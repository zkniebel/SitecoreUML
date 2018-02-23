define(function(require, exports, module) {
    "use strict";    

    // eager-load the required modules
    var PreferenceManager = app.getModule("core/PreferenceManager");
    var AppInit = app.getModule("utils/AppInit");

    // set the ID of the Sitecore preferences tab
    var preferenceId = "sitecore";

    // set the IDs of each of the preferences
    var sitecoreUrlId = "sitecore.connection.url";
    var sitecoreDeployRouteId = "sitecore.service.deployroute";
    var sitecoreImportRouteId = "sitecore.service.importroute";
    var sitecoreValidateRouteId = "sitecore.service.validateroute";
    var sitecoreTestConnectionRouteId = "sitecore.service.testconnectionroute";
    var sitecoreImportDefaultDiagramFormatId = "sitecore.import.defaultdiagramformat";
    var sitecoreHelixFoundationPathId = "sitecore.helix.foundationlayerpath";
    var sitecoreHelixFeaturePathId = "sitecore.helix.featurelayerpath";
    var sitecoreHelixProjectPathId = "sitecore.helix.projectlayerpath";
    var sitecoreHelixModulePathsRegularExpressionId = "sitecore.helix.modulepathsregularexpression";
    var sitecoreHelixModulePathsRegularExpressionPathCaptureGroupId = "sitecore.helix.modulepathsregularexpression.pathcapturegroup";
    var sitecoreHelixModulePathsRegularExpressionNameCaptureGroupId = "sitecore.helix.modulepathsregularexpression.namecapturegroup";

    // configure the preferences
    var sitecorePreferences = {
        "sitecore.connection.section": {
            text: "Instance Connection Settings",
            type: "Section"
        },
        "sitecore.connection.url": {
            text: "Sitecore URL",
            description: "URL of the Sitecore instance that you want to connect to",
            type: "String",
            default: "http://localhost"
        },
        "sitecore.import.section": {
            text: "Diagram Generation Settings",
            type: "Section"
        },
        "sitecore.import.defaultdiagramformat": {
            text: "Default Diagram Format",
            description: "Default formatting to be applied to all generated diagrams",
            type: "Dropdown",
            options: [ 
                { 
                    text: "Auto",
                    value: "format.layout.auto",
                }, 
                { 
                    text: "Top to Bottom",
                    value: "format.layout.topToBottom",
                }, 
                { 
                    text: "Bottom to Top",
                    value: "format.layout.bottomToTop",
                }, 
                { 
                    text: "Left to Right",
                    value: "format.layout.leftToRight",
                }, 
                { 
                    text: "Right to Left",
                    value: "format.layout.RightToLeft",
                }
            ],            
            default: "format.layout.leftToRight"
        },
        "sitecore.helix.section": {
            text: "SitecoreUML Helix Settings",
            type: "Section"
        },
        "sitecore.helix.foundationlayerpath": {
            text: "Foundation Template Folder Path",
            description: "Path to Foundation template folder relative to root template folder. (Case-sensitive; should start with a forward-slash should not end with a forward-slash)",
            type: "String",
            default: "/Foundation"
        },
        "sitecore.helix.featurelayerpath": {
            text: "Feature Template Folder Path",
            description: "Path to Feature template folder relative to root template folder. (Case-sensitive; should start with a forward-slash should not end with a forward-slash)",
            type: "String",
            default: "/Feature"
        },
        "sitecore.helix.projectlayerpath": {
            text: "Project Template Folder Path",
            description: "Path to Project template folder relative to root template folder. (Case-sensitive; should start with a forward-slash should not end with a forward-slash)",
            type: "String",
            default: "/Project"
        },
        "sitecore.helix.modulepathsregularexpression": {
            text: "Module Paths Regular Expression",
            description: "Regular expression for used to match Helix modules in paths. Use the {{LAYER_PATH}} token to indicate the generated pattern for matching any one of the layer names. IMPORTANT: the regular expression must have a capturing group for the module's path and a matching group for the module's name",
            type: "String",
            default: "(({{LAYER_PATH}}))/([^/]+))(/|$)"
        },
        "sitecore.helix.modulepathsregularexpression.pathcapturegroup": {
            text: "Module Path Capture Group Number",
            description: "Group number of the capture group in the Module Paths Regular Expression that matches the module's path",
            type: "Number",
            default: 1
        },        
        "sitecore.helix.modulepathsregularexpression.namecapturegroup": {
            text: "Module Name Capture Group Number",
            description: "Group number of the capture group in the Module Paths Regular Expression that matches the module's name",
            type: "Number",
            default: 3
        },        
        "sitecore.service.section": {
            text: "SitecoreUML Service Settings",
            type: "Section"
        },
        "sitecore.service.deployroute": {
            text: "Deploy Route",
            description: "Route to POST to when deploying data to Sitecore",
            type: "String",
            default: "/sitecoreuml/templates/deploy"
        },
        "sitecore.service.importroute": {
            text: "Import Route",
            description: "Route to GET when importing data from Sitecore",
            type: "String",
            default: "/sitecoreuml/templates/export"
        },
        "sitecore.service.validateroute": {
            text: "Validate Route",
            description: "Route to POST to when validating field types with Sitecore",
            type: "String",
            default: "/sitecoreuml/templates/validate"
        },
        "sitecore.service.testconnectionroute": {
            text: "Connection Test Route",
            description: "Route to GET when testing the connection to Sitecore",
            type: "String",
            default: "/sitecoreuml/status/connectivity"
        }
    };

    // register the preferences tab to add it to the UI
    AppInit.htmlReady(function () {
        PreferenceManager.register(preferenceId, "Sitecore", sitecorePreferences);
    });

    exports.sitecorePreferenceId = preferenceId;
    exports.sitecoreUrlId = sitecoreUrlId;
    exports.sitecoreImportDefaultDiagramFormatId = sitecoreImportDefaultDiagramFormatId;
    exports.sitecoreDeployRouteId = sitecoreDeployRouteId;
    exports.sitecoreImportRouteId = sitecoreImportRouteId;
    exports.sitecoreValidateRouteId = sitecoreValidateRouteId;
    exports.sitecoreHelixFoundationPathId = sitecoreHelixFoundationPathId;
    exports.sitecoreHelixFeaturePathId = sitecoreHelixFeaturePathId;
    exports.sitecoreHelixProjectPathId = sitecoreHelixProjectPathId;
    exports.sitecoreHelixModulePathsRegularExpressionId = sitecoreHelixModulePathsRegularExpressionId;
    exports.getSitecoreUrl = function() { return PreferenceManager.get(sitecoreUrlId); };
    exports.sitecoreHelixModulePathsRegularExpressionPathCaptureGroupId = sitecoreHelixModulePathsRegularExpressionPathCaptureGroupId;
    exports.getSitecoreImportDefaultDiagramFormat = function() { return PreferenceManager.get(sitecoreImportDefaultDiagramFormatId); };
    exports.getSitecoreDeployRoute = function() { return PreferenceManager.get(sitecoreDeployRouteId); };
    exports.getSitecoreImportRoute = function() { return PreferenceManager.get(sitecoreImportRouteId); };
    exports.getSitecoreValidateRoute = function() { return PreferenceManager.get(sitecoreValidateRouteId); };
    exports.getSitecoreTestConnectionRoute = function() { return PreferenceManager.get(sitecoreTestConnectionRouteId); };
    exports.getSitecoreHelixFoundationPath = function() { return PreferenceManager.get(sitecoreHelixFoundationPathId); };
    exports.getSitecoreHelixFeaturePath = function() { return PreferenceManager.get(sitecoreHelixFeaturePathId); };
    exports.getSitecoreHelixProjectPath = function() { return PreferenceManager.get(sitecoreHelixProjectPathId); };
    exports.getSitecoreHelixModulePathsRegularExpression = function() { return PreferenceManager.get(sitecoreHelixModulePathsRegularExpressionId); };
    exports.getSitecoreHelixModulePathsRegularExpressionPathCaptureGroup = function() { return PreferenceManager.get(sitecoreHelixModulePathsRegularExpressionPathCaptureGroupId); };
    exports.getSitecoreHelixModulePathsRegularExpressionNameCaptureGroup = function() { return PreferenceManager.get(sitecoreHelixModulePathsRegularExpressionNameCaptureGroupId); };
});