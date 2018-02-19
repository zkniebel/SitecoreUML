define(function(require, exports, module) {
    "use strict";

    /**
     * Returns the set of unique elements from the source array
     * @param {Array} source Source array
     * @see https://stackoverflow.com/a/9229821/1506793
     */
    function uniqueElements(source) {
        var seen = {};
        var out = [];
        var len = source.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = source[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
                   out[j++] = item;
             }
        }
        return out;
    };

    exports.uniqueElements = uniqueElements;
});