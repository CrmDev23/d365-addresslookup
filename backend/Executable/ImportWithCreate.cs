using Mat.Plugins;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Tooling.Connector;
using PowerApps.Samples;
using System;
using System.IO;
using System.ServiceModel;
using System.Windows;

namespace Mat.Executable
{
    public class ImportWithCreate
    {
        static void Run(string[] args)
        {
            CrmServiceClient service = null;
            string filename = null;
            try
            {
                filename = GetZipFile(filename);
                if (filename == null)
                {
                    throw new Exception("No input file given.");
                }

                service = SampleHelpers.Connect("Connect");
                if (service.IsReady)
                {
                    IOrganizationService _serviceProxy = service.OrganizationWebProxyClient ?? (IOrganizationService)service.OrganizationServiceProxy;

                    Guid userId = GetCurrentUserId(_serviceProxy);
                    var watch = System.Diagnostics.Stopwatch.StartNew();

                    Console.WriteLine("Please wait. The process takes up to five minutes to complete.");
                    ImportZipFileHelper.StartSingleBulkDeleteJob(_serviceProxy, RecordType.GEB, userId);
                    ImportZipFileHelper.StartSingleBulkDeleteJob(_serviceProxy, RecordType.STR, userId);
                    ImportZipFileHelper.StartSingleBulkDeleteJob(_serviceProxy, RecordType.PLZ, userId);
                    ImportZipFileHelper.ScheduleBulkDeleteAsyncOperations(_serviceProxy, userId);

                    string base64 = ConvertToBase64(filename);
                    ImportZipFileHelper.SubmitImportRecords(_serviceProxy, userId, base64);
                    ImportZipFileHelper.StartSubmitedImportJobs(_serviceProxy, RecordType.PLZ);

                    watch.Stop();
                    var elapsedMs = watch.ElapsedMilliseconds;
                    TimeSpan t = TimeSpan.FromMilliseconds(elapsedMs);
                    string answer = string.Format("{0:D2}h:{1:D2}m:{2:D2}s:{3:D3}ms",
                                            t.Hours,
                                            t.Minutes,
                                            t.Seconds,
                                            t.Milliseconds);
                    Console.WriteLine($"Time elapsed: {answer}.");
                }
                else
                {
                    const string UNABLE_TO_LOGIN_ERROR = "Unable to Login to Common Data Service";
                    if (service.LastCrmError.Equals(UNABLE_TO_LOGIN_ERROR))
                    {
                        Console.WriteLine("Check the connection string values in cds/App.config.");
                        throw new Exception(service.LastCrmError);
                    }
                    else
                    {
                        throw service.LastCrmException;
                    }
                }
            }
            catch (Exception ex)
            {
                SampleHelpers.HandleException(ex);
            }

            finally
            {
                if (service != null)
                    service.Dispose();
            }

        }

        private static string GetZipFile(string filename)
        {
            MessageBox.Show("Please select address file to import.");
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog
            {
                DefaultExt = ".zip",
                Filter = "Compressed files (.zip)|*.zip"
            };
            Nullable<bool> result = dlg.ShowDialog();
            if (result == true)
            {
                filename = dlg.FileName;
            }

            return filename;
        }

        private static Guid GetCurrentUserId(IOrganizationService serviceProxy)
        {
            WhoAmIRequest systemUserRequest = new WhoAmIRequest();
            WhoAmIResponse systemUserResponse =
                (WhoAmIResponse)serviceProxy.Execute(systemUserRequest);
            return systemUserResponse.UserId;
        }

        #region Main method

        private static string ConvertToBase64(string path)
        {
            Byte[] bytes = File.ReadAllBytes(path);
            return Convert.ToBase64String(bytes);
        }
        [STAThread] // Required to support the interactive login experience
        static public void Main(string[] args)
        {
            try
            {
                var app = new ImportWithCreate();
                Run(args);
            }

            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Timestamp: {0}", ex.Detail.Timestamp);
                Console.WriteLine("Code: {0}", ex.Detail.ErrorCode);
                Console.WriteLine("Message: {0}", ex.Detail.Message);
                Console.WriteLine("Trace: {0}", ex.Detail.TraceText);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
            }
            catch (System.TimeoutException ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Message: {0}", ex.Message);
                Console.WriteLine("Stack Trace: {0}", ex.StackTrace);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.InnerException.Message ? "No Inner Fault" : ex.InnerException.Message);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine(ex.Message);

                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);

                    FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> fe = ex.InnerException
                        as FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>;
                    if (fe != null)
                    {
                        Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                        Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                        Console.WriteLine("Message: {0}", fe.Detail.Message);
                        Console.WriteLine("Trace: {0}", fe.Detail.TraceText);
                        Console.WriteLine("Inner Fault: {0}",
                            null == fe.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
                    }
                }
            }

            finally
            {
                Console.WriteLine($"Data import jobs successfully commited. Import process takes around {ImportZipFileHelper.DeletionScheduleInHours} h. Check import job status in the Data Management section under the Settings area.");
                Console.WriteLine("Press <Enter> to exit.");
                Console.ReadLine();
            }
        }
        #endregion Main method
    }
}
//</snippetImportWithCreate>