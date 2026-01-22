module.exports = async fooldb => {
  await fooldb.update("Persona", row => row.nombre === "Persona2", {nombre: "Persona2 modificada"})
  await fooldb.update("Lugar", row => row.nombre === "Lugar2", {nombre: "Lugar2 modificado"})
  const Persona2 = await fooldb.select("Persona", row => row.nombre === "Persona2 modificada");
  const Lugar2 = await fooldb.select("Lugar", row => row.nombre === "Lugar2 modificado");
  assertion(Persona2.length === 1, "Persona2 debería tener 1 row ahora");
  assertion(Lugar2.length === 1, "Lugar2 debería tener 1 row ahora");
};