using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    public interface IJsonSitecoreItem
    {
        string ReferenceID { get; set; }

        string Name { get; set; }

        string Path { get; set; }

        bool IsTemplate { get; }
    }
}