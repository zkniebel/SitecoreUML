define(function (require, exports, module) {
    "use strict";

    // load in the Sitecore preferences
    var SitecorePreferencesLoader = require("SitecorePreferencesLoader");

    // load the json file export and initialize it to add the menu item
    var SitecoreTemplatesJsonGenerator = require("SitecoreTemplatesJsonGenerator");  
    SitecoreTemplatesJsonGenerator.initialize();
    
    // load the json file import module and initialize it to add the menu item
    var SitecoreTemplatesJsonReverseEngineer = require("SitecoreTemplatesJsonReverseEngineer");  
    SitecoreTemplatesJsonReverseEngineer.initialize();

    // load the Sitecore deploy module and initialize it to add the menu item
    var SitecoreTemplatesDeploy = require("SitecoreTemplatesDeploy");  
    SitecoreTemplatesDeploy.initialize();
    
    // load the Sitecore import module and initialize it to add the menu item
    var SitecoreTemplatesReverseEngineer = require("SitecoreTemplatesReverseEngineer");  
    SitecoreTemplatesReverseEngineer.initialize();
});