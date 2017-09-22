# Template Fields

Being able to visualize the fields that belong to the templates in an architecture diagram is paramount to the diagram's usefulness.

## UML Attributes

In Sitecore, an entity's data is stored in its fields; in C\#, an entity's data is stored in its fields and properties; and in UML, an entity's data is stored in its _Attributes_.

For those new to UML, an attribute is analogous to a data-holding member of the containing type, like a field or a property in C\#. The attribute’s text is significant, as it defines the signature of the represented field or property, including the visibility modifier and the type. Understanding attributes is pretty straightforward once you have seen them used, but there is a little memorization required for the syntax.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Attribute-Attributes.png?raw=true)

## Attribute Syntax

The following is the syntax of a UML attribute:

`+Name:Type`

There are four elements of this syntax to be mindful of:

* `+` : the visibility modifier \(e.g. `public`, `protected`, `private`, `internal`\); note that `+` means `public`, and is the default
* `Name` : the name of the attribute
* `:` : the name-type separator
* `Type` : the type of the attribute, e.g. `string`, `bool`, `MyClass`, `Single-Line Text`

### Visibility

The `+` modifier should be acknowledged but doesn't have a major affect on SitecoreUML architecture. Because all template fields in Sitecore are effectively public, SitecoreUML ignores the value that you set for the visibility modifier. It is recommended that you leave the visibility modifier set to the default, `+` meaning `public`, for sake of readability and future feature development.

Note that when you add an attribute, you can omit the visibility modifier and the the default modifier \(`+`\) will be added for you. This can help you save a little extra time while creating your architectures.

### Name

The name of the attribute is the exact name that you want to give your template field. While StarUML will allow it, you should not use any symbols or characters that are invalid in your Sitecore instance's `Settings.InvalidItemNameChars`. This applies to all name fields, but I am calling it out here, specifically, because it is easy to forget that fields are actually items.

_Note: In the current version of SitecoreUML, there is no validation against the characters in element names. Optional support for these validations is on the _[_Project Roadmap_](/chapter1.md) _to be added soon_.

_Note: In the current version, there is no support for setting the "Title" of a template field in the UML. This feature is on the _[_Project Roadmap_](/chapter1.md)_ to be added soon. _

### Name-Type Separator

The type-name separator is just that: a character \(`:`\) that separates the attributes name from its type. Note that you can pad this character with spaces on either side, at will, without affecting the end-value when the field is deployed to Sitecore.

### Type

Technically speaking, the `Type` isn't actually required in UML and you _could_ skip putting it in altogether. However, this won't work with SitecoreUML, which won't be able to map your field to a Sitecore type when you go to deploy your architecture. Any fields that have types that SitecoreUML is unable to map \(including no type at all\), will be skipped during deployment and a warning will be added to the log for it. 

Keep in mind that UML is not actually a type-safe language, in that there are no checks to ensure that you have specified a real type or not. As such, the `Type` of your attribute can include pretty much any character \(spaces, dashes, etc. are all allowed\). In the [Sitecore Config Files](/guide/sitecore-configuration.md), there is a mapping from the field type name in Sitecore to the field type name in UML. The purpose of this feature is to allow architects to further accelerate their architecture tasks by allowing them to set custom names for field types. For example, if Sitecore's`Single-Line Text` field was set to map to the UML type `SLT` then any field that the architect sets to `SLT` in their UML will become a `Single-Line Text` field when deployed to Sitecore.

_Note: the current version of SitecoreUML ships with a map that has UML field types that are slightly different from Sitecore's field type names, in that all spaces and punctuation have been removed. The original idea was that this would help architects enter their field types faster, but has proven to be confusing, based on feedback. The map will be updated to list the default Sitecore field type names before the release of the next version. You can still change the out-of-the-box values to make them simpler and quicker to type, at will \(e.g. _`Single-Line Text`_ -&gt; _`SLT`_ \)._

### Examples

The following are just a few examples of valid attribute text:

```
+MetaDescription: SingleLineText
+BrowserTitle : SingleLineText
+Navigation Title  :SingleLineNext
+Search-Result-Image:Image
```

## Adding a Template Field

To add a template field, perform the following steps:

1. Double-click on the template that you wish to add the field to ![](/assets/StarUML-Attribute-Add.png)
2. Click the _Add Attribute_ button, located immediately to the right of the interface name, which should have an icon that looks like a small rectangle at a 45-degree angle \(![](/assets/StarUML-Attribute-Add-Button.png)\)
3. Specify the text for your attribute, in the format `Name:Type`, where `Name` and `Type` are replaced with the name and the type of your new template field, respectively



