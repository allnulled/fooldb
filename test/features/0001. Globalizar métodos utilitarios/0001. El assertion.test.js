module.exports = fooldb => {
  global.assertion = function(condition, message) {
    if(condition) {
      console.log("[test][assertion][ok] " + message);
    } else {
      console.error("[test][assertion][FAIL] " + message);
      throw new fooldb.constructor.AssertionError(message);
    }
  };
}