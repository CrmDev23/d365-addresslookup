export const from = lcidCode => {
  return import("./lcids").then(all => {
    return all[lcidCode];
  });
};
