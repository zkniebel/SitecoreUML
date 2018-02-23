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

### Default Field Section Name

SitecoreUML **Version 1.3.4** adds support for controlling the default field section name to be used when deploying fields that do not have a field section name set to Sitecore. Note that in the configuration file for the SitecoreUML Service for Sitecore there is a required setting, [`defaultFieldSectionName`](/guide/sitecore-configuration.md#defaultfieldsectionname), that sets the fallback field section name, should the value of this preferences setting be empty.

### Route Settings

The_ Route_ settings are meant to add support for those who wish to customize the SitecoreUML service, installed on the connected Sitecore instance. By default, they point at the default SitecoreUML service routes for their respective actions.

The idea behind being able to change these settings is that, if desired, developers can change the service route that they point to for particular actions. This could be used to make the commands connect to extended services or different services, entirely.

