using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class DocumentationConfiguration
    {
        public string DocumentationTitle { get; set; }
        public IEnumerable<string> ExcludedItemPaths { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IJsonSitecoreItem FoundationLayerRoot { get; set; }
        public IJsonSitecoreItem[] FoundationModuleFolders { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IJsonSitecoreItem FeatureLayerRoot { get; set; }
        public IJsonSitecoreItem[] FeatureModuleFolders { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IJsonSitecoreItem ProjectLayerRoot { get; set; }
        public IJsonSitecoreItem[] ProjectModuleFolders { get; set; }
    }
}