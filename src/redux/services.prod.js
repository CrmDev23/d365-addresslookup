import axios from "axios";
import { getClientUrl } from "../config";

export const fetchPlz = () =>
  axios.get(
    getClientUrl() +
      "mat_plzs?$select=mat_plz_ortbez27,mat_plz_postleitzahl" +
      "&$orderby=mat_plz_ortbez27",
    {
      transformResponse: axios.defaults.transformResponse.concat(function(
        data,
        headers
      ) {
        return data.value;
      })
    }
  );
export const fetchStr = plz =>
  axios.get(
    getClientUrl() +
      "mat_strs?$select=mat_str_strbez2l" +
      "&$orderby=mat_str_strbez2l" +
      "&$filter=_mat_plzid_value eq " +
      plz
  );
export const fetchGeb = str =>
  axios.get(
    getClientUrl() +
      "mat_gebs?$select=mat_geb_hnr" +
      "&$orderby=mat_geb_hnr" +
      "&$filter=_mat_strid_value eq " +
      str
  );
export const fetchConfig = () => axios.get(getClientUrl() + "mat_configs");
