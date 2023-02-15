function openWebResource(formContext) {
  try {
    const globalContext = Xrm.Utility.getGlobalContext();
    const clientUrl = globalContext.getClientUrl();
    const lcid = globalContext.userSettings.languageId;
    const wrName = "/mat_/index.html";
    const windowOptions = { height: 408, width: 306 };

    var data = {
      crm_client_url: clientUrl + "/api/data/v9.1/",
      crm_lcid: lcid
    };

    var dialogParameters = {
        pageType: "webresource",
        webresourceName: wrName,
        data: JSON.stringify(data)
    };
    
    var navigationOptions = {
        target: 2,//use 1 if you want to open page inline or 2 to open it as dialog
        width: 310,
        height: 440,
        position: 1,
        title: "CH Address Lookup"
    };
    
    Xrm.Navigation.navigateTo(dialogParameters, navigationOptions).then(
        function (returnValue) {
            let addressDetailsString = sessionStorage.getItem("addressDetails");
            if (addressDetailsString != null)
            {
              let addressDetails = JSON.parse(addressDetailsString);
              formContext.getAttribute("address1_line1").setValue(addressDetails.str);  
              formContext.getAttribute("address1_postalcode").setValue(addressDetails.plz); 
              formContext.getAttribute("address1_city").setValue(addressDetails.city);
              sessionStorage.removeItem("addressDetails");
            }
        },
        function (e) {
            Xrm.Navigation.openErrorDialog(e);
        }); 
  } catch (e) {
    console.error(e.message || e);
  }
}
