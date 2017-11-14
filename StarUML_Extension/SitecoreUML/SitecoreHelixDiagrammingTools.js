define(function (require, exports, module) {
    "use strict";

    var SitecoreHelix = require("SitecoreHelix");

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
        // TODO: implement
    };

    exports.generateLayerDependenciesDiagram = generateLayerDependenciesDiagram;
    exports.generateModuleDependenciesDiagram = generateModuleDependenciesDiagram;
    exports.generateTemplateDependenciesDiagram = generateTemplateDependenciesDiagram;
    exports.generateTemplatesDiagramForLayer = generateTemplatesDiagramForLayer;
    exports.generateTemplatesDiagramForModule = generateTemplatesDiagramForModule;
});