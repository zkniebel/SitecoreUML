# Projects

The first step, whether creating a new architecture in StarUML from scratch, or generating one from an existing solution is to create a new or open an existing project.

## Creating a New Project

Creating a new project is pretty straightforward. Simply open the StarUML IDE and go to _File _&gt; _New_, or use the shortcut _Ctrl+N_.

![](/assets/StarUML-NewProject.png)

## Introduction to the StarUML Data Model

UML refers to all of the components of its data model as "things". However, since we are learning about the StarUML data model, I will be referring to all of its components as "entities" or "elements".

The first thing that everyone learning StarUML should know about the data model is that every entity, including the project, itself, is an element of the data model. StarUML's data model is somewhat similar to Sitecore in this way, in that in Sitecore everything is an item.

I find it to be best received when I introduce StarUML's data model by example. The following sections introduce the StarUML data model by analyzing a new project. If you wish to follow along, go ahead and create a new project

### Project Elements

With a new project created, some new entities will display in the “Model Explorer”. The first is a multi-colored cube, named “Untitled,” that lives at the top of the hierarchy. This element actually represents the project, as a whole. Similar to the _/sitecore_ node in Sitecore's content tree, the project element is an item that serves as the root of the entire solution.

![](/assets/StarUML-DataModel-Project.png)

### Model Elements

Beneath the project entity, there is an element represented by a folder with a triangle on it, labeled “Model”. This element represents a model that is a part of the project. You can have as many models in a project as you want. In our SitecoreUML architectures, it is recommended that you have one model element for each set of diagrams.

![](/assets/StarUML-DataModel-Model.png)

### Diagram Elements

If you expand the model element node, you will find that StarUML also automatically adds a diagram element, named “Main.” The diagram in the green icon next to the element tells us that "Main" is a class diagram. 

If you ever forget which type of diagram you are looking at, you can always compare the symbol to the list of available diagram symbols by right-clicking on a model or project element, and hovering over the “Add Diagram” option. If you are new to UML, don’t worry about familiarizing yourself with all of the different types of diagrams. There are over a dozen and you really only need to know two of them for SitecoreUML: the _Package Diagram_ and the _Class Diagram_.





