define(function(require, exports, module) {
    "use strict"
    
    // dependencies
    var SitecoreMenuLoader = require("SitecoreMenuLoader");
    
    // backing fields for lazy-loaded variables - do NOT use these values except from the lazy loaded variable assignments
    var _backingFields = {
        _dialogs: undefined,
        _sitecoreTemplatesJsonReverseEngineer: undefined,
        _sitecorePreferencesLoader: undefined
    };
    
    // lazy-loaded StarUML modules
    var Dialogs = _backingFields._dialogs || (_backingFields._dialogs = app.getModule("dialogs/Dialogs"));

    // lazy-loaded custom modules
    var SitecoreTemplatesJsonReverseEngineer = _backingFields._sitecoreTemplatesJsonReverseEngineer || (_backingFields._sitecoreTemplatesJsonReverseEngineer = require("SitecoreTemplatesJsonReverseEngineer"));
    var SitecorePreferencesLoader = _backingFields._sitecorePreferencesLoader || (_backingFields._sitecorePreferencesLoader = require("SitecorePreferencesLoader"));

    // reverse engineer the diagrams and models from Sitecore
    function reverseEngineerFromSitecore() {
        var sitecoreUrl = SitecorePreferencesLoader.getSitecoreUrl();
        var importRoute = SitecorePreferencesLoader.getSitecoreImportRoute();
        
        sitecoreUrl = sitecoreUrl.lastIndexOf("/") == sitecoreUrl.length - 1 
            ? sitecoreUrl.substr(0, sitecoreUrl.length - 1) 
            : sitecoreUrl;
        importRoute = importRoute.indexOf("/") == 0 
            ? importRoute 
            : "/" + importRoute;

        var getUrl = sitecoreUrl + importRoute;

        $.getJSON(getUrl, function(data) {
            if (!data.Success) {
                console.error("Import Error Response: ", data);
                Dialogs.showErrorDialog("Uh oh! An error occurred while importing from the Sitecore instance. See the DevTools console for more details.");
                return;
            }

            // get the templates from the returned data
            var jsonTemplates = data.Data;

            // report the retrieved templates to the log for debugging purposes
            console.log(jsonTemplates);

            // generate the diagrams
            SitecoreTemplatesJsonReverseEngineer.generateTemplateDiagrams(jsonTemplates)
        });
    };
    
    // command ID constant
    var CMD_REVERSEENGINEERSITECORETEMPLATES = "sitecore.reverseengineersitecoretemplates";

    exports.initialize = function() {
        // eager-load the requisite modules
        var CommandManager = app.getModule("command/CommandManager");
        
        // register the command
        CommandManager.register("Import Templates from Sitecore", CMD_REVERSEENGINEERSITECORETEMPLATES, reverseEngineerFromSitecore);
        // add the menu item
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_REVERSEENGINEERSITECORETEMPLATES);
    };
    exports.reverseEngineerFromSitecore = reverseEngineerFromSitecore;
    exports.CMD_REVERSEENGINEERSITECORETEMPLATES = CMD_REVERSEENGINEERSITECORETEMPLATES;
});