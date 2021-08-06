#!/usr/bin/env node

// System Dependencies
const path = require("path");

// Third Party Dependencies
require("console.table");
const { argv } = require("yargs");
const fglob = require("fast-glob");

// Local Dependencies
const asyncify = require("../lib/asyncify");
const work = require("../lib/index");

let pathlist = argv._;
let includesDir = argv.includesDir || argv.includesdir;
let test262Dir = argv.test262Dir || argv.test262dir;


// test/annexB/language/expressions/yield/star-iterable-return-emulates-undefined-throws-when-called.js


(async function() {


  if (!pathlist.length) {
    work.error("Missing path(s) to tests");
    process.exitCode = 1;
    return;
  }

  if (!test262Dir) {
    work.error("Missing path to test262");
    process.exitCode = 1;
    return;
  }

  if (!includesDir) {
    includesDir = path.join(test262Dir, "harness");
  }

  let hasGlobExpr = pathlist.some(v => v.includes("*"));
  let paths = await Promise.resolve(
    hasGlobExpr ? fglob.async(pathlist, { cwd: test262Dir }) : pathlist
  );

  const settings = {
    test262Dir,
    includesDir,
    paths,
  };

  return work(settings);



  // console.log(glob.sync(expr[0]));
  // let paths = await hasGlobExpr ? aglob(pathlist.map(p => path.join(test262Dir, p)).join(",")) : pathlist;
  //   console.log(paths);

  //   paths.then(v => console.log(v))
  // console.log(pathlist, pathlist.includes("*"));
  // paths to array
  // process.exit();
  // const settings = {
  //   test262Dir,
  //   includesDir,
  //   paths,
  // };
  // // test/annexB/language/expressions/yield/star-iterable-return-emulates-undefined-throws-when-called.js

  // console.table(
  //   "Test262 Feature Detection",
  //   Object.keys(settings).map(setting => ({ setting, value: settings[setting] }))
  // );

  // return work(settings);
}()).then(
  () => console.log("Finished without error"),
  error => console.log(error)
);

// test262-features --test262Dir $TEST262_DIR test/built-ins/Atomics
// test262-features --test262Dir $TEST262_DIR test/built-ins/BigInt
// test262-features --test262Dir $TEST262_DIR test/built-ins/Promise/any
