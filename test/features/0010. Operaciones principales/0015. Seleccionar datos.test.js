module.exports = async fooldb => {
  const Persona1 = await fooldb.select("Persona", row => row.nombre === "Persona1");
  const Lugar1 = await fooldb.select("Lugar", row => row.nombre === "Lugar1");
  assertion(Persona1.length === 1, "Persona1 debería tener 1 row ahora");
  assertion(Lugar1.length === 1, "Lugar1 debería tener 1 row ahora");
};