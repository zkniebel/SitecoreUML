# Template Containment

As was mentioned in the [Diagrams](/guide/diagrams.md) chapter, SitecoreUML recommends but does not require that you split your templates and your template folders into separate Templates Diagrams and Template Folders Diagrams. Up until this point, the guide has assumed that you have been following SitecoreUML's recommendations, but this chapter covers the alternative approach, for those who wish to keep their templates and template folders in the same diagram.

## Understanding Parent-Child Relationships

Whenever you add a template to your diagram and inspect the resulting element in the Model Explorer, you will find that your template was automatically added as a child of the Model to which its diagram belongs \(or the Project, if there is no model\). Oddly enough, however, when you add a template folder as a sub-package of another template folder the child element in the Model Explorer is properly nested under its parent.The reason this happens is because of the _Containment _\(see [Template Folders](/guide/template-folders.md)\) relationship.

## Using Containment with Templates

Recall that a Containment represents the ownership of one element over another. This means that when we add a Containment, we are effectively adding a parent-child relationship. In the [Template Folders](/guide/template-folders.md) chapter, we discussed two ways to add a Containment, visually. Applying the material from that chapter, it should be logical that the scenario in the image below is valid and would work properly with SitecoreUML_ _\(note that this is an example for demonstrative purposes; SitecoreUML still recommends that you separate your templates and template folders\):

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-TreeHierarchy-OneDiagramWithHierarchy.png?raw=true)

The above image depicts a \(Helix-compliant \*wink\*\) template hierarchy, in which the root folder, "Feature", contains a sub-folder, "Pages", that contains a template, "BasePage". If you look at the tree hierarchy depicted in the Model Explorer to the right, you can see that the "BasePage" template is correctly nested under the "Pages" folder, and so on.

## Template Containment Restrictions

In UML, a single entity can belong to an indeterminate number of _Packages_. This means that, as far as UML and StarUML are concerned, you could add Containments from a single template to as many template folders as you want. For example, see the image, below.

![](https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/StarUML-TreeHierarchy-MultipleContainments.png?raw=true)

Obviously, this structure is untenable for Sitecore: a template cannot have multiple parent items. As such, when manually adding Containments and consolidating templates and template folders into a single diagram, be sure to not violate constraints like these.

_Note: SitecoreUML will allow scenarios, like the above, when deploying. The result will be that whichever element displays as the parent in the Model Explorer will be the parent in Sitecore._

