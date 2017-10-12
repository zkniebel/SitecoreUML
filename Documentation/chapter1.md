# Project Roadmap

This page lists the project's upcoming features and serves as high-level release notes.

Listed under each version is the set of tasks, features and enhancements that are \(to be\) completed for a particular version. Note that completed tasks may not have been completed for the initial release of the version. For example a feature listed under version 1.0 might have been added in version 1.0.3. Starting with version **Version 1.2.0**, each item will be labeled with the patch version that it is included in, e.g. _Version 1.2.1_.

Please note that the roadmap is tentative and subject to change.

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

### Version 1.1 \(~ Mid-October 2017\)

* [x] Enhanced support for granular control over fields from UML \(extended field info\)
  * [x] Support for setting the "Title" of a template field
  * [x] Support for setting the "Source" of a template field
  * [x] Support for setting the \_Standard Value of a field
  * [x] Support for setting if the field is Shared
  * [x] Support for setting if the field is Unversioned
  * [x] Support for setting the field section name
* [x] Adds visual progress dialog to be displayed during imports
* [x] Updates file-path based config elements to settings that leverage the `$(dataFolder)` variable
* [x] Adds template exclude paths to SitecoreUML.config \(paths to exclude when data is being imported into StarUML
* [x] Adds support for controlling default diagram formatting for diagrams generated from imported data via Preferences
* [x] Moves folder paths in Sitecore config files to settings to enable use of Sitecore variables
* [x] Documentation
  * [x] Extended Field Info
  * [x] Path configuration settings
  * [x] Template Exclude paths
  * [x] Import Diagram Formatting Preference

### Version 1.2 \(~ November 2017\)

* [ ] Adds support for setting the default field section name in preferences, leaving the one in the Sitecore configuration to be a required backup value
* [ ] Validation updates
  * [ ] Adds field section names to validation
  * [ ] Adds validation of Extended Field Info syntax
* [ ] Refactor out broken lazy-initialization of module variables in JavaScript
* [ ] Documentation
  * [ ] Export as Html Docs
  * [ ] Print to PDF
  * [ ] Validation updates

### Version 1.3 \(~ December 2018\)

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

### Version 1.4 \(~ January 2018\)

* Adds support for deploying specific diagram sets
* JSON Tools and Extensibility Documentation

### ...

### Version 2.0 \(Coming in 2018\)

* Azure infrastructure provisioning support
* AWS infrastructure provisioning support



