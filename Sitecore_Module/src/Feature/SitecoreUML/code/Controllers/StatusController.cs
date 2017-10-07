using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ZacharyKniebel.Feature.SitecoreUML.Models;

namespace ZacharyKniebel.Feature.SitecoreUML.Controllers
{
    public class StatusController : Controller
    {
        [HttpGet]
        public JsonResult Connectivity()
        {
            return new JsonResult()
            {
                Data = new JsonResponse() { Success = true },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}