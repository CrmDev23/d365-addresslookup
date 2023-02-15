import { from } from "./lcid";
import store from './redux/store';

export const NrOfImportChunks = 5;

export const getClientUrl = () => {
  if (process.env.NODE_ENV === "production") {
    const state = store.getState();
    const crm_client_url = state.ui.parameters.crm_client_url;
    return crm_client_url;
  } else {
    return "https://557e1598-f83c-4560-9aec-4d51d8eacd50.mock.pstmn.io/api/data/v9.1/";
  }
};

export const getUserLocal = () => {
  const state = store.getState();
  let crm_lcid = state.ui.parameters.crm_lcid;
  if (crm_lcid == null){
    crm_lcid = 1033;
  }
  const locale = from(crm_lcid);
  return locale;
};
