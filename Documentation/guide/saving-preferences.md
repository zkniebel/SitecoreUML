# Preferences

SitecoreUML ships with full UI support for storing Preferences in StarUML. You can view and edit SitecoreUML preferences, by navigating to _File_ &gt; _Preferences_ and selecting the "Sitecore" tab.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-Preferences.png?raw=true)_\(Displayed image reflects Version 1.0.0\)_

## Supported Preferences

The current version of SitecoreUML includes three native Preferences:

* Instance Connection Settings
  * Sitecore URL
* Diagram Generation Settings
  * Default Diagram Format **\(1.1.3\)**
* Helix Settings
  * Foundation Template Folder Path **\(1.3.0\)**
  * Feature Template Folder Path **\(1.3.0\)**
  * Project Template Folder Path **\(1.3.0\)**
  * Module Paths Regular Expression **\(1.3.4\)**
    * Module Path Capture Group Number **\(1.3.4\)**
    * Module Name Capture Group Number **\(1.3.4\)**
  * Dependency Name Format **\(1.3.4\)**
* Template Deploy Settings
  * Default Field Section Name **\(1.3.4\)**
* SitecoreUML Service Settings
  * Connection Test Route
  * Validate Route
  * Import Route
  * Deploy Route

### Sitecore URL

The Sitecore URL setting is the most important setting for SitecoreUML deployment and import. In order to connect to a Sitecore instance that has the SitecoreUML service installed, the only configuration that you need to do is set the _Sitecore URL_ setting to the target instance's URL. Once that's done, you should be ready to deploy or import.

### Default Diagram Format

SitecoreUML **Version 1.1.3** adds support for controlling the default format of diagrams generated from imported template data, via the _Default Diagram Format_ drop-down. By default, the value is set to "Left to Right", as this tends to be the most printer and export-friendly format. Note that the available options map to the settings that are available by navigating to _Format_ -&gt; _Layout_ in the toolbar.

### Helix Settings

SitecoreUML **Version 1.3.0** introduces a new set of Helix features and settings to control them.

#### Layer Folder Path Settings

In SitecoreUML **Version 1.3.0**, settings were added to enable users to set the root path of each of the three Helix layers: Foundation, Feature and Project. The path is case-sensitive, should start with a forward-slash, should exclude _/sitecore/templates_, and should not end with a forward-slash, e.g. `/Foundation` , `/Feature` , and `/Project` .

#### Module Paths Regular Expression

In SitecoreUML **Version 1.3.4**, settings were added to control the regular expression that SitecoreUML uses to determine what folders are actually Helix module folders. SitecoreUML doesn't natively support distinguishing module groups from modules, so customizing this regular expression enables you to add support for that on your own, for your specific use-case.

It is important to note that the regular expression must have a capturing group for the module's path and a matching group for the module's name.

This setting supports the use of a token, `{{LAYER_PATH}}`, to specify the generated pattern for matching any one of the layer names -  i.e. the replacement value is a regular expression formed by doing an OR match on each of the three layer names, e.g. `/Foundation|/Feature|/Project` .

##### Module Path Capture Group Number

This setting holds the number of the capture group of the Module Paths Regular Expression that holds the module's path.

##### Module Name Capture Group Number

This setting holds the number of the capture group of the Module Paths Regular Expression that holds the module's name.

#### Dependency Name Format

In SitecoreUML **Version 1.3.4**, the Dependency Name Format setting was added to allow the user to control the format of the name assigned to the dependency relationships. 

Use the `{{LAYER}}` token to indicate the name of the layer that the dependency lives in \(points at\).

By default, this setting is set to `Dependencies for the {{LAYER}} Layer` , which will result in the names "Dependencies for the Foundation Layer", "Dependencies for the Feature Layer", and "Dependencies for the Project Layer".

### Default Field Section Name

SitecoreUML **Version 1.3.4** adds support for controlling the default field section name to be used when deploying fields that do not have a field section name set to Sitecore. Note that in the configuration file for the SitecoreUML Service for Sitecore there is a required setting, [`defaultFieldSectionName`](/guide/sitecore-configuration.md#defaultfieldsectionname), that sets the fallback field section name, should the value of this preferences setting be empty.

### Route Settings

The_ Route_ settings are meant to add support for those who wish to customize the SitecoreUML service, installed on the connected Sitecore instance. By default, they point at the default SitecoreUML service routes for their respective actions.

The idea behind being able to change these settings is that, if desired, developers can change the service route that they point to for particular actions. This could be used to make the commands connect to extended services or different services, entirely.

