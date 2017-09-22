# Template Inheritance

Sitecore's template inheritance is a powerful feature, but not the most visible when looking at Sitecore. It can be tedious to record inheritance when creating a template architecture, so being able to visualize these relationships is a key feature of SitecoreUML.

## Adding an Inheriting Template

Creating a template that inherits another is similar to [Adding a Template Sub-Folder](/adding-a-template-sub-folder). In UML, the concept of a "Sub-Interface" exists, but it isn't a single element. Rather, a sub-interface is a combination of an _Interface_ and a _Generalization_.

For those new to UML, a Generalization is essentially a type of relationship that shows one interface inheriting \(or generalizing\) another. UML uses the term "generalization" to differentiate between an interface inheriting another and an element \(e.g. class\) that _implements_ \(or "realizes", as it's referred to in UML\) an interface.

As with adding child template folders, there are essentially two ways to add an inheriting interface, in StarUML: the _easy method_, and the _manual method_.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-InheritanceAdded.png?raw=true)

### The Easy Method

Adding an inheriting template the easy way avoids having to manually create the Generalization yourself. To add an inheriting template the easy way, perform the following steps:

1. Double-click on the base template for which you want to add a new inheriting template ![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-InheritanceAdd.png?raw=true)
2. In the set of buttons to the right of the template name, click on the _Add Sub-Package_ button, located to the bottom-left and which looks like a circle with an arrow coming out of the top \(![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-InheritanceAdd-Button.png?raw=true)\)
3. Rename the inheriting template by double-clicking and replacing the text with the desired name

### The Manual Method

To add an inheriting template manually, perform the following steps:

1. Add the new template to the diagram, following the same steps as you did for [Adding a Template](/guide/templates.md#adding-a-template)
2. Refer to the [Adding a Base Template to an Existing Template](#adding-a-base-template-to-an-existing-template) section for instructions on how to manually add one template as the base template of another

## Adding a Base Template to an Existing Template

In Sitecore, you can add any number of base templates to a single template. Using the _Add Sub-Interface_ button, you can add as many templates that inherit from a single template as you would like. However, if you want to add one or more base templates to an existing template then you will have to do so manually, via the following steps:

1. In the Toolbox, under "Classes \(Basic\)" click the "Generalization" element \(![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-ToolboxGeneralization.png?raw=true)\)
2. On the diagram, click and drag from the inheriting template up to the base template to add the Generalization. Note that you do not need to specify a name for the generalization that you added.



