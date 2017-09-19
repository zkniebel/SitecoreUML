using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Shell.Framework.Commands;

namespace ZacharyKniebel.Feature.SitecoreUML.Shell.Framework.Commands
{
    public class ExportTemplates : Command
    {
        public override void Execute(CommandContext context)
        {
            // TODO: implement

            Sitecore.Context.ClientPage.ClientResponse.Alert("Export not yet implemented");
        }
    }
}