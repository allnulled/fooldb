module.exports = fooldb => {
  globalThis.expectToThrow = async function(callback, message = "Expected to throw but it did not!") {
    let mustFail = true;
    try {
      await callback();
    } catch (error) {
      mustFail = false;
    }
    assertion(!mustFail, message);
  };
  globalThis.expectPromiseToThrow = async function(promise, message = "Expected to throw but it did not!") {
    let mustFail = true;
    try {
      await promise;
    } catch (error) {
      mustFail = false;
    }
    assertion(!mustFail, message);
  };
};