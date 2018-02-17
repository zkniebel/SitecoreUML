using System;
using System.Collections.Generic;
using System.Linq;
using Sitecore;
using Sitecore.ContentSearch.Maintenance;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Data.Managers;
using Sitecore.Data.Proxies;
using Sitecore.Diagnostics;
using Sitecore.Exceptions;
using Sitecore.SecurityModel;
using ZacharyKniebel.Feature.SitecoreUML.Configuration;
using ZacharyKniebel.Feature.SitecoreUML.Models;

namespace ZacharyKniebel.Feature.SitecoreUML
{
    public class SitecoreDataManager
    {
        private readonly Database _database = SitecoreUMLConfiguration.Instance.TargetDatabase;

        // TODO: while EventDisabler breaks template creation, see if you can find a way around that, maybe by raising the event manually or by manually sending it to the client: Sitecore.Context.ClientPage.SendMessage((object) this, $"template:added(id={template.ID})")
        /// <summary>
        /// Imports the templates in the given set by creating them in Sitecore
        /// </summary>
        /// <remarks>
        /// Note that item paths are used as unique identifiers for each template. Note that the import
        /// will not overwrite existing items
        /// </remarks>
        /// <param name="templates">The set of JSON templates to import</param>
        /// <param name="templateRoot">The root item to import all of the templates under</param>
        /// <returns></returns>
        public virtual bool ImportTemplates(List<JsonSitecoreTemplate> templates, Item templateRoot = null)
        {
            // get the root item to add the templates to
            templateRoot = templateRoot ?? GetTemplateRoot();

            var shouldPauseIndexing = false;
            if (SitecoreUMLConfiguration.Instance.DisableIndexingDuringImport)
            {
                shouldPauseIndexing = true;
                IndexCustodian.PauseIndexing();
            }

            try
            {
                // get the templates to be used when adding the new items
                var templateTemplate = _database.GetTemplate(Sitecore.TemplateIDs.Template);
                var templateFolderTemplate = _database.GetTemplate(Sitecore.TemplateIDs.TemplateFolder);
                var templateSectionTemplate = _database.GetTemplate(Sitecore.TemplateIDs.TemplateSection);
                var templateFieldTemplate = _database.GetTemplate(Sitecore.TemplateIDs.TemplateField);

                // caches the added items by their original path (i.e. not the full Sitecore path) to boost 
                //   performance while setting base templates
                var addedItemsCache = new Dictionary<string, Item>();


                using (new SecurityDisabler())
                using (new DatabaseCacheDisabler())
                {
                    // create the templates
                    foreach (var jsonTemplate in templates)
                    {
                        // 1. make the full Sitecore path to the template
                        var path = templateRoot.Paths.Path + jsonTemplate.Path;

                        // if the path already exists then log a message and move onto the next template
                        if (_database.GetItem(path) != null)
                        {
                            Log.Warn($"SitecoreUML Import Warning: Item with path '{path}' skipped as an item with that path already exists", this);
                            continue;
                        }

                        // 2. add the template and its parent folders (if necessary)
                        var templateItem = _database.CreateItemPath(path, templateFolderTemplate, templateTemplate);
                        addedItemsCache.Add(jsonTemplate.Path, templateItem);

                        // NOTE: adding the field section was moved into the add fields loop, due to the added support 
                        //       for controlling field sections in UML documentation
                        //// 3. add a field section to the new template 
                        //var templateSectionItem = templateItem.Add(SitecoreUMLConfiguration.Instance.DefaultFieldSectionName, templateSectionTemplate);
                        var addedTemplateSectionItems = new Dictionary<string, Item>();

                        // 4. add the fields to the new template
                        var standardValuesToAdd = new List<Tuple<ID, string>>();
                        foreach (var jsonField in jsonTemplate.Fields)
                        {
                            // if the field type name/alias is not recognized then log a message and skip it
                            if (!SitecoreUMLConfiguration.Instance.UmlFieldTypeAliases.ContainsKey(jsonField.FieldType))
                            {
                                Log.Warn($"SitecoreUML Import Warning: Field type name or alias {jsonField.FieldType} was not recognized. Field {jsonField.Name} will be skipped for template {jsonTemplate.Name}.", this);
                                continue;
                            }
                            // get the field type from the field type name/alias
                            var fieldType = SitecoreUMLConfiguration.Instance.UmlFieldTypeAliases[jsonField.FieldType];

                            // add/get the template section item
                            Item templateSectionItem;
                            var templateSectionName = !string.IsNullOrEmpty(jsonField.SectionName)
                                ? jsonField.SectionName
                                : SitecoreUMLConfiguration.Instance.DefaultFieldSectionName;

                            if (addedTemplateSectionItems.ContainsKey(templateSectionName))
                            {
                                templateSectionItem = addedTemplateSectionItems[templateSectionName];
                            }
                            else
                            {
                                templateSectionItem = templateItem.Add(templateSectionName, templateSectionTemplate);
                                addedTemplateSectionItems.Add(templateSectionName, templateSectionItem);
                            }

                            // add the field
                            var templateFieldItem =
                                (TemplateFieldItem)templateSectionItem.Add(jsonField.Name, templateFieldTemplate);

                            // update the field based on the imported data
                            templateFieldItem.BeginEdit();

                            templateFieldItem.Sortorder = jsonField.SortOrder;
                            templateFieldItem.Type = fieldType;
                            templateFieldItem.Title = jsonField.Title;
                            templateFieldItem.Source = jsonField.Source;

                            if (jsonField.Shared)
                            {
                                templateFieldItem.InnerItem[TemplateFieldIDs.Shared] = "1";
                            }
                            if (jsonField.Unversioned)
                            {
                                templateFieldItem.InnerItem[TemplateFieldIDs.Unversioned] = "1";
                            }

                            templateFieldItem.EndEdit();

                            // if set, add StandardValue to the list of those to be aded
                            if (jsonField.StandardValue != null)
                            {
                                standardValuesToAdd.Add(
                                    new Tuple<ID, string>(templateFieldItem.ID, jsonField.StandardValue));
                            }
                        }

                        // 5. add the standard values item and set the values, if appropriate
                        if (!standardValuesToAdd.Any())
                        {
                            continue;
                        }

                        var standardValuesItem = new TemplateItem(templateItem).CreateStandardValues();
                        using (new EditContext(standardValuesItem))
                        {
                            foreach (var standardValueToAdd in standardValuesToAdd)
                            {
                                standardValuesItem[standardValueToAdd.Item1] = standardValueToAdd.Item2;
                            }
                        }
                    }

                    // get the Standard Template, which will be the default base template (only added if no other base templates)
                    var standardTemplate = _database.GetTemplate(Sitecore.TemplateIDs.StandardTemplate);
                    var standardTemplateIDStr = standardTemplate.ID.ToString();

                    // set the base templates
                    foreach (var jsonTemplate in templates)
                    {
                        Item item;
                        // if we skipped adding the item (already existed) then skip it here too
                        if (!addedItemsCache.TryGetValue(jsonTemplate.Path, out item))
                        {
                            continue;
                        }

                        string baseTemplatesFieldValue = null;
                        foreach (var baseTemplatePath in jsonTemplate.BaseTemplates)
                        {
                            Item baseTemplateItem;
                            // if the base template isn't newly added we still want to make it a base template
                            if (!addedItemsCache.TryGetValue(baseTemplatePath, out baseTemplateItem))
                            {
                                baseTemplateItem = _database.GetItem(templateRoot.Paths.Path + baseTemplatePath);
                            }

                            baseTemplatesFieldValue = baseTemplatesFieldValue != null
                                ? $"{baseTemplatesFieldValue}|{baseTemplateItem.ID}"
                                : $"{baseTemplateItem.ID}";
                        }

                        // set the Base Templates field value
                        using (new EditContext(item))
                        {
                            item[Sitecore.FieldIDs.BaseTemplate] = baseTemplatesFieldValue ?? standardTemplateIDStr;
                        }
                    }
                }
            }
            finally
            {
                if (shouldPauseIndexing)
                {
                    IndexCustodian.ResumeIndexing();
                }
            }

            return true;
        }

