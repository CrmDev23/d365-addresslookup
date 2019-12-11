import {
  fetchBreakfast,
  fetchDinner,
  fetchLunch,
  fetchPlz,
  fetchStr
} from "./services";
import { normalize } from "normalizr";
import _isEmpty from "lodash/isEmpty";
import { mealSchema, plzSchema, strSchema } from "./schemas";

export const FETCH_MEALS = "FETCH_MEALS";
export const FETCH_PLZS = "FETCH_PLZS";
export const FETCH_STRS = "FETCH_STRS";
export const FETCH_GEBS = "FETCH_GEBS";

export const SET_RATING = "SET_RATING";

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

export const fetchPlzsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchPlzs(getState())) {
    return dispatch(fetchPlzs());
  }
};

export const shouldFetchPlzs = state => {
  const plzs = state.entities.plzs;
  if (_isEmpty(plzs)) {
    return true;
  } else {
    return false;
  }
};

export const fetchPlzs = () => dispatch => {
  return fetchPlz().then(fetchCallback(dispatch, plzSchema, FETCH_PLZS));
};

export const fetchStrsIfNeeded = plz => (dispatch, getState) => {
  if (shouldFetchStrs(getState(), plz)) {
    return dispatch(fetchStrs(plz));
  }
};

export const shouldFetchStrs = (state, plz) => {
  const strs = state.entities.strs;
  if (_isEmpty(strs)) {
    return true;
  } else {
    return false;
  }
};

export const fetchStrs = plz => dispatch => {
  return fetchStr(plz).then(fetchCallback(dispatch, strSchema, FETCH_STRS));
};

const fetchCallback = (dispatch, schema, type) => res => {
  const { data } = res;
  const { entities, result } = normalize(data, [schema]);

  return dispatch(saveResult(entities, result, type));
};

const saveResult = (resultEntities, resultValues, resultType) => ({
  type: resultType,
  payload: {
    resultEntities,
    resultValues
  }
});
