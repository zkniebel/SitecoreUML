using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string DefaultFieldSectionName { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string ImportDropFolderPath { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string ImportHistoryFolderPath { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public bool DeleteFilesAfterImport { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public bool DisableIndexingDuringImport { get; private set; }

        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        public string ExportSaveFolderPath { get; private set; }

        /// <summary>
        /// Mapping between Sitecore field type names (keys) and UML field type names (values)
        /// </summary>
        public Map<string, string> FieldTypes { get; }

        public SitecoreUMLConfiguration()
        {
            FieldTypes = new Map<string, string>();
        }

        public void AddFieldType(System.Xml.XmlNode node)
        {
            var scName = Sitecore.Xml.XmlUtil.GetAttribute("sitecoreFieldTypeName", node);
            var umlName = Sitecore.Xml.XmlUtil.GetAttribute("umlFieldTypeName", node);
            FieldTypes.Add(scName, umlName);
        }
    }
}