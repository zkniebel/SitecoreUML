define(function(require, exports, module) {
    "use strict";
    
    // eager-loaded StarUML modules
    var Commands = app.getModule("command/Commands");
    var CommandManager = app.getModule("command/CommandManager");
    var MenuManager = app.getModule("menu/MenuManager");

    // the command ID for the sitecore menu
    var CMD_SITECOREMENU = "sitecore"

    // register the "Sitecore" menu command
    CommandManager.register("Sitecore", CMD_SITECOREMENU, CommandManager.doNothing);        
    // add the "Sitecore" menu
    var sitecoreMenu = MenuManager.addMenu(CMD_SITECOREMENU, MenuManager.BEFORE, Commands.HELP);

    exports.CMD_SITECOREMENU = CMD_SITECOREMENU;
    exports.sitecoreMenu = sitecoreMenu;
});