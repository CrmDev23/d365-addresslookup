import { from } from "./lcid";

export const NrOfImportChunks = 5;

export const getContext = () => {
  var context;
  // GetGlobalContext defined by including reference to
  // ClientGlobalContext.js.aspx in the HTML page.
  if (typeof GetGlobalContext != "undefined") {
    // eslint-disable-next-line no-undef
    context = GetGlobalContext();
  } else {
    if (typeof Xrm != "undefined") {
      // Xrm.Page.context defined within the Xrm.Page object model for form scripts.
      // eslint-disable-next-line no-undef
      context = Xrm.Page.context;
    } else {
      throw new Error("Context is not available.");
    }
  }
  return context;
};

export const getClientUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return getContext().getClientUrl() + "/api/data/v9.1/";
  } else {
    return "http://localhost:3001/";
  }
};

export const getUserLocal = () => {
  let lcid;
  if (process.env.NODE_ENV !== "production") {
    lcid = 1033;
  } else {
    lcid = getContext().getUserLcid();
  }
  const locale = from(lcid);
  return locale;
};
