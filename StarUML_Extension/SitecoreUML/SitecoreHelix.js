define(function (require, exports, module) {
    "use strict";

    // StarUML modules
    var Dialogs = app.getModule("dialogs/Dialogs");

    // SitecoreUML modules
    var StringUtils = require("StringUtils");
    var RepositoryUtils = require("RepositoryUtils");
    var ArrayUtils = require("ArrayUtils");
    var SitecorePreferencesLoader = require("SitecorePreferencesLoader");

    function HelixTemplate(jsonTemplate, model, layerId) {
        this.JsonTemplate = jsonTemplate;
        this.Model = model;
        this.LayerId = layerId;
        this.IsFoundationTemplate = false;
        this.IsFeatureTemplate = false;
        this.IsProjectTemplate = false;
        this.DirectDependencies = null;

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
    
    HelixTemplate.prototype.initializeDirectDependencies = function(pathsToHelixTemplatesMap) {
        this.DirectDependencies = this.JsonTemplate.BaseTemplates
            ? this.JsonTemplate.BaseTemplates
                .map(function(baseTemplatePath) {
                    return pathsToHelixTemplatesMap[baseTemplatePath];
                })
            : [];
    };

    HelixTemplate.prototype.getHelixLayer = function(helixArchitecture) {
        return this.IsFoundationTemplate 
            ? helixArchitecture.FoundationLayer
            : this.IsFeatureTemplate
                ? helixArchitecture.FeatureLayer
                : this.IsProjectTemplate 
                    ? helixArchitecture.ProjectLayer
                    : helixArchitecture.UnknownLayer;
    };
    
    var HelixLayerIds = {
        Unknown: "Unknown",
        Foundation: "Foundation",
        Feature: "Feature",
        Project: "Project"
    }

    function HelixModule(name, rootPath, rootPackageModel, layerId, templatePaths) {
        this.Name = name;
        this.RootPath = rootPath;
        this.RootPackageModel = rootPackageModel;
        this.LayerId = layerId;
        this.TemplatePaths = templatePaths;
        this.IsFoundationModule = false;
        this.IsFeatureModule = false;
        this.IsProjectModule = false;

        switch(layerId) {
            case HelixLayerIds.Foundation:
                this.IsFoundationModule = true;
                break;
            case HelixLayerIds.Feature:
                this.IsFeatureModule = true;
                break;
            case HelixLayerIds.Project:
                this.IsProjectModule = true;
                break;
            default:
                console.error("Unknown layer id,  \"" + layerId + "\", detected for helix module");
                break;
        }
    };    

    HelixModule.prototype.getHelixLayer = function(helixArchitecture) {
        return this.IsFoundationModule 
            ? helixArchitecture.FoundationLayer
            : this.IsFeatureModule
                ? helixArchitecture.FeatureLayer
                : this.IsProjectModule 
                    ? helixArchitecture.ProjectLayer
                    : helixArchitecture.UnknownLayer;
    };

    function HelixLayer(layerId, rootPath, rootPackageModel) {
        this.LayerId = layerId;
        this.RootPath = rootPath;
        this.RootPackageModel = rootPackageModel;
    };
    HelixLayer.prototype.containsTemplatePath = function(path) {
        return StringUtils.startsWith(path, this.RootPath);
    };

    // TODO: move all of the logic and fallback logic out of this function and into calling function(s) and/or utilities
    /**
     * Creates a new HelixArchitecture object from the given info
     * @param {Array} jsonTemplates serialized JSON template data
     * @param {UMLModel} foundationPackageModel (Optional) model of the foundation layer's root package
     * @param {UMLModel} featurePackageModel (Optional) model of the feature layer's root package
     * @param {UMLModel} projectPackageModel (Optional) model of the project layer's root package
     * @param {Object} pathsToTemplateModelsMap (Optional) mapping table that has the template paths as keys and the corresponding models as values
     */
    function HelixArchitecture(jsonTemplates, foundationPackageModel, featurePackageModel, projectPackageModel, pathsToTemplateModelsMap) {
        this.JsonTemplates = jsonTemplates;        

        // fallback function for getting the package model from the specified path
        var getPackageModelFromPath = function(packagePath) {
            var foundModels = RepositoryUtils.getElementsByPath(packagePath, "@UMLPackage");
            if (!foundModels.length) {
                console.warn("WARNING: A package model could not be found at the path '" + packagePath + "'.");
                return;
            } else if (foundModels.length > 1) {
                console.warn("WARNING: more than one package model was detected at the path '" + packagePath + "'. Helix architecture information will be based on the first result, only.");
            }

            return foundModels[0];
        };

        // foundation layer
        var foundationLayerRootPath = SitecorePreferencesLoader.getSitecoreHelixFoundationPath();
        this.FoundationLayer = new HelixLayer(
            HelixLayerIds.Foundation, 
            foundationLayerRootPath,
            foundationPackageModel 
                ? foundationPackageModel 
                : getPackageModelFromPath(foundationLayerRootPath));

        //feature layer
        var featureLayerRootPath = SitecorePreferencesLoader.getSitecoreHelixFeaturePath();
        this.FeatureLayer = new HelixLayer(
            HelixLayerIds.Feature, 
            featureLayerRootPath,
            featurePackageModel
                ? featurePackageModel
                : getPackageModelFromPath(featureLayerRootPath));
          
        // project layer
        var projectLayerRootPath = SitecorePreferencesLoader.getSitecoreHelixProjectPath();
        this.ProjectLayer = new HelixLayer(
            HelixLayerIds.Project, 
            projectLayerRootPath,
            projectPackageModel
                ? projectPackageModel
                : getPackageModelFromPath(projectLayerRootPath));   
        
        // unknown layer
        this.UnknownLayer = new HelixLayer(HelixLayerIds.Unknown);

        this.PathsToTemplateModelsMap = pathsToTemplateModelsMap || {};
        if (!this.PathsToTemplateModelsMap.length) {
            var abort = false;
            for (var i = 0; i < jsonTemplates.length; i++) {
                var jsonTemplate = jsonTemplates[i];
                var foundModels = RepositoryUtils.getElementsByPath(jsonTemplate.Path, "@UMLInterface");

                if (!foundModels.length) {
                    console.error("Error: cannot generate helix information from architecture because the model for template '" + jsonTemplate.Path + "' was not found");
                    Dialogs.showErrorDialog("Uh oh! An error occurred while generating the Helix information from the Sitecore architecture. See the DevTools console for more information");
                    abort = true;
                    break;
                } else if (foundModels.length > 1) {
                    console.warn("WARNING: more than one model was detected at the path for template '" + jsonTemplate.Path + "'. Helix architecture information will be based on the first template, only.");
                } 
                
                this.PathsToTemplateModelsMap[jsonTemplate.Path] = foundModels[0];
            }

            if (abort) {
                return;
            }
        }

        var _this = this;
        this.PathsToHelixTemplatesMap = {};

        this.HelixTemplates = jsonTemplates.map(function(jsonTemplate) {
            var layerId = _this.getLayerIdFromPath(jsonTemplate.Path);
            var helixTemplate = new HelixTemplate(jsonTemplate, _this.PathsToTemplateModelsMap[jsonTemplate.Path], layerId);
            _this.PathsToHelixTemplatesMap[jsonTemplate.Path] = helixTemplate;

            return helixTemplate;
        });
        this.HelixTemplates.forEach(function(helixTemplate) {
            helixTemplate.initializeDirectDependencies(_this.PathsToHelixTemplatesMap);
        });

        this.ModulePaths = [];  
        this.PathsToHelixModulesMap = {}; 
        this.HelixModules = [];
        
        // set up the variables for building out the HelixModule models
        var layerPrefixesPattern = foundationLayerRootPath + "|" + featureLayerRootPath + "|" + projectLayerRootPath;
        var modulePathsPattern = "((" + layerPrefixesPattern + ")/([^/]+))(/|$)";
        var modulePathsRegExp = new RegExp(modulePathsPattern);
        var modulePathMatchGroupIndex = 1; // path will always be in group 1...until we move the regex to preferences
        var moduleNameMatchGroupIndex = 3; // name will always be in group 3...until we move the regex to preferences'

        // populate the ModulePaths, PathsToHelixModulesMap, and HelixModuels properties
        jsonTemplates.forEach(function(jsonTemplate) {
            var matches = jsonTemplate.Path.match(modulePathsRegExp);
                // ensures that the supplied match group indexes are in range of the number of match groups...
                if (!matches || matches.length < (Math.max(modulePathMatchGroupIndex, moduleNameMatchGroupIndex) + 1)) { 
                    console.warn("WARNING: there were no module path matches for the template at the path \"" + jsonTemplate.Path + "\"");
                    return null;
                }

                var moduleName = matches[moduleNameMatchGroupIndex];
                var modulePath = matches[modulePathMatchGroupIndex];

                // if the module for this path has already been created then skip the path...
                if (_this.ModulePaths.indexOf(modulePath) != -1) {
                    return;
                }
                // add the module's path to the array
                _this.ModulePaths.push(modulePath);

                // get the layer ID of the layer that the module belongs to
                var layerId = _this.getLayerIdFromPath(modulePath);
                // get the paths for the templates belonging to the module
                var templatePaths = _this.JsonTemplates
                    .map(function(jsonTemplate) {
                        return jsonTemplate.Path;
                    })
                    .filter(function(path) {
                        return StringUtils.startsWith(path, modulePath + "/");
                    });

                // get the root package model
                var rootPackageModel = getPackageModelFromPath(modulePath);
    
                // create the module
                var helixModule = new HelixModule(moduleName, modulePath, rootPackageModel, layerId, templatePaths);
                
                // add the module to the map and the array
                _this.PathsToHelixModulesMap[modulePath] = helixModule;    
                _this.HelixModules.push(helixModule);
        });
    }; 

    HelixArchitecture.prototype.getLayerIdFromPath = function(path) {       
        if (this.FoundationLayer.containsTemplatePath(path)) {
            return HelixLayerIds.Foundation;
        } else if (this.FeatureLayer.containsTemplatePath(path)) {
            return HelixLayerIds.Feature;
        } else if (this.ProjectLayer.containsTemplatePath(path)) {
            return HelixLayerIds.Project; 
        } 

        return HelixLayerIds.Unknown;
    };  
    
    function _getModuleInfos(jsonTemplates) {        
        
    };

    exports.HelixArchitecture = HelixArchitecture;
    exports.HelixLayer = HelixLayer;
    exports.HelixModule = HelixModule;
    exports.HelixTemplate = HelixTemplate;
    exports.HelixLayerIds = HelixLayerIds;
});