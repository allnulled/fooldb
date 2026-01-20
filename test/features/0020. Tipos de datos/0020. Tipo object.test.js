module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {object} (1)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": null,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  });
  await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {object} (2)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": "texto",
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": null,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  }), "Debería de haber lanzado un error porque columna «{object}» es un texto");
};