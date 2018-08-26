using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonSitecoreTemplateArchitecture
    {
        public IJsonSitecoreItem[] Items { get; set; } = Array.Empty<IJsonSitecoreItem>();
        public DocumentationConfiguration DocumentationConfiguration { get; set; } = null;
    }
}