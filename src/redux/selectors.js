// General Selectors

export const selectPlzs = state => state.ui.plzs;

export const selectStrs = state => state.ui.strs;

export const selectGebs = state => state.ui.gebs;

export const selectedPlz = state => state.ui.selectedPlz;

export const selectedStr = state => state.ui.selectedStr;

export const selectedGeb = state => state.ui.selectedGeb;

// By id selectors

export const getPlzById = (state, id) => state.entities.plzs[id];

export const getPlzsByIds = (state, ids) =>
  ids.map(id => state.entities.plzs[id]);

export const getStrsByIds = (state, ids) =>
  ids.map(id => state.entities.strs[id]);

export const getGebsByIds = (state, ids) =>
  ids.map(id => state.entities.gebs[id]);
