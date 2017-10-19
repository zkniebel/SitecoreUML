
define(function (require, exports, module) {
    "use strict";

    var Core = app.getModule("core/Core");
    var AppInit = app.getModule("utils/AppInit");
    var EditorView = app.getModule("editors/EditorView");
    var Repository = app.getModule("core/Repository");
    var ProjectManager = app.getModule("engine/ProjectManager");
    var SelectionManager = app.getModule("engine/SelectionManager");

    var viewTemplate = require("text!htmlContent/Sitecore-Field-Editor-View.html");

    var $view = null;
    var _attributeElement = null;

    var input_title_id = "#sitecoreField_Title";
    var input_source_id = "#sitecoreField_Source";
    var input_shared_id = "#sitecoreField_Shared";
    var input_unversioned_id = "#sitecoreField_Unversioned";
    var input_sectionName_id = "#sitecoreField_SectionName";
    var input_standardValue_id = "#sitecoreField_StandardValue";

    function _setExistingValueForInput($input, attributeEle, name) {        
        var existing = undefined;
        for (var i = 0; i < attributeEle.ownedElements.length; i++) {
            var ownedEle = attributeEle.ownedElements[i];
            if (ownedEle.name == name) {
                existing = ownedEle;
                break;
            }
        }

        // intentionally using attr here to avoid caching
        var kind = $input.attr("data-kind");
        if (kind == "string") {
            var value = existing ? existing.value : "";
            $input.val(value);
        } else if (kind == "boolean") {
            var isChecked = existing !== undefined && existing.value;
            $input.prop("checked", isChecked);
        }
    };

    function show(elem) {
        if (elem instanceof type.UMLAttribute) {
            $view.show();

            _attributeElement = elem;

            _setExistingValueForInput($(input_title_id), _attributeElement, "Title");
            _setExistingValueForInput($(input_sectionName_id), _attributeElement, "Section Name");
            _setExistingValueForInput($(input_source_id), _attributeElement, "Source");
            _setExistingValueForInput($(input_shared_id), _attributeElement, "Shared");
            _setExistingValueForInput($(input_unversioned_id), _attributeElement, "Unversioned");
            _setExistingValueForInput($(input_standardValue_id), _attributeElement, "Standard Value");
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

            var documentationDefaultValue = undefined;

            if (existing) {
                if (existing.kind == "string") {
                    var value = $input.val();
                    existing.value = value;
                    
                    if (name == "Title") {
                        documentationDefaultValue = value;
                    }
                } else if (existing.kind == "boolean") {
                    existing.value = $input.is(":checked");
                }
            } else { 
                var value = undefined;

                // intentionally using attr to avoid caching
                var kind = $input.attr("data-kind");
                if (kind == "string") {
                    value = $input.val();

                    if (name == "Title") {
                        documentationDefaultValue = value;
                    }
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
              
            // if applicable, set the default documentation text
            if (documentationDefaultValue !== undefined) {
                var $documentation = $("#documentation");
                var documentation = $documentation.val().trim();
                if (documentation == "") {
                    $documentation.val(documentationDefaultValue);
                    $documentation.trigger("change");
                }
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
});

