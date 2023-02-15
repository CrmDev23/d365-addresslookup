using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.ServiceModel;

namespace Mat.Plugins
{
    public class ImportZipFilePlugin : IPlugin
    {
        private const string SwissAddressMatcher = "SwissAddressMatcher";

        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            if (context.InputParameters.Contains("Target"))
            {
                try
                {
                    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
                    if (context.InputParameters["Target"] is Entity && context.MessageName == "Create")
                    {
                        Entity entity = (Entity)context.InputParameters["Target"];
                        if (entity.LogicalName == "email")
                        {
                            if (entity.Attributes.Contains("regardingobjectid"))
                            {
                                EntityReference regarding = (EntityReference)entity["regardingobjectid"];
                                if (!string.IsNullOrEmpty(regarding.Name))
                                {
                                    if (regarding.Name.Contains(SwissAddressMatcher + "Import PLZ"))
                                    {
                                        if (CheckImportJobCount(service))
                                            ImportZipFileHelper.StartSubmitedImportJobs(service, RecordType.STR, tracingService, regarding.Name);
                                    }
                                    else if (regarding.Name.Contains(SwissAddressMatcher + "Import STR"))
                                    {
                                        if (CheckImportJobCount(service))
                                            ImportZipFileHelper.StartSubmitedImportJobs(service, RecordType.GEB, tracingService, regarding.Name);
                                    }
                                    else if (regarding.Name.Contains(SwissAddressMatcher + "Import GEB"))
                                    {
                                        ConfigurationHelper.InitiateLock(service);
                                        ConfigurationHelper.MoveNextToCurrentConfiguration
                                            (service, $"mat_{RecordType.PLZ.ToString().ToLower()}importsequencenumber_next");
                                        ConfigurationHelper.MoveNextToCurrentConfiguration(service, $"mat_{RecordType.STR.ToString().ToLower()}importsequencenumber_next");
                                        ConfigurationHelper.MoveNextToCurrentConfiguration(service, $"mat_{RecordType.GEB.ToString().ToLower()}importsequencenumber_next");
                                        ImportZipFileHelper.BulkDeleteImportFiles(service, context.UserId, tracingService);
                                    }
                                }
                            }
                        }
                    }
                }
                catch (FaultException<OrganizationServiceFault> ex)
                {
                    throw new InvalidPluginExecutionException($"An error occurred in the {nameof(ImportZipFilePlugin)} plug-in.", ex);
                }
                catch (Exception ex)
                {
                    tracingService.Trace($"{nameof(ImportZipFilePlugin)}: {0}", ex.ToString());
                    throw;
                }
            }
        }

        private static bool CheckImportJobCount(IOrganizationService service)
        {
            bool returnValue = false;
            ConfigurationHelper.InitiateLock(service);
            ConfigurationHelper.IncrementImportCounter(service);
            var counterObject = ConfigurationHelper.GetConfigurationValue(service, mat_config.Fields.mat_importcounter);
            if (counterObject != null)
            {
                var counterInt = (int)counterObject;
                returnValue = counterInt == ImportZipFileHelper.NrOfImportChunks;
                if (returnValue)
                {
                    ConfigurationHelper.ResetImportCounter(service);
                }
            }
            return returnValue;
        }
    }
}
