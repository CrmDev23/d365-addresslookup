if (process.env.NODE_ENV === "production") {
  module.exports = require("./services.prod");
} else {
  module.exports = require("./services.dev");
}
