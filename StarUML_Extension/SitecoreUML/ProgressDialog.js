define(function(require, exports, module) {
    "use strict";
    
    var _dialogs = undefined;
    var Dialogs_get = function() { return _dialogs || (_dialogs = app.getModule("dialogs/Dialogs")); };

    // creates and displays a new or updates the existing progress dialog with the specified uniqueDialogCssClass as its ID
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   title                :  string value to be displayed as the title of the dialog
    //   message              :  HTML string value to be rendered as the body of the dialog
    //   buttons              :  Array.<{id:string,text:string,className:string}> controlling the buttons to be displayed on the dialog
    function showOrUpdateDialog(uniqueDialogCssClass, title, message, buttons) {
        message = "<div style=\"padding:10px 10px 20px 10px; height: 400px; width: 500px;\">" + message + "</div>";

        cancelDialogIfOpen(uniqueDialogCssClass);
        return Dialogs_get().showModalDialog(uniqueDialogCssClass, title, message, (buttons || []), false)
    };
    
    // creates and displays a new or updates the existing progress dialog with progress bar that has the specified uniqueDialogCssClass as its ID
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   title                :  string value to be displayed as the title of the dialog
    //   message              :  HTML string value to be rendered as the body of the dialog
    //   progressBar          :  Object.{currentStep:int,totalSteps:int} defining the amount of progress that the progress bar should display
    //   buttons              :  Array.<{id:string,text:string,className:string}> controlling the buttons to be displayed on the dialog
    function showOrUpdateDialogWithProgressBar(uniqueDialogCssClass, title, message, progressBar, buttons) {
        var percentComplete = parseInt(((progressBar.currentStep / progressBar.totalSteps) || 0) * 100);

        var progressBarMarkup = 
            "<div class=\"progress-bar\">" + percentComplete + "%</div><div class=\"progress-bar__container\"><span style=\"width: " + percentComplete + "%;\"></span></div>";
        
        var bodyHtml = message + progressBarMarkup;
        return showOrUpdateDialog(uniqueDialogCssClass, title, bodyHtml, buttons);
    }

    // cancels and closes the dialog with the specified uniqueDialogCssClass identifier, if one exists
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   buttonId             :  The button id to use when closing the dialog. Defaults to DIALOG_CANCELED
    function cancelDialogIfOpen(uniqueDialogCssClass, buttonId) {        
        Dialogs_get().cancelModalDialogIfOpen(uniqueDialogCssClass, buttonId);
    }

    exports.showOrUpdateDialog = showOrUpdateDialog;
    exports.showOrUpdateDialogWithProgressBar = showOrUpdateDialogWithProgressBar;
    exports.cancelDialogIfOpen = cancelDialogIfOpen;
});