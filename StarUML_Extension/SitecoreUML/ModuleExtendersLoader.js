define(function(require, exports, module) {
    "use strict";    

    // eager-loaded StarUML modules
    var FileSystem = app.getModule("filesystem/FileSystem");
    var ExtensionUtils = app.getModule("utils/ExtensionUtils");
    
    // lazy-loaded StarUML Modules
    var _fileUtils = undefined;
    var FileUtils_get = function() { return _fileUtils || (_fileUtils = app.getModule("file/FileUtils")); }; 


    function applyExtensions(entry, basePath) {        
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
            doExtend(path, "ModuleExtenders/" + path);
        } else {
            var path = getPath(entry.name);
            entry.getContents(function (err, children) {
                children.forEach(function (child) { applyExtensions(child, path); });
            });
        }
    };  

    function doExtend(target, extenderName) {
        console.log("Extending \"" + target + "\" with \"" + extenderName + "\"");

        // get the custom extend module
        require([extenderName], function(extender) {            
            extender.doExtend();
        });
    };

    // NOTE: all Module Extenders must have the same name and be at the same relative path as the StarUML module they extend
    exports.initialize = function() {
        // get the root path
        var rootPath = ExtensionUtils.getModulePath(module);
        // get the extenders directory        
        var extendersDirectory = FileSystem.getDirectoryForPath(rootPath + "ModuleExtenders");
        
        // for each of the contents of the extenders directory, add the file descendants to the extenders
        extendersDirectory.getContents(function (err, children) {
            children.forEach(function(child) { applyExtensions(child); });
        });      
    };
});