# Extended Field Information

In **Version 1.1+**, SitecoreUML includes support for granular control over _Extended Field Information_. Extended field information includes the field data and settings that aren't displayed on the diagram, itself, including:

* Title
* Field Section Name
* Source
* Standard Value
* Shared Flag
* Unversioned Flag

These settings can be controlled from the _Documentation_ editor that lives under the Model Explorer.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-ExtendedFieldInfo-DocumentationField.png?raw=true)

## Syntax and Properties

The Extended Field Information is configured via JavaScript object syntax. The following table lists each of the supported properties and their descriptions:

| **Property Name** | **Description** |
| :--- | :--- |
| Title | Maps to the _Title_ field of the Template Field; this value overrides the field's name in the Content Editor \(often used to display hints and suggestions to content authors for how the field is used\) |
| SectionName | Maps to the name of the field section to which this item should be added \(case-sensitive\); if not specified, defaults to "Data" |
| Source | Maps to the _Source_ field of the Template Field; depending on the field-type, this value may control nothing or it may control value selection options, datasource queries, and beyond |
| StandardValue | Maps to the value that should be stored for the template field on the template's _\_Standard Values_ item; if none of the template fields on the template have a _StandardValue_ then a _\_Standard Values_ item is not created for the template |
| Shared | Maps to the _Shared_ field of the Template Field; this boolean setting determines whether or not the field is a Shared field |
| Unversioned | Maps to the _Unversioned_ field of the Template Field; this boolean setting determines whether or not the field is Unversioned |

**Note:** You can set the Extended Field Information using any JavaScript object syntax that you would like. However, if you define a function for your object, be sure that the definition is self-executing, so that the object itself is returned.

