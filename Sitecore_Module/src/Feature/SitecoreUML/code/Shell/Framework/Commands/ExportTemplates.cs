using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Sitecore.Data;
using Sitecore.Data.Managers;
using Sitecore.Diagnostics;
using Sitecore.Shell.Framework.Commands;
using ZacharyKniebel.Feature.SitecoreUML.Configuration;
using ZacharyKniebel.Feature.SitecoreUML.Models;

namespace ZacharyKniebel.Feature.SitecoreUML.Shell.Framework.Commands
{
    public class ExportTemplates : Command
    {
        private readonly Database _database = SitecoreUMLConfiguration.Instance.TargetDatabase;

        public override void Execute(CommandContext context)
        {
            var outputFolderPath = SitecoreUMLConfiguration.Instance.ExportSaveFolderPath;
            var outputDirectory = new DirectoryInfo(outputFolderPath);

            // if the export save folder path doesn't exist then terminate and show an error
            if (!outputDirectory.Exists)
            {
                Log.Error($"SitecoreUML Export Error: Export save folder path could not be found at the configured location: {outputFolderPath}", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert($"SitecoreUML Export Error: Export save folder was not found: {outputFolderPath}");
                return;
            }

            // get the root item to add the templates to
            var templateRoot = _database.GetItem(SitecoreUMLConfiguration.Instance.TemplatesRootPath);
            if (templateRoot == null)
            {
                Log.Error($"SitecoreUML Export Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.", this);
                Sitecore.Context.ClientPage.ClientResponse.Alert($"SitecoreUML Export Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.");
                return;
            }

            // get the templates for export
            var jsonTemplates = new SitecoreDataManager().GetTemplatesForExport(templateRoot);
            
            using (var file = File.CreateText($"{outputDirectory.FullName}/{DateTime.Now:yyyyMMddhhmmss}.json"))
            {
                var serializer = new JsonSerializer();
                serializer.Serialize(file, jsonTemplates);
            }

            Sitecore.Context.ClientPage.ClientResponse.Alert("Export completed successfully!");
        }
    }
}