import axios from "axios";
import { BASE_URL } from "../config";

export const fetchPlz = () =>
  axios.get(BASE_URL + "mat_plzs?_sort=mat_plz_postleitzahl");
export const fetchStr = plz =>
  axios.get(BASE_URL + "mat_strs?_mat_plzid_value=" + plz);
export const fetchGeb = str =>
  axios.get(BASE_URL + "mat_gebs?_mat_strid_value=" + str);
