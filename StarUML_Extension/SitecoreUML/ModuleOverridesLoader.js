define(function(require, exports, module) {
    "use strict";    

    // eager-loaded StarUML modules
    var FileSystem = app.getModule("filesystem/FileSystem");
    var ExtensionUtils = app.getModule("utils/ExtensionUtils");
    
    // lazy-loaded StarUML Modules
    var _fileUtils = undefined;
    var FileUtils_get = function() { return _fileUtils || (_fileUtils = app.getModule("file/FileUtils")); }; 


    function applyOverrides(entry, basePath) {        
        var getPath = function(name) {
            return basePath ? basePath + "/" + name : name;
        };

        if (entry.isFile) {
            var entryName = entry.name;
            var extensionLength = FileUtils_get().getFileExtension(entryName).length;  
            if (extensionLength) {          
                entryName = entryName.substr(0, entryName.length - (extensionLength + 1));
            }

            var path = getPath(entryName);
            doOverride(path, "Overrides/" + path);
        } else {
            var path = getPath(entry.name);
            entry.getContents(function (err, children) {
                children.forEach(function (child) { applyOverrides(child, path); });
            });
        }
    };  

    function doOverride(target, overrideName) {
        console.log("Overriding \"" + target + "\" with \"" + overrideName + "\"");

        // get the native StarUML module to override
        var targetModule = app.getModule(target);

        // get the custom override module
        require([overrideName], function(override) {
            // perform the override
            $.extend(targetModule, override);
            console.log("Target:", targetModule);
        });
    };

    // NOTE: all Module Overrides must have the same name and be at the same relative path as the StarUML module they override
    exports.initialize = function() {
        // get the root path
        var rootPath = ExtensionUtils.getModulePath(module);
        // get the overrides directory        
        var overridesDirectory = FileSystem.getDirectoryForPath(rootPath + "Overrides");
        
        // for each of the contents of the overrides directory, add the file descendants to the overrides
        overridesDirectory.getContents(function (err, children) {
            children.forEach(function(child) { applyOverrides(child); });
        });      
    };
});