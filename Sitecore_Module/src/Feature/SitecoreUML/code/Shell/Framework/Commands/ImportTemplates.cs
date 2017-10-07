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
            var importManager = new SitecoreDataManager();
            if (!importDataSets.All(set => importManager.ImportTemplates(set, templateRoot)))
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
    }
}