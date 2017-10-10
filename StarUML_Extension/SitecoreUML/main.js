define(function (require, exports, module) {
    "use strict";

    // load the Sitecore preferences
    var SitecorePreferencesLoader = require("SitecorePreferencesLoader");

    // load the Sitecore project templates
    var SitecoreProjectTemplatesLoader = require("SitecoreProjectTemplatesLoader");
    SitecoreProjectTemplatesLoader.initialize();

    // load the Sitecore deploy module and initialize it to add the menu item
    var SitecoreTemplatesDeploy = require("SitecoreTemplatesDeploy");  
    SitecoreTemplatesDeploy.initialize();
    
    // load the Sitecore import module and initialize it to add the menu item
    var SitecoreTemplatesReverseEngineer = require("SitecoreTemplatesReverseEngineer");  
    SitecoreTemplatesReverseEngineer.initialize();
    
    // load the Sitecore validate module and initialize it to add the menu item
    var SitecoreTemplatesValidate = require("SitecoreTemplatesValidate");  
    SitecoreTemplatesValidate.initialize();

    // load the json file export and initialize it to add the menu item
    var SitecoreTemplatesJsonGenerator = require("SitecoreTemplatesJsonGenerator");  
    SitecoreTemplatesJsonGenerator.initialize();
    
    // load the json file import module and initialize it to add the menu item
    var SitecoreTemplatesJsonReverseEngineer = require("SitecoreTemplatesJsonReverseEngineer");  
    SitecoreTemplatesJsonReverseEngineer.initialize();
    
    // load the Sitecore connection test module and initialize it to add the menu item
    var SitecoreConnectionTest = require("SitecoreConnectionTest");
    SitecoreConnectionTest.initialize();

    AppInit.htmlReady(function() {
        var ExtensionUtils = app.getModule("utils/ExtensionUtils");

        ExtensionUtils.loadStyleSheet(module, "Styles/ProgressDialog.css");
    });
});