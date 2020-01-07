import { produce } from "immer";
import _merge from "lodash/merge";
import {
  FETCH_MEALS,
  SET_RATING,
  FETCH_PLZS,
  FETCH_STRS,
  SET_PLZ,
  SET_STR,
  SET_GEB
} from "./actions";

const initialState = {
  ui: {
    breakfast: [],
    lunch: [],
    dinner: [],
    plzs: [],
    strs: [],
    gebs: [],
    selectedPlz: "",
    selectedStr: "",
    selectedGeb: ""
  },
  entities: {
    meals: {},
    ratings: {},
    plzs: {},
    strs: {},
    gebs: {}
  }
};

const reducer = (state = initialState, action) => {
  let newState = state;
  const { type, payload } = action;

  switch (type) {
    case FETCH_MEALS:
      const { entities, mealKey, mealValues } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, entities);
        draft.ui[mealKey] = mealValues;
      });

      break;
    case FETCH_PLZS:
    case FETCH_STRS:
      const { resultEntities, entityKey, resultValues } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, resultEntities);
        draft.ui[entityKey] = resultValues;
      });

      break;
    case SET_RATING:
      const { id, rating } = payload;

      newState = produce(state, draft => {
        draft.entities.ratings[id].value = rating;
      });

      break;
    case SET_PLZ:
      const { plzid } = payload;

      newState = produce(state, draft => {
        draft.ui.selectedPlz = plzid;
      });

      break;
    case SET_STR:
      const { strid } = payload;

      newState = produce(state, draft => {
        draft.ui.selectedStr = strid;
      });

      break;
    case SET_GEB:
      const { gebid } = payload;

      newState = produce(state, draft => {
        draft.ui.selectedGeb = gebid;
      });

      break;
    default:
  }

  return newState;
};

export default reducer;
