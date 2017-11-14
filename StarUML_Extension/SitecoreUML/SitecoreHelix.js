define(function (require, exports, module) {
    "use strict";

    var StringUtils = require("StringUtils");
    var SitecorePreferencesLoader = require("SitecorePreferencesLoader");

    function HelixTemplate(jsonTemplate, model, layerId) {
        this.JsonTemplate = jsonTemplate;
        this.Model = model;
        this.LayerId = layerId;
        this.IsFoundationTemplate = false;
        this.IsFeatureTemplate = false;
        this.IsProjectTemplate = false;
        this.Dependencies = [];

        switch(layerId) {
            case HelixLayerIds.Foundation:
                this.IsFoundationTemplate = true;
                break;
            case HelixLayerIds.Feature:
                this.IsFeatureTemplate = true;
                break;
            case HelixLayerIds.Project:
                this.IsProjectTemplate = true;
                break;
            default:
                console.error("Unknown layer id detected for template path \"" + jsonTemplate.Path + "\"");
                break;
        }
    };
    var _dependencySearchCache = {};
    HelixTemplate.prototype.initializeDependencies = function(pathsToHelixTemplateMap) {
        function _getDependencies(helixTemplate) {
            var dependencies = _dependencySearchCache[helixTemplate.jsonTemplate.Path];
            if (dependencies !== undefined) {
                return dependencies;
            }

            dependencies = helixTemplate.jsonTemplate.BaseTemplates
                .map(function(baseTemplatePath) {
                    return _getDependencies(pathsToHelixTemplateMap[baseTemplatePath]);
                })
                .reduce(function(a, b) {
                    return a.concat(b);
                });
            
            return dependencies;
        };

        this.Dependencies = _getDependencies(this);
    };
    
    var HelixLayerIds = {
        Unknown: "Unknown",
        Foundation: "Foundation",
        Feature: "Feature",
        Project: "Project"
    }

    function HelixModule(rootPath, layerId, templatePaths) {
        this.RootPath = rootPath;
        this.LayerId = layerId;
        this.TemplatePaths = templatePaths;
    }

    function HelixLayer(layerId, rootPath, rootPackageModel) {
        this.LayerId = layerId;
        this.RootPath = rootPath;
        this.RootPackageModel = rootPackageModel;
    };
    HelixLayer.prototype.containsTemplatePath = function(path) {
        return StringUtils.startsWith(path, this.RootPath);
    };

    function _getLayerIdFromPath(path) {       
        if (foundationLayer.containsTemplatePath(path)) {
            return HelixLayerIds.Foundation;
        } else if (featureLayer.containsTemplatePath(path)) {
            return HelixLayerIds.Feature;
        } else if (projectLayer.containsTemplatePath(path)) {
            return HelixLayerIds.Project; 
        } 

        return HelixLayerIds.Unknown;
    };

    function HelixArchitecture(jsonTemplates, foundationPackageModel, featurePackageModel, projectPackageModel, pathsToTemplateModelsMap, modulePaths) {
        this.JsonTemplates = jsonTemplates;

        this.FoundationLayer = new HelixLayer(
            HelixLayerIds.Foundation, 
            SitecorePreferencesLoader.getSitecoreHelixFoundationPathId(),
            foundationPackageModel);
        this.FeatureLayer = new HelixLayer(
            HelixLayerIds.Feature, 
            SitecorePreferencesLoader.getSitecoreHelixFeaturePathId(),
            featurePackageModel);
        this.ProjectLayer = new HelixLayer(
            HelixLayerIds.Project, 
            SitecorePreferencesLoader.getSitecoreHelixProjectPathId(),
            projectPackageModel);   
        this.UnknownLayer = new HelixLayer(HelixLayerIds.Unknown);

        this.PathsToTemplateModelsMap = pathsToTemplateModelsMap;
        this.PathsToHelixTemplatesMap = {};

        this.HelixTemplates = jsonTemplates.map(function(jsonTemplate) {
            var layerId = _getLayerIdFromPath(jsonTemplate.Path);
            var helixTemplate = new HelixTemplate(jsonTemplate, pathsToTemplateModelsMap[jsonTemplate.Path], layerId);
            PathsToHelixTemplatesMap[jsonTemplate.Path] = helixTemplate;

            return helixTemplate;
        });
        this.HelixTemplates.forEach(function(helixTemplate) {
            helixTemplate.initializeDependencies(this.PathsToHelixTemplateMap);
        });
        
        this.ModulePaths = modulePaths || [];
        this.PathsToHelixModulesMap = {};
        this.HelixModules = modulePaths.map(function(modulePath) {
            var layerId = _getLayerIdFromPath(modulePath);
            var templatePaths = jsonTemplates
                .map(function(jsonTemplate) {
                    return jsonTemplate.Path;
                })
                .filter(function(path) {
                    return StringUtils.startsWith(path, modulePath)
                });

            var helixModule = new HelixModule(modulePath, layerId, templatePaths);
            PathsToHelixModulesMap[modulePath] = helixModule;

            return helixModule;
        });
    };

    exports.HelixArchitecture = HelixArchitecture;
    exports.HelixLayer = HelixLayer;
    exports.HelixModule = HelixModule;
    exports.HelixTemplate = HelixTemplate;
    exports.HelixLayerIds = HelixLayerIds;
});