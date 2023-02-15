import { schema } from "normalizr";

export const plzSchema = new schema.Entity(
  "plzs",
  {},
  { idAttribute: "mat_plzid" }
);

export const strSchema = new schema.Entity(
  "strs",
  {},
  { idAttribute: "mat_strid" }
);

export const gebSchema = new schema.Entity(
  "gebs",
  {},
  { idAttribute: "mat_gebid" }
);

export const configSchema = new schema.Entity(
  "configs",
  {},
  { idAttribute: "mat_configid" }
);
