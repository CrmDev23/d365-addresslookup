import { produce } from "immer";
import _merge from "lodash/merge";
import {
  FETCH_PLZS,
  FETCH_STRS,
  FETCH_GEBS,
  SET_PLZ,
  SET_STR,
  SET_GEB
} from "./actions";

const initialState = {
  ui: {
    plzs: [],
    strs: [],
    gebs: [],
    selectedPlz: "",
    selectedStr: "",
    selectedGeb: ""
  },
  entities: {
    plzs: {},
    strs: {},
    gebs: {}
  }
};

const reducer = (state = initialState, action) => {
  let newState = state;
  const { type, payload } = action;

  switch (type) {
    case FETCH_PLZS:
      const {
        resultEntities: resultEntitiesPlz,
        entityKey: entityKeyPlz,
        resultValues: resultValuesPlz
      } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, resultEntitiesPlz);
        draft.ui[entityKeyPlz] = resultValuesPlz;
        draft.ui.selectedPlz = resultValuesPlz[0];
      });

      break;
    case FETCH_STRS:
      const {
        resultEntities: resultEntitiesStr,
        entityKey: entityKeyStr,
        resultValues: resultValuesStr
      } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, resultEntitiesStr);
        draft.ui[entityKeyStr] = resultValuesStr;
        draft.ui.selectedStr = resultValuesStr[0];
      });

      break;
    case FETCH_GEBS:
      const {
        resultEntities: resultEntitiesGeb,
        entityKey: entityKeyGeb,
        resultValues: resultValuesGeb
      } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, resultEntitiesGeb);
        draft.ui[entityKeyGeb] = resultValuesGeb;
        draft.ui.selectedGeb = resultValuesGeb[0];
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
