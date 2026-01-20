module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {referred-array} (1)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": [1,3],
    "integer": null,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  });
  await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {referred-array} (2)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": "texto",
    "integer": null,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  }), "Debería de haber lanzado un error porque columna «{referred-array}» es un texto");
};