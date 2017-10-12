# Preferences

SitecoreUML ships with full UI support for storing Preferences in StarUML. You can view and edit SitecoreUML preferences, by navigating to _File_ &gt; _Preferences_ and selecting the "Sitecore" tab.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-Preferences.png?raw=true)\(Image displays version 1.0\)

## Supported Preferences

The current version of SitecoreUML includes three native Preferences:

* Sitecore URL
* Default Diagram Format **\(Version 1.1.3+\)**
* Deploy Route
* Import Route
* Validate Route
* Connection Test Route

### Sitecore URL

The Sitecore URL setting is the most important setting for SitecoreUML deployment and import. In order to connect to a Sitecore instance that has the SitecoreUML service installed, the only configuration that you need to do is set the _Sitecore URL_ setting to the target instance's URL. Once that's done, you should be ready to deploy or import.

### Default Diagram Format

SitecoreUML version 1.1.3 adds support for controlling the default format of diagrams generated from imported template data, via the _Default Diagram Format_ drop-down. By default, the value is set to "Left to Right", as this tends to be the most printer and export-friendly format. Note that the available options map to the settings that are available by navigating to _Format_ -&gt; _Layout_ in the toolbar.

### Route Settings

The_ Route_ settings are meant to add support for those who wish to customize the SitecoreUML service, installed on the connected Sitecore instance. By default, they point at the default SitecoreUML service routes for their respective actions.

The idea behind being able to change these settings is that, if desired, developers can change the service route that they point to for particular actions. This could be used to make the commands connect to extended services or different services, entirely.

