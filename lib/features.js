#!/usr/bin/env node

// TODO: make classification buckets for each predicate,
//        based on node.type.value

const predicates = {
  "hashbang"(input) {
    // #! is not included in ast node, so this cannot be
    // detected?
  },
  "AggregateError"(input) {
    return typeof input === "string" && input.includes("AggregateError");
  },
  "WeakRef"(input) {
    return typeof input === "string" && input.includes("WeakRef");
  },
  "FinalizationRegistry"(input) {
    return typeof input === "string" && input.includes("FinalizationRegistry");
  },
  "Object.fromEntries"(input) {
    return typeof input === "string" && input.includes("Object.fromEntries");
  },
  "BigInt"(input) {
    if (input.type === 'Literal' && 'bigint' in input) {
      return true;
    }
    return (input.type && input.type.includes("BigInt")) ||
            (typeof input === "string" && input.includes("BigInt"));
  },
  "Temporal"(input) {
    return typeof input === "string" && input.includes("Temporal");
  },
  "Promise.any"(input) {
    return typeof input === "string" && input.includes("Promise.any");
  },
  "Promise.allSettled"(input) {
    return typeof input === "string" && input.includes("Promise.allSettled");
  },
  "Atomics.waitAsync"(input) {
    return typeof input === "string" && input.includes("Atomics.waitAsync");
  },
  "class-fields"(input) {
    // ClassDeclaration?
  },
  "Promise.prototype.finally"(input) {
    return typeof input === "string" &&
            input === "Promise.prototype.finally";
  },
  "async-iteration"(input) {
    return input.async && input.generator;
  },
  "Symbol.asyncIterator"(input) {
    return typeof input === "string" && (input.includes("Symbol.asyncIterator"));
  },
  "object-rest"(input) {
    // console.log(input);
  },
  "object-spread"(input) {

  },
  "optional-catch-binding"(input) {

  },
  "regexp-dotall"(input) {

  },
  "regexp-lookbehind"(input) {

  },
  "regexp-named-groups"(input) {

  },
  "regexp-unicode-property-escapes"(input) {

  },
  "Atomics"(input) {
    return typeof input === "string" && input.includes("Atomics");
  },
  "SharedArrayBuffer"(input) {
    return typeof input === "string" && input.includes("SharedArrayBuffer");
  },
  "ArrayBuffer"(input) {
    return typeof input === "string" && input.includes("ArrayBuffer") && !input.includes("SharedArrayBuffer");
  },
  "Array.prototype.values"(input) {
    // TODO: extend to [].values
    return typeof input === "string" &&
            input === "Array.prototype.values";
  },
  "arrow-function"(input) {
    // File name!
    if (typeof input === "string" && input.includes("arrow")) {
      return true;
    }

    return input.type === "ArrowFunctionExpression";
  },
  "async-functions"(input) {
    // if (input.type === "AwaitExpression") {
    //   return true;
    // }

    // This is not correct.
    // return typeof input === "string" && input.includes("async");
    return input.async === true;
  },
  "caller"(input) {

  },
  "class"(input) {
    // ClassDeclaration
    //
    // File name!?
    if (typeof input === "string" && input.includes("class")) {
      return true;
    }

    // console.log(input);
    return input.type === "ClassExpression" ||
            input.type === "ClassDeclaration";
  },
  // "class-static-method"(input) {
  //   // This may need more refinement
  //   return input.static;
  // },
  "computed-property-names"(input) {
    return (input.type === "Property" || input.type === "MethodDefinition") &&
            input.computed;
  },
  "const"(input) {

  },
  "cross-realm"(input) {

  },
  "DataView"(input) {
    return typeof input === "string" && input.includes("DataView");
  },
  // "DataView.prototype.getFloat32"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getFloat32";
  // },
  // "DataView.prototype.getFloat64"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getFloat64";
  // },
  // "DataView.prototype.getInt16"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getInt16";
  // },
  // "DataView.prototype.getInt32"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getInt32";
  // },
  // "DataView.prototype.getInt8"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getInt8";
  // },
  // "DataView.prototype.getUint16"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getUint16";
  // },
  // "DataView.prototype.getUint32"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.getUint32";
  // },
  // "DataView.prototype.setUint8"(input) {
  //   return typeof input === "string" &&
  //           input === "DataView.prototype.setUint8";
  // },
  "default-parameters"(input) {
    return input.type === "AssignmentPattern";
  },
  "destructuring-binding"(input) {
    return input.type === "ObjectBindingPattern" ||
            input.type === "ObjectPattern" ||
            input.type === "ArrayBindingPattern" ||
            input.type === "ArrayPattern";
  },
  "destructuring-assignment"(input) {
    return input.type === "AssignmentExpression" &&
            input.operator === "=" &&
            ((input.left && input.left.type === "ArrayPattern") ||
              (input.left && input.left.type === "ObjectPattern"));

// NodePath {
//   value:
//    AssignmentExpression {
//      type: 'AssignmentExpression',
//      operator: '=',
//      left: ArrayExpression { type: 'ArrayPattern', elements: [Array], loc: [Object] },
//      right: Identifier { type: 'Identifier', name: 'a', loc: [Object] },
//      loc: { start: [Object], end: [Object], lines: [Object], indent: 0 } },

// NodePath {
//   value:
//    AssignmentExpression {
//      type: 'AssignmentExpression',
//      operator: '=',
//      left: ArrayExpression { type: 'ArrayPattern', elements: [Array], loc: [Object] },
//      right: ArrayExpression { type: 'ArrayExpression', elements: [Array], loc: [Object] },
//      loc: { start: [Object], end: [Object], lines: [Object], indent: 0 } },

  },
  "for-of"(input) {

  },
  // "Float32Array"(input) {
  //   return typeof input === "string" && input.includes("Float32Array");
  // },
  // "Float64Array"(input) {
  //   return typeof input === "string" && input.includes("Float64Array");
  // },
  "generators"(input) {
    return !input.async && input.generator;
  },
  // "Int8Array"(input) {
  //   return typeof input === "string" && input.includes("Int8Array");
  // },
  "let"(input) {

  },
  "Map"(input) {
    return typeof input === "string" &&
            input === "Map";
  },
  "new.target"(input) {
    return input.type === "MetaProperty" &&
            input.meta.name === "new" &&
            input.property.name === "target";
  },
  "Proxy"(input) {
    return typeof input === "string" &&
            input === "Proxy";
  },
  "Reflect"(input) {
    return typeof input === "string" && input.includes("Reflect");
  },
  "Reflect.construct"(input) {
    return typeof input === "string" && input.includes("Reflect.construct");
  },
  "Reflect.set"(input) {
    return typeof input === "string" && input === "Reflect.set";
  },
  "Reflect.setPrototypeOf"(input) {
    return typeof input === "string" && input.includes("Reflect.setPrototypeOf");
  },
  "Set"(input) {
    return typeof input === "string" &&
            input === "Set";
  },
  "String.prototype.endsWith"(input) {
    return typeof input === "string" && input.includes("endsWith");
  },
  // "String.prototype.includes"(input) {
  //   // Will hit false positives
  //   return typeof input === "string" && input.includes("includes");
  // },
  "super"(input) {

  },
  "Symbol"(input) {
    return typeof input === "string" && input.includes("Symbol");
  },
  "Symbol.hasInstance"(input) {
    return typeof input === "string" && input.includes("Symbol.hasInstance");
  },
  "Symbol.isConcatSpreadable"(input) {
    return typeof input === "string" && input.includes("Symbol.isConcatSpreadable");
  },
  "Symbol.iterator"(input) {
    return typeof input === "string" && input.includes("Symbol.iterator");
  },
  "Symbol.match"(input) {
    return typeof input === "string" && input.includes("Symbol.match");
  },
  "Symbol.replace"(input) {
    return typeof input === "string" && input.includes("Symbol.replace");
  },
  "Symbol.search"(input) {
    return typeof input === "string" && input.includes("Symbol.search");
  },
  "Symbol.species"(input) {
    return typeof input === "string" && input.includes("Symbol.species");
  },
  "Symbol.split"(input) {
    return typeof input === "string" && input.includes("Symbol.split");
  },
  "Symbol.toPrimitive"(input) {
    return typeof input === "string" && input.includes("Symbol.toPrimitive");
  },
  "Symbol.toStringTag"(input) {
    return typeof input === "string" && input.includes("Symbol.toStringTag");
  },
  "Symbol.unscopables"(input) {
    return typeof input === "string" && input.includes("Symbol.unscopables");
  },
  "tail-call-optimization"(input) {

  },
  "template"(input) {

  },
  "TypedArray"(input) {
    return /(\dArray)$/g.test(input);
  },
  "u180e"(input) {

  },
  // "Uint8Array"(input) {
  //   return typeof input === "string" && input.includes("Uint8Array");
  // },
  // "Uint8ClampedArray"(input) {
  //   return typeof input === "string" && input.includes("Uint8ClampedArray");
  // },
  "WeakMap"(input) {
    return typeof input === "string" && input.includes("WeakMap");
  },
  "WeakSet"(input) {
    return typeof input === "string" && input.includes("WeakSet");
  },
  "IsHTMLDDA"(input) {
    return typeof input === "string" && input.includes("IsHTMLDDA");
  },
  "class-fields-public"(input) {
    return false;
  },
  "class-fields-private"(input) {
    return false;
  },
  "Array.prototype.flatten"(input) {
    return typeof input === "string" &&
            input === "Array.prototype.flatten";
  },
  "Array.prototype.flatMap"(input) {
    return typeof input === "string" &&
            input === "Array.prototype.flatMap";
  },
  "string-trimming"(input) {
    return typeof input === "string" &&
            (input === "String.prototype.trimEnd" || input === "String.prototype.trimStart");
  },
  "String.prototype.trimEnd"(input) {
    return typeof input === "string" &&
            input === "String.prototype.trimEnd";
  },
  "String.prototype.trimStart"(input) {
    return typeof input === "string" &&
            input === "String.prototype.trimStart";
  },
  "numeric-separator-literal"(input) {
    return false;
  },
  "String.prototype.matchAll"(input) {
    return typeof input === "string" &&
            input === "String.prototype.matchAll";
  },
  "Symbol.matchAll"(input) {
    return typeof input === "string" &&
            input === "Symbol.matchAll";
  },
  "Object.is"(input) {
    return typeof input === "string" &&
            input === "Object.is";
  },
  // "Uint16Array"(input) {
  //   return typeof input === "string" &&
  //           input === "Uint16Array";
  // },
  "CannotSuspendMainAgent"(input) {
    return false;
  },
  "exponentiation"(input) {
    return input.operator && input.operator === "**";
  },
};