        /// <summary>
        /// Gets all of the templates under the given template root as JsonSitecoreTemplates for export
        /// </summary>
        /// <returns></returns>
        public virtual IEnumerable<JsonSitecoreTemplate> GetTemplatesForExport()
        {
            // get the root item to add the templates to
            var templateRoot = GetTemplateRoot();

            const string defaultTemplatesRoot = "/sitecore/templates/";
            var relativeExcludePaths = SitecoreUMLConfiguration.Instance.TemplateExcludePaths
                .Select(
                    excludePath =>
                        excludePath.StartsWith(defaultTemplatesRoot)
                            ? excludePath.Substring(defaultTemplatesRoot.Length)
                            : excludePath);

            // get all of the template items that are children of the template root
            var templateItems = TemplateManager.GetTemplates(_database).Values
                .Where(
                    template => 
                        !relativeExcludePaths
                            .Any(excludePath => template.FullName.StartsWith(excludePath, StringComparison.OrdinalIgnoreCase)))
                .Select(template => _database.GetTemplate(template.ID))
                .Where(
                    templateItem =>
                        templateItem != null
                        && templateItem.InnerItem.Paths.Path.StartsWith(templateRoot.Paths.Path));

            var jsonTemplates = templateItems
                .Select(
                    templateItem =>
                        new JsonSitecoreTemplate()
                        {
                            ReferenceID = templateItem.ID.ToString(),
                            Name = templateItem.Name,
                            BaseTemplates = templateItem.BaseTemplates
                                .Where(
                                    baseTemplateItem =>
                                        !SitecoreUMLConfiguration.Instance.TemplateExcludePaths
                                            .Any(excludePath => baseTemplateItem.InnerItem.Paths.Path.StartsWith(excludePath, StringComparison.OrdinalIgnoreCase))
                                        && baseTemplateItem.InnerItem.Paths.Path.StartsWith(templateRoot.Paths.Path))
                                .Select(
                                    baseTemplateItem =>
                                        baseTemplateItem.InnerItem.Paths.Path.Substring(templateRoot.Paths.Path.Length))
                                .ToArray(),
                            Path = templateItem.InnerItem.Paths.Path.Substring(templateRoot.Paths.Path.Length),
                            Fields = templateItem.OwnFields
                                .Select(
                                    templateFieldItem =>
                                        new JsonSitecoreTemplateField()
                                        {
                                            Name = templateFieldItem.Name,
                                            FieldType =
                                                SitecoreUMLConfiguration.Instance.FieldTypes.HasKey(templateFieldItem.Type)
                                                    ? SitecoreUMLConfiguration.Instance.FieldTypes.Forward[templateFieldItem.Type]
                                                    : templateFieldItem.Type, // field type wasn't in the map, so fall back to the Sitecore field type
                                            SortOrder = templateFieldItem.Sortorder,
                                            SectionName = templateFieldItem.Section.Name,
                                            Title = templateFieldItem.InnerItem.Fields[TemplateFieldIDs.Title].GetValue(false, false, false, false),
                                            Source = templateFieldItem.InnerItem.Fields[TemplateFieldIDs.Source].GetValue(false, false, false, false),
                                            StandardValue = templateItem.StandardValues?.Fields[templateFieldItem.ID].GetValue(false, false, false, false),
                                            Shared = templateFieldItem.IsShared
                                        })
                                .ToArray()
                        });

            return jsonTemplates;
        }

