module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {day} (1)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": null,
    "array": null,
    "day": "2026/01/20",
    "hour": null,
    "moment": null,
  });
  await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {day} (2)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": null,
    "array": null,
    "day": "2026/01/20 ",
    "hour": null,
    "moment": null,
  }), "Debería de haber lanzado un error porque columna «{day}» es un texto pero no cumple el formato");
};