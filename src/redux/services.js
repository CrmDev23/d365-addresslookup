import axios from "axios";
import { getClientUrl, NrOfImportChunks } from "../config";

const options = {
  headers: {
    Accept: "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    "If-None-Match": "null",
  },
};

export const fetchPlz = (importSeqPlz) => {
  let minImportSeq = importSeqPlz - NrOfImportChunks + 1;
  let query =
    getClientUrl() +
    "mat_plzs?$select=mat_plz_ortbez27,mat_plz_postleitzahl,mat_plz_typ" +
    "&$orderby=mat_plz_ortbez27,mat_plz_postleitzahl" +
    "&$filter=(Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
    minImportSeq +
    "','" +
    importSeqPlz +
    "']))";
  return allResults(query);
};

export const fetchStr = (plz, importSeqStr) => {
  let minImportSeq = importSeqStr - NrOfImportChunks + 1;
  let plzType = plz.mat_plz_typ;
  console.log("plzType " + plzType);
  let query =
    getClientUrl() +
    "mat_strs?$select=mat_str_strbez2l,mat_geb_hnr" +
    "&$filter=(Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
    minImportSeq +
    "','" +
    importSeqStr +
    "']))" +
    " and (mat_str_mat_geb/any(o1:(o1/_mat_geb_fachonrp_value eq " +
    plz.mat_plzid +
    ")))" +
    "&$orderby=mat_str_strbez2l asc";
  return allResults(query);
};

export const fetchStrFach = (plz, importSeqStr) => {
  let minImportSeq = importSeqStr - NrOfImportChunks + 1;
  let plzType = plz.mat_plz_typ;
  console.log("plzType " + plzType);
  let query =
    getClientUrl() +
    "mat_strs?$select=mat_str_strbez2l,mat_geb_hnr" +
    "&$orderby=mat_str_strbez2l" +
    "&$filter=_mat_plzid_value eq " +
    plz.mat_plzid +
    " and (Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
    minImportSeq +
    "','" +
    importSeqStr +
    "']))";
  return allResults(query);
};

export const fetchGeb = (str, importSeqGeb) => {
  let minImportSeq = importSeqGeb - NrOfImportChunks + 1;
  let query =
    getClientUrl() +
    "mat_gebs?$select=mat_geb_hnr,mat_geb_hnra" +
    "&$orderby=mat_geb_hnr,mat_geb_hnra" +
    "&$filter=_mat_strid_value eq " +
    str +
    " and (Microsoft.Dynamics.CRM.Between(PropertyName='importsequencenumber',PropertyValues=['" +
    minImportSeq +
    "','" +
    importSeqGeb +
    "']))";
  return allResults(query);
};

export const fetchConfig = () => {
  let query = getClientUrl() + "mat_configs";
  return allResults(query);
};

const allResults = async (query) => {
  var allResults = [];
  do {
    const res = await axios.get(query, options);
    const data = res.data.value;
    query = res.data["@odata.nextLink"];
    allResults.push(...data);
  } while (query);
  return allResults;
};
