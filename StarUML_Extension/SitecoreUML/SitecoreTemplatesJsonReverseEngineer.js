define(function (require, exports, module) {
    "use strict";

    // dependencies    
    var SitecoreMenuLoader = require("SitecoreMenuLoader");

    // backing fields for lazy-loaded variables - do NOT use these values except from the lazy loaded variable assignments
    var _backingFields = {
        _repository: undefined,
        _factory: undefined,
        _fileSystem: undefined,
        _fileUtils: undefined,
        _dialogs: undefined,
        _modelExplorerView: undefined,
        _stringUtils: undefined,
        _diagramUtils: undefined
    };

    // lazy-loaded StarUML modules
    var Repository_get =  function() { return _backingFields._repository || (_backingFields._repository = app.getModule("core/Repository")); };
    var Factory = _backingFields._factory || (_backingFields._factory = app.getModule("engine/Factory"));
    var FileSystem = _backingFields._fileSystem || (_backingFields._fileSystem = app.getModule("filesystem/FileSystem"));
    var FileUtils = _backingFields._fileUtils || (_backingFields._fileUtils = app.getModule("file/FileUtils"));
    var Dialogs = _backingFields._dialogs || (_backingFields._dialogs = app.getModule("dialogs/Dialogs"));
    var ModelExplorerView_get = function() { return _backingFields._modelExplorerView || (_backingFields._modelExplorerView = app.getModule("explorer/ModelExplorerView")); };

    // lazy-loaded custom modules
    var StringUtils = _backingFields._stringUtils || (_backingFields._stringUtils = require("StringUtils"));
    var DiagramUtils = _backingFields._diagramUtils || (_backingFields._diagramUtils = require("DiagramUtils"));

    // eagerly-loaded (make lazy later)
    var ProgressDialog = require("ProgressDialog"); 




    // progress dialog constants
    var progressDialogClassId = "dialog-progress__sitecoreuml--import";
    var progressDialogTitle = "Import Progress";
    
    // gets the import progress message that should be displayed
    function getImportProgressMessage(actionLabel, path, index, total, type) {
        type = type ? " (" + type + ")" : "";
        return "<div><b>" + actionLabel + ": </b>" + path + type
            + "<br/><b>Completed: </b>" + index
            + "<br/><b>Remaining: </b>" + (total - index)
            + "</div>";
    };

    // executes a function asynchronously and supports a progress update function
    function async_executeTask(taskFn, progressFn) {
        return new Promise(function (resolve) {
            // update the progress dialog
            if (progressFn) {
                progressFn();
            }

            // run the task async to support the progress bars, using a timeout of 0
            setTimeout(function() {
                // execute the task
                taskFn();
                // resolve the promises
                resolve();
            }, 0);
        });
    };

    // generate the diagrams from the given JSON data
    function generateTemplateDiagrams(jsonTemplates) {
        // get the project to generate our UML things in
        var project = Repository_get().select("@Project")[0];

        // create the model to be the root for all generated things
        var rootModelOptions = {
            modelInitializer: function (modelEle) {
                modelEle.name = "Sitecore Templates Data Model";
            }
        };
        var rootModel = Factory.createModel(
            "UMLModel",
            project,
            "ownedElements",
            rootModelOptions);

        // create the template folders (package) diagram
        var folderDiagramOptions = {
            diagramInitializer: function (diagram) {
                diagram.name = "Template Folders Diagram";
            }
        };
        var templateFoldersDiagram =
            Factory.createDiagram("UMLPackageDiagram", rootModel, folderDiagramOptions);

        // create the templates (class) diagram, and make it the default diagram
        var templateDiagramOptions = {
            diagramInitializer: function (diagram) {
                diagram.name = "Templates Diagram";
                diagram.defaultDiagram = true;
            }
        };
        var templatesDiagram =
            Factory.createDiagram("UMLClassDiagram", rootModel, templateDiagramOptions);
            
        // parses the JSON templates into an array
        var jsonTemplatesArray = JSON.parse(jsonTemplates);
        // total number fo templates for the progress dialogs
        var totalTemplates = jsonTemplatesArray.length;               

        console.log("Importing " + totalTemplates + " Sitecore templates into StarUML");
        
        // map to hold the info for each of the packages (template folders)
        //   Structure by example:
        //     Path: 
        //       /Feature/Pages/BasePage
        //
        //     -->
        //
        //     Resulting Entries:
        //       "/Feature": { Name: "Feature", ParentKey: undefined, ReferenceId: "<StarUML ID>" } 
        //       "Feature/Pages": { Name: "Pages", ParentKey: "/Feature", ReferenceId: "<StarUML ID>"  }   
        var packagesMap = [];    
        // the keys for the package map
        var packagesMapKeys = [];           

        // array to hold all of the template folder eleemnts that have been added
        var addedPackageElements = {}; // packagesMapKey is the key, value is the element        
        
        // getter with backing field for the total number of packages, so that the actual value can be read while running tasks
        var _totalPackages = undefined;
        var totalPackages_get = function() { return _totalPackages || (_totalPackages = packagesMapKeys.length); }; // to be used for the progress dialogs
        
        // holds all of the added template elements
        var addedInterfaceElements = [];        
        
        // populates the folder (package) map based on the template's path data, such that it lists each
        //   package (folder) once and excludes the template name
        function populatePackagesMapFromTemplate(jsonTemplate) {
            // get the path parts            
            // e.g. "/Feature/Pages/BasePage"
            //      -->
            //      [ "", "Feature", "Pages", "BasePage" ]
            var templatePathParts = jsonTemplate.Path.split("/");

            var previousPathPartKey;
            // loop through the template path parts, skipping the last one (template name)
            for (var i = 0; i < templatePathParts.length - 1; i++) {
                var pathPart = templatePathParts[i];

                // skip empty entries
                if (pathPart == "") {
                    continue;
                }

                // create the package entry key
                var pathPartKey = (previousPathPartKey || "") + "/" + pathPart;

                // localize the prevPathPartKey and update the outer one for the next iteration
                var prevPathPartKey = previousPathPartKey;
                previousPathPartKey = pathPartKey;

                // if the key already exists then skip this part
                if (packagesMap[pathPartKey]) {
                    continue;
                }

                // add the new package (ReferenceId will be supplied later)
                packagesMap[pathPartKey] = {
                    Name: pathPart,
                    ParentKey: prevPathPartKey
                };
            }
        };

        // gets the task for populating the packages map from the given template
        var getPopulatePackagesMapFromTemplateTask = function(jsonTemplate, templateIndex) {
            return function() {
                return async_executeTask(
                    function() { populatePackagesMapFromTemplate(jsonTemplate); },
                    function() {    
                        ProgressDialog.showOrUpdateDialogWithProgressBar(
                            progressDialogClassId, 
                            progressDialogTitle + " - Step 2 of 7", 
                            getImportProgressMessage("Processing Paths", jsonTemplate.Path, templateIndex, totalTemplates), 
                            { currentStep: templateIndex, totalSteps: totalTemplates});
                    }
                );
            };
        };
      
        // task to populate the packageMapKeys array
        var buildPackagesMapKeysTask = function() {
            return async_executeTask(
                function() { 
                    packagesMapKeys = Object.keys(packagesMap).sort(function (a, b) {
                        var levelA = StringUtils.occurrences(a, "/");
                        var levelB = StringUtils.occurrences(b, "/");

                        return levelA > levelB
                            ? 1 // a is deeper level than b
                            : levelA == levelB
                                ? 0 // a and b are at the same level
                                : -1; // b is a deeper level than a
                    });
                }
            );
        };
       
        // creates the package and adds it to the diagram
        function createPackage(entry, packageMapKey) {
            // set up the options for the package to be created
            var packageOptions = {
                modelInitializer: function (modelEle) {
                    modelEle.name = entry.Name;
                },
                viewInitializer: function (viewEle) {
                    viewEle.name = entry.Name;
                }
            };

            // get the parent from the addedPackageElements
            var parentElement;
            var parentModel
            var hasParent = entry.ParentKey;
            if (hasParent) {
                parentElement = addedPackageElements[entry.ParentKey];
                parentModel = parentElement.model;
            } else {
                // use the root model, since no parent
                parentModel = rootModel;
            }

            // add the package
            var addedPackage = Factory.createModelAndView(
                "UMLPackage",
                parentModel,
                templateFoldersDiagram,
                packageOptions);

            // add the package to the list of added packages          
            addedPackageElements[packageMapKey] = addedPackage;

            // add the visual containment for the parent-child relationship
            if (hasParent) {
                // build the relationship options
                var relationshipOptions = {
                    headModel: parentModel,
                    tailModel: addedPackage.model,
                    tailView: addedPackage,
                    headView: parentElement
                };

                // add the view for the relationship
                Factory.createModelAndView(
                    "UMLContainment",
                    rootModel,
                    templateFoldersDiagram,
                    relationshipOptions);
            }
        };
        
        // creates the task for creating the package for the given packageMapKey
        var getCreatePackageTask = function(packageMapKey, entryIndex) {
            // get the entry from the packages map
            var entry = packagesMap[packageMapKey];

            // return the task
            return function() {
                return async_executeTask(
                    function() { createPackage(entry, packageMapKey); },
                    function() {                        
                        // update the progress dialog      
                        ProgressDialog.showOrUpdateDialogWithProgressBar(
                            progressDialogClassId, 
                            progressDialogTitle + " - Step 3 of 7", 
                            getImportProgressMessage("Importing", (entry.ParentKey + entry.Name), entryIndex, totalPackages_get(), "Folder"), 
                            { currentStep: entryIndex, totalSteps: totalPackages_get() });
                    }
                );
            };
        };
        
        // task for reformatting the template folders diagram to be legible
        var reformatTemplateFoldersDiagramTask = function() {
            return async_executeTask(
                function() { DiagramUtils.reformatDiagramLayout(templateFoldersDiagram); },
                function() { 
                    // update the progress dialog      
                    ProgressDialog.showOrUpdateDialog(
                        progressDialogClassId, 
                        progressDialogTitle  + " - Step 4 of 7", 
                        "<div>Template folders imported.</div><div>Template Folders Diagram generation complete.</div><div>Reformatting diagram layout...</div>");
                }
            );
        };

        // creates the template and adds it to the diagram
        function createTemplate(jsonTemplate) {
            // options for the template model and view
            var interfaceOptions = {
                modelInitializer: function (ele) {
                    ele.name = jsonTemplate.Name;
                },
                viewInitializer: function (ele) {
                    ele.suppressAttributes = false;
                }
            };

            // get the parent key from the path
            var parentKey = jsonTemplate.Path.substring(0, jsonTemplate.Path.lastIndexOf("/"));

            // get the parent model 
            var parentModel = parentKey
                ? addedPackageElements[parentKey].model  // get the parent from the added package elements
                : rootModel; // if no parent, use the root model as the parent

            // add the template model and view
            var addedInterfaceElement = Factory.createModelAndView(
                "UMLInterface",
                parentModel,
                templatesDiagram,
                interfaceOptions);

            // add the newly added element to the collection
            addedInterfaceElements[jsonTemplate.Path] = addedInterfaceElement;

            // sort the fields by their SortOrder
            var jsonFields = jsonTemplate.Fields.sort(function (a, b) {
                return a.SortOrder > b.SortOrder
                    ? 1 // a has a higher sort order than b
                    : a.SortOrder == b.SortOrder
                        ? 0 // a and b have the same sort order
                        : -1; // a has a lower sort order than b
            });

            // add the fields to the interface
            jsonFields.forEach(function (jsonField) {
                var documentation = "{\n" 
                    + "  Title: " + getExtendedFieldInfoPropertyValue(jsonField.Title, null) + ",\n"
                    + "  Source: " + getExtendedFieldInfoPropertyValue(jsonField.Source, null) + ",\n"
                    + "  Shared: " + getExtendedFieldInfoPropertyValue(jsonField.Shared, false) + ",\n"
                    + "  Unversioned: " + getExtendedFieldInfoPropertyValue(jsonField.Unversioned, false) + ",\n"
                    + "  SectionName: " + getExtendedFieldInfoPropertyValue(jsonField.SectionName, null) + ",\n"
                    + "  StandardValue: " + getExtendedFieldInfoPropertyValue(jsonField.StandardValue, null) + "\n}";

                // options for the template field to be added
                var attributeModelOptions = {
                    modelInitializer: function (ele) {
                        ele.name = jsonField.Name;
                        ele.visibility = "public"; // all fields are visible in Sitecore to admin so they are public here
                        ele.type = jsonField.FieldType;
                        ele.documentation = documentation;
                    }
                };

                // add the template field to the template's model
                Factory.createModel(
                    "UMLAttribute",
                    addedInterfaceElement.model,
                    "attributes",
                    attributeModelOptions);
            });
        };   
        
        // creates a task for creating the interface for the given template and adding it to the diagram
        var getCreateTemplateTask = function(jsonTemplate, templateIndex) {
            return function() {
                return async_executeTask(
                    function() { createTemplate(jsonTemplate) },
                    function() {
                        // update the progress dialog      
                        ProgressDialog.showOrUpdateDialogWithProgressBar(
                            progressDialogClassId, 
                            progressDialogTitle  + " - Step 5 of 7", 
                            getImportProgressMessage("Importing", jsonTemplate.Path, templateIndex, totalTemplates, "Template"), 
                            { currentStep: templateIndex, totalSteps: totalTemplates });
                    }
                );
            };
        };

        // generate the inheritance relationships for the template
        function createInheritanceRelationshipsForTemplate(jsonTemplate) {
            // if the template has no base templates then nothing more to do
            if (jsonTemplate.BaseTemplates && jsonTemplate.BaseTemplates.length) {
                jsonTemplate.BaseTemplates.forEach(function (baseTemplatePath) {
                    var templateView = addedInterfaceElements[jsonTemplate.Path];
                    var baseTemplateView = addedInterfaceElements[baseTemplatePath];

                    // set up the options
                    var relationshipOptions = {
                        headView: baseTemplateView,
                        headModel: baseTemplateView.model,
                        tailView: templateView,
                        tailModel: templateView.model
                    };

                    // add the inheritance relationship
                    Factory.createModelAndView(
                        "UMLGeneralization",
                        baseTemplateView.model,
                        templatesDiagram,
                        relationshipOptions
                    );
                });
            }
        }; 
        
        // creates a task for creating inheritance relationships for the given template
        var getCreateInheritanceRelationshipsForTemplateTask = function(jsonTemplate, templateIndex) {
            return function() {
                return async_executeTask(
                    function() { createInheritanceRelationshipsForTemplate(jsonTemplate); },
                    function() {
                        // update the progress dialog      
                        ProgressDialog.showOrUpdateDialogWithProgressBar(
                            progressDialogClassId, 
                            progressDialogTitle + " - Step 6 of 7", 
                            getImportProgressMessage("Setting Base Templates", jsonTemplate.Path, templateIndex, totalTemplates), 
                            { currentStep: templateIndex, totalSteps: totalTemplates });
                    }
                );
            };
        };

        // task for collapsing all of the templates and template folders in the model explorer
        var performFinalCleanupOperationsTask = function() {
            return async_executeTask(
                function() {       
                    // reformat the templates diagram to be legible
                    DiagramUtils.reformatDiagramLayout(templatesDiagram);

                    // setting to a local variable for a negligable performance increase
                    var ModelExplorerView = ModelExplorerView_get();

                    // rebuild the model explorer
                    ModelExplorerView.rebuild();

                    // expand the project and root model nodes
                    ModelExplorerView.expand(project);
                    ModelExplorerView.expand(rootModel);
                },
                function() {
                    // update the progress dialog 
                    ProgressDialog.showOrUpdateDialog(
                        progressDialogClassId, 
                        progressDialogTitle + " - Step 7 of 7", 
                        "<div>Templates imported.</div><div>Templates Diagram generation complete.</div><div>Collapsing templates and folders in Model Explorer...</div>");        
                }
            );
        };        
        
        // task to update the progress dialog to reflect completion
        var doCompleteTask = function() {
            return async_executeTask(
                function() {        
                    var finishButtonClass = "btn-import-finish";            
                    var finishDialog = ProgressDialog.showOrUpdateDialog(
                        progressDialogClassId, 
                        "Import Completed Successfully", 
                        "<p>Sitecore templates and template folders have been imported successfully. Diagram generation and reformatting complete.</p>\
                        <p><b>IMPORTANT:</b> Depending on the size of the imported architecture, it may take a few minutes for the Model Explorer to complete its background tasks. It is \
                        common to experience some sluggishness or scrolling issues during this time. If this occurs, give the Model Explorer a few minutes and proper \
                        functionality will be automatically restored.</p>\
                        <p>Click \"Finish\" to close this dialog.</p>",
                        [
                            { 
                                id: Dialogs.DIALOG_BTN_CANCEL, 
                                text: "Finish",
                                className: finishButtonClass
                            }
                        ]
                    );
                    
                    // add the click handler for closing the window
                    finishDialog.getElement().on("click.finishimport", "." + finishButtonClass, function() {
                        finishDialog.close();
                    });
                }
            );
        };        
        
        // gets the task for actually generating the models, adding them to the diagram, performing cleanup, etc.
        var generationAndCompletionTask = function() {            
            return async_executeTask(
                function() {
                    // create the packages and add them to the diagram
                    packagesMapKeys.forEach(function (packageMapKey, entryIndex) {    
                        tasks = tasks.then(getCreatePackageTask(packageMapKey, entryIndex));
                    });
                    // reformat the template folders diagram
                    tasks = tasks.then(reformatTemplateFoldersDiagramTask);            
                    // create the interfaces and add them to the diagram
                    jsonTemplatesArray.forEach(function(jsonTemplate, templateIndex) {
                        tasks = tasks.then(createTemplateTask(jsonTemplate, templateIndex));
                    });            
                    // create the inheritance relationships for the interfaces
                    jsonTemplatesArray.forEach(function (jsonTemplate, templateIndex) {
                        tasks = tasks.then(getCreateInheritanceRelationshipsForTemplateTask(jsonTemplate, templateIndex));
                    });
                    tasks = tasks
                        // perform final 
                        .then(performFinalCleanupOperationsTask)
                        // show the completion dialog
                        .then(doCompleteTask);
                }
            );
        };
        
        
        // start the promise chain for the tasks
        var tasks = Promise.resolve();   

        // populate the packages map from the templates
        jsonTemplatesArray.forEach(function(jsonTemplate, templateIndex){
            tasks = tasks.then(getPopulatePackagesMapFromTemplateTask(jsonTemplate, templateIndex));
        });

        tasks = tasks
            // build the packages map's keys
            .then(buildPackagesMapKeysTask)
            // generate and complete the process - note that because packagesMapKeys is populated in an earlier task and the result is 
            //   used to generate and add more tasks in this function, it is required that all subsequent tasks follow it in the chain.
            //   Alternatively, I could have assigned the subsequent tasks to a different chain and then added that chain to the "tasks"
            //   chain but that seemed harder to follow along with
            .then(function() {            
                return async_executeTask(
                    function() {
                        // create the packages and add them to the diagram
                        packagesMapKeys.forEach(function (packageMapKey, entryIndex) {    
                            tasks = tasks.then(getCreatePackageTask(packageMapKey, entryIndex));
                        });
                        // reformat the template folders diagram
                        tasks = tasks.then(reformatTemplateFoldersDiagramTask);            
                        // create the interfaces and add them to the diagram
                        jsonTemplatesArray.forEach(function(jsonTemplate, templateIndex) {
                            tasks = tasks.then(getCreateTemplateTask(jsonTemplate, templateIndex));
                        });            
                        // create the inheritance relationships for the interfaces
                        jsonTemplatesArray.forEach(function (jsonTemplate, templateIndex) {
                            tasks = tasks.then(getCreateInheritanceRelationshipsForTemplateTask(jsonTemplate, templateIndex));
                        });
                        tasks = tasks
                            // perform final 
                            .then(performFinalCleanupOperationsTask)
                            // show the completion dialog
                            .then(doCompleteTask);
                    }
                );
            });
    };

    // generates the template diagrams and models from specified JSON file
    function generateTemplateDiagramsFromFile() {

        function generateDiagramsForFilePath(filePath) {
            var file = FileSystem.getFileForPath(filePath);
            FileUtils.readAsText(file)
                .done(function (data) {
                    console.log("JSON data read successfully from file path " + filePath);
                    // generate the template diagrams
                    generateTemplateDiagrams(data); 
                })
                .fail(function (err) {
                    console.error(err);
                    Dialogs.showErrorDialog("Uh oh! An error occurred while attempting to read the input file, " + filePath);
                });
        };

        // prompt user to select an input file      
        FileSystem.showOpenDialog(false, false, "Select Serialized Sitecore Templates", null, ["json"], function (err, files) {
            if (!err) {
                if (files.length == 1) {
                    var filePath = files[0];
                    generateDiagramsForFilePath(filePath);
                } else { // user cancelled
                    return; // nothing more to do
                }
            } else {
                console.error(err);
                Dialogs.showErrorDialog("Uh oh! An error occurred while attempting to prompt user for/read user input. See the DevTools console for more details");
            }
        });
    };

    // command ID constant
    var CMD_GENERATETEMPLATEDIAGRAMSFROMFILE = "sitecore.generatetemplatediagramsfromfile";

    exports.initialize = function () {
        // eager-load the requisite modules
        var CommandManager = app.getModule("command/CommandManager");

        // register the command
        CommandManager.register("Import Template Diagrams from Serialized JSON", CMD_GENERATETEMPLATEDIAGRAMSFROMFILE, generateTemplateDiagramsFromFile);
        // add the menu item
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_GENERATETEMPLATEDIAGRAMSFROMFILE, ["Ctrl-Shift-D"]);
    };
    exports.generateTemplateDiagramsFromFile = generateTemplateDiagramsFromFile;
    exports.generateTemplateDiagrams = generateTemplateDiagrams;
    exports.CMD_GENERATETEMPLATEDIAGRAMSFROMFILE = CMD_GENERATETEMPLATEDIAGRAMSFROMFILE;
});