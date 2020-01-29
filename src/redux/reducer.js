import { produce } from "immer";
import _merge from "lodash/merge";
import {
  FETCH_PLZS,
  FETCH_STRS,
  FETCH_GEBS,
  FETCH_CONFIGS,
  SET_PLZ,
  SET_STR,
  SET_GEB,
  SET_FIELDNAMES
} from "./actions";

const initialState = {
  ui: {
    plzs: [],
    strs: [],
    gebs: [],
    configs: [],
    selectedPlz: "",
    selectedStr: "",
    selectedGeb: "",
    fieldnames: {},
    importSeqPlz: 0,
    importSeqStr: 0,
    importSeqGeb: 0
  },
  entities: {
    plzs: {},
    strs: {},
    gebs: {},
    configs: {}
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
    case FETCH_CONFIGS:
      const {
        resultEntities: resultEntitiesConfig,
        entityKey: entityKeyConfig,
        resultValues: resultValuesConfig
      } = payload;

      newState = produce(state, draft => {
        _merge(draft.entities, resultEntitiesConfig);
        draft.ui[entityKeyConfig] = resultValuesConfig;
        let config = resultEntitiesConfig.configs[resultValuesConfig[0]];
        draft.ui.importSeqPlz = config.mat_plzimportsequencenumber
          ? config.mat_plzimportsequencenumber
          : config.mat_plzimportsequencenumber_next;
        draft.ui.importSeqStr = resultEntitiesConfig.configs[
          resultValuesConfig[0]
        ].mat_strimportsequencenumber
          ? config.mat_strimportsequencenumber
          : config.mat_strimportsequencenumber_next;
        draft.ui.importSeqGeb = resultEntitiesConfig.configs[
          resultValuesConfig[0]
        ].mat_gebimportsequencenumber
          ? config.mat_gebimportsequencenumber
          : config.mat_gebimportsequencenumber_next;
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
    case SET_FIELDNAMES:
      const { fieldnames } = payload;

      newState = produce(state, draft => {
        draft.ui.fieldnames = fieldnames;
      });

      break;
    default:
  }

  return newState;
};

export default reducer;
