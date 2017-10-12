define(function(require, exports, module) {
    "use strict";

    // backing fields for lazy-loaded variables - do NOT use these values except from the lazy loaded variable assignments
    var _backingFields = {
        _commandManager: undefined,
        _diagramManager: undefined
    };
    
    // lazy-loaded modules
    var CommandManager = _backingFields._commandManager || (_backingFields._commandManager = app.getModule("command/CommandManager"));
    var DiagramManager = _backingFields._diagramManager || (_backingFields._diagramManager = app.getModule("diagrams/DiagramManager"));

    // reformat the layout so that elements are all visible (to the extent possible)
    function reformatDiagramLayout(diagram) {         
        // hold onto the current diagram so we can switch back to it when finished
        var currentDiagram = DiagramManager.getCurrentDiagram();

        var reformatPromise;
        // if not on the specified diagram
        if (currentDiagram._id != diagram._id) {
            // switch to the specified diagram 
            DiagramManager.setCurrentDiagram(diagram);            
            // do the reformatting
            reformatPromise = CommandManager.execute("format.layout.auto");
            // switch back to the original diagram
            DiagramManager.setCurrentDiagram(currentDiagram);
        } else { // already on the requested diagram, no need to switch         
            // do the reformatting
            reformatPromise = CommandManager.execute("format.layout.auto");
        }

        return reformatPromise;
    };

    exports.reformatDiagramLayout = reformatDiagramLayout;
});