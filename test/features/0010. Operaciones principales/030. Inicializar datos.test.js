module.exports = async fooldb => {
  await fooldb.initialize("Persona", {
    nombre: "Persona 4",
    edad: 33,
    "fecha de nacimiento": "1991/02/01",
  });
  const allPersonas = await fooldb.select("Persona", row => true);
  assertion(allPersonas.length === 3, "allPersonas debería tener 3 rows ahora");
  await fooldb.initialize("Persona", {
    nombre: "Persona 4",
    edad: 38,
    "fecha de nacimiento": "1991/02/01",
  });
  assertion(allPersonas.length === 3, "allPersonas debería tener 3 rows ahora");
  const persona4 = allPersonas.filter(persona => persona.nombre === "Persona 4")[0];
  assertion(persona4.edad === 33, "Objeto persona4 debería tener edad 33 ahora");
};