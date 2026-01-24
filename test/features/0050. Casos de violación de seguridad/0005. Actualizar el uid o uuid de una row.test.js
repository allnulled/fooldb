module.exports = async fooldb => {
  const originalRegistro = await fooldb.select("Todos los tipos", row => row["nombre de registro"] === "Comprobando tipo {string} (1)");
  await fooldb.update("Todos los tipos", row => {
    return row["nombre de registro"] === "Comprobando tipo {string} (1)";
  }, {
    uid: "no debería poder sobreescribirse"
  });
  await fooldb.update("Todos los tipos", row => {
    return row["nombre de registro"] === "Comprobando tipo {string} (1)";
  }, {
    uuid: "no debería poder sobreescribirse"
  });
  const finalRegistro = await fooldb.select("Todos los tipos", row => row["nombre de registro"] === "Comprobando tipo {string} (1)");
  assertion(originalRegistro.uid === finalRegistro.uid, "Registro con nombre 'Comprobando tipo {string} (1)' debería seguir teniendo el mismo uid");
  assertion(originalRegistro.uuid === finalRegistro.uuid, "Registro con nombre 'Comprobando tipo {string} (1)' debería seguir teniendo el mismo uuid");
};