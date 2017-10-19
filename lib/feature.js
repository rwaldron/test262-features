module.exports = {
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

  },
  "ArrayBuffer"(input) {

  },
  "Array.prototype.values"(input) {

  },
  "arrow-function"(input) {

  },
  "async-functions"(input) {

  },
  "caller"(input) {

  },
  "class"(input) {

  },
  "computed-property-names"(input) {

  },
  "const"(input) {

  },
  "cross-realm"(input) {

  },
  "DataView"(input) {

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
  "WeakMap"(input) {

  },
  "WeakSet"(input) {

  },
  "IsHTMLDDA"(input) {

  },
};
