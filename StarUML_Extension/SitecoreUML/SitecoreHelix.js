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
    HelixTemplate.prototype.initializeDependencies = function(pathsToHelixTemplatesMap) {
        function _getDependencies(helixTemplate) {
            var dependencies = _dependencySearchCache[helixTemplate.JsonTemplate.Path];
            if (dependencies !== undefined) {
                return dependencies;
            }

            // DEPENDENCY DETERMINATION LOGIC BELOW - ADD ADDITIONAL RULES/LOGIC HERE TO CUSTOMIZE DEPENDENCY DETERMINATION
            dependencies = helixTemplate.JsonTemplate.BaseTemplates
                ? helixTemplate.JsonTemplate.BaseTemplates
                    .map(function(baseTemplatePath) {
                        return _getDependencies(pathsToHelixTemplatesMap[baseTemplatePath]);
                    })
                    .reduce(function(a, b) {
                        return a.concat(b);
                    })
                : [];
            
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

    // TODO: move all of the logic and fallback logic out of this function and into calling function(s) and/or utilities
    /**
     * Creates a new HelixArchitecture object from the given info
     * @param {Array} jsonTemplates serialized JSON template data
     * @param {UMLModel} foundationPackageModel (Optional) model of the foundation layer's root package
     * @param {UMLModel} featurePackageModel (Optional) model of the feature layer's root package
     * @param {UMLModel} projectPackageModel (Optional) model of the project layer's root package
     * @param {Object} pathsToTemplateModelsMap (Optional) mapping table that has the template paths as keys and the corresponding models as values
     * @param {Array} modulePaths (Optional) the paths to all of the modules in the architecture
     */
    function HelixArchitecture(jsonTemplates, foundationPackageModel, featurePackageModel, projectPackageModel, pathsToTemplateModelsMap, modulePaths) {
        this.JsonTemplates = jsonTemplates;        

        // fallback function for getting the layer root models 
        var getLayerRootPackageFromPath = function(rootPackagePath) {
            var foundModels = RepositoryUtils.getElementsByPath(rootPackagePath, "@UMLPackage");
            if (!foundModels.length) {
                console.warn("WARNING: A layer root could not be found at the path '" + rootPackagePath + "'.");
                return;
            } else if (foundModels.length > 1) {
                console.warn("WARNING: more than one model was detected at the path for layer root '" + rootPackagePath + "'. Helix architecture information will be based on the first result, only.");
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
                : getLayerRootPackageFromPath(foundationLayerRootPath));

        //feature layer
        var featureLayerRootPath = SitecorePreferencesLoader.getSitecoreHelixFeaturePath();
        this.FeatureLayer = new HelixLayer(
            HelixLayerIds.Feature, 
            featureLayerRootPath,
            featurePackageModel
                ? featurePackageModel
                : getLayerRootPackageFromPath(featureLayerRootPath));
          
        // project layer
        var projectLayerRootPath = SitecorePreferencesLoader.getSitecoreHelixProjectPath();
        this.ProjectLayer = new HelixLayer(
            HelixLayerIds.Project, 
            projectLayerRootPath,
            projectPackageModel
                ? projectPackageModel
                : getLayerRootPackageFromPath(projectLayerRootPath));   
        
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
            helixTemplate.initializeDependencies(_this.PathsToHelixTemplatesMap);
        });

        var getModulePaths = function() {
            var layerPrefixesPattern = foundationLayerRootPath + "|" + featureLayerRootPath + "|" + projectLayerRootPath;
            var modulePathsPattern = "((" + layerPrefixesPattern + ")/[^/]+)(/|$)";
            var modulePathsRegExp = new RegExp(modulePathsPattern);
            var modulePathMatchGroupIndex = 1; // match will always be in group 1

            var mPaths = ArrayUtils.uniqueElements(
                jsonTemplates.map(function(jsonTemplate) {
                    var matches = jsonTemplate.Path.match(modulePathsRegExp);
                    if (!matches || matches.length < (modulePathMatchGroupIndex + 1)) { // so long as there are matches, there should be the expected number of match groups, but just to be safe...
                        console.warn("WARNING: there were no module path matches for the template at the path \"" + jsonTemplate.Path + "\"");
                        return null;
                    }
                    return matches[1];
                })
                .filter(function(path) {
                    return path != null;
                })
            );
                
            return mPaths;
        };

        this.ModulePaths = modulePaths || getModulePaths();

        if (!_this.ModulePaths || !_this.ModulePaths.length) {
            return;
        }

        _this.PathsToHelixModulesMap = {};
        _this.HelixModules = _this.ModulePaths.map(function(modulePath) {
            var layerId = _this.getLayerIdFromPath(modulePath);
            var templatePaths = jsonTemplates
                .map(function(jsonTemplate) {
                    return jsonTemplate.Path;
                })
                .filter(function(path) {
                    return StringUtils.startsWith(path, modulePath)
                });

            var helixModule = new HelixModule(modulePath, layerId, templatePaths);
            _this.PathsToHelixModulesMap[modulePath] = helixModule;

            return helixModule;
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

    exports.HelixArchitecture = HelixArchitecture;
    exports.HelixLayer = HelixLayer;
    exports.HelixModule = HelixModule;
    exports.HelixTemplate = HelixTemplate;
    exports.HelixLayerIds = HelixLayerIds;
});