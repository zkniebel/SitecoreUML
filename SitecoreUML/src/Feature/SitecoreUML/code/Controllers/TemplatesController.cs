using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sitecore.Diagnostics;
using Sitecore.Exceptions;
using ZacharyKniebel.Feature.SitecoreUML.Configuration;
using ZacharyKniebel.Feature.SitecoreUML.Models;

namespace ZacharyKniebel.Feature.SitecoreUML.Controllers
{
    public class TemplatesController : Controller
    {
        [HttpPost]
        public JsonResult Deploy()
        {
            try
            {
                // read the json from the body of the request
                var jsonBody = new StreamReader(Request.InputStream).ReadToEnd();
                // parse the json
                var templates = JsonConvert.DeserializeObject<List<JsonSitecoreTemplate>>(jsonBody);

                // get the root item to add the templates to
                var templateRoot = SitecoreUMLConfiguration.Instance.TargetDatabase.GetItem(SitecoreUMLConfiguration.Instance.TemplatesRootPath);
                if (templateRoot == null)
                {
                    Log.Error($"SitecoreUML Deploy Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.", this);
                    throw new ItemNotFoundException("SitecoreUML Deploy Error: The configured template root item could not be found. See the Sitecore log for more details.");
                }

                // import the templates
                var importManager = new ImportManager();
                var success = importManager.ImportTemplates(templates, templateRoot);

                var response = new JsonResponse() { Success = success };
                return new JsonResult() { Data = response };
            }
            catch (Exception ex)
            {
                Log.Error("SitecoreUML Deploy Exception: An error occurred while deploying templates to Sitecore", ex, this); 
                return new JsonResult() { Data = new JsonResponse() { Success = false, ErrorMessage = ex.Message } };
            }
        }
    }
}