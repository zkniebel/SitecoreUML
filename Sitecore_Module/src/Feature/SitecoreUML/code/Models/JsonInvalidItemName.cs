using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonInvalidItemName
    {
        public string ItemName { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ItemType ItemType { get; set; }
    }
}