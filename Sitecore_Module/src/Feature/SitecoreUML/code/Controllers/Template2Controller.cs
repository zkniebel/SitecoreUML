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
    public class Template2Controller : Controller
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
                var database = SitecoreUMLConfiguration.Instance.TargetDatabase;
                var templateRoot = SitecoreUMLConfiguration.Instance.TargetDatabase.GetItem(SitecoreUMLConfiguration.Instance.TemplatesRootPath);
                if (templateRoot == null)
                {
                    Sitecore.Diagnostics.Log.Error($"SitecoreUML Configuration Error: Template root path does not exist: '{SitecoreUMLConfiguration.Instance.TemplatesRootPath}'.", this);
                    throw new Sitecore.Exceptions.ItemNotFoundException("SitecoreUML Configuration Error: The configured template root item could not be found. See the Sitecore log for more details.");
                }

                // get the architecture
                var jsonArchitecture = new JsonSitecoreTemplateArchitecture()
                {
                    Items = GetChildJsonSitecoreItems(
                        templateRoot,
                        templateRoot,
                        SitecoreUMLConfiguration.Instance.TemplateExcludePaths)
                };

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

        public IJsonSitecoreItem GetJsonSitecoreItem(Item item, Item templateRoot, List<string> excludePaths)
        {
            if (TemplateManager.IsTemplate(item))
            {
                var templateItem = item.Database.GetTemplate(item.ID);
                var templateRootPath = templateRoot.Paths.Path;
                var templateRootPathLength = templateRootPath.Length;

                return new JsonSitecoreTemplate()
                {
                    ReferenceID = templateItem.ID.ToString(),
                    Name = templateItem.Name,
                    BaseTemplates = templateItem.BaseTemplates
                            .Where(
                                baseTemplateItem =>
                                    !SitecoreUMLConfiguration.Instance.TemplateExcludePaths
                                        .Any(excludePath =>
                                            baseTemplateItem.InnerItem.Paths.Path.StartsWith(excludePath,
                                                StringComparison.OrdinalIgnoreCase))
                                    && baseTemplateItem.InnerItem.Paths.Path.StartsWith(templateRootPath))
                            .Select(
                                baseTemplateItem =>
                                    baseTemplateItem.InnerItem.ID.ToString())
                            .ToArray(),
                    Path = templateItem.InnerItem.Paths.Path.Substring(templateRootPathLength),
                    Fields = templateItem.OwnFields
                            .Select(
                                templateFieldItem =>
                                    new JsonSitecoreTemplateField()
                                    {
                                        Name = templateFieldItem.Name,
                                        FieldType =
                                            SitecoreUMLConfiguration.Instance.FieldTypes.HasKey(templateFieldItem
                                                .Type)
                                                ? SitecoreUMLConfiguration.Instance.FieldTypes.Forward[
                                                    templateFieldItem.Type]
                                                : templateFieldItem
                                                    .Type, // field type wasn't in the map, so fall back to the Sitecore field type
                                    SortOrder = templateFieldItem.Sortorder,
                                        SectionName = templateFieldItem.Section.Name,
                                        Title = templateFieldItem.InnerItem.Fields[TemplateFieldIDs.Title]
                                            .GetValue(false, false, false, false),
                                        Source = templateFieldItem.InnerItem.Fields[TemplateFieldIDs.Source]
                                            .GetValue(false, false, false, false),
                                        StandardValue =
                                            templateItem.StandardValues?.Fields[templateFieldItem.ID]
                                                .GetValue(false, false, false, false),
                                        Shared = templateFieldItem.IsShared
                                    })
                            .ToArray()
                };
            }

            if (item.TemplateID == TemplateIDs.TemplateFolder)
            {
                return new JsonSitecoreTemplateFolder()
                {
                    ReferenceID = item.ID.ToString(),
                    Name = item.Name,
                    Path = item.Paths.Path,
                    Children = GetChildJsonSitecoreItems(item, templateRoot, excludePaths)
                };
            }

            return null;
        }

        public IJsonSitecoreItem[] GetChildJsonSitecoreItems(Item item, Item templateRoot, List<string> excludePaths)
        {
            return item.Children
                .Where(child => !excludePaths
                    .Any(path => child.Paths.Path.StartsWith(path)))
                .Select(child => GetJsonSitecoreItem(child, templateRoot, excludePaths))
                .Where(jsonItem => jsonItem != null)
                .ToArray();
        }
    }
}