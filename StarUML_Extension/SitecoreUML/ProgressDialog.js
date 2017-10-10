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

    // updates the existing progress dialog that has the specified uniqueDialogCssClass as its ID, without replacing the dialog
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   dialogOptions        :  Object.{title:string,message:string,progressBar:Object.{currentStep:int,totalSteps:int}} 
    //                           see showOrUpdateDialogWithProgressBar for more details on each of the properties. Note that all properties are optional.
    // NOTEs: 
    // - It is important that there is only one dialog with the given class identifier, otherwise multiple dialogs will be updated
    // - This function is meant to be a shortcut function and will not remove existing progress bars or elements that no longer have content. 
    // - If you want to update the raw dialog markup in place, use the updateDialogHtmlInPlace function
    function updateDialogInPlace(uniqueDialogCssClass, dialogOptions) {
        console.log("Updating");
        console.log(uniqueDialogCssClass, dialogOptions);
        if (!dialogOptions) {
            return;
        }

        var _$dialog = undefined; 
        var $dialog_get = function() { return _$dialog || (_$dialog = $("." + uniqueDialogCssClass)); };

        if (dialogOptions.title !== undefined) {
            $dialog_get()
                .siblings(".k-window-titlebar")
                .children(".k-window-title")
                .html(dialogOptions.title);
        }

        var _$content = undefined;;
        var $content_get = function() { return _$content || (_$content = $dialog_get().find(".progress-dialog__content")); };

        if (dialogOptions.message !== undefined) {
            var $content = $content_get();
            var $message = $content_get().children(".progress-dialog__message");

            if ($message.length) {
                $message.html(dialogOptions.message);
            } else {
                $content.html("<div class=\"progress-dialog__message\">" + message + "</div>")
            }
        }

        if (dialogOptions.progressBar !== undefined) {
            // intentionally using .attr to avoid getting cached values
            var displayedProgress = $dialog_get().attr("data-progress");
            if (displayedProgress === undefined) {
                // the dialog doesn't have a progress bar - no need to go any further
                return;
            }

            var percentComplete = _getProgressBarPercentComplete(dialogOptions.progressBar);
            if (parseInt(displayedProgress) === percentComplete) {
                // the progress didn't changed from what's already displayed - no need to go any further
                return;
            }

            var percentCompleteStr = percentComplete + "%";
            var $content = $content_get();
            $content.find(".progress-bar__label").text(percentCompleteStr);
            $content.find(".progress-bar__completed-progress").css("width", percentCompleteStr);
        }
    };

    // updates the htmlContent and title for the dialog in place
    function updateDialogHtmlInPlace(uniqueDialogCssClass, htmlContent) {   
        $("." + uniqueDialogCssClass)
            .find(".progress-dialog__content")
            .html(htmlContent);
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