define(function (require, exports, module) {
    "use strict";

    // StarUML Module Dependencies
    var DiagramManager = app.getModule("diagrams/DiagramManager");
    var Factory = app.getModule("engine/Factory");
    var ModelExplorerView = app.getModule("explorer/ModelExplorerView");

    // SitecoreUML Module Dependencies
    var SitecoreHelix = require("SitecoreHelix");
    var SitecoreMenuLoader = require("SitecoreMenuLoader");
    var SitecorePreferencesLoader = require("SitecorePreferencesLoader");
    var DiagramUtils = require("DiagramUtils");
    var StringUtils = require("StringUtils");

    function _addPackageViewForLayer(helixLayer, diagram) {
        return Factory.createViewOf(
            "UMLPackage",
            helixLayer.RootPackageModel,
            diagram,
            {
                viewInitializer: function (viewEle) {
                    viewEle.name = helixLayer.RootPackageModel.name;
                }
            });
    };

    function _addPackageViewsForHelixLayers(helixArchitecture, diagram) {
        return {
            FoundationPackageView: _addPackageViewForLayer(helixArchitecture.FoundationLayer, diagram),
            FeaturePackageView: _addPackageViewForLayer(helixArchitecture.FeatureLayer, diagram),
            ProjectPackageView: _addPackageViewForLayer(helixArchitecture.ProjectLayer, diagram)
        };
    };
    
    // - each layer represented as a package
    // - dependencies documented with relationship 
    // - tails are layer packages
    function generateLayerDependenciesDiagram(rootModel, helixArchitecture) {
        var layerDependenciesDiagram =
            Factory.createDiagram(
                "UMLPackageDiagram", 
                rootModel, 
                {
                    diagramInitializer: function (diagram) {
                        diagram.name = "Helix Layer Dependencies Diagram";
                    }
                });

        // add the base helix packages
        var helixLayerViews = _addPackageViewsForHelixLayers(helixArchitecture, layerDependenciesDiagram);

        // NEW PLAN: 
        /**
         * Loop through each of the templates and add a "dependency info" object for each to the array      
         * Only one dependency will be drawn in each direction from one package to another and all of the relationships will be
         *   listed in the documetnation. E.g. Foo and Bar are Feature templates that both inherit the Foundation template Baz.
         *   One dependency will be diagrammed from the Feature layer to the Foundation layer. The documentation for the 
         *   dependency of the Feature layer on the Foundation layer will list "Foo->Baz, Bar->Baz"
         */

        // TODO: finish implementing
    };
    
    // - each module represented as a package within a layer package
    // - dependencies documented with relationship
    // - tails are module packages within layer package
    function generateModuleDependenciesDiagram(helixModule, helixArchitecture) {
        // TODO: implement
    };

    // - each template represented as an interface within a module package within a layer package
    // - dependencies documented with relationship
    // - tails are interfaces within module package with layer package
    function generateTemplateDependenciesDiagram(helixTemplate, helixArchitecture) {
        // TODO: implement
    }
    
    // - should run template generation with specific set of templates from layer
    // - resulting diagram should be generated below layer root model
    function generateTemplatesDiagramForLayer(helixTemplate, helixArchitecture) {
        // TODO: implement
    };
    
    // - should run template generation with specific set of templates from module
    // - resulting diagram should be generated below module root model
    function generateTemplatesDiagramForModule(helixModule, helixArchitecture) {
        // 1. Create the blank class diagram under the module's folder
        var templateDiagramOptions = {
            diagramInitializer: function (diagram) {
                diagram.name = helixModule.Name + " Module Templates";
            }
        };
        var templatesDiagram =
            Factory.createDiagram("UMLClassDiagram", helixModule.RootPackageModel, templateDiagramOptions);

        // 2. Get the editor and set its diagram to the newly created one
        var editor = DiagramManager.getEditor();
        editor.diagram = templatesDiagram;

        // 3. Get the module's layer and add a package to the class diagram for it
        var helixLayer = helixModule.getHelixLayer(helixArchitecture);        

        var layerView = _addViewToDiagram(helixLayer.RootPackageModel, templatesDiagram);

        // 4. Add a package to the class diagram for the module
        var moduleView = _addViewToDiagram(helixModule.RootPackageModel, templatesDiagram);

        // 5. Set the module package to be a sub-package (child) of the layer package
        _addRelationshipToDiagram("UMLContainment", layerView, moduleView, templatesDiagram);

        // 6. Get the HelixTemplate object for each of the paths from the PathsToHelixTemplatesMap array on the HelixArch object
        var moduleHelixTemplates = helixModule.TemplatePaths.map(function(path) {
            return helixArchitecture.PathsToHelixTemplatesMap[path];
        });

        // 7. Add from the existing models each of the templates with their existing relationships and dependencies to the diagram, and show module folder as parent of each 
        var layerIdsToDrawnViewsMap = {}
        layerIdsToDrawnViewsMap[helixLayer.LayerId] = layerView;
        var layerIdsToDrawnDependenciesMap = {};

        moduleHelixTemplates.forEach(function(helixTemplate) {
            // draw the template
            var templateView = _addViewWithRelationshipsToDiagram(helixTemplate.Model, editor);
            // show module folder as containing the template
            _addRelationshipToDiagram("UMLContainment", moduleView, templateView, templatesDiagram);
            
            // Loop through the dependencies and add them to the diagram
            helixTemplate.DirectDependencies
                // don't add dependencies on templates in the same module, as these are already shown as generalizations
                .filter(function(dependencyHelixTemplate) {
                    return helixModule.TemplatePaths.indexOf(dependencyHelixTemplate.JsonTemplate.Path) == -1;
                })            
                .forEach(function(dependencyHelixTemplate) {
                // get the layer of the dependency
                var dependencyLayer = dependencyHelixTemplate.getHelixLayer(helixArchitecture);
    
                // draw the layer, if not already drawn
                var dependencyLayerView = layerIdsToDrawnViewsMap[dependencyLayer.LayerId];
                if (dependencyLayerView === undefined) {
                    // add layer to the diagram
                    dependencyLayerView = _addViewToDiagram(dependencyLayer.RootPackageModel, templatesDiagram);
                    // add layer to the drawn layers map to avoid adding it multiple times
                    layerIdsToDrawnViewsMap[dependencyLayer.LayerId] = dependencyLayerView;
                }

                // create the documentation entry
                var templatePath = StringUtils.escapeForMarkdown(helixTemplate.JsonTemplate.Path);
                var dependencyPath = StringUtils.escapeForMarkdown(dependencyHelixTemplate.JsonTemplate.Path);
                var documentationEntry = "{" + templatePath + "} -> {" + dependencyPath + "}";

                var dependencyView = layerIdsToDrawnDependenciesMap[dependencyLayer.LayerId];
                if (dependencyView === undefined) {    
                    // add the dependency to the diagram
                    dependencyView = _addRelationshipToDiagram(
                        "UMLDependency", 
                        dependencyLayerView, 
                        moduleView, 
                        templatesDiagram)
                    
                    // document the dependency info
                    dependencyView.model.documentation = documentationEntry
                } else {
                    // append the dependency info to the existing documentaion
                    dependencyView.model.documentation += "\n" + documentationEntry;
                }          
                // set the name of the dependency (for display in generated docs)
                dependencyView.model.name = "Dependencies on the " + dependencyLayer.LayerId + " Layer";
                // hides the name from displaying on the actual diagram (redundant and makes the diagrams harder to read)
                dependencyView.nameLabel.font.size = 0; 
            });
        });

        // 8. Reformat the diagram and collapse the Model Explorer
        DiagramUtils.reformatDiagramLayout(templatesDiagram, SitecorePreferencesLoader.getSitecoreImportDefaultDiagramFormat());
        ModelExplorerView.rebuild();

        // 9. Annotate the dependencies as valid/invalid based on validation rules and update color formatting for better visualization
        
        // TODO: IMPLEMENT
    };

    // creates the view of the existing model without its relationships and adds it to the diagram
    function _addViewToDiagram(model, diagram) {
        var packageViewOptions = {
            viewInitializer: function (viewEle) {
                viewEle.name = model.name;
            }
        };

        // add the package
        var view = Factory.createViewOf(model, diagram, packageViewOptions);
        view.showNamespace = false;

        return view;
    };

     // creates the views from the existing model and its relationships, and adds them to the diagram of the given editor
     function _addViewWithRelationshipsToDiagram(model, editor) {
        // set up the options for the package to be created
        var view = Factory.createViewAndRelationships(editor, 0, 0, model);
        view.showNamespace = false;

        return view;
    };

    // add the visual parent-child relationship to the between things on the diagram
    function _addRelationshipToDiagram(relationshipType, headView, tailView, diagram) {
        // build the relationship options
        var relationshipOptions = {
            headModel: headView.model,
            headView: headView,
            tailModel: tailView.model,
            tailView: tailView
        };

        // add the view for the relationship
        return Factory.createModelAndView(
            relationshipType,
            tailView.model,
            diagram,
            relationshipOptions);
    };


    function testCreateHelixObject() {
        var SitecoreTemplatesJsonGenerator = require("SitecoreTemplatesJsonGenerator");
        console.log("Serializing architecture into JSON...");
        var jsonTemplates = SitecoreTemplatesJsonGenerator.generateJsonTemplates();
        console.log("Serialization complete. Creating Helix Architecture object...");
        var helixArchitecture = new SitecoreHelix.HelixArchitecture(jsonTemplates);
        console.log("Helix Architecture object created! See app.HelixArchitecture in the Dev Tools console for more.");

        app.HelixArchitecture = helixArchitecture;

        return helixArchitecture;
    };

    function testGenerateHelixModuleDiagrams() {
        var helixArchitecture = testCreateHelixObject();

        console.log("Starting Helix Module Diagram Generation...");
        helixArchitecture.HelixModules.forEach(function(helixModule) {
            generateTemplatesDiagramForModule(helixModule, helixArchitecture);
        });
        console.log("Completed Helix Module Diagram Generation!");
    };




    // command ID constant
    var CMD_TESTCREATEHELIXOBJECT = "sitecore.testcreatehelixobject";
    var CMD_TESTGENERATEHELIXMODULEDIAGRAMS = "sitecore.testgeneratehelixmodulediagrams";

    exports.initialize = function() {
        // eager-load the requisite modules
        var CommandManager = app.getModule("command/CommandManager");

        // register the command
        CommandManager.register("Test Create Helix Object", CMD_TESTCREATEHELIXOBJECT, testCreateHelixObject);
        // add the menu item
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_TESTCREATEHELIXOBJECT);
        app.testCreateHelixObject = testCreateHelixObject;    

        // register the command
        CommandManager.register("Test Generate Helix Module Diagrams", CMD_TESTGENERATEHELIXMODULEDIAGRAMS, testGenerateHelixModuleDiagrams);
        // add the menu item
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_TESTGENERATEHELIXMODULEDIAGRAMS);
        app.testGenerateHelixModuleDiagrams = testGenerateHelixModuleDiagrams;
    };

    exports.testCreateHelixObject = testCreateHelixObject;
    exports.testGenerateHelixModuleDiagrams = testGenerateHelixModuleDiagrams;

    exports.generateLayerDependenciesDiagram = generateLayerDependenciesDiagram;
    exports.generateModuleDependenciesDiagram = generateModuleDependenciesDiagram;
    exports.generateTemplateDependenciesDiagram = generateTemplateDependenciesDiagram;
    exports.generateTemplatesDiagramForLayer = generateTemplatesDiagramForLayer;
    exports.generateTemplatesDiagramForModule = generateTemplatesDiagramForModule;
});