const Identifier = "Identifier";
const Literal = "Literal";
const MemberExpression = "MemberExpression";
const BinaryExpression = "BinaryExpression";


// predicates["BigInt"].tags = [Identifier, Literal];
// predicates["Promise.prototype.finally"].tags = [MemberExpression];
// predicates["async-iteration"].tags = [];
// predicates["Symbol.asyncIterator"].tags = [Identifier, MemberExpression];
// predicates["object-rest"].tags = [];
// predicates["object-spread"].tags = [];
// predicates["optional-catch-binding"].tags = [];
// predicates["regexp-dotall"].tags = [];
// predicates["regexp-lookbehind"].tags = [];
// predicates["regexp-named-groups"].tags = [];
// predicates["regexp-unicode-property-escapes"].tags = [];
// predicates["Atomics"].tags = [Identifier, MemberExpression];
// predicates["SharedArrayBuffer"].tags = [Identifier, MemberExpression];
// predicates["ArrayBuffer"].tags = [Identifier, MemberExpression];
// predicates["Array.prototype.values"].tags = [MemberExpression];
// predicates["arrow-function"].tags = [];
// predicates["async-functions"].tags = [];
// predicates["caller"].tags = [];
// predicates["class"].tags = [];
// predicates["computed-property-names"].tags = [];
// predicates["const"].tags = [];
// predicates["cross-realm"].tags = [];
// predicates["DataView"].tags = [Identifier, MemberExpression];
// predicates["DataView.prototype.getFloat32"].tags = [MemberExpression];
// predicates["DataView.prototype.getFloat64"].tags = [MemberExpression];
// predicates["DataView.prototype.getInt16"].tags = [MemberExpression];
// predicates["DataView.prototype.getInt32"].tags = [MemberExpression];
// predicates["DataView.prototype.getInt8"].tags = [MemberExpression];
// predicates["DataView.prototype.getUint16"].tags = [MemberExpression];
// predicates["DataView.prototype.getUint32"].tags = [MemberExpression];
// predicates["DataView.prototype.setUint8"].tags = [MemberExpression];
// predicates["default-parameters"].tags = [];
// predicates["destructuring-binding"].tags = [];
// predicates["for-of"].tags = [];
// predicates["Float32Array"].tags = [Identifier, MemberExpression];
// predicates["Float64Array"].tags = [Identifier, MemberExpression];
// predicates["generators"].tags = [];
// predicates["Int8Array"].tags = [Identifier, MemberExpression];
// predicates["let"].tags = [];
// predicates["Map"].tags = [Identifier, MemberExpression];
// predicates["new.target"].tags = [];
// predicates["Proxy"].tags = [Identifier, MemberExpression];
// predicates["Reflect"].tags = [Identifier, MemberExpression];
// predicates["Reflect.construct"].tags = [Identifier, MemberExpression];
// predicates["Reflect.set"].tags = [Identifier, MemberExpression];
// predicates["Reflect.setPrototypeOf"].tags = [Identifier, MemberExpression];
// predicates["Set"].tags = [Identifier, MemberExpression];
// predicates["String.prototype.endsWith"].tags = [MemberExpression];
// predicates["String.prototype.includes"].tags = [MemberExpression];
// predicates["super"].tags = [];
// predicates["Symbol"].tags = [Identifier, MemberExpression];
// predicates["Symbol.hasInstance"].tags = [Identifier, MemberExpression];
// predicates["Symbol.isConcatSpreadable"].tags = [Identifier, MemberExpression];
// predicates["Symbol.iterator"].tags = [Identifier, MemberExpression];
// predicates["Symbol.match"].tags = [Identifier, MemberExpression];
// predicates["Symbol.replace"].tags = [Identifier, MemberExpression];
// predicates["Symbol.search"].tags = [Identifier, MemberExpression];
// predicates["Symbol.species"].tags = [Identifier, MemberExpression];
// predicates["Symbol.split"].tags = [Identifier, MemberExpression];
// predicates["Symbol.toPrimitive"].tags = [Identifier, MemberExpression];
// predicates["Symbol.toStringTag"].tags = [Identifier, MemberExpression];
// predicates["Symbol.unscopables"].tags = [Identifier, MemberExpression];
// predicates["tail-call-optimization"].tags = [];
// predicates["template"].tags = [];
// predicates["TypedArray"].tags = [Identifier, MemberExpression];
// predicates["u180e"].tags = [];
// predicates["Uint8Array"].tags = [Identifier, MemberExpression];
// predicates["Uint8ClampedArray"].tags = [Identifier, MemberExpression];
// predicates["WeakMap"].tags = [Identifier, MemberExpression];
// predicates["WeakSet"].tags = [Identifier, MemberExpression];
// predicates["IsHTMLDDA"].tags = [];
// predicates["class-fields-public"].tags = [];
// predicates["class-fields-private"].tags = [];
// predicates["Array.prototype.flatten"].tags = [MemberExpression];
// predicates["Array.prototype.flatMap"].tags = [MemberExpression];
// predicates["string-trimming"].tags = [MemberExpression];
// predicates["String.prototype.trimEnd"].tags = [MemberExpression];
// predicates["String.prototype.trimStart"].tags = [MemberExpression];
// predicates["numeric-separator-literal"].tags = [Literal];
// predicates["String.prototype.matchAll"].tags = [MemberExpression];
// predicates["Symbol.matchAll"].tags = [Identifier, MemberExpression];
// predicates["destructuring-assignment"].tags = [];
// predicates["Object.is"].tags = [Identifier, MemberExpression];
// predicates["Uint16Array"].tags = [Identifier, MemberExpression];
// predicates["CannotSuspendMainAgent"].tags = [];
// predicates["exponentiation"].tags = ["BinaryExpression"];

module.exports = predicates;


if (module.id === ".") {
  require("console.table");

  const asyncify = require("./asyncify");

  const { argv } = require("yargs");
  const cp = require("child_process");
  const fs = require("fs");
  const path = require("path");


  const aexec = asyncify(cp.exec);
  const alstat = asyncify(fs.lstat);
  const areadFile = asyncify(fs.readFile);


  const cwd = path.join(__dirname, "../");
  const features = path.join(cwd, "lib/data/features.txt");


  (async function() {
    const update = await aexec("npm run features-update", { cwd });
    const exists = await alstat(features);
    const contents = await areadFile(features, "utf8");
    const list = contents.split("\n").filter(line => {
      return line.trim() && !line.startsWith("#");
    });

    const missing = list.filter(feature => !predicates[feature]);
    const header = "missing";

    console.table(
      missing.map(feature => ({ "Missing Feature": feature }))
    );
    return true;
  }()).then(
    () => console.log("Finished without error"),
    error => console.log(error)
  );
}

