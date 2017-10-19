#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { argv } = require("yargs");
const TestStream = require("test262-stream");
const recast = require("recast");

const feature = require("../lib/feature");
const fKeys = Object.keys(feature);
const fChecks = Object.values /* nvm use 8 */ (feature).map((check, index) => {
  return (input) => {
    return check(input) ? fKeys[index] : null;
  };
});

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

const stream = new TestStream(test262Dir, {
  includesDir,
  paths,
});

const worklist = [];

stream.on("data", test => {
  // console.log(path.join(test262Dir, test.file));

  // This is temporary.
  fs.readFile(path.join(test262Dir, test.file), "utf8", (error, contents) => {
    console.log(contents);

    let ast = recast.parse(contents);

    test.attrs.features = test.attrs.features || [];

    console.log(`(Before) Features: ${test.attrs.features}`);

    // TODO: Move this to lib/visitor.js
    recast.visit(ast, {
      visitNode(node) {
        let feature = "";

        if (node.value.type === "Identifier") {
          test.attrs.features = combineUnique(
            test.attrs.features,
            runChecks(node.value.name)
          );
        }

        if (node.value.type === "MemberExpression") {
          test.attrs.features = combineUnique(
            test.attrs.features,
            runChecks(`${node.value.object.name}.${node.value.property.name}`)
          );
        }

        // TODO:
        //
        // expressions
        // statements
        //
        // etc
        //
        //
        this.traverse(node);
      }
    });
    console.log(`(After)  Features: ${test.attrs.features}`);
    // TODO:
    //
    // 1. Update features data
    // 2. Update test contents
    //
    //
    // console.log(ast);
  });
});

stream.on("end", () => {
  console.log("end");
});


function combineUnique(a, b) {
  return [...new Set([...a, ...b])].sort();
}

function runChecks(input) {
  return fChecks.reduce((accum, check) => {
    let feature = check(input);
    if (feature) {
      accum.push(feature);
    }
    return accum;
  }, []);
}

function help() {
  console.log("TODO: print help contents");
}

function error(message) {
  console.log(message);
  help();
}


// test262-features --test262Dir $TEST262_DIR test/built-ins/Atomics
