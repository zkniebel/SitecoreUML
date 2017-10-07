define(function(require, exports, module) {
    "use strict"
    
    // dependencies
    var SitecoreMenuLoader = require("SitecoreMenuLoader");

    // backing fields for lazy-loaded variables - do NOT use these values except from the lazy loaded variable assignments
    var _backingFields = {
        _dialogs: undefined,
        _sitecoreTemplatesJsonGenerator: undefined,
        _sitecorePreferencesLoader: undefined
    };
    
    // lazy-loaded StarUML modules
    var Dialogs = _backingFields._dialogs || (_backingFields._dialogs = app.getModule("dialogs/Dialogs"));

    // lazy-loaded custom modules
    var SitecoreTemplatesJsonGenerator = _backingFields._sitecoreTemplatesJsonGenerator || (_backingFields._sitecoreTemplatesJsonGenerator = require("SitecoreTemplatesJsonGenerator"));
    var SitecorePreferencesLoader = _backingFields._sitecorePreferencesLoader || (_backingFields._sitecorePreferencesLoader = require("SitecorePreferencesLoader"));

    // serializes and deployes templates to Sitecore
    function serializeAndDeploySitecoreTemplates() {
        var templates = SitecoreTemplatesJsonGenerator.generateJsonTemplates();
        var json = JSON.stringify(templates);

        var sitecoreUrl = SitecorePreferencesLoader.getSitecoreUrl();
        var deployRoute = SitecorePreferencesLoader.getSitecoreDeployRoute();
        
        sitecoreUrl = sitecoreUrl.lastIndexOf("/") == sitecoreUrl.length - 1 
            ? sitecoreUrl.substr(0, sitecoreUrl.length - 1) 
            : sitecoreUrl;
        deployRoute = deployRoute.indexOf("/") == 0 
            ? deployRoute 
            : "/" + deployRoute;

        var postUrl = sitecoreUrl + deployRoute;
        $.ajax(
            postUrl, 
            {
                method: "POST",
                data: json,
                cache: false,
                contentType: "application/json; charset=utf-8",
                complete: function(data) {
                    if (!data.success) {
                        console.error("Deploy Error Response: ", data);
                        Dialogs.showErrorDialog("Uh oh! An error occurred while deploying to the Sitecore instance. See the DevTools console for more details.");
                        return;
                    }
    
                    Dialogs.showAlertDialog("Templates deployed successfully!");
                }
            });
    };

    // serializes the templates and validates the field type names in Sitecore
    function serializeAndValidateSitecoreTemplates() {
        var templates = SitecoreTemplatesJsonGenerator.generateJsonTemplates();
        var json = JSON.stringify(templates);
        
        var sitecoreUrl = SitecorePreferencesLoader.getSitecoreUrl();
        // var validateRoute = SitecorePreferencesLoader.getSitecoreValidateRoute();
        var validateRoute = "/sitecoreuml/templates/validateFieldTypes";
        
        sitecoreUrl = sitecoreUrl.lastIndexOf("/") == sitecoreUrl.length - 1 
            ? sitecoreUrl.substr(0, sitecoreUrl.length - 1) 
            : sitecoreUrl;
        validateRoute = validateRoute.indexOf("/") == 0 
            ? validateRoute 
            : "/" + validateRoute;

        var postUrl = sitecoreUrl + validateRoute;
        $.ajax(
            postUrl, 
            {
                method: "POST",
                data: json,
                cache: false,
                contentType: "application/json; charset=utf-8",
                complete: function(data) {
                    if (!data.success) {
                        console.error("Validation Error Response: ", data);
                        Dialogs.showErrorDialog("Uh oh! An error occurred while validating the Sitecore templates. See the DevTools console for more details.");
                        return;
                    }
                    
                    if (!data.responseText.Success) {
                        console.log("Validation Error Response: ", data.responseText);
                        var responseJson = JSON.parse(JSON.parse(data.responseText));

                        var resultList = "<ol>";
                        responseJson.forEach(function(entry) {
                            resultList += "<li><b>" + entry.TemplateName + "</b>::<b>" + entry.FieldName + "</b> &nbsp; : &nbsp; " + entry.FieldType + "</li>";
                        });
                        resultList += "</ol>";
                        
                        var msg = "Invalid Field Types: " + resultList;
                        Dialogs.showErrorDialog(msg);
                        return;
                    }

                    Dialogs.showAlertDialog("No validation errors detected!");
                }
            });
    }
    
    // command ID constant
    var CMD_DEPLOYSITECORETEMPLATES = "sitecore.serializeanddeploysitecoretemplates";

    exports.initialize = function() {
        // eager-load the requisite modules
        var CommandManager = app.getModule("command/CommandManager");
        
        // register the command
        CommandManager.register("Deploy Templates to Sitecore", CMD_DEPLOYSITECORETEMPLATES, serializeAndDeploySitecoreTemplates);
        // add the menu item for the command
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_DEPLOYSITECORETEMPLATES);
    };
    exports.serializeAndDeploySitecoreTemplates = serializeAndDeploySitecoreTemplates;
    exports.CMD_DEPLOYSITECORETEMPLATES = CMD_DEPLOYSITECORETEMPLATES;
});