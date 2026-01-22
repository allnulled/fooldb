const __TEST_ELEMENT__ = document.querySelector("#test");
const assertion = (condition, message) => {
  const assertionElement = document.createElement("div");
  assertionElement.classList.add(condition ? "ok" : "fail");
  assertionElement.textContent = (condition ? "[OK] " : "[FAIL] ") + message;
  __TEST_ELEMENT__.appendChild(assertionElement);
};