module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {number} (1)",
    "string": null,
    "number": 100,
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
    "nombre de registro": "Comprobando tipo {number} (2)",
    "string": null,
    "number": "texto",
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
  }), "Debería de haber lanzado un error porque columna «{number}» es un texto");
};