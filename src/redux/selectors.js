// General Selectors

export const selectPlzs = state => state.ui.plzs;

export const selectStrs = state => state.ui.strs;

export const selectGebs = state => state.ui.gebs;

export const selectedPlzName = state => state.ui.selectedPlzName;

export const selectedStr = state => state.ui.selectedStr;

export const selectedGebName = state => state.ui.selectedGebName;

// By id selectors

export const getPlzById = (state, id) => state.entities.plzs[id];

export const getStrById = (state, id) => state.entities.strs[id];

export const getGebById = (state, id) => state.entities.gebs[id];

export const getPlzsByIds = (state, ids) =>
  ids.map(id => state.entities.plzs[id]);

export const getUniquePlzsNamesByIds = (state, ids) => {
  let plzs = ids.map(id => state.entities.plzs[id].mat_plz_ortbez27);
  let optionsOrtBez27Unique = [...new Set(plzs)];
  return optionsOrtBez27Unique;
}

export const getStrsByIds = (state, ids) =>
  ids.map(id => state.entities.strs[id]);

export const getGebsByIds = (state, ids) =>
  ids.map(id => state.entities.gebs[id]);
