import axios from "axios";
import { getClientUrl, NrOfImportChunks } from "../config";

const options = {
  headers: {
    Accept: "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    "If-None-Match": "null",
  },
  transformResponse: axios.defaults.transformResponse.concat(
    (data, headers) => {
      return data.value;
    }
  ),
};

export const fetchPlz = (importSeqPlz) => {
  let minImportSeq = importSeqPlz - NrOfImportChunks + 1;
  return axios.get(
    getClientUrl() +
      "mat_plzs?$select=mat_plz_ortbez27,mat_plz_postleitzahl,mat_plz_typ" +
      "&$orderby=mat_plz_ortbez27,mat_plz_postleitzahl" +
      "&$filter=(Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
      minImportSeq +
      "','" +
      importSeqPlz +
      "']))",
    options
  );
};

export const fetchStr = (plz, importSeqStr) => {
  let minImportSeq = importSeqStr - NrOfImportChunks + 1;
  let plzType = plz.mat_plz_typ;
  console.log("plzType " + plzType);
  if (plzType == "30") {
    return axios.get(
      getClientUrl() +
        "mat_strs?$select=mat_str_strbez2l" +
        "&$filter=(Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
        minImportSeq +
        "','" +
        importSeqStr +
        "']))" +
        " and (mat_str_mat_geb/any(o1:(o1/_mat_geb_fachonrp_value eq " +
        plz.mat_plzid +
        ")))" +
        "&$orderby=mat_str_strbez2l asc",
      options
    );
  } else {
    return axios.get(
      getClientUrl() +
        "mat_strs?$select=mat_str_strbez2l" +
        "&$orderby=mat_str_strbez2l" +
        "&$filter=_mat_plzid_value eq " +
        plz.mat_plzid +
        " and (Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
        minImportSeq +
        "','" +
        importSeqStr +
        "']))",
      options
    );
  }
};

export const fetchGeb = (str, importSeqGeb) => {
  let minImportSeq = importSeqGeb - NrOfImportChunks + 1;
  return axios.get(
    getClientUrl() +
      "mat_gebs?$select=mat_geb_hnr,mat_geb_hnra" +
      "&$orderby=mat_geb_hnr,mat_geb_hnra" +
      "&$filter=_mat_strid_value eq " +
      str +
      " and (Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
      minImportSeq +
      "','" +
      importSeqGeb +
      "']))",
    options
  );
};

export const fetchConfig = () =>
  axios.get(getClientUrl() + "mat_configs", options);
