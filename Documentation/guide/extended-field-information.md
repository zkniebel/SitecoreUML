# Field Attributes

In **Version 1.1+**, SitecoreUML includes support for granular control over _Field Attributes_ \(formerly known as _Extended Field Information_\). Field Attributes include the field data and settings that aren't displayed on the diagram, itself, including:

* Title
* Field Section Name
* Source
* Standard Value
* Shared Flag
* Unversioned Flag

## Managing Field Attributes \(1.2.0+\)

For earlier versions, see [Managing Field Attributes via the Documentation Editor \(&lt;1.2.0\)](#managing-field-attributes-via-the-documentation-editor-120).

## The Sitecore Field Editor

In **Version 1.2.0**, SitecoreUML introduces the _Sitecore Field Editor_ - a user-friendly interface for editing Field Attributes. Note taht each value is automatically saved when clicking away from the input box.

When deploying your architecture to Sitecore, all Field Attribute values will be included and applied to the generated Fields. Similarly, when importing an existing architecture from Sitecore, all Field Attribute values will be imported, as well.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-ExtendedFieldInfo-SitecoreFieldEditor.png?raw=true)

### Field Documentation

#### Documentation and the Documentation Editor

Prior to version 1.2.0, the `documentation` property of and the _Documentation Editor_ for each UML attribute \(template field\) were re-purposed for managing Extended Field Information. In **Version 1.2.0+**, the original purposes of the `documenation` property and the _Documentation Editor_ were restored, and are now used only for documentation purposes. By default, SitecoreUML generates documentation for each field that displays the values of each of the Field Attributes.

In **Version 1.2.0**, SitecoreUML includes the _Auto-Doc_ feature, in which documentation for each field is automatically generated from the values of each of the Field Attributes. The benefit of this feature is that each of your fields will be documented with the value of its attributes, without requiring manual effort.

#### Enabling and Disabling Auto-Doc for a Field

**Version 1.2.0** of SitecoreUML also includes the _Auto-Doc_ checkbox, in the _Sitecore Field Editor_, which controls whether or not the _Auto-Doc_ feature should be enabled or disabled for the field. More specifically, the _Auto-Doc_ checkbox controls whether or not the field's _Documentation_ \(visible in the _Documentation Editor_\) should be automatically generated after every Field Attribute update.

This is important, because if you enable the Auto-Doc feature for a field, any custom documentation that you enter will automatically be overwritten on each Field Attribute update. As such, if you wish to add your own, custom documentation for a field, then you should disable Auto-Doc for that field.

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

## Managing Field Attributes via the Documentation Editor \(&lt;1.2.0\)

**DEPRECATED:** Management of Extended Field Information was moved to the [Sitecore Field Editor](#managing-field-attributes-120) in **Version 1.2.0**. From that version on, the _Documentation Editor_ is used only for actual documentation purposes \(optionally generated\).

In versions of SitecoreUML **prior to Version 1.2.0**, the Extended Field Information \(since renamed to "Field Attributes"\) for each field is managed via the _Documentation Editor_ that lives under the Model Explorer.

In versions prior to 1.2.0, the value of the _Documentation Editor_ field is parsed using the JavaScript `eval()` function, and the data from the resulting object is mapped to the Extended Field Information. You can manage the Extended Field Information in the _Documentation Editor_ using any JavaScript object syntax that you would like. However, if you define a function for your object, please ensure that the definition is self-executing, so that the object itself is returned.

Note that proneness to syntactical error, lacking ease of use and the vulnerability of the `eval` function just a few reasons why this implementation was changed for version 1.2.0+.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-ExtendedFieldInfo-DocumentationField.png?raw=true)

