define(function(require, exports, module) {
    "use strict";
    
    // backing fields for lazy-loaded variables - do NOT use these values except from the lazy loaded variable assignments
    var _backingFields = {
        _commands: undefined,
        _commandManager: undefined,
        _menuManager: undefined
    };
    
    // lazy-loaded StarUML modules
    var Commands = _backingFields._commands || (_backingFields._commands = app.getModule("command/Commands"));
    var CommandManager = _backingFields._commandManager || (_backingFields._commandManager = app.getModule("command/CommandManager"));
    var MenuManager = _backingFields._menuManager || (_backingFields._menuManager = app.getModule("menu/MenuManager"));

    // command ID constants
    var CMD_FILE_NEW_FROM_TEMPLATE_SITECORE = "file.newfromtemplate.sitecore";
    var CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_BLANKPROJECT = "file.newfromtemplate.sitecore.blank";
    var CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_HELIXPROJECT = "file.newfromtemplate.sitecore.helixproject";

    // TODO: this should be moved to its own module
    function registerSubMenu(displayName, commandId, parentMenuId) {
        // register the command
        CommandManager.register(displayName, commandId, CommandManager.doNothing);

        // get the parent menu
        var parentMenu = MenuManager.getMenuItem(parentMenuId);

        // add the new menu
        return parentMenu.addMenuItem(commandId);
    }

    function registerProjectTemplate(displayName, commandId, templatePath, menu) {
        // register the command
        CommandManager.register(displayName, commandId, function() { 
            return CommandManager.execute(Commands.FILE_NEW, templatePath); 
        });

        // add the menu item for the command
        menu = menu || (menu = MenuManager.getMenuItem(CMD_FILE_NEW_FROM_TEMPLATE_SITECORE));
        menu.addMenuItem(commandId);
    }

    exports.initialize = function() {
        // register the menu
        var menu = registerSubMenu("Sitecore", CMD_FILE_NEW_FROM_TEMPLATE_SITECORE, Commands.FILE_NEW_FROM_TEMPLATE);

        // eager-load the ExtensionUtils module for getting the root path 
        var ExtensionUtils = app.getModule("utils/ExtensionUtils");

        // get the root path
        var rootPath = ExtensionUtils.getModulePath(module);

        // register the templates
        registerProjectTemplate(
            "Blank Project", 
            CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_BLANKPROJECT, 
            rootPath + "Templates/BlankProject.mdj", 
            menu);
        registerProjectTemplate(
            "Helix Project",
            CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_HELIXPROJECT,
            rootPath + "Templates/HelixProject.mdj",
            menu);
    };
    exports.registerProjectTemplate = registerProjectTemplate;
    exports.CMD_FILE_NEW_FROM_TEMPLATE_SITECORE = CMD_FILE_NEW_FROM_TEMPLATE_SITECORE;
    exports.CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_BLANKPROJECT = CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_BLANKPROJECT;
    exports.CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_HELIXPROJECT = CMD_FILE_NEW_FROM_TEMPLATE_SITECORE_HELIXPROJECT;
});