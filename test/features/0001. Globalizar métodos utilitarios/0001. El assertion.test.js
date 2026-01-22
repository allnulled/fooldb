module.exports = fooldb => {
  globalThis.assertion = function (condition, message) {
    if (condition) {
      console.log(colorizer(32, "[test][assertion][OK] " + message));
    } else {
      console.error(colorizer(31, "[test][assertion][FAIL] " + message));
      throw new fooldb.constructor.AssertionError(message);
    }
  };
}