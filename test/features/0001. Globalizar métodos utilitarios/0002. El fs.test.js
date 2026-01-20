module.exports = fooldb => {
  global.fs = fooldb.constructor.fs;
}