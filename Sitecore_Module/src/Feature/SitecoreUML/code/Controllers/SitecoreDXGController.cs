using Sitecore;
using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sitecore.Data.Managers;
using ZacharyKniebel.Feature.SitecoreUML.Configuration;
using ZacharyKniebel.Feature.SitecoreUML.Models;
using Newtonsoft.Json;

namespace ZacharyKniebel.Feature.SitecoreUML.Controllers
{
    public class SitecoreDXGController : Controller
    {
        /// <summary>
        /// Gets the template architecture as JSON
        /// </summary>
        /// <param name="paths">(FUTURE) Pipe-delimited list of paths to include or exclude (* means children; ** means descendants; should exclude templates root path)</param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetTemplateArchitecture()
        {
            try
            {
                var jsonArchitecture = new SitecoreDataManager().GetTemplateArchitectureForExport();

                return new JsonResult()
                {
                    Data = new JsonResponse() { Success = true, Data = jsonArchitecture },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                Sitecore.Diagnostics.Log.Error("SitecoreUML Export Architecture Exception: An error occurred while exporting templates from Sitecore", ex, this);
                return new JsonResult()
                {
                    Data = new JsonResponse() { Success = false, ErrorMessage = ex.Message },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }
    }
}