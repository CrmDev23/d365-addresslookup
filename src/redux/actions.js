import {
  fetchBreakfast,
  fetchDinner,
  fetchLunch,
  fetchPlz,
  fetchStr
} from "./services";
import { normalize } from "normalizr";
import { mealSchema, plzSchema, strSchema } from "./schemas";
import { getStrsByPlzId } from "../redux/selectors";

export const FETCH_MEALS = "FETCH_MEALS";
export const FETCH_PLZS = "FETCH_PLZS";
export const FETCH_STRS = "FETCH_STRS";
export const FETCH_GEBS = "FETCH_GEBS";

export const SET_RATING = "SET_RATING";
export const SET_PLZ = "SET_PLZ";
export const SET_STR = "SET_STR";
export const SET_GEB = "SET_GEB";

const saveMeals = (entities, mealKey, mealValues) => ({
  type: FETCH_MEALS,
  payload: {
    entities,
    mealKey,
    mealValues
  }
});

export const setRating = (id, rating) => ({
  type: SET_RATING,
  payload: {
    id,
    rating
  }
});

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

const fetchMealCallback = (mealKey, dispatch) => res => {
  const { data } = res;
  const { entities, result } = normalize(data, [mealSchema]);

  return dispatch(saveMeals(entities, mealKey, result));
};

export const fetchMeals = () => dispatch => {
  const breakfastPromise = fetchBreakfast().then(
    fetchMealCallback("breakfast", dispatch)
  );

  const lunchPromise = fetchLunch().then(fetchMealCallback("lunch", dispatch));

  const dinnerPromise = fetchDinner().then(
    fetchMealCallback("dinner", dispatch)
  );

  return Promise.all([breakfastPromise, lunchPromise, dinnerPromise]);
};

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
