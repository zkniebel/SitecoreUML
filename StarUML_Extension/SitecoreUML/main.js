define(function (require, exports, module) {
    "use strict";

    // // gets the import progress message that should be displayed
    // function getImportProgressMessage(actionLabel, path, index, total, type) {
    //     type = type ? " (" + type + ")" : "";
    //     return "<div><b>" + actionLabel + ": </b>" + path + type
    //         + "<br/><b>Completed: </b>" + index
    //         + "<br/><b>Remaining: </b>" + (total - index)
    //         + "</div>";
    // };

    // var ProgressDialog = require("ProgressDialog");
    // var interval = setInterval(testCallback, 1);
    // var index = 0;
    // var total = 1000;
    // function testCallback() {
    //     if (index >= 1000) {
    //         clearInterval(interval);
    //     }

    //     ProgressDialog.showOrUpdateDialogWithProgressBar(
    //         "progressDialogClassId", 
    //         "Test Progress Dialog", 
    //         getImportProgressMessage("Running Test", "/some/value/" + index, index, total), 
    //         { 
    //             currentStep: index, 
    //             totalSteps: total 
    //         });

    //     index++;
    // // }

    // var ProgressDialog = require("ProgressDialog2");
    // ProgressDialog.createAndDisplayProgressBarDialog("uniqueDialogCssClass", "Test Progress", "", 0, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 1, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 2, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 3, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 4, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 5, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 6, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 7, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 8, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 9, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 10, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 11, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 12, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 13, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 14, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 15, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 16, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 17, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 18, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 19, 20);
    // ProgressDialog.queueProgressBarMessageForDialog("uniqueDialogCssClass", "Test Progress", "", 20, 20);

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
});