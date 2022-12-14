function openWebResource(formContext) {
  try {
    const globalContext = Xrm.Utility.getGlobalContext();
    const clientUrl = globalContext.getClientUrl();
    const lcid = globalContext.userSettings.languageId;
    const wrName = "/mat_/index.html";
    const windowOptions = { height: 408, width: 306 };

    var data = {
      plz_fieldname: "address1_postalcode",
      city_fieldname: "address1_city",
      str_fieldname: "address1_line1",
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
        height: 420,
        position: 1,
        title: "Address lookup"
    };

    debugger;
    Xrm.Navigation.navigateTo(dialogParameters, navigationOptions).then(
        function (returnValue) {
            let addressDetailsString = sessionStorage.getItem("addressDetails");
            let addressDetails = JSON.parse(addressDetailsString);
            formContext.getAttribute("address1_line1").setValue(addressDetails.str);  
            formContext.getAttribute("address1_postalcode").setValue(addressDetails.plz); 
            formContext.getAttribute("address1_city").setValue(addressDetails.city);
            sessionStorage.removeItem("addressDetails");
        },
        function (e) {
            Xrm.Navigation.openErrorDialog(e);
        }); 
    //http://localhost:3000/?data=%7B%22plz_fieldname%22%3A%22address1_postalcode%22%2C%22city_fieldname%22%3A%22address1_city%22%2C%22str_fieldname%22%3A%22address1_line1%22%2C%22crm_client_url%22%3A%22https%3A%2F%2F2dd60c03-c292-414e-b888-842e51d8e968.mock.pstmn.io%2Fapi%2Fdata%2Fv9.1%2F%22%2C%22crm_lcid%22%3A1033%7D
    //https://org28c105a6.crm.dynamics.com/main.aspx?appid=145ea306-b3b5-ec11-983f-0022482fe207&newWindow=true&pagetype=webresource&webresourceName=%2Fmat_%2Findex.html&data=%7B%22plz_fieldname%22%3A%22address1_postalcode%22%2C%22city_fieldname%22%3A%22address1_city%22%2C%22str_fieldname%22%3A%22address1_line1%22%2C%22crm_client_url%22%3A%22https%3A%2F%2Forg28c105a6.crm.dynamics.com%2Fapi%2Fdata%2Fv9.1%2F%22%2C%22crm_lcid%22%3A1033%7D&cmdbar=false&navbar=off
  } catch (e) {
    console.error(e.message || e);
  }
}
