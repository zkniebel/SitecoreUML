# How it Works

The functionality of SitecoreUML is provided by a two-way integration between Sitecore and StarUML, the editor for the UML diagrams and models.

## StarUML

StarUML is one of the most popular modeling and diagramming tools on the market. It is important to know that StarUML is not just a diagramming tool, like Microsoft Visio, but also a modeling tool, wherein the model can be represented beyond the scope of the diagrams, alone. In other words, a diagram is a model but a model is not a diagram. Conceptually speaking, a diagram is a type of visual model. SitecoreUML leverages both the diagramming and modeling aspects of StarUML.

## Components of SitecoreUML

SitecoreUML is comprised of two components:

* Sitecore Module
* StarUML Extension

The Sitecore Module's main purpose is to add the SitecoreUML service to the Sitecore site. SitecoreUML uses this service in order to deploy templates to and request template data from Sitecore. There are some additional features, as described in the chapter on [JSON Tools](/JSON Tools), however they are typically for more advanced users looking to customize or extend SitecoreUML.

The main component of SitecoreUML is the StarUML extension. This component extends the native StarUML interface and provides support for configuring Preferences, one-click deployment to Sitecore and one-click import from Sitecore. As with the Sitecore module, there are some additional features that are for more advanced users looking to customize or extend SitecoreUML. You can read about these features in the [JSON Tools](/JSON Tools) chapter.

## Serialization and Transmission



## Import & Export Architecture

SitecoreUML's import and export logic is pretty straight-forward. When you _import_,_ \_you are requesting data from the Sitecore instance. The retrieved data is then used to auto-generate your diagrams and models in Star UML. In contrast, when you \_deploy_, you are sending data from StarUML to Sitecore, where it is then used to auto-generate templates and template folders.

![](/assets/ImportExportArchitecture.png)

