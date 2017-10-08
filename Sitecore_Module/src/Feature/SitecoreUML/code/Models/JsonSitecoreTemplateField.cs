using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonSitecoreTemplateField
    {
        // Required properties
        public string Name { get; set; }

        public string FieldType { get; set; }

        public int SortOrder { get; set; }

        // Optional properties
        public string Title { get; set; }

        public string SectionName { get; set; }

        public string Source { get; set; }

        public string StandardValue { get; set; }

        [DefaultValue(false)]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
        public bool Shared { get; set; }

        [DefaultValue(false)]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
        public bool Unversioned { get; set; }
    }
}