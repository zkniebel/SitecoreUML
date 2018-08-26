using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonSitecoreItem : IJsonSitecoreItem
    {
        public string ReferenceID { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        [System.ComponentModel.DefaultValue(false)]
        [Newtonsoft.Json.JsonProperty(NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore, DefaultValueHandling = Newtonsoft.Json.DefaultValueHandling.Populate)]
        public bool IsTemplate { get; private set; }

        public static implicit operator JsonSitecoreItem(Sitecore.Data.Items.Item item)
        {
            return item != null
                ? new JsonSitecoreItem()
                    {
                        ReferenceID = item.ID.ToString(),
                        Name = item.Name,
                        Path = item.Paths.Path,
                        IsTemplate = item.TemplateID == Sitecore.TemplateIDs.Template
                    }
                : null;
        }
    }
}