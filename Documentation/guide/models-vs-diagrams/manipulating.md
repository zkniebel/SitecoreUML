# Manipulating Hierarchies

_**Attention: If you have not yet the **_[_**Template Containment**_](/guide/template-containment.md) _**and **_[_**Models vs Diagrams**_](/guide/models-vs-diagrams/concepts.md)_** chapters then it is highly recommended that you do so before proceeding with this chapter. Understanding the difference between models and diagrams can be very important when working with tree hierarchies.**_

It is important to note that the tree hierarchy visible in the Model Explorer at any given time is an exact match to what the resulting template hierarchy would be in Sitecore, if the templates were deployed via SitecoreUML at that moment. This chapter discusses the two very simple ways to manipulate your tree hierarchies.

## Methods for Controlling Tree Hierarchy

Just like with our templates and template folders, there is an _easy_ way and a _manual_ way to manipulate your tree hierarchies.

### The Model Explorer \(Easy\)

You can control where a template lives in your tree hierarchy by simply clicking and dragging it to the desired parent, in the Model Explorer. It really is that simple.

_Even though this technique is simple, bear in mind that the cautions attached to this chapter are there for a reason. If you move the wrong thing your diagrams and your models can easily become out of sync. You need to properly understand the theory of what you're doing before you do it. _

### Templates and Template Folders in the Same Diagram \(Manual\)

_As was mentioned in the _[_Diagrams_](/guide/diagrams.md)_ chapter, SitecoreUML recommends but does not require that you split your templates and your template folders into separate Templates Diagrams and Template Folders Diagrams. This technique covers the alternative approach, though it is not what SitecoreUML recommends._

For those of you who would prefer to keep your templates and template folders in the same diagram. you can manipulate your tree by adding a Containment from your template to its desired template folder, as was done in the example shown in the chapter [Template Containment](/guide/template-containment.md).

_**IMPORTANT: if you use the following technique, it is advised that you not manipulate tree hierarchies using the click-and-drag method in the model explorer. Please, only do so if you are confident in your experience with StarUML and its data model.**_

If you wish to move a template with an existing parent to another, you must follow the steps, below:

1. Remove the Containment View from the diagram by selecting it and clicking _delete_
2. Add a new Containment from the Toolbox, from the template to its parent, as was done for template folders' containments, in the chapter [Template Folders](/guide/template-folders.md)

Be very careful manipulating tree hierarchies using this method. It is much easier for things to go wrong that will be difficult for you to identify until after you have deployed and re-imported. Again, this is not the recommended path, but it is an option for more advanced users.

