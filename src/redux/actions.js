import { fetchPlz, fetchStr, fetchGeb } from "./services";
import { normalize } from "normalizr";
import { plzSchema, strSchema, gebSchema } from "./schemas";

export const FETCH_PLZS = "FETCH_PLZS";
export const FETCH_STRS = "FETCH_STRS";
export const FETCH_GEBS = "FETCH_GEBS";

export const SET_PLZ = "SET_PLZ";
export const SET_STR = "SET_STR";
export const SET_GEB = "SET_GEB";

export const setPlz = plzid => ({
  type: SET_PLZ,
  payload: {
    plzid
  }
});

export const setStr = (strid, str) => ({
  type: SET_STR,
  payload: {
    strid,
    str
  }
});

export const setGeb = (gebid, geb) => ({
  type: SET_GEB,
  payload: {
    gebid,
    geb
  }
});

export const fetchPlzs = () => dispatch => {
  return fetchPlz().then(
    fetchCallback("plzs", dispatch, plzSchema, FETCH_PLZS)
  );
};

export const fetchStrs = plz => dispatch => {
  return fetchStr(plz).then(
    fetchCallback("strs", dispatch, strSchema, FETCH_STRS)
  );
};

export const fetchGebs = str => dispatch => {
  return fetchGeb(str).then(
    fetchCallback("gebs", dispatch, gebSchema, FETCH_GEBS)
  );
};

const fetchCallback = (entityKey, dispatch, schema, type) => res => {
  const { data } = res;
  const { entities, result } = normalize(data, [schema]);

  return dispatch(saveResult(entities, entityKey, result, type));
};

const saveResult = (resultEntities, entityKey, resultValues, resultType) => ({
  type: resultType,
  payload: {
    resultEntities,
    entityKey,
    resultValues
  }
});