        /// <summary>
        /// Validates the templates and returns a response with any validation errors
        /// </summary>
        /// <param name="templates">The templates to validate</param>
        /// <returns>Response with validation errors</returns>
        public virtual JsonValidationResponse ValidateTemplates(List<JsonSitecoreTemplate> templates)
        {
            return new JsonValidationResponse()
            {
                InvalidItemNames = GetInvalidItemNames(templates),
                InvalidTemplateFieldTypes = GetInvalidTemplateFieldTypes(templates)
            };
        }

        /// <summary>
        /// Gets the invalid template field types that could not be mapped to a Sitecore field type
        /// </summary>
        /// <param name="templates">The templates containing the fields with the field types to be checked</param>
        /// <returns>Invalid field type models</returns>
        public virtual IEnumerable<JsonInvalidTemplateFieldType> GetInvalidTemplateFieldTypes(List<JsonSitecoreTemplate> templates)
        {
            // compare the field types with the mappings in the config
            return templates
                .SelectMany(template => template.Fields
                    .Select(field => new JsonInvalidTemplateFieldType
                    {
                        TemplateName = template.Name,
                        FieldName = field.Name,
                        FieldType = field.FieldType
                    }))
                .Where(templateFields =>
                    !SitecoreUMLConfiguration.Instance.UmlFieldTypeAliases.ContainsKey(templateFields.FieldType));
        }

