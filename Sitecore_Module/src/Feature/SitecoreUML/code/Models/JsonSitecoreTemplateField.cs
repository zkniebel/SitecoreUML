using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonSitecoreTemplateField
    {
        public string Name { get; set; }
        public string FieldType { get; set; }
        public int SortOrder { get; set; }
    }
}