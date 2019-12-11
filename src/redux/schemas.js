import { schema } from "normalizr";

export const ratingSchema = new schema.Entity("ratings");

export const mealSchema = new schema.Entity("meals", {
  rating: ratingSchema
});

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
