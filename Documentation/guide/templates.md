# Templates

Without templates, Sitecore template architecture...isn't.

When considering object-oriented languages, in general, which UML Class Diagrams are specifically designed to represent, there are three basic constructs that are most commonly used to represent an object:

* Interfaces
* Classes
* Instances

Instances aren't a tenable option for representing Sitecore templates, as they are more analogous to content items, or implementors of the templates. Classes are a viable option where instances fall short, but class-to-class inheritance is far more limited than Sitecore’s template inheritance, which allows for templates to inherit any number of base templates. As such, given that Interfaces do not have this limitation, it is logical that SitecoreUML requires that all Sitecore templates be UML Interfaces.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-Interface.png?raw=true)

## Adding a Template

To add a template, perform the following steps:

1. Make sure that you have your Templates Diagram selected for editing, by double clicking it in the Model Explorer
2. In the Toolbox, under “Classes \(Basic\)”, click on “Interface” \(![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-ToolboxInterface.png?raw=true)\)
3. Click on the diagram, where you want to place the new element
4. Give the template a meaningful name 
5. Click away or hit _return_ when done in order to close editing mode

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Interfaces-Add.png?raw=true)

## Adding an Inheriting Template

Coming soon...

## Adding a Base Template to an Existing Template

Coming soon...

