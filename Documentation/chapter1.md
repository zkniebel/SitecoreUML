# Project Roadmap

This page lists the project's upcoming features and serves as high-level release notes. See the [latest version](#version-12-20171020---current).

Listed under each version is the set of tasks, features and enhancements that are \(to be\) completed for a particular version. Note that completed tasks may not have been completed for the initial release of the version. For example a feature listed under version 1.0 might have been added in version 1.0.3. Starting with version **Version 1.2.0**, each item will be labeled with the patch version that it is included in, e.g. _Version 1.2.1_.

Please note that the roadmap is tentative and subject to change.

**Scroll down to see the latest changes and the current backlog.** If you're looking for a feature \(even one that you would like to request\) that listed then please reach out to me over Sitecore Slack \(@zachary\_kniebel\) and I will do my best to add it. Similarly, I can occasionally provide early releases for features that you require that have not yet been implemented or completed. Reach out to me and I will see what I can do.

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

### Version 1.0

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

### Version 1.1

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

### Version 1.2

* [x] Adds support for dashes in Quick Edits for attribute type names **\(1.2.0\)**
* [x] Replaces Documentation field-based implementation of Extended Field Info with the Sitecore Field Editor **\(1.2.0\)**

  * [x] Updates the content of the Documentation field to be more human-readable **\(1.2.0\)**
  * [x] Adds auto-generation of Documentation based on Sitecore Field Editor-managed values **\(1.2.0\)**
  * [x] Adds support for controlling whether or not Documentation is auto-generated via a Sitecore Field Editor setting **\(1.2.0\)**

* [x] Validation updates

  * [x] Adds field section names to validation **\(1.2.0\)**

* [x] Documentation

  * [x] Field section name validation **\(1.2.0\)**
  * [x] Sitecore Field Editor **\(1.2.0\)**
  * [x] Attribute type name dash support - fixes StarUML bug **\(1.2.0\)**

### Version 1.3 \(2018.02.18 - current\)

* [ ] Helix diagramming and validation features support

  * [x] New command for generating Helix module-specific template diagrams **\(1.3.0\)**
  * [x] Visualize module-to-layer dependencies on module-specific diagrams **\(1.3.0\)**
  * [ ] New command for generating Helix layer-specific template diagrams
  * [ ] Visualize layer-to-layer dependencies on layer-specific diagrams
  * [ ] New Helix dependency direction validation integrated into all Helix diagrams
  * [x] Adds support for controlling the regular expression used for determining Helix modules to preferences **\(1.3.4\)**
  * [x] Adds support for controlling paths to layers in preferences **\(1.3.0\)**
  * [x] Adds support for controlling dependency names in documentation **\(1.3.4\)**

* [x] Adds support for setting the default field section name in preferences, leaving the one in the Sitecore configuration to be a required backup value **\(1.3.4\)**

* [ ] Documentation

  * [x] Export as HTML Docs Video **\(1.3.3\)**
  * [x] Helix Module Diagram Generation Video **\(1.3.3\)**
  * [x] Default Field Section Name **\(1.3.4\)**
  * [x] Controlling Paths to Layers **\(1.3.4 - **was missed and should have been added in 1.3.0**\)**
  * [x] Controlling Dependency Name Format **\(1.3.4\)**
  * [ ] How to review dependencies on diagram and in docs \(late addition - will be adding this this in order to be thorough\)

### Backlog \(Coming Soon\)

* Introduces a new CLI tool to be used for generating [metadata-json](https://github.com/staruml/metadata-json) \(.mdj\) files directly from Sitecore and using [mdgen](https://github.com/staruml/mdgen) to auto-generate the HTML documentation, for use in CI/CD builds
* Adds support for deploying specific diagram sets
* Sitecore 7 Support
* Optional Template ID Generation and Preservation Support
* Help Fields in Sitecore Updated with Documentation field from StarUML

* Update the deployment to run validation and give the option to cancel the deployment if errors are detected

* Makes the _TemplateRoot_ setting optional

  * * Falls back to the _/sitecore/templates_ folder 
    * Optional _exclusions_ configuration to define templates and paths to be excluded

* Documentation

  * Add Diagram Set command
  * Developer Setup
  * Tutorials
  * Samples
  * Glossary

### ...

### 



