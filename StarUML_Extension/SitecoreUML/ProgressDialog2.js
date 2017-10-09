define(function(require, exports, module) {
    "use strict";
    
    var _dialogs = undefined;
    var Dialogs_get = function() { return _dialogs || (_dialogs = app.getModule("dialogs/Dialogs")); };

    // stack to display progress from on tick
    var progressStack = {}; 
    var progressStackKeys = [];
    var stackProcessingInterval = undefined;
    
    // creates and displays a new progress dialog with the specified uniqueDialogCssClass as its ID
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   title                :  string value to be displayed as the title of the dialog
    //   message              :  HTML string value to be rendered as the body of the dialog
    //   buttons              :  Array.<{id:string,text:string,className:string}> controlling the buttons to be displayed on the dialog
    function createAndDisplayDialog(uniqueDialogCssClass, title, message, buttons) {
        message = "<div style=\"padding:10px 10px 20px 10px;\">" + message + "</div>";

        // close any other dialog with the same ID
        _cancelDialogIfOpen(uniqueDialogCssClass);

        // initialize the progress stack for the dialog
        progressStack[uniqueDialogCssClass] = message;
        progressStackKeys.push(uniqueDialogCssClass);

        // start the processing interval, if not already started
        if (!stackProcessingInterval) {
            stackProcessingInterval = setInterval(function() { _updateAndDisplayDialogs(); }, 100);
        }

        Dialogs_get().showModalDialog(uniqueDialogCssClass, title, message, buttons, false)
    };
    
    // creates and displays a new progress bar dialog with the specified uniqueDialogCssClass as its ID
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   title                :  string value to be displayed as the title of the dialog
    //   message              :  HTML string value to be rendered as the body of the dialog
    //   currentStep          :  int value indicating the current step in the task being executed
    //   totalSteps           :  int value indicating the total number of steps in the task being executed
    //   buttons              :  Array.<{id:string,text:string,className:string}> controlling the buttons to be displayed on the dialog
    function createAndDisplayProgressBarDialog(uniqueDialogCssClass, title, message, currentStep, totalSteps, buttons) {
        message += getProgressBarHtml(currentStep, totalSteps);
        createAndDisplayDialog(uniqueDialogCssClass, title, message, buttons);
    };

    // callback to process the LIFO stack for the dialog with the given identifier
    function _updateAndDisplayDialogs() {
        console.log("processing progress bar stacks");

        progressStackKeys.forEach(function(key) { 
            var stack = progressStack[key];
            if (stack) {  
                var entry = progressStack[key]; // used to actually be a stack - now it's more of a map
    
                _cancelDialogIfOpen(key);
                Dialogs_get().showModalDialog(key, entry.title, entry.message, entry.buttons, false);
            }
        });
    };

    // gets the markup for the state of the progress bar represented by the current step and total steps
    function getProgressBarHtml(currentStep, totalSteps) {
        var percentComplete = parseInt(((currentStep / totalSteps) || 0) * 100);

        var progressBarMarkup = "<div style=\"text-align: right;\"> " 
            + percentComplete 
            + "%</div><div class=\"progress-bar__container\" style=\"height: 21px; background-color: #2d2e30; border-top: 1px solid #27282a; border-left: 1px solid #27282a; border-bottom: 1px solid #454648; border-right: 1px solid #454648; border-radius: 4px; overflow: hidden; padding: 1px;\"><span style=\"display: inline-block; height: 100%; width: " 
            + percentComplete 
            + "%; background: linear-gradient(to right, rgb(199, 199, 199), rgb(240, 240, 240)); background-color: rgb(199, 199, 199); border-radius: 2px;\"></span></div>";

        return progressBarMarkup;
    }
    
    // queues the message onto the progress stack
    function queueMessageForDialog(uniqueDialogCssClass, title, message, buttons) {
        var messageStack = progressStack[uniqueDialogCssClass];
        if (!messageStack) {
            console.error("Progress stack for " + uniqueDialogCssClass + " does not exist");
        }

        progressStack[uniqueDialogCssClass] = {
            title: title,
            message: message,
            buttons: buttons
        };
    }
    
    // queues the progress bar message onto the progress stack
    function queueProgressBarMessageForDialog(uniqueDialogCssClass, title, message, currentStep, totalSteps, buttons) {
        message += getProgressBarHtml(currentStep, totalSteps);
        queueMessageForDialog(uniqueDialogCssClass, title, message, buttons);
    }

    // cancels and closes the dialog with the specified uniqueDialogCssClass identifier, if one exists
    //   uniqueDialogCssClass :  CSS class to be used as the dialog's ID (should be unique to the dialog)
    //   buttonId             :  The button id to use when closing the dialog. Defaults to DIALOG_CANCELED
    function _cancelDialogIfOpen(uniqueDialogCssClass, buttonId) {        
        Dialogs_get().cancelModalDialogIfOpen(uniqueDialogCssClass, buttonId);
    }

    // disposes of the dialog with the given identifier
    //   IMPORTANT: this function must be called for every progress bar dialog once finished with it
    function disposeOfDialog(uniqueDialogCssClass) {
        // reset the stack for the key
        progressStack[uniqueDialogCssClass] = undefined;
        
        // remove the key from the list of progress stack keys
        var keyIndex = progressStackKeys.indexOf(uniqueDialogCssClass);
        while (keyIndex >= 0) {
            progressStackKeys.splice(keyIndex, 1);
        }

        // stop the interval, if this was the last dialog being processed, and reset it
        clearInterval(stackProcessingInterval);
        stackProcessingInterval = undefined;
    }


    exports.createAndDisplayDialog = createAndDisplayDialog;
    exports.createAndDisplayProgressBarDialog = createAndDisplayProgressBarDialog;
    exports.queueMessageForDialog = queueMessageForDialog;
    exports.queueProgressBarMessageForDialog = queueProgressBarMessageForDialog;
    exports.getProgressBarHtml = getProgressBarHtml;
    exports.disposeOfDialog = disposeOfDialog;
});