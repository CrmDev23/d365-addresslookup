using Mat;
using Mat.Plugins;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.PackageDeployment.CrmPackageExtentionBase;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;

namespace SwissAddressPackage
{
    public static class ImportZipFileHelper
    {
        private const string SwissAddressMatcher = "SwissAddressMatcher";
        public const int NrOfImportChunks = 5;
        public const int DeletionScheduleInHours = 1;

        public static void SubmitImportRecords(IOrganizationService serviceProxy, Guid userId, string base64String, TraceLogger traceLogger)
        {
            string currentUserEmail = GetCurrentUserEmail(serviceProxy, userId);
            var recordTypes = Enum.GetValues(typeof(RecordType)).Cast<RecordType>();
            string timeStamp = DateTime.Now.ToString("yyMMddHHmmss");
            ConfigurationHelper.SetConfigurationValue(serviceProxy, mat_config.Fields.mat_importcounter, 0);
            foreach (var recordType in recordTypes)
            {
                if (recordType != RecordType.None)
                {
                    Guid importMapId = CreateMapping(serviceProxy, traceLogger, recordType, timeStamp);
                    List<string> csvContentChunks = GetCsvContentInChunks(base64String, recordType, timeStamp, NrOfImportChunks);
                    foreach (var csvContentChunk in csvContentChunks)
                    {
                        int sequenceNumberJob = GetCurrentImportSequenceNumber(serviceProxy);
                        ConfigurationHelper.SetConfigurationValue(serviceProxy, $"mat_{recordType.ToString().ToLower()}importsequencenumber_next", sequenceNumberJob);
                        Import import = new Import()
                        {
                            ModeCode = new OptionSetValue((int)Import_ModeCode.Create),
                            Name = SwissAddressMatcher + $"Import {recordType.ToString() + timeStamp}, {sequenceNumberJob}",
                            SendNotification = true,
                            EMailAddress = currentUserEmail
                        };
                        traceLogger.Log($"{nameof(SubmitImportRecords)} pre create import.");
                        Guid importId = serviceProxy.Create(import); // current import number incremented
                        traceLogger.Log($"{nameof(SubmitImportRecords)} post create immport.");

                        ImportFile importFile = new ImportFile()
                        {
                            Content = csvContentChunk,
                            Name = SwissAddressMatcher + $"Import {recordType.ToString() + timeStamp}, {sequenceNumberJob}",
                            IsFirstRowHeader = true,
                            ImportMapId = new EntityReference(ImportMap.EntityLogicalName, importMapId),
                            UseSystemMap = false,
                            Source = SwissAddressMatcher + $"Import{recordType.ToString()}.csv",
                            SourceEntityName = $"{recordType.ToString()}",
                            TargetEntityName = $"mat_{recordType.ToString().ToLower()}",
                            ImportId = new EntityReference(Import.EntityLogicalName, importId),
                            EnableDuplicateDetection = false,
                            FieldDelimiterCode =
            new OptionSetValue((int)ImportFile_FieldDelimiterCode.Semicolon),
                            DataDelimiterCode =
            new OptionSetValue((int)ImportFile_DataDelimiterCode.DoubleQuote),
                            ProcessCode =
            new OptionSetValue((int)ImportFile_ProcessCode.Process),
                        };

                        importFile.RecordsOwnerId =
        new EntityReference(SystemUser.EntityLogicalName, userId);


                        traceLogger.Log($"{nameof(SubmitImportRecords)} pre create import file.");
                        Guid importFileId = serviceProxy.Create(importFile);
                        traceLogger.Log($"{nameof(SubmitImportRecords)} post create immport file.");
                    }
                }
            }
        }

