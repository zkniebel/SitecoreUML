
define(function (require, exports, module) {
    "use strict";

    var Core = app.getModule("core/Core");
    var AppInit = app.getModule("utils/AppInit");
    var EditorView = app.getModule("editors/EditorView");
    var Repository = app.getModule("core/Repository");
    var ProjectManager = app.getModule("engine/ProjectManager");
    var SelectionManager = app.getModule("engine/SelectionManager");
    var Engine = app.getModule("engine/Engine");

    var viewTemplate = require("text!htmlContent/Sitecore-Field-Editor-View.html");

    var $view = null;
    var _attributeElement = null;

    var input_title_id = "#sitecoreField_Title";
    var input_source_id = "#sitecoreField_Source";
    var input_shared_id = "#sitecoreField_Shared";
    var input_unversioned_id = "#sitecoreField_Unversioned";
    var input_sectionName_id = "#sitecoreField_SectionName";
    var input_standardValue_id = "#sitecoreField_StandardValue";
    var input_autoDocument_id = "#sitecoreField_Documentation";

    var fieldAttributes = [ 
        { name: "Title", kind: "string", default: null },
        { name: "SectionName", kind: "string", default: null },
        { name: "Source", kind: "string", default: null },
        { name: "Shared", kind: "boolean", default: false },
        { name: "Unversioned", kind: "boolean", default: false },
        { name: "StandardValue", kind: "string", default: null }
    ];

    var defaultInputValues = {};
    // populate the default input values for the field attributes
    fieldAttributes.forEach(function(fieldAttr) {
        defaultInputValues[fieldAttr.name] = 
            fieldAttr.default === null 
                ? "" // so that 'null' doesn't display in the input
                : fieldAttr.default;
    });
    // add the default input value for the Documentation input
    defaultInputValues["Documentation"] = true;

    // sets the input to the value that already exists for the attribute of the field 
    function _setExistingValueForInput($input, attributeEle, name) {        
        var existing = undefined;
        for (var i = 0; i < attributeEle.ownedElements.length; i++) {
            var ownedEle = attributeEle.ownedElements[i];
            if (ownedEle.name == name) {
                existing = ownedEle;
                break;
            }
        }

        var value = existing !== undefined ? existing.value : defaultInputValues[name];

        // intentionally using attr here to avoid caching
        var kind = $input.attr("data-kind");
        if (kind == "string") {
            $input.val(value);
        } else if (kind == "boolean") {
            $input.prop("checked", value);
        }
    };

    function show(elem) {
        if (elem instanceof type.UMLAttribute) {
            $view.show();

            _attributeElement = elem;

            _setExistingValueForInput($(input_title_id), _attributeElement, "Title");
            _setExistingValueForInput($(input_sectionName_id), _attributeElement, "SectionName");
            _setExistingValueForInput($(input_source_id), _attributeElement, "Source");
            _setExistingValueForInput($(input_shared_id), _attributeElement, "Shared");
            _setExistingValueForInput($(input_unversioned_id), _attributeElement, "Unversioned");
            _setExistingValueForInput($(input_standardValue_id), _attributeElement, "StandardValue");
            _setExistingValueForInput($(input_autoDocument_id), _attributeElement, "Documentation");
        } else {
            $view.hide();
            _attributeElement = null;
        }
    };

    // bind events for updating editor
    function _initializeEventHandlers() {        
        $(Repository).on('updated', function (event, elems) {
            try {
                _.forEach(elems, function (elem) {
                    if (SelectionManager.getSelected() === elem) {
                        show(elem);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        });
        
        $(ProjectManager).on('projectClosed', function (event) {
            try {
                show(null);
            } catch (err) {
                console.error(err);
            }
        });

        $(SelectionManager).on('selectionChanged', function (event, models, views) {
            try {
                if (models.length === 1) {
                    show(models[0]);
                } else {
                    show(null);
                }
            } catch (err) {
                console.error(err);
            }
        });
    };

    function createAttributeDocumentation(attributeEle) {
        var fieldAttributeMap = {};        
        attributeEle.ownedElements.forEach(function(element) {
            if (element instanceof type.Tag) {
                fieldAttributeMap[element.name] = element.value;
            }
        });
        var docString = "";
        var numFieldAttributes = fieldAttributes.length;
        fieldAttributes.forEach(function(fieldAttribute, i) {
            var value = fieldAttributeMap[fieldAttribute.name];
            if (value === undefined || value === "") {
                value = fieldAttribute.default;
            }
            
            docString += "**" + fieldAttribute.name + ":** `" + JSON.stringify(value) + "`";
            if (numFieldAttributes > i + 1) {                
                docString += "  \n";  
            }              
        });

        return docString;
    };

    function updateAttributeDocumentation(attributeEle) {
        var docString = createAttributeDocumentation(attributeEle);
        Engine.setProperty(attributeEle, "documentation", docString);
    };

    function _handleViewChangeForInput($input, attributeEle, name) {
        try {  
            var existing = undefined;
            if (attributeEle) {
                for (var i = 0; i < attributeEle.ownedElements.length; i++) {
                    var ownedEle = attributeEle.ownedElements[i];
                    if (ownedEle.name == name) {
                        existing = ownedEle;
                        break;
                    }
                }
            }

            if (existing) {
                if (existing.kind == "string") {
                    var value = $input.val();
                    existing.value = value;
                } else if (existing.kind == "boolean") {
                    existing.value = $input.is(":checked");
                }
            } else { 
                var value = undefined;

                // intentionally using attr to avoid caching
                var kind = $input.attr("data-kind");
                if (kind == "string") {
                    value = $input.val();
                } else if (kind == "boolean") {
                    value = $input.is(":checked");
                }

                var tag = new Core.Tag();
                tag.name = name;
                tag.kind = kind;
                tag.value = value;

                // add the tag
                attributeEle.ownedElements.push(tag);
            }
              
            // auto-update the documentation, if checked
            var $input_autoDocument = $(input_autoDocument_id);
            if ($input_autoDocument.is(":checked")) {
                updateAttributeDocumentation(attributeEle);
            }
        } catch (err) {
            console.error(err);
        }
    };

    AppInit.htmlReady(function () {
        $view = $(viewTemplate);

        $view.on("change", ".sitecore-field-attribute", function() {
            var $this = $(this);
            // intentionally using attr to avoid caching
            var name = $this.attr("data-name");
            _handleViewChangeForInput($this, _attributeElement, name);
        });
        
        EditorView.setupEditorView($view);
        show();

        _initializeEventHandlers();
    });

    exports.show = show;
    exports.fieldAttributes = fieldAttributes;
    exports.updateAttributeDocumentation = updateAttributeDocumentation;
    exports.createAttributeDocumentation = createAttributeDocumentation;
});

