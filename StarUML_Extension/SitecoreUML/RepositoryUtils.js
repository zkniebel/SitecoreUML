define(function(require, exports, module) {
    "use strict";

    // StarUML module dependencies
    var Repository = app.getModule("core/Repository");

    // SitecoreUML dependencies
    var StringUtils = require("StringUtils");

    /** 
     * Converts a given backslash-delimited path to a path expression that can be queried
     * - Input path should follow the syntax path/to/desired/models
     * - Converts the path from backslash-delimited to double-colon delimited, e.g. path::to::desired::models
     */
    function convertElementPathToQueryExpression(path) {
        if (!path) {
            return;
        }

        while (StringUtils.startsWith(path, "/")) {
            path = path.substring(1);
        }
        return path.replace(/\//g, "::");
    };

    /**
     * Retrieves the elements at the specified path that passes the optional filter expression 
     * - Note that the filter expression is appended to the end of the path expression before querying, e.g. path/to/desired/model[field=Value]
     * - Filter expression could be any valid selector expression, including type (e.g. "@UMLPackage"), value (e.g. "[field=Value]"), etc. 
     * - Selector expression reference: https://github.com/staruml/metadata-json/wiki/SelectorExpression
     */
    function getElementsByPath(path, filterExpression) {
        var queryExpr = convertElementPathToQueryExpression(path) + filterExpression;
        return Repository.select(queryExpr);
    };

    exports.convertElementPathToQueryExpression = convertElementPathToQueryExpression;
    exports.getElementsByPath = getElementsByPath;
});