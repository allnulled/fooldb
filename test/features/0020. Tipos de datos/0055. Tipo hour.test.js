module.exports = async fooldb => {
  await fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {hour} (1)",
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
    "hour": "15:00:00",
    "moment": null,
  });
  await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
    "nombre de registro": "Comprobando tipo {hour} (2)",
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
    "hour": "15:00:00 ",
    "moment": null,
  }), "Debería de haber lanzado un error porque columna «{hour}» es un texto pero no cumple el formato");
};