module.exports = async fooldb => {
  await fooldb.delete("Persona", row => row.nombre === "Persona2 modificada");
  await fooldb.delete("Lugar", row => row.nombre === "Lugar2 modificado");
  const Persona2 = await fooldb.select("Persona", row => row.nombre === "Persona2 modificada");
  const Lugar2 = await fooldb.select("Lugar", row => row.nombre === "Lugar2 modificado");
  assertion(Persona2.length === 0, "Persona2 debería tener 0 rows ahora");
  assertion(Lugar2.length === 0, "Lugar2 debería tener 0 rows ahora");
};