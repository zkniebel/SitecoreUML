# Validate

SitecoreUML includes a _Validate Templates_ command, to help validate templates before they are deployed to Sitecore \(**Version beta.0.1+**\). When executed, the _Validate Templates_ command sends the template data to the SitecoreUML service, hosted by the Sitecore instance, to see if the data can be parsed and adheres to the settings defined in the configuration.

SitecoreUML strongly recommends validating templates before every deployment.

## Validating Templates

To validate your templates, click _Sitecore_ &gt; _Validate Templates_

Any validation errors that are found will display in the resulting modal.

## ![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-Validate.png?raw=true)Supported Validation Strategies

SitecoreUML's _Validate Templates_ command is meant to be a one-click validation tool for your UML diagrams. As time goes on, this feature will become more robust, but it currently is meant to help you validate that the templates that you create can be deployed to Sitecore without error.

### Field Type Name Validation

Since **Version beta.0.1**, SitecoreUML has supported field type name validation via the _Validate Templates_ command. This validation strategy checks the field type names specified for each field against the field type mappings \(including their aliases\) defined in the [`<fieldTypes>`](//guide/sitecore-configuration.md#fieldtypes) section of the _SitecoreUML.config_ file. Any types that are not recognized will be listed as errors in the validation results.

Note that when deploying templates to Sitecore, any fields with field-types that SitecoreUML is unable to interpret are skipped and logged. This feature helps avoid these situations by enabling users to identify unrecognized field type names before attempting a deployment.

### Item Name Validation

Support for item name validation is included in **Version 1.0+**, and supports validating the names of each of the following using Sitecore's native item name validation logic:

* Templates
* Template Folders
* Template Fields

Note that when deploying templates to Sitecore, any invalid names will result in an error that will halt the deployment. This feature helps avoid these situations by enabling users to identify item name issues before attempting a deployment.



