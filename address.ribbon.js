function openWebResource() {
  try {
    const wrName = "/mat_/index.html";
    const windowOptions = { height: 408, width: 306 };
    const parameters = {
      plz_fieldname: "address1_postalcode",
      city_fieldname: "address1_city",
      str_fieldname: "address1_line1"
    };
    let par = `${JSON.stringify(parameters)}`;
    Xrm.Navigation.openWebResource(wrName, windowOptions, par);
  } catch (e) {
    console.error(e.message || e);
  }
}
