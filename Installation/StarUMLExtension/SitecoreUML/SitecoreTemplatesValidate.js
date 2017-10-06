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

    // serializes the templates and validates the field type names in Sitecore
    function serializeAndValidateSitecoreTemplates() {
        var templates = SitecoreTemplatesJsonGenerator.generateJsonTemplates();
        var json = JSON.stringify(templates);
        
        var sitecoreUrl = SitecorePreferencesLoader.getSitecoreUrl();
        var validateRoute = SitecorePreferencesLoader.getSitecoreValidateRoute();
        
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
                    var responseJson = JSON.parse(JSON.parse(data.responseText));           
                    if (!responseJson.length) {                        
                        Dialogs.showAlertDialog("No validation errors detected!");
                        return;
                    }

                    var resultList = "<ol>";
                    responseJson.forEach(function(entry) {
                        resultList += "<li><b>" + entry.TemplateName + "</b>::<b>" + entry.FieldName + "</b> &nbsp; : &nbsp; " + entry.FieldType + "</li>";
                    });
                    resultList += "</ol>";
                    
                    var msg = "Invalid Field Types: " + resultList;
                    Dialogs.showErrorDialog(msg);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error("Validation Errore: ", errorThrown, textStatus, jqXHR);
                Dialogs.showErrorDialog("Uh oh! An error occurred while validating the Sitecore templates. See the DevTools console for more details.");
                return;
            });
    }
    
    // command ID constant
    var CMD_VALIDATESITECORETEMPLATES = "sitecore.serializeandvalidatesitecoretemplates";

    exports.initialize = function() {
        // eager-load the requisite modules
        var CommandManager = app.getModule("command/CommandManager");

        // register the command
        CommandManager.register("Validate Templates", CMD_VALIDATESITECORETEMPLATES, serializeAndValidateSitecoreTemplates);
        // add the menu item for the command
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_VALIDATESITECORETEMPLATES);
    };
    exports.serializeAndValidateSitecoreTemplates = serializeAndValidateSitecoreTemplates;
    exports.CMD_VALIDATESITECORETEMPLATES = CMD_VALIDATESITECORETEMPLATES;
});