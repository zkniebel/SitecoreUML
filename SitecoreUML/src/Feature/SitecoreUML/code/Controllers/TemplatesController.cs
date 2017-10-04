using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Exceptions;
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

                // compare the field types with the mappings in the config
                var fieldTypes = SitecoreUMLConfiguration.Instance.FieldTypes;
                var invalidFieldTypes = templates
                    .SelectMany(template => template.Fields
                        .Select(field => new
                        {
                            TemplateName = template.Name,
                            FieldName = field.Name,
                            FieldType = field.FieldType
                        }))
                    .Where(templateFields =>
                        !SitecoreUMLConfiguration.Instance.FieldTypes.HasValue(templateFields.FieldType));
                
                // send the response
                return new JsonResult() { Data = JsonConvert.SerializeObject(invalidFieldTypes) };
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

                // get the root item to add the templates to
                var templateRoot = GetTemplateRoot();

                // import the templates
                var importManager = new SitecoreDataManager();
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

        [HttpGet]
        public JsonResult Export()
        {
            try
            {
                // get the root item that contains the templates to export
                var templateRoot = GetTemplateRoot();
                // get the json templates under the root item
                var jsonTemplates = new SitecoreDataManager().GetTemplatesForExport(templateRoot);
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
        
        private Item GetTemplateRoot()
        {
            // get the root item to add the templates to
            var templateRoot = SitecoreUMLConfiguration.Instance.TargetDatabase.GetItem(SitecoreUMLConfiguration.Instance.TemplatesRootPath);
            if (templateRoot == null)
            {
                Log.Error($"SitecoreUML Deploy Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.", this);
                throw new ItemNotFoundException("SitecoreUML Deploy Error: The configured template root item could not be found. See the Sitecore log for more details.");
            }

            return templateRoot;
        }
    }
}