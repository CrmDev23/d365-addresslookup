import { fetchPlz, fetchStr, fetchStrFach, fetchGeb, fetchConfig } from "./services";
import { normalize } from "normalizr";
import { plzSchema, strSchema, gebSchema, configSchema } from "./schemas";

export const FETCH_PLZS = "FETCH_PLZS";
export const FETCH_STRS = "FETCH_STRS";
export const FETCH_STRS_FACH = "FETCH_STRS_FACH";
export const FETCH_GEBS = "FETCH_GEBS";
export const FETCH_CONFIGS = "FETCH_CONFIGS";

export const SET_PLZ = "SET_PLZ";
export const SET_STR = "SET_STR";
export const SET_STR_FACH = "SET_STR_FACH";
export const SET_GEB = "SET_GEB";
export const SET_FIELDNAMES = "SET_FIELDNAMES";

export const SET_ISLOADING = "SET_ISLOADING";

export const setPlz = (plzid) => ({
  type: SET_PLZ,
  payload: {
    plzid,
  },
});

export const setStr = (strid) => ({
  type: SET_STR,
  payload: {
    strid,
  },
});

export const setGeb = (gebid) => ({
  type: SET_GEB,
  payload: {
    gebid,
  },
});

export const setFieldnames = (fieldnames) => ({
  type: SET_FIELDNAMES,
  payload: {
    fieldnames,
  },
});

export const setIsloading = (isLoading) => ({
  type: SET_ISLOADING,
  payload: {
    isLoading,
  },
});

export const fetchPlzs = (importSeqPlz) => (dispatch) => {
  dispatch(setIsloading(true));
  return fetchPlz(importSeqPlz).then(
    fetchCallback("plzs", dispatch, plzSchema, FETCH_PLZS)
  );
};

export const fetchStrs = (plz, importSeqStr) => (dispatch) => {
  dispatch(setIsloading(true));
  return fetchStr(plz, importSeqStr).then(
    fetchCallback("strs", dispatch, strSchema, FETCH_STRS)
  );
};

export const fetchStrsFach = (plz, importSeqStr) => (dispatch) => {
  dispatch(setIsloading(true));
  return fetchStrFach(plz, importSeqStr).then(
    fetchCallback("strsfach", dispatch, strSchema, FETCH_STRS_FACH)
  );
};

export const fetchGebs = (str, importSeqGeb) => (dispatch) => {
  dispatch(setIsloading(true));
  return fetchGeb(str, importSeqGeb).then(
    fetchCallback("gebs", dispatch, gebSchema, FETCH_GEBS)
  );
};

export const fetchConfigs = () => (dispatch) => {
  dispatch(setIsloading(true));
  return fetchConfig().then(
    fetchCallback("configs", dispatch, configSchema, FETCH_CONFIGS)
  );
};

const fetchCallback = (entityKey, dispatch, schema, type) => (res) => {
  const { entities, result } = normalize(res, [schema]);
  dispatch(setIsloading(false));
  return dispatch(saveResult(entities, entityKey, result, type));
};

const saveResult = (resultEntities, entityKey, resultValues, resultType) => ({
  type: resultType,
  payload: {
    resultEntities,
    entityKey,
    resultValues,
  },
});
