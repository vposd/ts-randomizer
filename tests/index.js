const path = require("path");
const compile = require("../dist/src/compile").default;

compile([
  path.join(__dirname, "./transformer.test.ts"),
  path.join(__dirname, "./fixture.test.ts")
]);
