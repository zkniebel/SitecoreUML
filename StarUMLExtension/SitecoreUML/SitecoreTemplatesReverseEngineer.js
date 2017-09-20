define(function(require, exports, module) {
    "use strict"
    
    // dependencies
    var SitecoreMenuLoader = require("SitecoreMenuLoader");

    // TODO: implemement
    function reverseEngineerFromSitecore() {
        app.getModule("dialogs/Dialogs").showAlertDialog("Not yet implemented");
    }
    
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