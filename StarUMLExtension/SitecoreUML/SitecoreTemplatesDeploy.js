define(function(require, exports, module) {
    "use strict"
    
    // dependencies
    var SitecoreMenuLoader = require("SitecoreMenuLoader");

    // backing fields for lazy-loaded variables - do NOT use these values except from the lazy loaded variable assignments
    var _backingFields = {
        _sitecoreTemplatesJsonGenerator: undefined,
    };
    
    // lazy-loaded StarUML modules
    var SitecoreTemplatesJsonGenerator = _backingFields._sitecoreTemplatesJsonGenerator || (_backingFields._sitecoreTemplatesJsonGenerator = require("SitecoreTemplatesJsonGenerator"));

    // serializes
    function serializeAndDeploySitecoreTemplates() {
        var templates = SitecoreTemplatesJsonGenerator.generateJsonTemplates();
        var json = JSON.stringify(templates);

        $.ajax(
            "http://local.sitecoreuml.com/sitecoreuml/templates/deploy", 
            {
                method: "POST",
                data: json,
                cache: false,
                contentType: "application/json; charset=utf-8",
                error: function() {
                    console.error("Deploy Error Response: ", data);
                    app.getModule("dialogs/Dialogs").showErrorDialog("Uh oh! An error occurred while deploying to the Sitecore instance. See the DevTools console for more details.");
                    return;
                },
                success: function(data) {
                    if (!data.success) {
                        console.error("Deploy Error Response: ", data);
                        app.getModule("dialogs/Dialogs").showErrorDialog("Uh oh! An error occurred while deploying to the Sitecore instance. See the DevTools console for more details.");
                        return;
                    }
    
                    app.getModule("dialogs/Dialogs").showAlertDialog("Templates deployed successfully!");
                }
            });
    };
    
    // command ID constant
    var CMD_DEPLOYSITECORETEMPLATES = "sitecore.serializeanddeploysitecoretemplates";

    exports.initialize = function() {
        // eager-load the requisite modules
        var CommandManager = app.getModule("command/CommandManager");
        
        // register the command
        CommandManager.register("Deploy Templates to Sitecore", CMD_DEPLOYSITECORETEMPLATES, serializeAndDeploySitecoreTemplates);
        // add the menu item
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_DEPLOYSITECORETEMPLATES);
    };
    exports.serializeAndDeploySitecoreTemplates = serializeAndDeploySitecoreTemplates;
    exports.CMD_DEPLOYSITECORETEMPLATES = CMD_DEPLOYSITECORETEMPLATES;
});