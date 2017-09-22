# Template Folders

Sitecore's template folders and structure and organization to Sitecore template architectures. As such, template architectures created in SitecoreUML should include template folders, where necessary.

## Packages

As mentioned in the [Diagrams](/guide/diagrams.md) chapter, for those new to UML, it is important to know that, when modeling with UML, folders and namespaces are represented by “Packages”. As such, SitecoreUML requires that packages be used to represent Sitecore template folders.

Packages are represented in the diagram by a folder with the package's name. For example, the following represents a package named "Package1". 

## Adding a Template Folder

## Adding a Template Sub-Folder

Since we are all well-behaved Sitecore architects and adhere to Helix principles, there are a few things that we know about our template architecture upfront that we can start modeling.

First, the templates in all Helix solutions should live within one of three folders, representing the layer of the solution that the template belongs to: Foundation, Feature or Project.

In the Model Explorer, double-click on the Template Folders Diagram to set it as the active diagram for editing.

In the Toolbox, you should see an element, named “Package”, under the section “Packages”.  Click on “Package” and then click, on your diagram, where you like your package created. Name the package “Foundation”, and feel free to move it to wherever you would like.

Next, add two more package elements: one named “Feature” and the other named “Project”.

Break

Now that we have our basic folders created, let’s discuss the architecture that we are creating. We have been assigned to create the architecture for a very basic blog. The site will need to have generic pages, landing pages, and blog sections. Each blog section should be hierarchical, consisting of a root item, and organizing blog posts by publish date.

You don’t need to memorize these requirements, nor worry about all the details right now. For the moment, let’s just try to cover some of the basic modules and template categories \(or folders\) that we will need.

For starters, we know that our website is going to have pages. Pages live in the “Feature” layer and should belong to a “Pages” module.

Let’s create the “Pages” module as a sub-package of the Feature package.

Double-click on the Feature package and you should see a textbox, allowing you to rename the element, as well as several buttons around it. Directly to the right of the textbox is a button with an icon that looks like a folder with a lollipop coming out the top. This is the “Add Sub-Package” button. Click it to add a sub-package. Note that you can also add a sub-package manually from the Toolbox, by adding another package and linking it to the Feature package with a “Containment” element.

Double-click the new sub-package and change its name to “Pages”. You have now created your first module in SitecoreUML.

Break

Now that we’ve learned how to add sub-packages to create modules, let’s do so for the other modules that we anticipate needing.

According to our requirements, the only other thing we are going to need is a blog. As such, let’s go ahead and create a module for it.

Like the “Pages” module, the “Blog” module is a feature and should live under the Feature package. Let’s add the new sub-package and name it “Blog”.

Break

At this point, we have covered all of the requirements that we were given for the site. However, being the smart Sitecore architects that we are, we know that just about every site will have a header and a footer. While we don’t know much about the requirements for these components, right now, we can still create their templates as stubs.

Go ahead and add a new sub-package, “Navigation”, as a Feature module.

We now have the basic template folder structure created for our site. Take a look at the “Model Explorer”. Notice that your new module folders are listed as children of the Feature folder, just as they would be in the Sitecore tree.

Going forward in the walkthrough and in your subsequent architectural assignments, you should continue to use the Model Explorer as a visualization of your desired Sitecore tree architecture.

