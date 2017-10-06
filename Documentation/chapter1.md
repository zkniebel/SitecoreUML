# Project Roadmap

This page lists the project's upcoming features, phases and milestones.

Listed under each version is the set of tasks, features and enhancements that should be completed for and included in the release of the version. Please note that the roadmap is tentative and subject to change.

### Version alpha

* [x] Initial build out of core features
* [x] One-click deploy
* [x] One-click import
* [x] Sitecore module
* [x] StarUML extension
* [x] Initial documentation

### Version beta \(2017.09.28 - Current\)

* [x] Documentation
  * [x] Upgrade instructions
  * [x] Validation feature
  * [x] Sitecore Config Files
* [x] Native Sitecore field-type names used for UML types, by default
* [x] Adds support for UML field type mapping aliases \(optional abbreviated names mapping to Sitecore field type names\)
* [x] Adds field type name validation feature

### Version 1.0 \(November 2017\)

* [ ] Adds SitecoreUML project template to StarUML with required diagrams automatically added
* [ ] Remove broken lazy-initialization of module variables in JavaScript
* [ ] Adds invalid name characters field to the preferences for preventing invalid characters from being used in template, template folder or field names
* [ ] Adds "connection test" to Preferences

### Version 1.1 \(~ December 2017\)

* Enhanced support for granular control over fields from UML
  * Support for setting the "Title" of a template field
  * Support for setting the "Source" of a template field
  * Support for setting the \_Standard Value of a field
* Moves folder paths in Sitecore config files to settings to enable use of Sitecore variables
* Documentation
  * Tutorials
  * Samples
  * Glossary

### Version 1.2 \(~ January 2018\)

* Makes the _TemplateRoot_ setting optional
  * Falls back to the _/sitecore/templates_ folder 
  * Optional _exclusions_ configuration to define templates and paths to be excluded
* Adds support for branch templates 

### Version 1.3 \(~ February 2018\)

* Adds support for deploying specific diagram sets
* Code generation API support

### ...

### Version 2.0 \(Coming in 2018\)

* Azure infrastructure provisioning support
* AWS infrastructure provisioning support



