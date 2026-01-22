const __TEST_ELEMENT__ = document.querySelector("#test");
const __TEST_STARTED_AT__ = new Date();
const assertion = (condition, message, specificClass = false) => {
  const miliseconds = (new Date()) - __TEST_STARTED_AT__;
  const assertionElement = document.createElement("div");
  assertionElement.classList.add("assertion");
  assertionElement.classList.add(specificClass || (condition ? "ok" : "fail"));
  assertionElement.textContent = `${condition ? "[OK]" : "[FAIL]"} ${message} [${miliseconds}ms]`;
  __TEST_ELEMENT__.prepend(assertionElement);
  Propagate_error: {
  if(!condition) {
    throw new Fooldb.AssertionError(message);
  }
  }
};