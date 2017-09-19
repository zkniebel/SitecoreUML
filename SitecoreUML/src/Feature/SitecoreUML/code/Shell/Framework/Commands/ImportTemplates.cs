using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Sitecore.ContentSearch.Maintenance;
using Sitecore.Data;
using Sitecore.Data.Events;
using Sitecore.Data.Items;
using Sitecore.Data.Managers;
using Sitecore.Data.Proxies;
using Sitecore.Diagnostics;
using Sitecore.SecurityModel;
using Sitecore.Shell.Framework.Commands;
using ZacharyKniebel.Feature.SitecoreUML.Configuration;
using ZacharyKniebel.Feature.SitecoreUML.Models;

namespace ZacharyKniebel.Feature.SitecoreUML.Shell.Framework.Commands
{
    public class ImportTemplates : Command
    {
        private readonly Database _database = SitecoreUMLConfiguration.Instance.TargetDatabase;

        public override void Execute(CommandContext context)
        {
            var inputFolderPath = SitecoreUMLConfiguration.Instance.ImportDropFolderPath;
            var inputDirectory = new DirectoryInfo(inputFolderPath);

            // if the import file drop path doesn't exist then terminate and show an error
            if (!inputDirectory.Exists)
            {
                Log.Error($"SitecoreUML Import Error: Drop path could not be found at the configured location: {inputFolderPath}", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert($"SitecoreUML Import Error: Import Drop Folder was not found: {inputFolderPath}");
                return;
            }

            var inputFiles = inputDirectory.EnumerateFiles("*.json").ToArray();
            if (!inputFiles.Any())
            {
                Log.Error("SitecoreUML Import Error: Input files could not be found at the configured location. See the configuration for more.", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert("SitecoreUML Import Error: Import files were not found in the drop folder. See configuration for more.");
                return;
            }

            // deserialize the json
            var importDataSets = GetImportDataSets(inputFiles);

            // if data sets are null or empty report to the log and the client, and then terminate
            if (importDataSets == null)
            {
                Log.Warn("SitecoreUML Import Error: No import data sets were found in the import files. Process terminated.", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert("SitecoreUML Import Error: No import data sets were found in the import files. Process terminated.");
                return;
            }

            // get the root item to add the templates to
            var templateRoot = _database.GetItem(SitecoreUMLConfiguration.Instance.TemplatesRootPath);
            if (templateRoot == null)
            {
                Log.Error($"SitecoreUML Import Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert($"SitecoreUML Import Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.");
                return;
            }

            // execute the import
            if (!importDataSets.All(set => ImportTemplateSet(set, templateRoot)))
            {
                // TODO: add support for rolling back the import and update the logging when complete

                Log.Error("SitecoreUML Import Error: An error occurred while importing the template sets. Process terminated early. Please review your content tree for artifact files.", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert("SitecoreUML Import Error: An error occurred while importing the template sets. Process terminated early. Please review your content tree for artifact files.");
                return;
            }

            // delete or archive the import data
            // TODO: implement delete or archiving functionality
            
            // refresh the template root so the imported items show
            Sitecore.Context.ClientPage.SendMessage(this, $"item:refreshchildren(id={templateRoot.ID})");
            // show the client a success message
            Sitecore.Context.ClientPage.ClientResponse.Alert("Import completed successfully!");
        }

        /// <summary>
        /// Reads in and deserializes the template sets to be imported from the given import files
        /// </summary>
        /// <param name="importFiles">The files that contain the templates to be imported; each file is a set</param>
        /// <returns></returns>
        protected virtual List<List<JsonSitecoreTemplate>> GetImportDataSets(FileInfo[] importFiles)
        {
            try
            {
                var serializer = new JsonSerializer();
                var importSets = new List<List<JsonSitecoreTemplate>>();
                foreach (var importFile in importFiles)
                {
                    using (var file = File.OpenText(importFile.FullName))
                    {
                        importSets.Add(
                            (List<JsonSitecoreTemplate>)serializer.Deserialize(
                                file,
                                typeof(List<JsonSitecoreTemplate>)));
                    }
                }

                return importSets;
            }
            catch (Exception ex)
            {
                Log.Error("SitecoreUML Import Error: An error occurred while attempting to deserialize the import data", ex, this);
                Sitecore.Context.ClientPage.ClientResponse.Alert("SitecoreUML Import Error: An error occurred while attempting to deserialize the import data.");
                return null;
            }
        }

        // TODO: while EventDisabler breaks template creation, see if you can find a way around that, maybe by raising the event manually or by manually sending it to the client: Sitecore.Context.ClientPage.SendMessage((object) this, $"template:added(id={template.ID})")
        /// <summary>
        /// Imports the templates in the given set by creating them in Sitecore
        /// </summary>
        /// <remarks>
        /// Note that item paths are used as unique identifiers for each template. Note that the import
        /// will not overwrite existing items
        /// </remarks>
        /// <param name="templateSet">The set of JSON templates to import</param>
        /// <param name="templateRoot">The root item where all other templates should be added</param>
        /// <returns></returns>
        protected virtual bool ImportTemplateSet(List<JsonSitecoreTemplate> templateSet, Item templateRoot)
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

                // create the templates
                foreach (var jsonTemplate in templateSet)
                {
                    using (new SecurityDisabler())
                    using (new ProxyDisabler())
                    using (new DatabaseCacheDisabler())
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
                            // if the field type is not recognized then log a message and skip it
                            if (!SitecoreUMLConfiguration.Instance.FieldTypes.HasValue(jsonField.FieldType))
                            {
                                Log.Warn($"SitecoreUML Import Warning: Field type {jsonField.FieldType} was not recognized. Field {jsonField.Name} will be skipped for template {jsonTemplate.Name}.", this);
                                continue;
                            }

                            // 4a. add the field
                            var templateFieldItem =
                                (TemplateFieldItem)templateSectionItem.Add(jsonField.Name, templateFieldTemplate);

                            // 4b. update the field based on the imported data
                            templateFieldItem.BeginEdit();

                            templateFieldItem.Sortorder = jsonField.SortOrder;
                            templateFieldItem.Type = SitecoreUMLConfiguration.Instance.FieldTypes.Reverse[jsonField.FieldType];

                            templateFieldItem.EndEdit();
                        }
                    }
                }

                // get the Standard Template, which will be the default base template (only added if no other base templates)
                var standardTemplate = _database.GetTemplate(Sitecore.TemplateIDs.StandardTemplate);
                var standardTemplateIDStr = standardTemplate.ID.ToString();

                // set the base templates
                foreach (var jsonTemplate in templateSet)
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
            finally
            {
                if (shouldPauseIndexing)
                {
                    IndexCustodian.ResumeIndexing();
                }
            }

            return true;
        }
    }
}