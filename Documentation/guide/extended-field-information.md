# Field Attributes

In **Version 1.1+**, SitecoreUML includes support for granular control over _Extended Field Information_. Extended field information includes the field data and settings that aren't displayed on the diagram, itself, including:

* Title
* Field Section Name
* Source
* Standard Value
* Shared Flag
* Unversioned Flag

## Syntax and Attributes

The following table lists each of the supported field attributes and their descriptions:

| Field Attribute **Name** | **Description** |
| :--- | :--- |
| Title | Maps to the _Title_ field of the Template Field; this value overrides the field's name in the Content Editor \(often used to display hints and suggestions to content authors for how the field is used\) |
| Section Name | Maps to the name of the field section to which this item should be added \(case-sensitive\); if not specified, defaults to "Data" |
| Source | Maps to the _Source_ field of the Template Field; depending on the field-type, this value may control nothing or it may control value selection options, datasource queries, and beyond |
| Standard Value | Maps to the value that should be stored for the template field on the template's _\_Standard Values_ item; if none of the template fields on the template have a _StandardValue_ then a _\_Standard Values_ item is not created for the template |
| Shared | Maps to the _Shared_ field of the Template Field; this boolean setting determines whether or not the field is a Shared field |
| Unversioned | Maps to the _Unversioned_ field of the Template Field; this boolean setting determines whether or not the field is Unversioned |

## Managing Field Attributes

### Sitecore Field Editor \(1.2.0+\)

### Documentation Editor \(&lt;1.2.0\)

**DEPRECATED:** Management of Extended Field Information was moved to the [Sitecore Field Editor](#sitecore-field-editor-120) in **Version 1.2.0**. From that version on, the _Documentation Editor_ is used only for actual documentation purposes \(optionally generated\). 

In versions of SitecoreUML **prior to Version 1.2.0**, the Extended Field Information \(since renamed to "Field Attributes"\) for each field is managed via the _Documentation Editor_ that lives under the Model Explorer.

In versions prior to 1.2.0, the value of the _Documentation Editor_ field is parsed using the JavaScript `eval()` function, and the data from the resulting object is mapped to the Extended Field Information. You can manage the Extended Field Information in the _Documentation Editor_ using any JavaScript object syntax that you would like. However, if you define a function for your object, please ensure that the definition is self-executing, so that the object itself is returned.

Note that proneness to syntactical error, lacking ease of use and the vulnerability of the `eval` function just a few reasons why this implementation was changed for version 1.2.0+.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-ExtendedFieldInfo-DocumentationField.png?raw=true)

