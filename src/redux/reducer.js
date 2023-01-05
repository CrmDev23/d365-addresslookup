import { produce } from "immer";
import _merge from "lodash/merge";
import {
  FETCH_PLZS,
  FETCH_STRS,
  FETCH_PLZ_STRS_FACH,
  FETCH_GEBS,
  FETCH_CONFIGS,
  SET_PLZ,
  SET_STR,
  SET_GEB,
  SET_PARAMETERS,
  SET_ISLOADING,
} from "./actions";

const initialState = {
  ui: {
    plzs: [],
    strs: [],
    gebs: [],
    configs: [],
    selectedPlzName: "",
    selectedPlz: "",
    selectedStr: "",
    selectedGebName: "",
    parameters: {},
    importSeqPlz: 0,
    importSeqStr: 0,
    importSeqGeb: 0,
    isLoading: false,
  },
  entities: {
    plzs: {},
    strs: {},
    gebs: {},
    configs: {},
  },
};

const reducer = (state = initialState, action) => {
  let newState = state;
  const { type, payload } = action;

  switch (type) {
    case FETCH_PLZS:
      const {
        resultEntities: resultEntitiesPlz,
        entityKey: entityKeyPlz,
        resultValues: resultValuesPlz,
      } = payload;

      newState = produce(state, (draft) => {
        _merge(draft.entities, resultEntitiesPlz);
        draft.ui[entityKeyPlz] = resultValuesPlz;
        let plz = resultEntitiesPlz.plzs[resultValuesPlz[0]];
        draft.ui.selectedPlzName = plz.mat_plz_ortbez27;
      });

      break;
    case FETCH_STRS:
      const {
        resultEntities: resultEntitiesStr,
        entityKey: entityKeyStr,
        resultValues: resultValuesStr,
      } = payload;

      newState = produce(state, (draft) => {
        _merge(draft.entities, resultEntitiesStr);
        draft.ui[entityKeyStr] = resultValuesStr;
        if (resultValuesStr.length > 0) {
          draft.ui.selectedStr = resultValuesStr[0];
        } else {
          draft.ui.selectedStr = "";
          draft.ui.gebs = [];
        }
      });

      break;

    case FETCH_PLZ_STRS_FACH:
      const {
        resultEntities: resultEntitiesStrFach,
        entityKey: entityKeyStrFach,
        resultValues: resultValuesStrFach,
      } = payload;

      newState = produce(state, (draft) => {
        _merge(draft.entities, resultEntitiesStrFach);
        draft.ui[entityKeyStrFach] = resultValuesStrFach;
        
        let str = resultEntitiesStrFach.strs[resultValuesStrFach[0]];
        if (str != null && str.mat_geb_hnr != null){
          let gebs = str.mat_geb_hnr.split(";");
          let gebsReduced = gebs.reduce((acc, cur) => {
              let gebsObj = {};
              gebsObj.mat_strid = cur;
              gebsObj.mat_geb_hnr = cur;
              acc[cur] = gebsObj;
              return acc;
            }, {});
          _merge(draft.entities.gebs, gebsReduced);
          draft.ui["gebs"] = gebs;
          draft.ui.selectedGebName = gebs[0];
        }
        if (str != null && str._mat_plzid_value != null){
          draft.ui.selectedPlz = str._mat_plzid_value;
        }

        if (resultValuesStrFach.length > 0) {
          draft.ui.selectedStr = resultValuesStrFach[0];
        } else {
          draft.ui.selectedStr = "";
          draft.ui.gebs = [];
        }
      });

      break;

    case FETCH_GEBS:
      const {
        resultEntities: resultEntitiesGeb,
        entityKey: entityKeyGeb,
        resultValues: resultValuesGeb,
      } = payload;

      newState = produce(state, (draft) => {
        _merge(draft.entities, resultEntitiesGeb);
        draft.ui[entityKeyGeb] = resultValuesGeb;
        draft.ui.selectedGebName = resultValuesGeb[0];
      });

      break;
    case FETCH_CONFIGS:
      const {
        resultEntities: resultEntitiesConfig,
        entityKey: entityKeyConfig,
        resultValues: resultValuesConfig,
      } = payload;

      newState = produce(state, (draft) => {
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
      const { plzname } = payload;

      newState = produce(state, (draft) => {
        draft.ui.selectedPlzName = plzname;
      });

      break;
    case SET_STR:
      const { strid } = payload;

      newState = produce(state, (draft) => {
        draft.ui.selectedStr = strid;
        let str = state.entities.strs[strid];
        if (str != null && str.mat_geb_hnr != null){
          let gebs = str.mat_geb_hnr.split(";");
          let gebsReduced = gebs.reduce((acc, cur) => {
              let gebsObj = {};
              gebsObj.mat_strid = cur;
              gebsObj.mat_geb_hnr = cur;
              acc[cur] = gebsObj;
              return acc;
            }, {});
          _merge(draft.entities.gebs, gebsReduced);
          draft.ui["gebs"] = gebs;
          draft.ui.selectedGebName = gebs[0];
        }
        if (str != null && str._mat_plzid_value != null){
          draft.ui.selectedPlz = str._mat_plzid_value;
        }
      });

      break;
    case SET_GEB:
      const { gebname } = payload;

      newState = produce(state, (draft) => {
        draft.ui.selectedGebName = gebname;
      });

      break;
    case SET_PARAMETERS:
      const { parameters } = payload;

      newState = produce(state, (draft) => {
        draft.ui.parameters = parameters;
      });

      break;
    case SET_ISLOADING:
      const { isLoading } = payload;

      newState = produce(state, (draft) => {
        draft.ui.isLoading = isLoading;
      });

      break;
    default:
  }

  return newState;
};

export default reducer;
