module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {boolean} (1)",
    "string": null,
    "number": null,
    "boolean": true,
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
    "nombre de registro": "Comprobando tipo {boolean} (2)",
    "string": null,
    "number": null,
    "boolean": "texto",
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": null,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  }), "Debería de haber lanzado un error porque columna «{boolean}» es un texto");
};