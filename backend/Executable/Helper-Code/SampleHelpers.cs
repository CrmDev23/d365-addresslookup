using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Tooling.Connector;
using PowerApps.Samples.LoginUX;
using System;
using System.Configuration;
using System.ServiceModel;

namespace PowerApps.Samples
{
    public class SampleHelpers
    {
        /// <summary>
        /// A function to manage exceptions thrown by console application samples
        /// </summary>
        /// <param name="exceptionFromSample">The exception thrown</param>
        public static void HandleException(Exception exceptionFromSample)
        {
            Console.WriteLine("The application terminated with an error.");

            try
            {
                throw exceptionFromSample;
            }
            catch (FaultException<OrganizationServiceFault> fe)
            {
                Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                Console.WriteLine("Message: {0}", fe.Detail.Message);
                Console.WriteLine("Plugin Trace: {0}", fe.Detail.TraceText);
                Console.WriteLine("Inner Fault: {0}",
                    null == fe.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
            }
            catch (TimeoutException te)
            {
                Console.WriteLine("Message: {0}", te.Message);
                Console.WriteLine("Stack Trace: {0}", te.StackTrace);
                Console.WriteLine("Inner Fault: {0}",
                    null == te.InnerException.Message ? "No Inner Fault" : te.InnerException.Message);

            }
            catch (Exception ex)
            {
                // Display the details of the inner exception.
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);

                    FaultException<OrganizationServiceFault> fe = ex.InnerException
                        as FaultException<OrganizationServiceFault>;
                    if (fe != null)
                    {
                        Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                        Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                        Console.WriteLine("Message: {0}", fe.Detail.Message);
                        Console.WriteLine("Plugin Trace: {0}", fe.Detail.TraceText);
                        Console.WriteLine("Inner Fault: {0}",
                            null == fe.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
                    }
                }
            }

        }

        /// <summary>
        /// Gets a named connection string from App.config
        /// </summary>
        /// <param name="name">The name of the connection string to return</param>
        /// <returns>The named connection string</returns>
        private static string GetConnectionStringFromAppConfig(string name)
        {
            //Verify cds/App.config contains a valid connection string with the name.
            try
            {
                return ConfigurationManager.ConnectionStrings[name].ConnectionString;
            }
            catch (Exception)
            {
                Console.WriteLine("You can set connection data in cds/App.config before running this sample. - Switching to Interactive Mode");
                return string.Empty;
            }
        }

        public static CrmServiceClient Connect(string name)
        {
            CrmServiceClient service = null;

            //You can specify connection information in cds/App.config to run this sample without the login dialog
            if (string.IsNullOrEmpty(GetConnectionStringFromAppConfig("Connect")))
            {
                // Failed to find a connection string... Show login Dialog. 
                CrmLogin loginFrm = new CrmLogin();
                // Login process is Async, thus we need to detect when login is completed and close the form. 
                loginFrm.ConnectionToCrmCompleted += LoginFrm_ConnectionToCrmCompleted;
                // Show the dialog here. 
                loginFrm.ShowDialog();

                // If the login process completed, assign the connected service to the CRMServiceClient var 
                if (loginFrm.CrmConnectionMgr != null && loginFrm.CrmConnectionMgr.CrmSvc != null && loginFrm.CrmConnectionMgr.CrmSvc.IsReady)
                    service = loginFrm.CrmConnectionMgr.CrmSvc;


            }
            else
            {
                // Try to create via connection string. 
                service = new CrmServiceClient(GetConnectionStringFromAppConfig("Connect"));

            }

            return service;

        }

        /// <summary>
        /// Handle closing the dialog when completed. 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private static void LoginFrm_ConnectionToCrmCompleted(object sender, EventArgs e)
        {
            if (sender is CrmLogin)
            {
                ((CrmLogin)sender).Close();
            }
        }
    }
}
