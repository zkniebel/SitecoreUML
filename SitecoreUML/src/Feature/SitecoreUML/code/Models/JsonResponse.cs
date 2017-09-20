using System;

namespace ZacharyKniebel.Feature.SitecoreUML.Models
{
    [Serializable]
    public class JsonResponse
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
    }
}