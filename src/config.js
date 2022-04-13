import { from } from "./lcid";
import store from './redux/store';

export const NrOfImportChunks = 5;

export const getClientUrl = () => {
  const state = store.getState();
  const crm_client_url = state.ui.parameters.crm_client_url;
  return crm_client_url;
};

export const getUserLocal = () => {
  const state = store.getState();
  const crm_lcid = state.ui.parameters.crm_lcid;
  const locale = from(crm_lcid);
  return locale;
};
