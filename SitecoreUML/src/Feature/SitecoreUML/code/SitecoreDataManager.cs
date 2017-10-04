﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.ContentSearch.Maintenance;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Data.Managers;
using Sitecore.Data.Proxies;
using Sitecore.Diagnostics;
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
        /// <param name="templateRoot">The root item where all other templates should be added</param>
        /// <returns></returns>
        public virtual bool ImportTemplates(List<JsonSitecoreTemplate> templates, Item templateRoot)
        {
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
                using (new ProxyDisabler())
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

                    // 3. add a field section to the new template
                    var templateSectionItem = templateItem.Add(SitecoreUMLConfiguration.Instance.DefaultFieldSectionName, templateSectionTemplate);

                    // 4. add the fields to the new template
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

                        // 4a. add the field
                        var templateFieldItem =
                            (TemplateFieldItem)templateSectionItem.Add(jsonField.Name, templateFieldTemplate);

                        // 4b. update the field based on the imported data
                        templateFieldItem.BeginEdit();

                        templateFieldItem.Sortorder = jsonField.SortOrder;
                        templateFieldItem.Type = fieldType;

                        templateFieldItem.EndEdit();
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
        /// <param name="templateRoot">The root item under which all of the templates to be exported live</param>
        /// <returns></returns>
        public virtual IEnumerable<JsonSitecoreTemplate> GetTemplatesForExport(Item templateRoot)
        {
            // get all of the template items that are children of the template root
            var templateItems = TemplateManager.GetTemplates(_database).Values
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
                                        baseTemplateItem.InnerItem.Paths.Path.StartsWith(templateRoot.Paths.Path))
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
                                            SortOrder = templateFieldItem.Sortorder
                                        })
                                .ToArray()
                        });

            return jsonTemplates;
        }
    }
}