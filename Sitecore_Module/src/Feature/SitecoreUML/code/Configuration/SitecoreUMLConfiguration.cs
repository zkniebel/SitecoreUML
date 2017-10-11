using System;
using System.Collections.Generic;
using Sitecore.Data;
using ZacharyKniebel.Feature.SitecoreUML.Common;

namespace ZacharyKniebel.Feature.SitecoreUML.Configuration
{
    public class SitecoreUMLConfiguration
    {
        private static SitecoreUMLConfiguration _instance;
        public static SitecoreUMLConfiguration Instance
            =>
                _instance ??
                (_instance =
                    Sitecore.Configuration.Factory.CreateObject("sitecoreUML", true) as SitecoreUMLConfiguration);

        private Database _targetDatabase;
        public Database TargetDatabase => _targetDatabase ?? (_targetDatabase = Database.GetDatabase(TargetDatabaseName));

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string TargetDatabaseName { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string TemplatesRootPath { get; private set; }
        
        public List<string> TemplateExcludePaths { get; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string DefaultFieldSectionName { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public bool ArchiveFilesAfterImport { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public bool DisableIndexingDuringImport { get; private set; }

        public static string ImportDropFolder => Sitecore.Configuration.Settings.GetSetting("SitecoreUML.JsonTools.ImportDropFolder");
        public static string ImportHistoryFolder => Sitecore.Configuration.Settings.GetSetting("SitecoreUML.JsonTools.ImportHistoryFolder");
        public static string ExportSaveFolder => Sitecore.Configuration.Settings.GetSetting("SitecoreUML.JsonTools.ExportSaveFolder");

        // TODO: with the introduction of aliases, this can be changed to a dictionary for better performance, since 2-way lookups are no longer necessary
        /// <summary>
        /// Mapping between Sitecore field type names (keys) and UML field type names (values)
        /// </summary>
        public Map<string, string> FieldTypes { get; }

        /// <summary>
        /// Case-insensitive mapping between each uml alias and the sitecoreFieldTypeName that it refers to
        /// </summary>
        public Dictionary<string, string> UmlFieldTypeAliases { get; }

        public SitecoreUMLConfiguration()
        {
            TemplateExcludePaths = new List<string>();
            FieldTypes = new Map<string, string>();
            UmlFieldTypeAliases = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }

        public void AddFieldType(System.Xml.XmlNode node)
        {
            // add field type name the mapping
            var scName = Sitecore.Xml.XmlUtil.GetAttribute("sitecoreFieldTypeName", node);
            var umlName = Sitecore.Xml.XmlUtil.GetAttribute("umlFieldTypeName", node);
            FieldTypes.Add(scName, umlName);

            // add the umlFieldTypeName to the aliases map to enable case-insensitive matches
            UmlFieldTypeAliases.Add(umlName, scName);

            // add the aliases to the alias map
            var umlAliases = Sitecore.Xml.XmlUtil.GetAttribute("umlAliases", node);
            if (string.IsNullOrEmpty(umlAliases))
            {
                return;
            }

            var aliases = umlAliases
                .Split(new[] {'|'}, StringSplitOptions.RemoveEmptyEntries);
            foreach (var alias in aliases)
            {
                UmlFieldTypeAliases.Add(alias, scName);
            }
        }
    }
}