        public virtual IEnumerable<JsonInvalidItemName> GetInvalidItemNames(List<JsonSitecoreTemplate> templates)
        {
            // maps the item name (key) to the value (value) indicating whether or not it is valid (valid = true)
            var nameValidationCache = new Dictionary<string, bool>();

            // get the models for the item names from the templates template folders and template fields
            var models = templates
                .SelectMany(
                    template =>
                        template.Path
                            // split the path into item names
                            .Split(new[] {'/'}, StringSplitOptions.RemoveEmptyEntries)
                            // reverse so that the template name is first
                            .Reverse()
                            // get the models for the template and template folder items
                            .Select((name, i) => new JsonInvalidItemName()
                            {
                                ItemName = name,
                                ItemType = i == 0 ? ItemType.Template : ItemType.TemplateFolder,
                                TemplatePath = i == 0 ? template.Path : null
                            })
                            // add in the models for the template field items
                            .Concat(
                                template.Fields
                                    .Select(field => new JsonInvalidItemName()
                                    {
                                        ItemName = field.Name,
                                        ItemType = ItemType.TemplateField,
                                        TemplatePath = template.Path
                                    }))
                            // add in the models for the template field section items
                            .Concat(
                                template.Fields
                                    .Where(field => !string.IsNullOrEmpty(field.SectionName))
                                    .Select(field => new JsonInvalidItemName()
                                    {
                                        ItemName = field.SectionName,
                                        ItemType = ItemType.TemplateFieldSection,
                                        TemplatePath = template.Path
                                    })));
            
            // get the list of models with invalid item names
            var invalidItemNames = models
                .Where(
                    model =>
                    {
                        // if the name has already been checked then return the cached result
                        if (nameValidationCache.ContainsKey(model.ItemName))
                        {
                            return !nameValidationCache[model.ItemName];
                        }

                        // check the names in the models with the InvalidItemNameChars setting
                        var isValid = ItemUtil.IsItemNameValid(model.ItemName);

                        // add the name and result to the cache and return true if the name is invalid
                        nameValidationCache.Add(model.ItemName, isValid);
                        return !isValid;
                    });

            return invalidItemNames;
        }

        /// <summary>
        /// Gets the root item under which all templates and template folders should be imported or exported
        /// </summary>
        /// <remarks>
        /// All imported and exported paths should be relative to this item
        /// </remarks>
        /// <returns>The root item of the templates and template folders that are imported/exported</returns>
        public virtual Item GetTemplateRoot()
        {
            // get the root item to add the templates to
            var templateRoot = SitecoreUMLConfiguration.Instance.TargetDatabase.GetItem(SitecoreUMLConfiguration.Instance.TemplatesRootPath);
            if (templateRoot == null)
            {
                Log.Error($"SitecoreUML Configuration Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.", this);
                throw new ItemNotFoundException("SitecoreUML Configuration Error: The configured template root item could not be found. See the Sitecore log for more details.");
            }

            return templateRoot;
        }
    }
}