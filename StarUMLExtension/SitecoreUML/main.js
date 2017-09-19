define(function (require, exports, module) {
    "use strict";

    // load the export and initialize it to add the menu item
    var SitecoreJsonGenerator = require("SitecoreJsonGenerator");  
    SitecoreJsonGenerator.initialize();
    
    // load the import module and initialize it to add the menu item
    var SitecoreJsonReverseEngineer = require("SitecoreJsonReverseEngineer");  
    SitecoreJsonReverseEngineer.initialize();
});