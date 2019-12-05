const path = require("path");
const compile = require("../dist/debug/compile").default;

compile([
  path.join(__dirname, "./transformer.test.ts"),
  path.join(__dirname, "./fixture.test.ts")
]);
