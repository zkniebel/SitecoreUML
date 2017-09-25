# Preferences

SitecoreUML ships with full UI support for storing Preferences in StarUML. You can view and edit SitecoreUML preferences, by navigating to _File_ &gt; _Preferences_ and selecting the "Sitecore" tab.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Preferences.png?raw=true)

## Supported Preferences

The current version of SitecoreUML includes three native Preferences:

* Sitecore URL
* Deploy Route
* Import Route

### Sitecore URL

The Sitecore URL setting is the most important setting for SitecoreUML deployment and import. In order to connect to a Sitecore instance that has the SitecoreUML service installed, the only configuration that you need to do is set the _Sitecore URL_ setting to the target instance's URL. Once that's done, you should be ready to deploy or import.

### Import Route and Deploy Route

The _Deploy Route_ and _Import Route_ settings are meant to add support for those who wish to customize the SitecoreUML service, installed on the connected Sitecore instance. By default, they point at the default SitecoreUML service routes for their respective actions.

The idea behind being able to change these settings is that, if desired, developers can change the service route that they point to for particular actions. This could be used to make the import or deploy commands connect to a different service, entirely.

