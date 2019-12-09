import { fetchBreakfast, fetchDinner, fetchLunch, fetchPlz } from "./services";
import { normalize } from "normalizr";
import _isEmpty from "lodash/isEmpty";
import { mealSchema, plzSchema } from "./schemas";

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

const savePlzs = (plzEntities, plzValues) => ({
  type: FETCH_PLZS,
  payload: {
    plzEntities,
    plzValues
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

const fetchPlzCallback = dispatch => res => {
  const { data } = res;
  const { entities, result } = normalize(data, [plzSchema]);

  return dispatch(savePlzs(entities, result));
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
  return fetchPlz().then(fetchPlzCallback(dispatch));
};
