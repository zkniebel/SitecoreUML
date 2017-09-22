# Installation and Setup

This contains all of the instructions that you need in order to get up and running with SitecoreUML.

## Installation Steps

1. Download and install [StarUML](http://staruml.io/). Note that an evaluation of StarUML can be used and never expires. The evaluation version is the same download and has all of the same features as an unlocked version. The only difference is that you have to click an "Evaluate" button every now and then. StarUML does request that you purchase a license, if intending to use the software continuously. Again, evaluation licenses do not expire and have all of the same features as the licensed version, so feel free to try the software out and make your own decision on the licensing, based on how you plan to use it.
2. Install a new Sitecore instance or ensure that you have access to install packages on an existing instance
3. Install the Sitecore Package from the _.\Installation\SitecorePackage\_ folder on your Sitecore instance. Note that it is recommended that you do not install the Sitecore package on a Content Delivery \\(CD\\) instance. However, if you choose to do so, please delete or disable the included Sitecore patch config at the path _App\\_Config/Include/SitecoreUML/SitecoreUML.CM.config_ from your CD instance.
4. Copy the _.\Installation\StarUMLExtension\SitecoreUML_ folder \(the whole directory, not just its contents\) to your _%APPDATA%\StarUML\extensions\user_ folder.
5. Launch StarUML
6. In StarUML, go to _File_ &gt; _Preferences_ &gt; _Sitecore_ and provide the URL of the Sitecore instance that you want to connect to. Preferences save automatically, so just close the Preferences dialog when you're done. 

Once you have completed the above steps, you will be ready to start using SitecoreUML!

