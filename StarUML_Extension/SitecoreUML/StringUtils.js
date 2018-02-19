define(function (require, exports, module) {
    "use strict";
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
    };
     
    /** 
     * Checks if the given source string starts with the given searchString
     * @param {String} sourceString String to check
     * @param {String} searchString String to look for
     * @param {Integer} position (optional) Index of the first character to check (default: 0)
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
     */
    function startsWith(sourceString, searchString, position){
        return sourceString.substr(position || 0, searchString.length) === searchString;
    };

    /**
     * Checks if the given search string ends with the given string
     * @param {String} sourceString String to check
     * @param {String} search String to look for
     * @param {Integer} this_len (optional) Length of the string to include in the check (default: length of the search string)
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
     */
    function endsWith(sourceString, search, this_len) {
		if (this_len === undefined || this_len > sourceString.length) {
			this_len = sourceString.length;
		}
		return sourceString.substring(this_len - search.length, this_len) === search;
    };
    
    /**
     * Returns a new string with any special markdown characters escaped
     * @param {String} source Source string in which the markdown characters need to be escaped
     */
    function escapeForMarkdown(source) {
        var markdownCharsPattern = "([_\*#])";
        var re = new RegExp(markdownCharsPattern, "g");
        return source.replace(re, "\\$1");
    }

    exports.occurrences = occurrences;
    exports.startsWith = startsWith;
    exports.endsWith = endsWith;
    exports.escapeForMarkdown = escapeForMarkdown;
});