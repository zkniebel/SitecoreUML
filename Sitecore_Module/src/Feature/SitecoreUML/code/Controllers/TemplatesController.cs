using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sitecore.Diagnostics;
using ZacharyKniebel.Feature.SitecoreUML.Configuration;
using ZacharyKniebel.Feature.SitecoreUML.Models;

namespace ZacharyKniebel.Feature.SitecoreUML.Controllers
{
    public class TemplatesController : Controller
    {
        [HttpPost]
        public JsonResult Validate()
        {
            try
            {
                // read the json from the body of the request
                var jsonBody = new StreamReader(Request.InputStream).ReadToEnd();
                // parse the json
                var templates = JsonConvert.DeserializeObject<List<JsonSitecoreTemplate>>(jsonBody);

                // validate the templates and get the response
                var response = new SitecoreDataManager().ValidateTemplates(templates);
                
                // send the response
                return new JsonResult() { Data = JsonConvert.SerializeObject(response) };
            }
            catch (Exception ex)
            {
                Log.Error("SitecoreUML ValidateFieldTypes Exception: An error occurred while validating field types", ex, this);
                return new JsonResult() { Data = new JsonResponse() { Success = false, ErrorMessage = ex.Message } };
            }
        }

        [HttpPost]
        public JsonResult Deploy()
        {
            try
            {
                // read the json from the body of the request
                var jsonBody = new StreamReader(Request.InputStream).ReadToEnd();
                // parse the json
                var templates = JsonConvert.DeserializeObject<List<JsonSitecoreTemplate>>(jsonBody);

                // import the templates
                var manager = new SitecoreDataManager();
                var success = manager.ImportTemplates(templates);

                var response = new JsonResponse() { Success = success };
                return new JsonResult() { Data = response };
            }
            catch (Exception ex)
            {
                Log.Error("SitecoreUML Deploy Exception: An error occurred while deploying templates to Sitecore", ex, this); 
                return new JsonResult() { Data = new JsonResponse() { Success = false, ErrorMessage = ex.Message } };
            }
        }

        [HttpGet]
        public JsonResult Export()
        {
            try
            {
                // get the json templates under the root item
                var jsonTemplates = new SitecoreDataManager().GetTemplatesForExport();
                // serialize the templates
                var json = JsonConvert.SerializeObject(jsonTemplates);

                return new JsonResult()
                {
                    Data = new JsonResponse() { Success = true, Data = json },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                Log.Error("SitecoreUML Export Exception: An error occurred while exporting templates from Sitecore", ex, this);
                return new JsonResult()
                {
                    Data = new JsonResponse() { Success = false, ErrorMessage = ex.Message },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }
    }
}