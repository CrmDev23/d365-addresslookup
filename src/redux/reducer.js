import { produce } from "immer";
import _merge from "lodash/merge";
import { FETCH_MEALS, SET_RATING, FETCH_PLZS, FETCH_STRS } from "./actions";

const initialState = {
  ui: {
    breakfast: [],
    lunch: [],
    dinner: [],
    selectedPlz: {},
    selectedStr: {},
    selectedGeb: {}
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
      const { resultEntities, resultValues } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, resultEntities);
      });

      break;
    case SET_RATING:
      const { id, rating } = payload;

      newState = produce(state, draft => {
        draft.entities.ratings[id].value = rating;
      });

      break;
    default:
  }

  return newState;
};

export default reducer;
