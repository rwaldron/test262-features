#!/usr/bin/env node


const predicates = {
  "BigInt"(input) {
    return input.includes("BigInt") || /\d.*n/.test(input);
  },
  "class-fields"(input) {

  },
  "Promise.prototype.finally"(input) {

  },
  "async-iteration"(input) {

  },
  "Symbol.asyncIterator"(input) {
    return input.includes("Symbol.asyncIterator");
  },
  "object-rest"(input) {
    console.log(input);
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
    return input.includes("Atomics");
  },
  "SharedArrayBuffer"(input) {
    return input.includes("SharedArrayBuffer");
  },
  "ArrayBuffer"(input) {
    return input.includes("ArrayBuffer") && !input.includes("SharedArrayBuffer");
  },
  "Array.prototype.values"(input) {
    // TODO: extend to [].values
    return input === "Array.prototype.values";
  },
  "arrow-function"(input) {
    // File name!
    if (input.includes("arrow")) {
      return true;
    }

  },
  "async-functions"(input) {
    // This is not correct.
    return input.includes("async function");
  },
  "caller"(input) {

  },
  "class"(input) {
    // File name!
    if (input.includes("class")) {
      return true;
    }

  },
  "computed-property-names"(input) {

  },
  "const"(input) {

  },
  "cross-realm"(input) {

  },
  "DataView"(input) {
    return input.includes("DataView");
  },
  "DataView.prototype.getFloat32"(input) {

  },
  "DataView.prototype.getFloat64"(input) {

  },
  "DataView.prototype.getInt16"(input) {

  },
  "DataView.prototype.getInt32"(input) {

  },
  "DataView.prototype.getInt8"(input) {

  },
  "DataView.prototype.getUint16"(input) {

  },
  "DataView.prototype.getUint32"(input) {

  },
  "DataView.prototype.setUint8"(input) {

  },
  "default-arg"(input) {

  },
  "default-parameters"(input) {

  },
  "destructuring-binding"(input) {

  },
  "for-of"(input) {

  },
  "Float32Array"(input) {
    return input.includes("Float32Array");
  },
  "Float64Array"(input) {
    return input.includes("Float64Array");
  },
  "generators"(input) {

  },
  "Int8Array"(input) {
    return input.includes("Int8Array");
  },
  "let"(input) {

  },
  "Map"(input) {
    return input.includes("Map");
  },
  "new.target"(input) {

  },
  "Proxy"(input) {

  },
  "Reflect"(input) {
    return input.includes("Reflect");
  },
  "Reflect.construct"(input) {
    return input.includes("Reflect.construct");
  },
  "Reflect.set"(input) {
    return input.includes("Reflect.set");
  },
  "Reflect.setPrototypeOf"(input) {
    return input.includes("Reflect.setPrototypeOf");
  },
  "Set"(input) {
    return input.includes("Set");
  },
  "String.prototype.endsWith"(input) {
    return input.includes("endsWith");
  },
  "String.prototype.includes"(input) {
    // Will hit false positives
    return input.includes("includes");
  },
  "super"(input) {

  },
  "Symbol"(input) {
    return input.includes("Symbol");
  },
  "Symbol.hasInstance"(input) {
    return input.includes("Symbol.hasInstance");
  },
  "Symbol.isConcatSpreadable"(input) {
    return input.includes("Symbol.isConcatSpreadable");
  },
  "Symbol.iterator"(input) {
    return input.includes("Symbol.iterator");
  },
  "Symbol.match"(input) {
    return input.includes("Symbol.match");
  },
  "Symbol.replace"(input) {
    return input.includes("Symbol.replace");
  },
  "Symbol.search"(input) {
    return input.includes("Symbol.search");
  },
  "Symbol.species"(input) {
    return input.includes("Symbol.species");
  },
  "Symbol.split"(input) {
    return input.includes("Symbol.split");
  },
  "Symbol.toPrimitive"(input) {
    return input.includes("Symbol.toPrimitive");
  },
  "Symbol.toStringTag"(input) {
    return input.includes("Symbol.toStringTag");
  },
  "Symbol.unscopables"(input) {
    return input.includes("Symbol.unscopables");
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
  "Uint8Array"(input) {
    return input.includes("Uint8Array");
  },
  "Uint8ClampedArray"(input) {
    return input.includes("Uint8ClampedArray");
  },
  "WeakMap"(input) {

  },
  "WeakSet"(input) {

  },
  "IsHTMLDDA"(input) {

  },
};

module.exports = predicates;

if (module.id === ".") {
  require("console.table");

  const asyncify = require("./asyncify");

  const { argv } = require("yargs");
  const cp = require("child_process");
  const fs = require("fs");
  const path = require("path");


  const exec = asyncify(cp.exec);
  const lstat = asyncify(fs.lstat);
  const readFile = asyncify(fs.readFile);


  const cwd = path.join(__dirname, "../");
  const features = path.join(cwd, "lib/data/features.txt");


  (async function() {
    const update = await exec("npm run features-update", { cwd });
    const exists = await lstat(features);
    const contents = await readFile(features, "utf8");
    const list = contents.split("\n").filter(line => {
      return line.trim() && !line.startsWith("#");
    });

    const missing = list.filter(feature => !predicates[feature]);
    const header = "missing";

    console.table(
      missing.map(feature => ({ "Missing Feature": feature }))
    );

  }()).then(
    () => console.log("Finished without error"),
    error => console.log(error)
  );
}