        private static Guid CreateMapping(IOrganizationService serviceProxy, TraceLogger traceLogger, RecordType recordType, string timeStamp)
        {
            ImportMap importMap = new ImportMap()
            {
                Name = $"Import Map {SwissAddressMatcher}  {recordType.ToString()}, {timeStamp}",
                Source = $"Import {SwissAddressMatcher}  {recordType.ToString()}.csv",
                Description = $"Importer {SwissAddressMatcher}  {recordType.ToString()}",
                EntitiesPerFile =
                new OptionSetValue((int)ImportMap_EntitiesPerFile.MultipleEntitiesPerFile),
                EntityState = EntityState.Created,
            };
            traceLogger.Log($"{nameof(SubmitImportRecords)} pre create import map.");
            Guid importMapId = serviceProxy.Create(importMap);
            traceLogger.Log($"{nameof(SubmitImportRecords)} post create immport map.");
            switch (recordType)
            {
                case RecordType.PLZ:
                    #region Column plzOnrp Mappings
                    ColumnMapping plzOnrp = new ColumnMapping()
                    {
                        SourceAttributeName = "PLZ_ONRP",
                        SourceEntityName = "PLZ",

                        TargetAttributeName = mat_plz.Fields.mat_plz_onrp,
                        TargetEntityName = mat_plz.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(plzOnrp);
                    #endregion

                    #region Column plzPostleitzahl Mappings
                    ColumnMapping plzPostleitzahl = new ColumnMapping()
                    {
                        SourceAttributeName = "PLZ_POSTLEITZAHL",
                        SourceEntityName = "PLZ",

                        TargetAttributeName = mat_plz.Fields.mat_plz_postleitzahl,
                        TargetEntityName = mat_plz.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(plzPostleitzahl);
                    #endregion

                    #region Column plzOrtbez27 Mappings
                    ColumnMapping plzOrtbez27 = new ColumnMapping()
                    {
                        SourceAttributeName = "PLZ_ORTBEZ27",
                        SourceEntityName = "PLZ",

                        TargetAttributeName = mat_plz.Fields.mat_plz_ortbez27,
                        TargetEntityName = mat_plz.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(plzOrtbez27);
                    #endregion

                    #region Column plzKanton Mappings
                    ColumnMapping plzKanton = new ColumnMapping()
                    {
                        SourceAttributeName = "PLZ_KANTON",
                        SourceEntityName = "PLZ",

                        TargetAttributeName = mat_plz.Fields.mat_plz_kanton,
                        TargetEntityName = mat_plz.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(plzKanton);
                    #endregion

                    #region Column plzTyp Mappings
                    ColumnMapping plzTyp = new ColumnMapping()
                    {
                        SourceAttributeName = "PLZ_TYP",
                        SourceEntityName = "PLZ",

                        TargetAttributeName = mat_plz.Fields.mat_plz_typ,
                        TargetEntityName = mat_plz.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(plzTyp);
                    #endregion
                    break;
                case RecordType.STR:
                    #region Column plzOnrp Mappings
                    ColumnMapping strPlzOnrp = new ColumnMapping()
                    {
                        SourceAttributeName = "PLZ_ONRP",
                        SourceEntityName = "PLZ",

                        TargetAttributeName = mat_plz.Fields.mat_plz_onrp,
                        TargetEntityName = mat_plz.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(strPlzOnrp);
                    #endregion

                    #region Column strStrId Mappings
                    ColumnMapping strStrId = new ColumnMapping()
                    {
                        SourceAttributeName = "STR_STRID",
                        SourceEntityName = "STR",

                        TargetAttributeName = mat_str.Fields.mat_str_strid,
                        TargetEntityName = mat_str.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(strStrId);
                    #endregion

                    #region Column plzId Mappings
                    ColumnMapping plzId = new ColumnMapping()
                    {
                        SourceAttributeName = "STR_ONRP",
                        SourceEntityName = "STR",

                        TargetAttributeName = mat_str.Fields.mat_plzId,
                        TargetEntityName = mat_str.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    Guid plzIdMappingId = serviceProxy.Create(plzId);

                    LookUpMapping plzIdParent = new LookUpMapping()
                    {
                        ColumnMappingId =
                new EntityReference(ColumnMapping.EntityLogicalName, plzIdMappingId),

                        ProcessCode =
                new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpEntityName = mat_plz.EntityLogicalName,
                        LookUpAttributeName = mat_plz.Fields.mat_plz_onrp,
                        LookUpSourceCode =
                new OptionSetValue((int)LookUpMapping_LookUpSourceCode.System)
                    };

                    serviceProxy.Create(plzIdParent);

                    LookUpMapping plzIdLookup = new LookUpMapping()
                    {
                        ColumnMappingId =
        new EntityReference(ColumnMapping.EntityLogicalName, plzIdMappingId),

                        ProcessCode =
        new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpAttributeName = "PLZ_ONRP",
                        LookUpEntityName = "PLZ",
                        LookUpSourceCode =
        new OptionSetValue((int)LookUpMapping_LookUpSourceCode.Source)
                    };

                    serviceProxy.Create(plzIdLookup);
                    #endregion

                    #region Column strStrbez2l Mappings
                    ColumnMapping strStrbezk = new ColumnMapping()
                    {
                        SourceAttributeName = "STR_STRBEZ2L",
                        SourceEntityName = "STR",

                        TargetAttributeName = mat_str.Fields.mat_str_strbez2l,
                        TargetEntityName = mat_str.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(strStrbezk);
                    #endregion

                    #region Column strGebHnr Mappings
                    ColumnMapping strGebHnr = new ColumnMapping()
                    {
                        SourceAttributeName = "STR_GEBHNR",
                        SourceEntityName = "STR",

                        TargetAttributeName = mat_str.Fields.mat_geb_hnr,
                        TargetEntityName = mat_str.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(strGebHnr);
                    #endregion

                    #region Column mat_str_fachonrp Mappings
                    ColumnMapping mat_str_fachonrp = new ColumnMapping()
                    {
                        SourceAttributeName = "STR_FACHONRP",
                        SourceEntityName = "STR",

                        TargetAttributeName = mat_str.Fields.mat_str_fachonrp,
                        TargetEntityName = mat_str.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    Guid fachonrpMappingId = serviceProxy.Create(mat_str_fachonrp);

                    LookUpMapping fachonrpParent = new LookUpMapping()
                    {
                        ColumnMappingId =
                new EntityReference(ColumnMapping.EntityLogicalName, fachonrpMappingId),

                        ProcessCode =
                new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpEntityName = mat_plz.EntityLogicalName,
                        LookUpAttributeName = mat_plz.Fields.mat_plz_onrp,
                        LookUpSourceCode =
                new OptionSetValue((int)LookUpMapping_LookUpSourceCode.System)
                    };

                    serviceProxy.Create(fachonrpParent);

                    LookUpMapping fachonrpLookup = new LookUpMapping()
                    {
                        ColumnMappingId =
        new EntityReference(ColumnMapping.EntityLogicalName, fachonrpMappingId),

                        ProcessCode =
        new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpAttributeName = "PLZ_ONRP",
                        LookUpEntityName = "PLZ",
                        LookUpSourceCode =
        new OptionSetValue((int)LookUpMapping_LookUpSourceCode.Source)
                    };

                    serviceProxy.Create(fachonrpLookup);
                    #endregion
                    break;
                case RecordType.GEB:
                    #region Column strStrId Mappings
                    ColumnMapping gebStrStrId = new ColumnMapping()
                    {
                        SourceAttributeName = "STR_STRID",
                        SourceEntityName = "STR",

                        TargetAttributeName = mat_str.Fields.mat_str_strid,
                        TargetEntityName = mat_str.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(gebStrStrId);
                    #endregion

                    #region Column gebHauskey Mappings
                    ColumnMapping gebHauskey = new ColumnMapping()
                    {
                        SourceAttributeName = "GEB_HAUSKEY",
                        SourceEntityName = "GEB",

                        TargetAttributeName = mat_geb.Fields.mat_geb_hauskey,
                        TargetEntityName = mat_geb.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(gebHauskey);
                    #endregion

                    #region Column strId Mappings
                    ColumnMapping strId = new ColumnMapping()
                    {
                        SourceAttributeName = "GEB_STRID",
                        SourceEntityName = "GEB",

                        TargetAttributeName = mat_geb.Fields.mat_strId,
                        TargetEntityName = mat_geb.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    Guid strIdMappingId = serviceProxy.Create(strId);

                    LookUpMapping strIdParent = new LookUpMapping()
                    {
                        ColumnMappingId =
                new EntityReference(ColumnMapping.EntityLogicalName, strIdMappingId),

                        ProcessCode =
                new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpEntityName = mat_str.EntityLogicalName,
                        LookUpAttributeName = mat_str.Fields.mat_str_strid,
                        LookUpSourceCode =
                new OptionSetValue((int)LookUpMapping_LookUpSourceCode.System)
                    };

                    serviceProxy.Create(strIdParent);

                    LookUpMapping strIdLookup = new LookUpMapping()
                    {
                        ColumnMappingId =
        new EntityReference(ColumnMapping.EntityLogicalName, strIdMappingId),

                        ProcessCode =
        new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpAttributeName = "STR_STRID",
                        LookUpEntityName = "STR",
                        LookUpSourceCode =
        new OptionSetValue((int)LookUpMapping_LookUpSourceCode.Source)
                    };

                    serviceProxy.Create(strIdLookup);
                    #endregion

                    #region Column mat_geb_fachonrp Mappings
                    ColumnMapping mat_geb_fachonrp = new ColumnMapping()
                    {
                        SourceAttributeName = "GEB_FACHONRP",
                        SourceEntityName = "GEB",

                        TargetAttributeName = mat_geb.Fields.mat_geb_fachonrp,
                        TargetEntityName = mat_geb.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    Guid gebFachonrpMappingId = serviceProxy.Create(mat_geb_fachonrp);

                    LookUpMapping gebFachonrpParent = new LookUpMapping()
                    {
                        ColumnMappingId =
                new EntityReference(ColumnMapping.EntityLogicalName, gebFachonrpMappingId),

                        ProcessCode =
                new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpEntityName = mat_plz.EntityLogicalName,
                        LookUpAttributeName = mat_plz.Fields.mat_plz_onrp,
                        LookUpSourceCode =
                new OptionSetValue((int)LookUpMapping_LookUpSourceCode.System)
                    };

                    serviceProxy.Create(gebFachonrpParent);

                    LookUpMapping gebFachonrpLookup = new LookUpMapping()
                    {
                        ColumnMappingId =
        new EntityReference(ColumnMapping.EntityLogicalName, gebFachonrpMappingId),

                        ProcessCode =
        new OptionSetValue((int)LookUpMapping_ProcessCode.Process),

                        LookUpAttributeName = "PLZ_ONRP",
                        LookUpEntityName = "PLZ",
                        LookUpSourceCode =
        new OptionSetValue((int)LookUpMapping_LookUpSourceCode.Source)
                    };

                    serviceProxy.Create(gebFachonrpLookup);
                    #endregion

                    #region Column gebHnr Mappings
                    ColumnMapping gebHnr = new ColumnMapping()
                    {
                        SourceAttributeName = "GEB_HNR",
                        SourceEntityName = "GEB",

                        TargetAttributeName = mat_geb.Fields.mat_geb_hnr,
                        TargetEntityName = mat_geb.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(gebHnr);
                    #endregion

                    #region Column gebHnra Mappings
                    ColumnMapping gebHnra = new ColumnMapping()
                    {
                        SourceAttributeName = "GEB_HNRA",
                        SourceEntityName = "GEB",

                        TargetAttributeName = mat_geb.Fields.mat_geb_hnra,
                        TargetEntityName = mat_geb.EntityLogicalName,

                        ImportMapId =
                new EntityReference(ImportMap.EntityLogicalName, importMapId),

                        ProcessCode =
                new OptionSetValue((int)ColumnMapping_ProcessCode.Process)
                    };

                    serviceProxy.Create(gebHnra);
                    #endregion
                    break;
            }
            return importMapId;
        }

        public static void StartSingleBulkDeleteJob(IOrganizationService serviceProxy, RecordType type, Guid userId, TraceLogger traceLogger)
        {
            int sequenceNumber = GetCurrentImportSequenceNumber(serviceProxy);

            var deleteFilter = new FilterExpression();
            deleteFilter.AddCondition(new ConditionExpression("importsequencenumber", ConditionOperator.LessThan, sequenceNumber));
            var bulkDeleteQuery = new QueryExpression
            {
                EntityName = $"mat_{type.ToString().ToLower()}",
                Distinct = false,
                Criteria = deleteFilter
            };
            var bulkDeleteRequest = new BulkDeleteRequest
            {
                JobName = SwissAddressMatcher + $"BulkDelete{type.ToString()}, {sequenceNumber}",
                QuerySet = new[] { bulkDeleteQuery },
                StartDateTime = DateTime.Now.AddHours(DeletionScheduleInHours),
                ToRecipients = new[] { userId },
                CCRecipients = new Guid[] { },
                SendEmailNotification = false,
                RecurrencePattern = String.Empty
            };

            traceLogger.Log($"{nameof(StartSingleBulkDeleteJob)} pre create bulk delete job with user id {userId} and mail {GetCurrentUserEmail(serviceProxy, userId)}.");
            var bulkDeleteResponse =
                (BulkDeleteResponse)serviceProxy.Execute(bulkDeleteRequest);
            traceLogger.Log($"{nameof(StartSingleBulkDeleteJob)} post create bulk delete job. Result response {bulkDeleteResponse}.");
        }

        public static void ScheduleBulkDeleteAsyncOperations(IOrganizationService serviceProxy, Guid userId, TraceLogger traceLogger)
        {
            string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var deleteFilter = new FilterExpression();
            deleteFilter.AddCondition(new ConditionExpression(AsyncOperation.Fields.OperationType, ConditionOperator.Equal, AsyncOperation_OperationType.Import));
            var bulkDeleteQuery = new QueryExpression
            {
                EntityName = AsyncOperation.EntityLogicalName,
                Distinct = false,
                Criteria = new FilterExpression()
                {
                    Conditions =
                        {
                            new ConditionExpression(AsyncOperation.Fields.StatusCode, ConditionOperator.Equal, 30),
                            new ConditionExpression(AsyncOperation.Fields.Name, ConditionOperator.BeginsWith, SwissAddressMatcher)
                        }
                },
            };
            var bulkDeleteRequest = new BulkDeleteRequest
            {
                JobName = SwissAddressMatcher + $"BulkDelete{AsyncOperation.EntityLogicalName.ToUpper()}, {timeStamp}",
                QuerySet = new[] { bulkDeleteQuery },
                StartDateTime = DateTime.Now.AddHours(DeletionScheduleInHours),
                ToRecipients = new[] { userId },
                CCRecipients = new Guid[] { },
                SendEmailNotification = false,
                RecurrencePattern = String.Empty
            };


            traceLogger.Log($"{nameof(ScheduleBulkDeleteAsyncOperations)} pre create bulk delete job with user id {userId} and mail {GetCurrentUserEmail(serviceProxy, userId)}");
            var bulkDeleteResponse =
                (BulkDeleteResponse)serviceProxy.Execute(bulkDeleteRequest);

            traceLogger.Log($"{nameof(ScheduleBulkDeleteAsyncOperations)} post create bulk delete job. Result response {bulkDeleteResponse}.");
        }

        public static void BulkDeleteImportFiles(IOrganizationService serviceProxy, Guid userId, TraceLogger traceLogger)
        {
            string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var deleteFilter = new FilterExpression();
            deleteFilter.AddCondition(new ConditionExpression(AsyncOperation.Fields.OperationType, ConditionOperator.Equal, AsyncOperation_OperationType.Import));
            var bulkDeleteQuery = new QueryExpression
            {
                EntityName = ImportFile.EntityLogicalName,
                Distinct = false,
                Criteria = new FilterExpression()
                {
                    Conditions =
                        {
                            new ConditionExpression(AsyncOperation.Fields.StatusCode, ConditionOperator.Equal, 4),
                            new ConditionExpression(AsyncOperation.Fields.Name, ConditionOperator.BeginsWith, SwissAddressMatcher + "Import")
                        }
                },
            };
            var bulkDeleteRequest = new BulkDeleteRequest
            {
                JobName = SwissAddressMatcher + $"BulkDelete{ImportFile.EntityLogicalName.ToUpper()}, {timeStamp}",
                QuerySet = new[] { bulkDeleteQuery },
                StartDateTime = DateTime.Now,
                ToRecipients = new[] { userId },
                CCRecipients = new Guid[] { },
                SendEmailNotification = false,
                RecurrencePattern = String.Empty
            };


            traceLogger.Log($"{nameof(BulkDeleteImportFiles)} pre create bulk delete job with user id {userId} and mail {GetCurrentUserEmail(serviceProxy, userId)}");
            var bulkDeleteResponse =
                (BulkDeleteResponse)serviceProxy.Execute(bulkDeleteRequest);
            traceLogger.Log($"{nameof(BulkDeleteImportFiles)} post create bulk delete job. Result response {bulkDeleteResponse}.");
        }

        public static void StartSubmitedImportJobs(IOrganizationService serviceProxy, RecordType type, TraceLogger traceLogger, string name = null)
        {
            List<Entity> jobs;
            if (name == null)
            {
                jobs = RetrieveSubmitedImortJobs(serviceProxy, traceLogger);
            }
            else
            {
                jobs = RetrieveSubmitedImortJobsByJobIndex(serviceProxy, traceLogger, name);
            }
            traceLogger.Log($"{nameof(StartSubmitedImportJobs)} post retrieve import jobs. Result count: {jobs.Count}.");
            foreach (var job in jobs)
            {
                string importName = (string)job.Attributes[Import.Fields.Name];
                switch (type)
                {
                    case RecordType.PLZ:
                        if (importName.Contains("PLZ"))
                        {
                            traceLogger.Log($"{nameof(StartSingleImportJob)} pre StartSingleImportJob. Type {type} and name {importName}.");
                            StartSingleImportJob(serviceProxy, job.Id, traceLogger);
                            traceLogger.Log($"{nameof(StartSingleImportJob)} post StartSingleImportJob. Type {type}.");
                        }
                        break;
                    case RecordType.STR:
                        if (importName.Contains("STR"))
                        {
                            traceLogger.Log($"{nameof(StartSingleImportJob)} pre StartSingleImportJob. Type {type} and name {importName}.");
                            StartSingleImportJob(serviceProxy, job.Id, traceLogger);
                            traceLogger.Log($"{nameof(StartSingleImportJob)} post StartSingleImportJob. Type {type}.");
                        }
                        break;
                    case RecordType.GEB:
                        if (importName.Contains("GEB"))
                        {
                            traceLogger.Log($"{nameof(StartSingleImportJob)} pre StartSingleImportJob. Type {type} and name {importName}.");
                            StartSingleImportJob(serviceProxy, job.Id, traceLogger);
                            traceLogger.Log($"{nameof(StartSingleImportJob)} post StartSingleImportJob. Type {type}.");
                        }
                        break;
                }
            }
        }

        private static List<Entity> RetrieveSubmitedImortJobs(IOrganizationService serviceProxy, TraceLogger traceLogger)
        {
            QueryExpression query = new QueryExpression()
            {
                TopCount = NrOfImportChunks * 3,
                EntityName = Import.EntityLogicalName,
                Criteria = new FilterExpression()
                {
                    Conditions =
                    {
                        new ConditionExpression(Import.Fields.Name, ConditionOperator.BeginsWith, SwissAddressMatcher + "Import"),
                        new ConditionExpression(Import.Fields.StatusCode, ConditionOperator.Equal, 0)
                    }
                },
                ColumnSet = new ColumnSet(Import.Fields.Name),
                Orders =
                {
                    new OrderExpression("createdon", OrderType.Descending)
                }
            };
            traceLogger.Log($"{nameof(RetrieveSubmitedImortJobs)} pre retrieve import jobs.");
            var jobs = serviceProxy.RetrieveMultiple(query).Entities.ToList();
            return jobs;
        }

        private static List<Entity> RetrieveSubmitedImortJobsByJobIndex(IOrganizationService serviceProxy, TraceLogger traceLogger, string jobName)
        {
            var jobs = new List<Entity>();
            if (jobName.Length > 43)
            {
                string jobIndex = jobName.Substring(29, 14);
                QueryExpression query = new QueryExpression()
                {
                    TopCount = NrOfImportChunks * 3,
                    EntityName = Import.EntityLogicalName,
                    Criteria = new FilterExpression()
                    {
                        Conditions =
                    {
                        new ConditionExpression(Import.Fields.Name, ConditionOperator.Like, "%" + jobIndex + "%"),
                        new ConditionExpression(Import.Fields.StatusCode, ConditionOperator.Equal, 0)
                    }
                    },
                    ColumnSet = new ColumnSet(Import.Fields.Name),
                    Orders =
                {
                    new OrderExpression("createdon", OrderType.Descending)
                }
                };
                traceLogger.Log($"{nameof(RetrieveSubmitedImortJobsByJobIndex)} pre retrieve import jobs. Job index {jobIndex}");
                jobs = serviceProxy.RetrieveMultiple(query).Entities.ToList();
            }

            return jobs;
        }

        private static void StartSingleImportJob(IOrganizationService serviceProxy, Guid importId, TraceLogger traceLogger)
        {
            ParseImportRequest parseImportRequest = new ParseImportRequest()
            {
                ImportId = importId
            };
            traceLogger.Log($"{nameof(StartSingleImportJob)} pre parseImportRequest.");
            ParseImportResponse parseImportResponse =
                (ParseImportResponse)serviceProxy.Execute(parseImportRequest);
            traceLogger.Log($"{nameof(StartSingleImportJob)} post parseImportRequest.");
            TransformImportRequest transformImportRequest = new TransformImportRequest()
            {
                ImportId = importId,
            };
            traceLogger.Log($"{nameof(StartSingleImportJob)} pre transformImportRequest.");
            TransformImportResponse transformImportResponse =
                (TransformImportResponse)serviceProxy.Execute(transformImportRequest);
            traceLogger.Log($"{nameof(StartSingleImportJob)} post transformImportRequest.");
            ImportRecordsImportRequest importRequest = new ImportRecordsImportRequest()
            {
                ImportId = importId,
            };
            traceLogger.Log($"{nameof(StartSingleImportJob)} pre importRequest.");
            ImportRecordsImportResponse importResponse =
                (ImportRecordsImportResponse)serviceProxy.Execute(importRequest);
            traceLogger.Log($"{nameof(StartSingleImportJob)} post importRequest.");
        }

        private static List<string> GetCsvContentInChunks(string base64String, RecordType recordType, string timeStamp, int chunks)
        {
            var returnValues = new List<string>();
            var plzList = new List<NEW_PLZ1>();
            var strDictionary = new Dictionary<string, NEW_STR>();
            var gebList = new List<NEW_GEB>();
            
            byte[] zipBytes = Convert.FromBase64String(base64String);
            using (var zipStream = new MemoryStream(zipBytes))
            using (var zipArchive = new ZipArchive(zipStream))
            {
                if (zipArchive.Entries.Count > 0)
                {
                    var entry = zipArchive.Entries[0];
                    using (var decompressedStream = entry.Open())
                    using (CsvFileReader reader = new CsvFileReader(decompressedStream, Encoding.GetEncoding("iso-8859-1")))
                    {
                        CsvRow row = new CsvRow();
                        while (reader.ReadRow(row))
                        {
                            var type = RecordType.None;
                            if (row[0] == "01")
                            {
                                type = RecordType.PLZ;
                            }
                            else if (row[0] == "04")
                            {
                                type = RecordType.STR;
                            }
                            else if (row[0] == "06")
                            {
                                type = RecordType.GEB;
                            }
                            else
                            {
                                continue;
                            }
                            switch (type)
                            {
                                case RecordType.PLZ:
                                    var plz = (NEW_PLZ1)GetRecord(row, RecordType.PLZ);
                                    plzList.Add(plz);
                                    break;
                                case RecordType.STR:
                                    var str = (NEW_STR)GetRecord(row, RecordType.STR);
                                    strDictionary.Add(str.STRID, str);
                                    break;
                                case RecordType.GEB:
                                    var geb = (NEW_GEB)GetRecord(row, RecordType.GEB);
                                    if (!string.IsNullOrEmpty(geb.FACHONRP))
                                    {
                                        gebList.Add(geb);
                                    }
                                    
                                    var gebStr = strDictionary[geb.STRID];
                                    gebStr.STR_GEBHNR_LIST.Add(geb);
                                    break;
                                case RecordType.None:
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }

            switch (recordType)
            {
                case RecordType.PLZ:
                    var splitedListsPlzs = Split(plzList, chunks);
                    foreach (var splitedListPlz in splitedListsPlzs)
                    {
                        using (var stream = new MemoryStream())
                        using (var reader = new StreamReader(stream))
                        using (CsvFileWriter writer = new CsvFileWriter(stream))
                        {
                            WriteHeaderRow(writer, recordType);
                            foreach (var plz in splitedListPlz)
                            {
                                CsvRow row = new CsvRow();
                                row.Add(timeStamp + "_" + plz.ONRP);
                                row.Add(plz.POSTLEITZAHL);
                                row.Add(plz.ORTBEZ27);
                                row.Add(plz.KANTON);
                                row.Add(plz.TYP);
                                writer.WriteRow(row);
                            }
                            writer.Flush();
                            stream.Position = 0;
                            returnValues.Add(reader.ReadToEnd());
                        }
                    }
                    break;
                case RecordType.STR:
                    var splitedListsStrs = Split(strDictionary.Values.ToList(), chunks);
                    foreach (var splitedListStr in splitedListsStrs)
                    {
                        using (var stream = new MemoryStream())
                        using (var reader = new StreamReader(stream))
                        using (CsvFileWriter writer = new CsvFileWriter(stream))
                        {
                            WriteHeaderRow(writer, recordType);
                            foreach (var str in splitedListStr)
                            {
                                CsvRow row = new CsvRow();
                                row.Add(timeStamp + "_" + str.ONRP);
                                row.Add(timeStamp + "_" + str.STRID);
                                row.Add(timeStamp + "_" + str.ONRP);
                                row.Add(str.STRBEZ2L);
                                if (str.FACHONRP == "")
                                    row.Add(str.FACHONRP);
                                else
                                    row.Add(timeStamp + "_" + str.FACHONRP);
                                row.Add(str.StrGebHnrList);
                                writer.WriteRow(row);
                            }
                            writer.Flush();
                            stream.Position = 0;
                            returnValues.Add(reader.ReadToEnd());
                        }
                    }
                    break;
                case RecordType.GEB:
                    var splitedListsGeb = Split(gebList, chunks);
                    foreach (var splitedListGeb in splitedListsGeb)
                    {
                        using (var stream = new MemoryStream())
                        using (var reader = new StreamReader(stream))
                        using (CsvFileWriter writer = new CsvFileWriter(stream))
                        {
                            WriteHeaderRow(writer, recordType);
                            foreach (var geb in splitedListGeb)
                            {
                                CsvRow row = new CsvRow();
                                row.Add(timeStamp + "_" + geb.STRID);
                                row.Add(geb.HAUSKEY);
                                row.Add(timeStamp + "_" + geb.STRID);
                                row.Add(geb.HNR.ToString());
                                row.Add(geb.HNRA);
                                if (geb.FACHONRP == "")
                                    row.Add(geb.FACHONRP);
                                else
                                    row.Add(timeStamp + "_" + geb.FACHONRP);
                                writer.WriteRow(row);
                            }
                            writer.Flush();
                            stream.Position = 0;
                            returnValues.Add(reader.ReadToEnd());
                        }
                    }
                    break;
            }
            return returnValues;
        }

        private static int GetCurrentImportSequenceNumber(IOrganizationService service)
        {
            int importSequenceNumber = 0;
            QueryExpression query = new QueryExpression()
            {
                EntityName = Organization.EntityLogicalName,
                ColumnSet = new ColumnSet(Organization.Fields.CurrentImportSequenceNumber),
            };
            EntityCollection response = service.RetrieveMultiple(query);
            if (response.Entities.Count > 0)
            {
                Entity organization = response.Entities[0];
                if (organization.Contains(Organization.Fields.CurrentImportSequenceNumber))
                {
                    importSequenceNumber = (int)organization[Organization.Fields.CurrentImportSequenceNumber];
                }
            }
            return importSequenceNumber;
        }

        private static CsvRow WriteHeaderRow(CsvFileWriter writer, RecordType recordType)
        {
            CsvRow row = new CsvRow();
            switch (recordType)
            {
                case RecordType.PLZ:
                    row.Add("PLZ_ONRP");
                    row.Add("PLZ_POSTLEITZAHL");
                    row.Add("PLZ_ORTBEZ27");
                    row.Add("PLZ_KANTON");
                    row.Add("PLZ_TYP");
                    break;
                case RecordType.STR:
                    row.Add("PLZ_ONRP");
                    row.Add("STR_STRID");
                    row.Add("STR_ONRP");
                    row.Add("STR_STRBEZ2L");
                    row.Add("STR_FACHONRP");
                    row.Add("STR_GEBHNR");
                    break;
                case RecordType.GEB:
                    row.Add("STR_STRID");
                    row.Add("GEB_HAUSKEY");
                    row.Add("GEB_STRID");
                    row.Add("GEB_HNR");
                    row.Add("GEB_HNRA");
                    row.Add("GEB_FACHONRP");
                    break;
            }
            writer.WriteRow(row);
            return row;
        }

        private static object GetRecord(CsvRow row, RecordType type)
        {
            var returnValue = new object();
            switch (type)
            {
                case RecordType.PLZ:
                    var plz = new NEW_PLZ1();
                    plz.ONRP = row[1];
                    plz.POSTLEITZAHL = row[4];
                    plz.ORTBEZ27 = row[8];
                    plz.KANTON = row[9];
                    plz.TYP = row[3];
                    returnValue = plz;
                    break;
                case RecordType.STR:
                    var str = new NEW_STR();
                    str.STRID = row[1];
                    str.ONRP = row[2];
                    str.STRBEZ2L = row[6];
                    str.FACHONRP = row.Count > 11 ? row[11] : "";
                    returnValue = str;
                    break;
                case RecordType.GEB:
                    var geb = new NEW_GEB();
                    geb.HAUSKEY = row[1];
                    geb.STRID = row[2];
                    geb.HNR = string.IsNullOrEmpty(row[3]) ? 0 : int.Parse(row[3]);
                    geb.HNRA = row[4];
                    geb.FACHONRP = row.Count > 7 ? row[7] : "";
                    returnValue = geb;
                    break;
            }
            return returnValue;
        }

        private static string GetCurrentUserEmail(IOrganizationService serviceProxy, Guid userId)
        {
            string email = "test@test.ch";
            Entity currentUser =
             serviceProxy.Retrieve(SystemUser.EntityLogicalName, userId, new ColumnSet("internalemailaddress"));
            if (currentUser.Attributes.Contains("internalemailaddress"))
            {
                email = (string)currentUser["internalemailaddress"];
            }
            return email;
        }

        public static IEnumerable<IEnumerable<T>> Split<T>(this IEnumerable<T> list, int parts)
        {
            int i = 0;
            var splits = from item in list
                         group item by i++ % parts into part
                         select part.AsEnumerable();
            return splits;
        }
    }

    public enum RecordType
    {
        PLZ,
        STR,
        GEB,
        None
    }

    public class NEW_PLZ1
    {
        public string ONRP { get; set; }
        public string POSTLEITZAHL { get; set; }
        public string ORTBEZ27 { get; set; }
        public string KANTON { get; set; }
        public string TYP { get; set; }
    }

    public class NEW_STR
    {
        private string _strGebHnrList = "";
        public string STRID { get; set; }
        public string ONRP { get; set; }
        public string STRBEZ2L { get; set; }
        public string FACHONRP { get; set; }
        public List<NEW_GEB> STR_GEBHNR_LIST { get;}
        public string StrGebHnrList
        {
            get
            {
                var STR_GEBHNR_LIST_ORDERED = STR_GEBHNR_LIST.OrderBy(g => g.HNR).ThenBy(g => g.HNRA);
                foreach (var geb in STR_GEBHNR_LIST_ORDERED)
                {
                    if (!string.IsNullOrEmpty(_strGebHnrList))
                    {
                        _strGebHnrList += ";";
                    }
                    if (string.IsNullOrEmpty(geb.HNRA))
                    {
                        _strGebHnrList += geb.HNR;
                    }
                    else
                    {
                        _strGebHnrList += geb.HNR + geb.HNRA;
                    }
                }
                return _strGebHnrList;
            }
        }

        public NEW_STR()
        {
            STR_GEBHNR_LIST = new List<NEW_GEB>();
        }
    }

    public class NEW_GEB
    {
        public string HAUSKEY { get; set; }
        public string STRID { get; set; }
        public int HNR { get; set; }
        public string HNRA { get; set; }
        public string FACHONRP { get; set; }
    }
}
