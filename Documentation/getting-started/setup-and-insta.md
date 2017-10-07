# Installation and Setup

Use the following instructions in order to get up and running with SitecoreUML.

## Installation Steps

1. Download and install [StarUML](http://staruml.io/). Note that an evaluation of StarUML can be used and never expires. The evaluation version is the same download and has all of the same features as an unlocked version. The only difference is that you have to click an "Evaluate" button every now and then. StarUML does request that you purchase a license, if intending to use the software continuously. Again, evaluation licenses do not expire and have all of the same features as the licensed version, so feel free to try the software out and make your own decision on the licensing, based on how you plan to use it.
2. Install a new Sitecore instance or ensure that you have access to install packages on an existing instance
3. Install the latest version of the Sitecore Package from the _.\Installation\Sitecore\_Package\_ folder. Note that it is recommended that you do not install the Sitecore package on a Content Delivery \(CD\) instance. However, if you choose to do so, please delete or disable the included Sitecore patch config at the path _App\\_Config/Include/SitecoreUML/SitecoreUML.CM.config_ from your CD instance. Please, also note that the version of the Sitecore package may be a lower version than you are intending to install. The Sitecore package is only updated when changes are made to the Sitecore module, itself. 
4. Run the MSI installer, located in the _.\Installation\StarUML\_Extension_ folder, in order to install the SitecoreUML Extension for StarUML
5. Launch StarUML. If StartUML was already open, please close and reopen it.
6. In StarUML, go to _File_ &gt; _Preferences_ &gt; _Sitecore_ and provide the URL of the Sitecore instance that you want to connect to \(see [Connecting to Sitecore](/guide/connecting-to-sitecore.md) for more\). Preferences save automatically, so just close the Preferences dialog when you're done. 

Once you have completed the above steps, you will be ready to start using SitecoreUML!

