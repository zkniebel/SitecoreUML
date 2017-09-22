# Template Folders

Sitecore's template folders and structure and organization to Sitecore template architectures. As such, template architectures created in SitecoreUML should include template folders, where necessary.

## Packages

As mentioned in the [Diagrams](/guide/diagrams.md) chapter, for those new to UML, it is important to know that, when modeling with UML, folders and namespaces are represented by “Packages”. As such, SitecoreUML requires that packages be used to represent Sitecore template folders.

Packages are represented in the diagram by a folder with the package's name. For example, the image below shows the representation of a package named "Package1" in a diagram.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-PackageDiagramElement.png?raw=true)

## Adding a Template Folder

To a template folder, a package must be added to the diagram:

1. Make sure that you have your Template Folders Diagram selected for editing, by double clicking it in the Model Explorer
2. In the Toolbox, click on "Package" \(![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-ToolboxPackage.png?raw=true)\) 
3. Click on the diagram in the location where you would like to create the package
4. Give the package a meaningful name 
5. Click away or hit _return_ when done in order to close editing mode

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-Add.png?raw=true)

## Adding a Template Sub-Folder

Creating sub-folders isn't quite as straightforward as creating a folder. In UML, the concept of a "Sub-Package" exists but it isn't a single element. Rather, a sub-package is a combination of a _Package_ and a _Containment_.

For those new to UML, a Containment is essentially a type of relationship that shows that one element contains \(or owns\) another.

There are essentially two ways to add a sub-folder in StarUML: the _easy method_, and the _manual method_.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-AddSubAdded.png?raw=true)

### The Easy Method

Adding a package the easy way avoids having to manually create the Containment yourself. To add a package the easy way, perform the following steps:

1. Double-click on the parent folder to which you want to add a new child folder ![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-AddSub.png?raw=true)
2. Click on the button immediately to the right of the package name, which looks like a folder with a lollipop coming out of the top \(![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-AddSub-Button.png?raw=true)\)
3. Rename the sub-package by double-clicking and replacing the text with the desired name

### The Manual Method

Every now and then, you might add a package to the wrong parent. You don't have to delete the package and start over. This is where the manual method comes in. To add a package using the manual method, perform the following steps:

1. Add the new child to the diagram following the same steps as you did for [Adding a Template Folder](#adding-a-template-folder)
2. In the Toolbox, under "Packages", click the "Containment" element \(![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-Packages-ToolboxContainment.png?raw=true)\)
3. On the diagram, click and drag from the new child package up to the parent package to add the Containment



