# Sitecore Config Files

The Sitecore module of SitecoreUML includes two config files: _SitecoreUML.config_, and _SitecoreUML.CM.config_. The content of these configuration files is documented, below.

## SitecoreUML.config

This file patches all of the in the SitecoreUML configuration, save for the `RegisterRoutes` processor which is patched in via the [SitecoreUML.CM.config](#sitecoreumlcmconfig).

### Commands

The commands included with SitecoreUML are primarily for advanced users who intend to customize SitecoreUML and/or work directly with the serialized JSON data. The commands provide the functionality for SitecoreUML's [JSON tools](/guide/json-tools.md). The included commands are documented, below.

#### `sitecoreuml:import`

Command to import templates from the serialized JSON file located at the [`importDropFolderPath`](#sitecoreumljsontoolsimportdropfolder-v111).

#### `sitecoreuml:export`

Command to export templates from Sitecore as serialized JSON saved to the [`exportSaveFolderPath`](#sitecoreumljsontoolsexportsavefolder-v111).

### Settings

The settings included with SitecoreUML are primarily for advanced users who intend to customize SitecoreUML and/or work directly with the serialized JSON data. The settings support the functionality for SitecoreUML's [JSON tools](/guide/json-tools.md). The included settings are documented, below.

#### `SitecoreUML.JsonTools.ImportDropFolder` \(v1.1.1+\)

**Default:** `$(dataFolder)\SitecoreUML\Import`**  
Description:** Path to the folder where serialized template data to be imported into Sitecore should be stored. Note that this setting is only necessary if intending to manually \(i.e. not from StarUML\) import template data from serialized JSON, using SitecoreUML's [JSON tools](/guide/json-tools.md)

#### `SitecoreUML.JsonTools.ImportHistoryFolder` \(v1.1.1+\)

**Default:** `$(dataFolder)\SitecoreUML\ImportHistory`**  
Description:** Path to the folder where serialized JSON template data files will be archived after the import. This setting is only used if `archiveFilesAfterImport` is `true` and import was manually \(i.e. not from StarUML\) executed from serialized JSON, using SitecoreUML's [JSON tools](/guide/json-tools.md)

#### `SitecoreUML.JsonTools.ExportSaveFolder` \(v1.1.1+\)

**Default:** `$(dataFolder)\SitecoreUML\Export`**  
Description:** Path to the folder where exported template data files will be saved, if exporting via SitecoreUML's [JSON tools](/guide/json-tools.md)

### SitecoreUML Configuration Section

The `<sitecoreUML>` configuration section contains all of the custom configuration for the Sitecore module of SitecoreUML. It's components are documented, below.

#### `targetDatabaseName`

**Type:** string  
**Default:** `master`**  
Description:** The name of the database to import data into and export data from

#### `templateRootPath`

**Type:** string  
**Default:** `master`**  
Description:** Path to the root item that contains all templates to be imported or exported. All template paths in UML diagrams will be relative to

#### `templateExcludePaths` \(v1.1.2+\)

**Type:** List  
**ChildNode:** `<exclude>`  
**Default:** N/A  
**Description:** Paths to be ignored when templates are exported from Sitecore

* Paths should be full Sitecore path
* Path and descendants are excluded from templates in export
* Path and descendants are excluded from the exported templates' base templates

#### `defaultFieldSectionName`

**Type:** string  
**Default:** `Data`  
**Description:** Field section name to be created by default on all imported templates. As of **version 1.3.4**, this required setting acts as a fallback for the [Default Field Section Name](/guide/saving-preferences.md#default-field-section-name) setting in the SitecoreUML preferences dialog.

#### `importDropFolderPath` \(&lt;1.1.1\)

**DEPRECATED: See **[**SitecoreUML.JsonTools.ImportDropFolder \(v1.1.1+\)**](#sitecoreumljsontoolsimportdropfolder-v111)

**Type:** string  
**Default:** `C:/inetpub/wwwroot/SitecoreUML/Data/SitecoreUML/Import`**  
Description:** Path to the folder where serialized template data to be imported into Sitecore should be stored. Note that this setting is only necessary if intending to manually \(i.e. not from StarUML\) import template data from serialized JSON, using SitecoreUML's [JSON tools](/guide/json-tools.md)

#### `importHistoryFolderPath` \(&lt;1.1.1\)

**DEPRECATED: See **[**SitecoreUML.JsonTools.ImportHistoryFolder \(v1.1.1+\)**](#sitecoreumljsontoolsimporthistoryfolder-v111)

**Type:** string  
**Default:** `C:/inetpub/wwwroot/SitecoreUML/ImportHistory`**  
Description:** Path to the folder where serialized JSON template data files will be archived after the import. This setting is only used if `archiveFilesAfterImport` is `true` and import was manually \(i.e. not from StarUML\) executed from serialized JSON, using SitecoreUML's [JSON tools](/guide/json-tools.md)

#### `archiveFilesAfterImport`

**Type:** boolean  
**Default:** `false`**  
Description:** Determines whether or not import data files should be archived after file-based import via SitecoreUML's [JSON tools](/guide/json-tools.md); if `false` files are deleted after import

#### `disableIndexingDuringImport`

**Type:** boolean  
**Default:** `true`**  
Description:** Controls whether or not indexing should be disabled during import. It is recommended that this be set to `true` for sake of performance during the import

#### `exportSaveFolderPath` \(&lt;1.1.1\)

**DEPRECATED: See **[**SitecoreUML.JsonTools.ExportSaveFolder \(v1.1.1+\)**](#sitecoreumljsontoolsexportsavefolder-v111)

**Type:** string  
**Default:** `C:/inetpub/wwwroot/SitecoreUML/Data/SitecoreUML/Export`**  
Description:** Path to the folder where exported template data files will be saved, if exporting via SitecoreUML's [JSON tools](/guide/json-tools.md)

#### `fieldTypes`

**Type:** collection  
**Default:** N/A**  
Description:** Maps the Sitecore field type names to the field type names used in the UML diagrams. Each mapping is defined as a `fieldType` node, with the following attributes:

| **Attribute** | **Description** |
| :--- | :--- |
| sitecoreFieldTypeName | The name of the Sitecore field type being mapped to |
| umlFieldTypeName | The name that will be used when diagrams are imported into StarUML or otherwise exported from Sitecore as SitecoreUML JSON. Effectively, this attribute defines the default UML field type name alias. |
| umlAliases | \(Optional\) A pipe-delimited list of case-insensitive aliases that resolve to the _umlFieldTypeName_ when deploying from StarUML to Sitecore. Note that the _umlFieldTypeName_ does not have to be included in the _umlAliases_. **IMPORTANT: **All aliases must be unique. |

## SitecoreUML.CM.config

This configuration file patches in the SitecoreUML `RegisterRoutes` processor. This processor registers the routes to the SitecoreUML services, called via StarUML for [deployment](/guide/deploy-and-import.md), [import](/guide/deploy-and-import.md) and [validation](/guide/validate.md).

If intending to update the out of the box SitecoreUML routes and/or services, this file should be your first stop.

**IMPORTANT: **For security reasons, it is recommended that the SitecoreUML Sitecore module be installed only on Content Management \(CM\) and non-production instances. However, if you do happen to install the SitecoreUML Sitecore module on a production Content Delivery \(CD\) instance, it is important that you remove this file.

