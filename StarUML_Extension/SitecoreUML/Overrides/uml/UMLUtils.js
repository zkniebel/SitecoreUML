define(function(require, exports, module) {
    "use strict";

    var GrammarAttribute = require("text!grammars/uml-attribute.pegjs");

    /**
     * Parse Attribute Expression
     * @param {string} expr
     * @return {Object} - Abstract Syntax Tree
     */
    function parseAttributeExpression(expr) {
        var parser = PEG.buildParser(GrammarAttribute);
        var ast = parser.parse(expr);
        return ast;
    };

    exports.parseAttributeExpression = parseAttributeExpression;
});