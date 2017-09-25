# Models vs Diagrams

_**Attention: If you have not yet read the section **_[_**Models vs Diagrams**_](/guide/creating-a-project.md#models-vs-diagrams)_** from the **_[_**Projects**_](/guide/creating-a-project.md)_** chapter then it is advised that you do so before proceeding with this chapter**_

There are several key concepts to understand Models vs Diagrams in UML and StarUML, before you begin to manipulate tree hierarchies.

_**Caution: it is highly recommended that you understand the concepts outlined in **_[_**Template Containment**_](/guide/template-containment.md)_** and in this chapter, before attempting to manipulate tree hierarchies. If you are new to UML, please read this before continuing, to ensure that you do not have an unexpected results.**_** **

### Models vs Diagrams

It has been mentioned several times already, but models are not diagrams. In this section, we are going to see some of the proof of this statement, by induction.

Consider the example from the [Template Containment](/guide/template-containment.md) chapter, depicting the template hierarchy for the "BasePage" template \(image repeated, below\):

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-TreeHierarchy-OneDiagramWithHierarchy.png?raw=true)

Consider what would happen if I were to delete the view for the Containment that joins the "BasePage" template to its parent "Pages" template folder. If the diagram and the model are the same, then the "BasePage" template will be "un-nested" from the "Pages" folder and would once again nest under the "Model" element.

Have a look at the following image, which shows the _actual_ result of this test:

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-TreeHierarchy-ModelProof.png?raw=true)

Notice that the "BasePage" template remains a child of the "Pages" folder. No, this isn't a bug in StarUML - it would only be a bug if drawing a new Containment from "BasePage" to "Feature" didn't cause the "BasePage" template to nest under feature \(which it does, and you can try on your own\). The reason why this happens is because **the Model Explorer is effectively a diagram.** _Did I just blow your mind?_** **

**Because the model explorer can still depict the parent-child relationship between "BasePage" and "Pages", removing the Containment doesn't actually remove the relationship.**

This is one of the subtleties of StarUML that I am a big fan of and which I feel really identify their development team's attention to detail. Unfortunately, it also happens to be a trap that many who are new to UML can easily fall into. In the [Projects](/guide/creating-a-project.md) chapter, I suggested another experiment that you can do on your own that similarly proves this same point: add a bunch of random elements to your diagrams and then start deleting them. Then, look to see what happened to the deleted diagrams in your Model Explorer.

Make sure that you are familiar with this before manipulating tree hierarchies, and always ask yourself _Is there another diagram that will continue showing this relationship after I delete it_, whenever you delete a Containment or an element.

