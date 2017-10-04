# Validate

SitecoreUML now supports a validation feature, which helps to validate the field-type names that you specify in your UML diagrams, before deploying to Sitecore.

When deploying templates to Sitecore, any fields with field-types that SitecoreUML is unable to interpret are skipped and logged. Fortunately, SitecoreUML now provides the \_Validate \_command, which enables architects to first validate that all of the field types that they are using are recognized.

## Validating Templates

Go to _Sitecore_ &gt; _Validate Templates_

Any validation errors that are found will display in the resulting modal.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Validate.png?raw=true)

