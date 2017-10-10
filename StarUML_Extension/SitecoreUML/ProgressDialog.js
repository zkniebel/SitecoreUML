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
        message = "<div class=\"progress-dialog__content\">" + message + "</div>";

        cancelDialogIfOpen(uniqueDialogCssClass);
        return Dialogs_get().showModalDialog(uniqueDialogCssClass, title, message, (buttons || []), false)
    };

    // gets the percent complete value, based on the progress bar settings
    //   progressBar          :  Object.{currentStep:int,totalSteps:int} defining the amount of progress that the progress bar should display
    function _getProgressBarPercentComplete(progressBar) {
        return parseInt(((progressBar.currentStep / progressBar.totalSteps) || 0) * 100);
    }
    
    // creates and displays a new or updates the existing progress dialog with progress bar that has the specified uniqueDialogCssClass as its ID
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   title                :  string value to be displayed as the title of the dialog
    //   message              :  HTML string value to be rendered as the body of the dialog
    //   progressBar          :  Object.{currentStep:int,totalSteps:int} defining the amount of progress that the progress bar should display
    //   buttons              :  Array.<{id:string,text:string,className:string}> controlling the buttons to be displayed on the dialog
    function showOrUpdateDialogWithProgressBar(uniqueDialogCssClass, title, message, progressBar, buttons) {
        var percentComplete = _getProgressBarPercentComplete(progressBar);

        var html = 
            "<div class=\"progress-dialog__message\">" + message + "</div>\
            <div class=\"progress-bar\">\
                <div class=\"progress-bar__label\">" + percentComplete + "%</div>\
                <div class=\"progress-bar__container\">\
                    <span class=\"progress-bar__completed-progress\" style=\"width: " + percentComplete + "%;\"></span>\
                </div>\
            </div>";
        
        var dialog = showOrUpdateDialog(uniqueDialogCssClass, title, html, buttons);
        
        // stores the percent complete value in a data attribute (without caching), for improved performance when updating in place
        dialog.getElement().attr("data-progress", percentComplete);

        return dialog;
    };

    // cancels and closes the dialog with the specified uniqueDialogCssClass identifier, if one exists
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   buttonId             :  The button id to use when closing the dialog. Defaults to DIALOG_CANCELED
    function cancelDialogIfOpen(uniqueDialogCssClass, buttonId) {        
        Dialogs_get().cancelModalDialogIfOpen(uniqueDialogCssClass, buttonId);
    };

    exports.showOrUpdateDialog = showOrUpdateDialog;
    exports.showOrUpdateDialogWithProgressBar = showOrUpdateDialogWithProgressBar;
    exports.updateDialogInPlace = updateDialogInPlace;
    exports.cancelDialogIfOpen = cancelDialogIfOpen;
});