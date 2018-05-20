using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonSitecoreTemplate : IJsonSitecoreItem
    {
        public string ReferenceID { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        public bool IsTemplate { get; } = true;

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string[] BaseTemplates { get; set; } = Array.Empty<string>();

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public JsonSitecoreTemplateField[] Fields { get; set; } = Array.Empty<JsonSitecoreTemplateField>();
    }
}