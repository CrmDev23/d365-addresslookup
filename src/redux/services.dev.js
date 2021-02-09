import axios from "axios";
import { getClientUrl } from "../config";

export const fetchPlz = (importSeqPlz) =>
  axios.get(
    getClientUrl() +
      "mat_plzs?importsequencenumber=" +
      importSeqPlz +
      "&_sort=mat_plz_ortbez27"
  );
export const fetchStr = (plz, importSeqStr) =>
  axios.get(
    getClientUrl() +
      "mat_strs?_mat_plzid_value=" +
      plz.mat_plzid +
      "&importsequencenumber=" +
      importSeqStr +
      "&_sort=mat_str_strbez2l"
  );
export const fetchGeb = (str, importSeqGeb) =>
  axios.get(
    getClientUrl() +
      "mat_gebs?_mat_strid_value=" +
      str +
      "&importsequencenumber=" +
      importSeqGeb +
      "&_sort=mat_geb_hnr"
  );
export const fetchConfig = () => axios.get(getClientUrl() + "mat_configs");
