// System Dependencies
const fs = require("fs");
const path = require("path");

// Third Party Dependencies
const TestStream = require("test262-stream");
const YAML = require("js-yaml");
// TODO: Maybe this should be some kind of pool of available parsers?
const acorn = require("acorn");
const recast = require("recast");
const babelparser = require("@babel/parser");

// Local Dependencies
const asyncify = require("./asyncify");
const features = require("./features");

// TODO: Move this crap to some external config?
const parsers = [
  {
    name: "recast",
    parser: recast,
    goalTypes: null,
    options: {
      tolerant: true,
    }
  },
  {
    name: "recast w/ acorn",
    parser: acorn,
    goalTypes: null,
    options: {
      ecmaVersion: "latest",
      tolerant: true,
    }
  },
  {
    name: "@babel/parser",
    parser: babelparser,
    goalTypes: ["module", "script"],
    options: {
      plugins: [
        "asyncGenerators",
        "bigInt",
        "classPrivateMethods",
        "classPrivateProperties",
        "classProperties",
        "dynamicImport",
        "exportDefaultFrom",
        "exportNamespaceFrom",
        "functionSent",
        "functionBind",
        "importMeta",
        "logicalAssignment",
        "nullishCoalescingOperator",
        "numericSeparator",
        "objectRestSpread",
        "optionalCatchBinding",
        "optionalChaining",
        "partialApplication",
        "throwExpressions",
        "topLevelAwait",
      ]
    }
  }
];



const omitRuntime = true;
const acceptVersion = '3.0.0';


const fKeys = Object.keys(features);
const fChecks = Object.values /* nvm use 8 */ (features).map((check, index) => {
  return (input) => {
    return check(input) ? fKeys[index] : null;
  };
});

function combineUnique(a, b) {
  return [...new Set([...a, ...b])].sort((a, b) => {
    return a.toLowerCase() > b.toLowerCase();
  });
}

function findFeatures(nodeOrString) {
  return fChecks.reduce((accum, check) => {
    let feature = check(nodeOrString);
    if (feature) {
      accum.push(feature);
    }
    return accum;
  }, []);
}


async function work(settings) {

  const {test262Dir, includesDir, paths} = settings;

  const stream = new TestStream(test262Dir, {
    acceptVersion,
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

    console.log(path.join(test262Dir, test.file));

    if (test.flags) {
      if (test.flags.generated) {
        console.log("Skipping generated");
        return;
      }
    }

    if (test.attrs.negative) {
      console.log("Skipping negative");
      return;
    }
    // console.log(test.contents.slice(0, test.insertionIndex));
    // console.log(test.contents.slice(test.insertionIndex));
    // process.exit();

    let ast;
    let usedParser;
    let isParsed = false;

    parsing: for (let {goalTypes, name, options, parser} of parsers) {
      try {
        if (goalTypes) {
          options.sourceType = test.attrs.flags.module ? "module" : "script";
        }

        ast = parser.parse(test.contents, options);
        isParsed = true;
        usedParser = name;
        break parsing;
      } catch (error) {
        console.log(`     File: ${test.file}`);
        console.log(`     Parser: ${name}`);
        console.log(`     Options:`);
        Object.entries(options).forEach(([key, value]) => {
          console.log(`       ${key}: ${value}`);
        });

        console.log();
        console.log("     There was some error parsing this code, that's a bummer.");
        console.log();
        console.log(`     ${error.message}`);
        console.log();
        // TODO: How to Retry?
      }
    }


    let accumFeatures = test.attrs.features || [];

    console.log(`Successful Parser: ${usedParser}`);
    console.log("                                                ");
    console.log(`(Before) Features: ${test.attrs.features || []}`);
    // console.log(`isParsed? ${isParsed}`);

    if (!isParsed) {
      // Last ditch effort...
      accumFeatures = combineUnique(accumFeatures, findFeatures(test.file));
      // TODO: It's not clear why "test.file" is used here :|
    } else {
      try {
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

            // For Parameters...
            if ([
                  "ArrowFunctionExpression",
                  "FunctionDeclaration",
                  "FunctionExpression",
                  "MethodDefinition",
                  // "AssignmentExpression",
                  // "BinaryExpression",
                  // "ArrayBindingPattern",
                  // "ObjectBindingPattern",
                ].includes(node.value.type)) {

              if (node.value.params) {
                node.value.params.forEach(param => {
                  discovered.push(...findFeatures(param));
                });
              }
            }

            // console.log(`node.value: ${node.value}`);
            // Just check the node
            discovered.push(...findFeatures(node.value));


            // Wrap up for this node
            accumFeatures = combineUnique(accumFeatures, discovered);

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
      } catch (error) {
        console.log("There was some error visiting nodes in this ast, that's a bummer.");
        console.log(`   ${error.message}`);
        console.log(`   This code was parsed with ${usedParser}`);

      }
    }
    console.log(`(After)  Features: ${accumFeatures}`);
    console.log(`.......................................................`);
    if (accumFeatures.length === 0) {
      return;
    }

    accumFeatures.sort();

    accumFeatures = accumFeatures.filter(feature => {
      return !(/(DataView\.prototype\..+\d)|(.*\d(Array|ClampedArray))/.test(feature));
    });

    // Only bother opening the file if we have something to do.
    let contents = fs.readFileSync(path.join(test262Dir, test.file), "utf8");
    let lines = contents.split("\n");

    let hasFeatures = typeof test.attrs.features !== "undefined";
    let insertionIndex = hasFeatures ?
      lines.findIndex(line => line.startsWith("features:")) :
      lines.findIndex(line => line.startsWith("---*/"));
    let newFeatures = `features: [${accumFeatures.join(", ")}]`;

    if (hasFeatures) {
      lines[insertionIndex] = newFeatures;
    } else {
      lines.splice(insertionIndex, 0, newFeatures);
    }

    let rebuilt = lines.join("\n");

    fs.writeFile(path.join(test262Dir, test.file), rebuilt, (error) => {
      if (error) {
        console.log(error);
        console.log(test.file);
      }
    });
  });

  return new Promise((resolve, reject) => {
    stream.on("end", resolve);
    stream.on("error", reject);
  });
}


function error(message) {
  console.log(message);
  help();
}

work.error = error;
work.error = error;

module.exports = work;
// test262-features --test262Dir $TEST262_DIR test/built-ins/Function/prototype/toString/line-terminator-normalisation-CR.js
// test262-features --test262Dir $TEST262_DIR test/built-ins/Atomics
// test262-features --test262Dir $TEST262_DIR test/built-ins/BigInt
