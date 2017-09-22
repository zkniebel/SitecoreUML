# The StarUML IDE

As a large portion of SItecoreUML's functionality is based on creating an architectural diagram and model in the StarUML, we must first understand the interface in which we will be working.

## About StarUML

StarUML is one of the most popular UML diagramming and modeling interfaces on the market. It differs from diagramming tools, like Microsoft Visio, because it includes full support for modeling and not just diagramming. 

_At a high-level, the difference between modeling and diagramming is that a diagram is a visual form of a model, whereas a model can include features beyond the scope of the diagram. We will further discuss the difference between diagrams and models in the chapter _[_Models vs. Diagrams. _](/guide/models-vs-diagrams.md)

Although it is not used to actually develop programs that can be compiled and executed, StarUML is used to architect programs, infrastructure, and beyond using the Unified Modeling Language \(UML\). UML is a language with the goal of providing a standard for the visualization software and other systems. As we are developing our architectures in UML using StarUML as our interface, StarUML is our Interactive Development Environment \(IDE\). 

## Extensibility

One of the best features of StarUML is the platform on which it is built. StarUML is JavaScript-based, using the Chromium framework. This makes it very straightforward to customize, debug and extend. StarUML also supports integrating with Node.js, which SitecoreUML does not make use of at present, but likely will in the future.

## Key Interface Components

When creating and editing UML diagrams and models within StarUML, the majority of your time will be spent working with the following three components of the interface:

1. On the left, we have our “Toolbox”, from which we choose what elements we wish to add to our diagrams. 
2. In the center, we have our diagram window, where we can edit our diagrams. 
3. On the right, we have our “Model Explorer”, where we can view the different pieces that make up our modeling project, as well as the hierarchy in which they live. 

![](https://github.com/zkniebel/SitecoreUML/blob/master/assets/StarUML-IDE.png?raw=true)



