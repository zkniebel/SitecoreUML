using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonInvalidTemplateFieldType
    {
        public string TemplateName { get; set; }

        public string FieldName { get; set; }

        public string FieldType { get; set; }
    }
}