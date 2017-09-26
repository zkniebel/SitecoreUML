# Projects

The first step, whether creating a new architecture in StarUML from scratch, or generating one from an existing solution is to create a new or open an existing project.

## Creating a New Project

Creating a new project is pretty straightforward. Simply open the StarUML IDE and go to _File _&gt; _New_, or use the shortcut _Ctrl+N_.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-NewProject.png?raw=true)

## Introduction to the StarUML Data Model

UML refers to all of the components of its data model as "things". However, since we are learning about the StarUML data model, I will be referring to all of its components as "entities" or "elements".

The first thing that everyone learning StarUML should know about the data model is that every entity, including the project, itself, is an element of the data model. StarUML's data model is somewhat similar to Sitecore in this way, in that in Sitecore everything is an item.

I find it to be best received when I introduce StarUML's data model by example. The following sections introduce the StarUML data model by analyzing a new project. If you wish to follow along, go ahead and create a new project

### Project Elements

With a new project created, some new entities will display in the “Model Explorer”. The first is a multi-colored cube, named “Untitled,” that lives at the top of the hierarchy. This element actually represents the project, as a whole. Similar to the _/sitecore_ node in Sitecore's content tree, the project element is an item that serves as the root of the entire solution.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-DataModel-Project.png?raw=true)

### Model Elements

Beneath the project entity, there is an element represented by a folder with a triangle on it, labeled “Model”. This element represents a model that is a part of the project. You can have as many models in a project as you want. In our SitecoreUML architectures, it is recommended that you have one model element for each set of diagrams.

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-DataModel-Model.png?raw=true)

### Diagram Elements

If you expand the model element node, you will find that StarUML also automatically adds a diagram element, named “Main.” The diagram in the green icon next to the element tells us that "Main" is a class diagram.

If you ever forget which type of diagram you are looking at, you can always compare the symbol to the list of available diagram symbols by right-clicking on a model or project element, and hovering over the “Add Diagram” option. If you are new to UML, don’t worry about familiarizing yourself with all of the different types of diagrams. There are over a dozen and you really only need to know two of them for SitecoreUML: the _Package Diagram_ and the _Class Diagram_.

## Models vs Diagrams

There is a difference between _models_ and _diagrams_. [StarUML's documentation](http://docs.staruml.io/en/latest/basic-concepts.html#model-vs-diagram) includes a decent summary of the difference between the two, as copied, below:

> _Model_ or _software model_ is a description of any aspect of a software system such as structure, behavior, requirement, and so on. A software model can be represented in textual, mathmatical or visual form. A _Model element_ is a building block of a software model.
>
> A _Diagram _is a visual geometric symbolic representation of a software model. A software model can be represented in one or more diagrams with different aspects. For example, a diagram can focus on class hierarchical structure while another diagram can focus on interaction between objects. Diagrams consists of_ view elements_, which are visual representations of a _model element_.

Effectively, this means two things:

1. A _diagram_ is a _model_ but a _model_ is not a _diagram_
2. A _model_ can be represented in a multitude of different ways. 

If you would like to experiment with this concept on your own, open up StarUML and begin adding some element and relationships to your diagrams \(instructions for doing so can be found in the chapters on [Diagrams](/guide/diagrams.md), [Template Folders](/guide/template-folders.md), [Templates](/guide/templates.md), and [Template Inheritance](/guide/template-inheritance.md)\).  Once you have added a few elements, start clicking on them in the diagram and delete them. When you're done, have a look at the Model Explorer and note that all of your elements are still there. The only ones will disappear are the non-parent-child relationships \(associations, generalizations, realizations, containments, etc.\), because they have no formal way of appearing in the tree and are thus deleted with their respective _Views _\(or visual representations on the diagram; see [Views](/guide/diagrams.md#views)\).

