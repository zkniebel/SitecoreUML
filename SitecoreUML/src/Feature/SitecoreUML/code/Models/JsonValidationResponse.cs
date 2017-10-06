using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonValidationResponse
    {
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public IEnumerable<JsonInvalidItemName> InvalidItemNames { get; set; } = Array.Empty<JsonInvalidItemName>();

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public IEnumerable<JsonInvalidTemplateFieldType> InvalidTemplateFieldTypes { get; set; } = Array.Empty<JsonInvalidTemplateFieldType>();
    }
}