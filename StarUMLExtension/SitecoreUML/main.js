define(function (require, exports, module) {
    "use strict";
    
    // TODO: Move this to its own module
    /** Function that count occurrences of a substring in a string;
     * @param {String} string               The string
     * @param {String} subString            The sub string to search for
     * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
     *
     * @author Vitim.us https://gist.github.com/victornpb/7736865
     * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
     * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
     */
    function occurrences(string, subString, allowOverlapping) {        
        string += "";
        subString += "";
        if (subString.length <= 0) return (string.length + 1);
    
        var n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;
    
        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else break;
        }
        return n;
    }

    var Commands = app.getModule("command/Commands");
    var CommandManager = app.getModule("command/CommandManager");
    var MenuManager = app.getModule("menu/MenuManager");
    var Repository, 
        FileSystem, 
        FileUtils,
        Factory,
        DiagramManager,
        Dialogs;

    // TODO: move the dialogs encapsulation to a separate module
    function showErrorDialog(message) {
        Dialogs = Dialogs || app.getModule("dialogs/Dialogs");

        Dialogs.showErrorDialog(message);
    }
    function showAlertDialog(message) {
        Dialogs = Dialogs || app.getModule("dialogs/Dialogs");

        Dialogs.showAlertDialog(message);
    }
    function showInfoDialog(message) {
        Dialogs = Dialogs || app.getModule("dialogs/Dialogs");

        Dialogs.showInfoDialog(message);
    }


        
    
    // TODO: move to separate module
     // reformat the layout so that elements are all visible (to the extent possible)
    function reformatDiagramLayout(diagram) { 
        DiagramManager = DiagramManager || app.getModule("diagrams/DiagramManager");
        
        // hold onto the current diagram so we can switch back to it when finished
        var currentDiagram = DiagramManager.getCurrentDiagram();

        // if not on the specified diagram
        if (currentDiagram._id != diagram._id) {
            // switch to the specified diagram 
            DiagramManager.setCurrentDiagram(diagram);            
            // do the reformatting
            CommandManager.execute("format.layout.auto");
            // switch back to the original diagram
            DiagramManager.setCurrentDiagram(currentDiagram);
        } else { // already on the requested diagram, no need to switch         
            // do the reformatting
            CommandManager.execute("format.layout.auto");
        }
    }
    
    // register the "Sitecore" menu command
    var CMD_SITECOREMENU = "sitecore"
    CommandManager.register(
        "Sitecore",
        CMD_SITECOREMENU,
        CommandManager.doNothing);
        
    // add the "Sitecore" menu
    var sitecoreMenu = MenuManager.addMenu(
        CMD_SITECOREMENU,
        MenuManager.BEFORE,
        Commands.HELP);

    // execute "Generate Serialized Templates"
    function handleGenerateSerializedTemplates() {
        if (!Repository) {
            Repository = app.getModule("core/Repository");
        }

        var SitecoreTemplateField = function(
                name, 
                fieldType, 
                sortOrder,
                title,
                source) {
            this.Name = name;
            this.FieldType = fieldType;
            this.SortOrder = sortOrder;
            this.Title = title;
            this.Source = source;
        };
        
        var SitecoreTemplate = function(
                referenceId,
                name,
                fields,
                path,
                baseTemplates) {
            this.ReferenceId = referenceId;
            this.Name = name;
            this.Fields = fields;
            this.Path = path;
            this.BaseTemplates = baseTemplates;
        };

        // get the folders
        var umlPackages = Repository.select("@UMLPackage");
        var sitecorePathMap = [];

        // recursively adds the folder and its ancestors to the path map
        var recursivelyBuildFolderPathMap = function (umlPackage) {
            var folderPath = sitecorePathMap[umlPackage._id];
            // if the folder path was already set then nothing more to do
            if (folderPath) {
                return folderPath;
            } 
            
            // if there is no parent folder then make the folder path, store and return it
            if (!umlPackage._parent || umlPackage._parent.constructor.name != "UMLPackage") {
                // folder path should just be the current folder
                folderPath = "/" + umlPackage.name;
                // store the folder path
                sitecorePathMap[umlPackage._id] = folderPath;
                return folderPath;
            } else {
                // ensure the path was added for the parent
                recursivelyBuildFolderPathMap(umlPackage._parent);
                // add the path for the current folder to its parent's folder path
                sitecorePathMap[umlPackage._id] = 
                    sitecorePathMap[umlPackage._parent._id] + "/" + umlPackage.name;
            }
        };

        // populate the path map with the folder paths
        umlPackages.forEach(recursivelyBuildFolderPathMap);

        // get the templates
        var umlInterfaces = Repository.select("@UMLInterface");

        var inheritanceMap = [];
        // get an array of sitecore templates
        var sitecoreTemplates = umlInterfaces.map(function(umlInterface, index) {            
            var fields = umlInterface.attributes.map(function(attribute, index) {      
                // TODO: add title and source support
                return new SitecoreTemplateField(
                    attribute.name,
                    attribute.type,
                    index); 
            });

            // add inheriting templates to inheritance map
            umlInterface.ownedElements.forEach(function(ele) {
                if (inheritanceMap[ele.source._id]) {
                    inheritanceMap[ele.source._id].push(ele.target._id);
                } else {
                    inheritanceMap[ele.source._id] = [ ele.target._id ];
                }
            });

            // build the path to the template
            var parentPath = umlInterface._parent 
                ? (sitecorePathMap[umlInterface._parent._id] || "")
                : "";
            var templatePath = parentPath + "/" + umlInterface.name;
            sitecorePathMap[umlInterface._id] = templatePath;
            
            return new SitecoreTemplate(
                umlInterface._id,
                umlInterface.name, 
                fields,
                templatePath);
        });

        // add each template's base templates
        sitecoreTemplates = sitecoreTemplates.map(function(sitecoreTemplate) {
            var baseTemplateReferences = inheritanceMap[sitecoreTemplate.ReferenceId];
            if (baseTemplateReferences) {
                var baseTemplates = baseTemplateReferences.map(function(referenceId) {
                    return sitecorePathMap[referenceId];
                });
                sitecoreTemplate.BaseTemplates = baseTemplates;
            }

            return sitecoreTemplate;
        });

        // write the sitecore templates to the console for debugging purposes
        console.log(sitecoreTemplates);

        // serialize template data as JSON and save to output directory
        FileSystem = FileSystem ? FileSystem : app.getModule("filesystem/FileSystem");
        FileUtils  = FileUtils ? FileUtils : app.getModule("file/FileUtils");

        // var directoryPath = "C:/Temp/UMLToSitecorePOC/";
        // var directory = FileSystem.getDirectoryForPath(directoryPath);
        // directory.create();
        // var file = FileSystem.getFileForPath(directoryPath + Date.now().toString() + ".json");

        function serializeAndSaveSitecoreTemplates(filePath) {
            var file = FileSystem.getFileForPath(filePath);
            var json = JSON.stringify(sitecoreTemplates);

            // write the json to the file
            FileUtils.writeText(file, json, true)
                .done(function () {
                    showInfoDialog("File saved successfully!")
                })
                .fail(function (err) {
                    console.error(err);
                    showErrorDialog("Uh oh! An error occurred while saving. See the DevTools console for details.");
                    return;
                });  
        }

        FileSystem.showSaveDialog("Save serialized Sitecore templates as...", null, "Untitled.json", function (err, filename) {
            if (!err) {
                if (filename) {
                    // save the file
                    serializeAndSaveSitecoreTemplates(filename);
                } else { // User canceled
                    return; 
                }
            } else {
                console.error(err);
                showErrorDialog("Uh oh! An error occurred while saving the serialized Sitecore templates. See the DevTools console for more information");
            }
        });  
    }

    // register the "Generate Serialized Templates" command
    var CMD_GENERATESERIALIZEDTEMPLATES = "sitecore.generateserializedtemplates";
    CommandManager.register(
        "Export Diagrams to Sitecore",
        CMD_GENERATESERIALIZEDTEMPLATES,
        handleGenerateSerializedTemplates);

    // add the "Generate Serialized Templates" menu item
    sitecoreMenu.addMenuItem(
        CMD_GENERATESERIALIZEDTEMPLATES, 
        ["Ctrl-Shift-B"]);

    // execute the "Generate Template Diagrams" command
    function handleGenerateTemplateDiagrams() {
        // initialize the FileSystem and FileUtils modules, if they're not already initialized
        FileSystem = FileSystem ? FileSystem : app.getModule("filesystem/FileSystem");
        FileUtils  = FileUtils ? FileUtils : app.getModule("file/FileUtils");

        // generate the diagrams from the given JSON data
        function generateDiagrams(jsonTemplates) {
            // initialize the Factory and Repository modules, if not yet initialized
            Factory = Factory ? Factory : app.getModule("engine/Factory");
            Repository = Repository ? Repository : app.getModule("core/Repository");

            // get the project to generate our UML things in
            var project = Repository.select("@Project")[0];

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
                diagramInitializer: function(diagram) { 
                    diagram.name = "Template Folders Diagram";
                }
            };
            var templateFoldersDiagram = 
                Factory.createDiagram("UMLPackageDiagram", rootModel, folderDiagramOptions);

            // create the templates (class) diagram, and make it the default diagram
            var templateDiagramOptions = { 
                diagramInitializer: function(diagram) { 
                    diagram.name = "Templates Diagram";
                    diagram.defaultDiagram = true;
                }
            };
            var templatesDiagram = 
                Factory.createDiagram("UMLClassDiagram", rootModel, templateDiagramOptions);

            // loop through the JSON templates and build out the folder (package) map
            //   Build packages map such that it lists each package (folder) once and excludes the template name
            // 
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
            var jsonTemplatesArray = JSON.parse(jsonTemplates);
            jsonTemplatesArray.forEach(function (jsonTemplate) { 
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
            });

            // sort the package map keys by level
            //   Inherently, creating in sorted order means that parents will be created before
            //   children, as each level of packages will be built out breadth-first
            var packagesMapKeys = Object.keys(packagesMap).sort(function(a, b) {
                var levelA = occurrences(a, "/");
                var levelB = occurrences(b, "/");

                return levelA > levelB 
                    ? 1 // a is deeper level than b
                    : levelA == levelB
                        ? 0 // a and b are at the same level
                        : -1; // b is a deeper level than a
            });

            // create package elements
            var addedPackageElements = []; // packagesMapKey is the key, value is the element
            packagesMapKeys.forEach(function(packageMapKey) {
                var entry = packagesMap[packageMapKey];

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
            });

            // reformat the template folders diagram to be legible
            reformatDiagramLayout(templateFoldersDiagram);

            // create template elements
            var addedInterfaceElements = [];
            jsonTemplatesArray.forEach(function(jsonTemplate) {
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
                var jsonFields = jsonTemplate.Fields.sort(function(a, b) {
                    return a.SortOrder > b.SortOrder
                        ? 1 // a has a higher sort order than b
                        : a.SortOrder == b.SortOrder
                            ? 0 // a and b have the same sort order
                            : -1; // a has a lower sort order than b
                });

                // add the fields to the interface
                jsonFields.forEach(function(jsonField) {
                    // options for the template field to be added
                    var attributeModelOptions = {
                        modelInitializer: function (ele) {
                            ele.name = jsonField.Name;
                            ele.visibility = "public"; // all fields are visible in Sitecore to admin so they are public here
                            ele.type = jsonField.FieldType;
                        }
                    };

                    // add the template field to the template's model
                    Factory.createModel(
                        "UMLAttribute",
                        addedInterfaceElement.model,
                        "attributes",
                        attributeModelOptions);
                });
            });

            // generate the template inheritance relationships
            jsonTemplatesArray.forEach(function(jsonTemplate) { 
                // if the template has no base templates then nothing more to do
                if (jsonTemplate.BaseTemplates && jsonTemplate.BaseTemplates.length) {
                    jsonTemplate.BaseTemplates.forEach(function(baseTemplatePath) {
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
            });

            // reformat the templates diagram to be legible
            reformatDiagramLayout(templatesDiagram);
        };
        
        function generateDiagramsForFilePath(filePath) {
            var file = FileSystem.getFileForPath(filePath);
            FileUtils.readAsText(file)
                .done(function (data) {
                    console.log("JSON data read successfully from file path " + filePath);
                    generateDiagrams(data);
                })
                .fail(function (err) {
                    console.error(err);
                    showErrorDialog("Uh oh! An error occurred while attempting to read the input file, " + filePath);
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
                showErrorDialog("Uh oh! An error occurred while attempting to prompt user for/read user input. See the DevTools console for more details");
            }
        });
    };

    // register the "Generate Template Diagrams" command
    var CMD_GENERATETEMPLATEDIAGRAMS = "sitecore.generatetemplatediagrams";
    CommandManager.register(
        "Import Diagrams from Sitecore",
        CMD_GENERATETEMPLATEDIAGRAMS,
        handleGenerateTemplateDiagrams);
    
    // add the "Generate Template Diagrams" menu item
    sitecoreMenu.addMenuItem(
        CMD_GENERATETEMPLATEDIAGRAMS,
        ["Ctrl-Shift-D"]);
});