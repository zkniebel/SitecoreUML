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

### Version beta

* [x] Documentation
  * [x] Upgrade instructions
  * [x] Validation feature
  * [x] Sitecore Config Files
* [x] Native Sitecore field-type names used for UML types, by default
* [x] Adds support for UML field type mapping aliases \(optional abbreviated names mapping to Sitecore field type names\)
* [x] Adds field type name validation feature

### Version 1.0 \(2017.10.07 - Current\)

* [x] Adds SitecoreUML project templates to StarUML with required diagrams automatically added
  * [x] Blank Project
  * [x] Helix Project
* [x] Adds support for validating field, template and template folder item names with Sitecore
* [x] Adds "connection test" command
* [x] Adds MSI installer for StarUML extension via WiX
* [x] Documentation
  * [x] Project Templates
  * [x] Item name validation
  * [x] Connection test
  * [x] Installation \(updated for MSI installer\)

### Version 1.1 \(~ November 2017\)

* [x] Enhanced support for granular control over fields from UML \(extended field info\)
  * [x] Support for setting the "Title" of a template field
  * [x] Support for setting the "Source" of a template field
  * [x] Support for setting the \_Standard Value of a field
  * [x] Support for setting if the field is Shared
  * [x] Support for setting if the field is Unversioned
  * [x] Support for setting the field section name
* [ ] Adds support for setting the default field section name in preferences, leaving the one in the Sitecore configuration to be a required backup value
* [ ] Validation updates
  * [ ] Adds field section names to validation
  * [ ] Adds validation of Extended Field Info syntax
* [ ] Moves folder paths in Sitecore config files to settings to enable use of Sitecore variables
* [ ] Refactor out broken lazy-initialization of module variables in JavaScript
* [ ] Adds visual progress dialog to be displayed during imports
* [ ] Documentation
  * [x] Extended Field Info
  * [ ] Validation updates

### Version 1.2 \(~ December 2018\)

* Makes the _TemplateRoot_ setting optional
  * Falls back to the _/sitecore/templates_ folder 
  * Optional _exclusions_ configuration to define templates and paths to be excluded
* Updates the deployment to run validation and give the option to cancel the deployment if errors are detected
* Adds "Add diagram set" command
* Documentation
  * Add Diagram Set command
  * Developer Setup
* * Tutorials
  * Samples
  * Glossary

### Version 1.3 \(~ January 2018\)

* Adds support for deploying specific diagram sets
* JSON Tools and Extensibility Documentation

### ...

### Version 2.0 \(Coming in 2018\)

* Azure infrastructure provisioning support
* AWS infrastructure provisioning support



