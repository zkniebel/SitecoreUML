<p align="center">
<a href="https://github.com/zkniebel/SitecoreUML/">
<img src="https://github.com/zkniebel/SitecoreUML/blob/master/Documentation/assets/SitecoreUML-Logo-50x50.png?raw=true" alt="SitecoreUML" />
</a>
</p>

<h1 align="center">SitecoreUML: Visualizing Sitecore Architecture</h1>
<p align="center">
<a href="https://github.com/zkniebel/SitecoreUML/releases/latest">
<img src="https://img.shields.io/github/release/zkniebel/SitecoreUML.svg" alt="GitHub Release" />
</a>
<a href="https://github.com/zkniebel/SitecoreUML">
<img src="https://img.shields.io/github/last-commit/zkniebel/SitecoreUML.svg" alt="GitHub Last Commit" />
</a>
<a href="https://zkniebel.gitbooks.io/sitecoreuml/">
<img src="https://img.shields.io/badge/documentation-up%20to%20date-brightgreen.svg" alt="Documentation" />
</a>
<a href="https://github.com/zkniebel/SitecoreUML/blob/master/LICENSE">
<img src="https://img.shields.io/github/license/zkniebel/SitecoreUML.svg" alt="GitHub License" />
</a>
</p>

SitecoreUML is an architecture visualization tool that enables architects to one-click import existing Sitecore template architectures directly from Sitecore and generate UML diagrams from them. Additionally, SitecoreUML can be used to create new Sitecore architectures in UML and one-click deploy them to Sitecore.

You can use SitecoreUML to generate MSDN-style HTML documentation for any architecture, new or existing! Use this feature for ramping up onto projects, documenting the data model and architecture for internal or external technical teams, or even for audits and migration discovery!

## NEW - Helix Tools
With the release of version 1.3, SitecoreUML includes a new set of Helix tools for visualizing and validating template dependencies in any Helix solution!

## Getting Started

Download the [latest release](https://github.com/zkniebel/SitecoreUML/releases/latest) or checkout the [documentation](https://zkniebel.gitbooks.io/sitecoreuml/) to get started!

## Features

* One-click generate UML diagrams and models from any existing Sitecore 8/9+ instance
* One-click deploy Sitecore templates from UML diagrams directly to any Sitecore 8/9+ instance
* One-click generate UML diagrams and models from a template architecture in Sitecore
* One-click generate MSDN-style documentation from any existing Sitecore architecture that has been imported from Sitecore, or from any newly created architecture's UML
* (NEW) Generate a diagram for each Helix module that depicts the module's template architecture and its dependencies
* And much more!

## Supported Sitecore Versions
* Sitecore 8+
* Sitecore 9+

## SitecoreUML-Generated Architecture Documentation Sample

**[SitecoreUML-Generated-Documentation-for-Habitat.zip](https://github.com/zkniebel/SitecoreUML/raw/master/Documentation/assets/SitecoreUML-Generated-Docs-for-Habitat.zip)**

Be sure to check out:
* Diagrams (green icons) from the tree and/or the "All Diagrams" page (link at the top of the tree)
* Template documentation pages (yellow, pin-like icons; under the module folders and/or their sub-folders)
* Helix module-specific diagrams (green icons; one under each module)
* Dependency documentation pages (blue icons; one under each module with dependencies on another module; named "Dependencies for \_\_\_\_\_ Layer")

Using SitecoreUML, it took approximately **5 minutes to generate the Habitat documentation**. It took me another 30 minutes to push the output in source control and update the README.

I generated this documentation straight from a clean Habitat instance and did not modify the documentation in any way. However, note that the documentation is customizeable from StarUML, and will soon be customizable from Sitecore, as well!

## Project Status

The [SitecoreUML project](https://github.com/zkniebel/SitecoreUML) is actively maintained, and new features are always under development. As a general rule, documentation for any new or existing feature will be updated within two days or one patch release of the associated code changes.

Feel free to reach out to me over Sitecore Slack \(@Zachary\_Kniebel\) to get involved and to provide feedback!

## Development Strategies

The SitecoreUML is run following the agile methodology with continuous deployment, and updates are made available as soon as the tasks for each milestone (not all of which are recorded in GitHub) are completed and validated. Occasionally, updates are released weeks early, but this is subject to schedule and availability.

Before every update, all work is reviewed, and any new or updated features are thoroughly tested and documented. Each release candidate is subsequently regression tested and undergoes an install, upgrade, and uninstall test, to avoid any issues for new or existing users. Any issues discovered or reported after a release are investigated and resolved as soon as possible, and fixes are immediately released as patch releases (e.g. version _X.X.3_, where the _3_ is the patch version). Patches are not held up for new features, other fixes, or milestone completion.

As previously alluded to, each milestone is comprised of a set of tasks that must be completed for the update to be released. A high-level view of the tasks is available on the [Project Roadmap](/chapter1.md), which is updated regularly. The roadmap is meant to allow users to get an idea of which new features that are currently under development, which have already been completed and will be made available in the next update, and which were released in previous updates. Occasionally, tasks are added to or removed from milestones, based on the number of changes, relation of tasks to other tasks in the queue, etc. 

## Early Access to Features

As a general rule, I do not mark tasks as completed on the [Project Roadmap](/chapter1.md) until they are finished and developer-tested. If for any reason you need access to a feature that is marked complete but hasn't been released yet, feel free to reach out to me over Sitecore Slack (@zachary\_kniebel) and I will gladly create an _early access_ version for you.

## About the Documentation

The [documentation](https://zkniebel.gitbooks.io/sitecoreuml/) is meant to serve as a comprehensive guide to SitecoreUML, and is the primary source of the tool's documentation. In it, you can find definitions and quick references, installation and configuration instructions, information regarding syntax and data models, feature and tool usage, details on how the tool can be extended and customized, as well as walkthroughs and tutorials.

## Contributors

My name is Zachary Kniebel, and I am the creator and developer of the SitecoreUML project and the documentation. Feel free to reach out to me any time over Sitecore Community Slack \(@zachary\_kniebel\) if you have any questions, issues, or comments regarding this tool. I am always happy to help.

