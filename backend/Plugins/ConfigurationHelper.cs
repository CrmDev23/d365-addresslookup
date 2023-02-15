using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace Mat.Plugins
{
    public static class ConfigurationHelper
    {
        public static void SetConfigurationValue(IOrganizationService service, string name, object value)
        {
            object configurationId = GetConfigurationValue(service, mat_config.Fields.mat_configId);
            if (configurationId == null)
            {
                Entity configuration = new Entity(mat_config.EntityLogicalName);
                configuration[name] = value;
                service.Create(configuration);
            }
            else
            {
                Entity configuration = new Entity(mat_config.EntityLogicalName, (Guid)configurationId);
                configuration[name] = value;
                service.Update(configuration);
            }
        }

        public static void MoveNextToCurrentConfiguration(IOrganizationService service, string name)
        {
            object configurationId = GetConfigurationValue(service, mat_config.Fields.mat_configId);
            object nextValue = GetConfigurationValue(service, name);
            if (nextValue != null)
            {
                Entity configuration = new Entity(mat_config.EntityLogicalName, (Guid)configurationId);
                configuration[name.TrimEnd("_next".ToCharArray())] = nextValue;
                service.Update(configuration);
            }
        }

        public static void InitiateLock(IOrganizationService service)
        {
            object configurationId = GetConfigurationValue(service, mat_config.Fields.mat_configId);
            Entity configuration = new Entity(mat_config.EntityLogicalName, (Guid)configurationId);
            configuration[mat_config.Fields.mat_name] = "lock " + DateTime.Now; ;
            service.Update(configuration);
        }

        public static void IncrementImportCounter(IOrganizationService service)
        {
            object configurationId = GetConfigurationValue(service, mat_config.Fields.mat_configId);
            object importCounterValue = GetConfigurationValue(service, mat_config.Fields.mat_importcounter);
            if (importCounterValue != null)
            {
                var importCounterIntValue = (int)importCounterValue;
                Entity configuration = new Entity(mat_config.EntityLogicalName, (Guid)configurationId);
                importCounterIntValue += 1;
                configuration[mat_config.Fields.mat_importcounter] = importCounterIntValue;
                service.Update(configuration);
            }
        }

        public static void ResetImportCounter(IOrganizationService service)
        {
            object configurationId = GetConfigurationValue(service, mat_config.Fields.mat_configId);
            Entity configuration = new Entity(mat_config.EntityLogicalName, (Guid)configurationId);
            configuration[mat_config.Fields.mat_importcounter] = 0;
            service.Update(configuration);
        }

        public static object GetConfigurationValue(IOrganizationService service, string name)
        {
            object returnValue = null;
            QueryExpression query = new QueryExpression()
            {
                EntityName = mat_config.EntityLogicalName,
                ColumnSet = new ColumnSet(name),
            };
            EntityCollection response = service.RetrieveMultiple(query);
            if (response.Entities.Count > 0)
            {
                Entity configuration = response.Entities[0];
                if (configuration.Contains(name))
                {
                    returnValue = configuration[name];
                }
            }
            return returnValue;
        }
    }
}
