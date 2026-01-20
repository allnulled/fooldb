module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {integer} (1)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": 100,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  });
  await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {integer} (2)",
    "string": null,
    "number": null,
    "boolean": null,
    "object": null,
    "function": null,
    "referred-object": null,
    "referred-array": null,
    "integer": 100.5,
    "array": null,
    "day": null,
    "hour": null,
    "moment": null,
  }), "Debería de haber lanzado un error porque columna «{integer}» es un float");
};