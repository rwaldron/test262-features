// System Dependencies
const fs = require("fs");
const path = require("path");

// Third Party Dependencies
const TestStream = require("test262-stream");
// TODO: Maybe this should be some kind of pool of available parsers?
const recast = require("recast");
const babylon = require("babylon");

// Local Dependencies
const asyncify = require("./asyncify");
const features = require("./features");


process.exit();
// TODO: Move this crap to some external config?
const parsers = [
  {
    parser: recast,
    options: {
      tolerant: true,
    }
  },
  {
    parser: babylon,
    options: {
      plugins: [
        "asyncGenerators",
        "bigInt",
        "classProperties",
        "classPrivateMethods",
        "classPrivateProperties",
        "numericSeparator",
        "objectRestSpread",
      ]
    }
  }
];

const fKeys = Object.keys(features);
const fChecks = Object.values /* nvm use 8 */ (features).map((check, index) => {
  return (input) => {
    return check(input) ? fKeys[index] : null;
  };
});

function processor(settings) {

  const {test262Dir, includesDir, omitRuntime, paths} = settings;

  const stream = new TestStream(test262Dir, {
    includesDir,
    omitRuntime,
    paths,
  });

  const worklist = [];

  stream.on("data", test => {

    if (worklist.includes(test.file)) {
      return;
    }
    worklist.push(test.file);

    console.log("-------------------------------------------------------------------------");
    console.log(path.join(test262Dir, test.file));

    if (test.flags) {

      if (test.flags.generated) {
        console.log("Skipping generated");
        return;
      }
    }

    // console.log(test.contents.slice(0, test.insertionIndex));
    // console.log(test.contents.slice(test.insertionIndex));
    // process.exit();

    let ast;
    let isParsed = false;

    parsing: for (let {parser, options} of parsers) {
      try {
        ast = parser.parse(test.contents, options);
        isParsed = true;
        break parsing;
      } catch (error) {
        console.log("There was some error parsing this code, that's a bummer.");
        console.log(error);

        // TODO: How to Retry?
      }
    }


    test.attrs.features = test.attrs.features || [];

    console.log(`(Before) Features: ${test.attrs.features}`);

    if (!isParsed) {
      // Last ditch effort...
      test.attrs.features = combineUnique(test.attrs.features, findFeatures(test.file));

    } else {
      recast.visit(ast, {
        // TODO: Move this to lib/visitor.js
        visitNode(node) {
          let discovered = [];

          if (node.value.type === "Identifier") {
            discovered.push(...findFeatures(node.value.name));
          }

          if (node.value.type === "MemberExpression") {
            discovered.push(...findFeatures(`${recast.print(node.value).code}`));
          }

          if (node.value.type.endsWith("Literal")) {
            discovered.push(...findFeatures(node.value.type));
          }

          test.attrs.features = combineUnique(test.attrs.features, discovered);

          // console.log(node.value);
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
    }
    console.log(`(After)  Features: ${test.attrs.features}`);
    // console.log(test.contents);
    // TODO:
    //
    // 1. Update features data
    // 2. Update test contents
    //
    //
    // console.log(ast);
  // });
  });

  stream.on("end", () => {
    console.log("end");
  });
}

function combineUnique(a, b) {
  return [...new Set([...a, ...b])].sort();
}

function findFeatures(input) {
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


module.exports = processor;

// test262-features --test262Dir $TEST262_DIR test/built-ins/Atomics
// test262-features --test262Dir $TEST262_DIR test/built-ins/BigInt
