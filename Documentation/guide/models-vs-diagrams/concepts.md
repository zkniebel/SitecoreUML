# Concepts

There are several key concepts to understand regarding parent-child relationships and Models vs Diagrams in UML, before you begin to manipulate tree hierarchies.

_**Caution: it is highly recommended that you understand the concepts in this section before attempting to manipulate tree hierarchies. If you are new to UML, please read this before continuing, to ensure that you do not have an unexpected results.**_** **

## Template Containment

Whenever you add a template to your diagram and inspect the resulting element in the Model Explorer, you will find that your template was automatically added as a child of the Model to which its diagram belongs \(or the Project, if there is no model\). Oddly enough, however, when you add a template folder as a sub-package of another template folder the child element in the Model Explorer is properly nested under its parent.The reason this happens is because of the _Containment _\(see [Template Folders](/guide/template-folders.md)\) relationship.

Recall that a Containment represents the ownership of one element over another. This means that when we add a Containment, we are effectively adding a parent-child relationship. In the [Template Folders](/guide/template-folders.md) chapter, we discussed two ways to add a Containment, visually. Applying the material from that chapter, it should be logical that the scenario in the image below is valid and would work properly with SitecoreUML_ _\(note that this is an example for demonstrative purposes; SitecoreUML still recommends that you separate your templates and template folders\):

![](/assets/StarUML-TreeHierarchy-OneDiagramWithHierarchy.png)

The above image depicts a \(Helix-compliant \*wink\*\) template hierarchy, in which the root folder, "Feature", contains a sub-folder, "Pages", that contains a template, "BasePage". If you look at the tree hierarchy depicted in the Model Explorer to the right, you can see that the "BasePage" template is correctly nested under the "Pages" folder, and so on.

### Models vs Diagrams

It has been mentioned several times already, but models are not diagrams. In this section, we are going to see some of the proof of this statement, by induction.

Consider the example from the above image, depicting the template hierarchy for the "BasePage" template. Assume that I were to delete the view for the Containment that joins the "BasePage" template to its parent "Pages" template folder. If the diagram and the model are the same, then the "BasePage" template will be un-nested from the "Pages" folder and would once again nest under the "Model" element. Have a look at the following image, which shows the actual result of this test:

![](/assets/StarUML-TreeHierarchy-ModelProof.png)

Notice that the "BasePage" template remains a child of the "Pages" folder. No, this isn't a bug in StarUML - it would only be a bug if drawing a new Containment from "BasePage" to "Feature" didn't cause the "BasePage" template to nest under feature \(which it does, and you can try on your own\). The reason why this happens is because **the Model Explorer is effectively a diagram.** _Did I just blow your mind?_** **

Because the model explorer can still depict the parent-child relationship between "BasePage" and "Pages", removing the Containment doesn't actually remove the relationship.

This is one of the subtleties of StarUML that I am a big fan of and which I feel really identify their development team's attention to detail. Unfortunately, it also happens to be a trap that many who are new to UML can easily fall into. In the [Projects](/guide/creating-a-project.md) chapter, I suggested another experiment that you can do on your own that similarly proves this same point: add a bunch of random elements to your diagrams and then start deleting them. Then, look to see what happened to the deleted diagrams in your Model Explorer.

Make sure that you are familiar with this before manipulating tree hierarchies, and always ask yourself _Is there another diagram that will continue showing this relationship after I delete it_, whenever you delete a Containment or an element.

