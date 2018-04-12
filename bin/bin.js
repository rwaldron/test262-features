#!/usr/bin/env node

// System Dependencies
const path = require("path");

// Third Party Dependencies
const { argv } = require("yargs");

// Local Dependencies
const processor = require("../lib/index");

const omitRuntime = true;

let paths = argv._;
let includesDir = argv.includesDir || argv.includesdir;
let test262Dir = argv.test262Dir || argv.test262dir;


if (!paths.length) {
  error("Missing path(s) to tests");
  process.exitCode = 1;
  return;
}

if (!test262Dir) {
  error("Missing path to test262");
  process.exitCode = 1;
  return;
}

if (!includesDir) {
  includesDir = path.join(test262Dir, "harness");
}

processor({
  test262Dir,
  includesDir,
  omitRuntime,
  paths,
});
// test262-features --test262Dir $TEST262_DIR test/built-ins/Atomics
// test262-features --test262Dir $TEST262_DIR test/built-ins/BigInt
