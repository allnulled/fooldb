module.exports = fooldb => {
  globalThis.fs = fooldb.constructor.fs;
}