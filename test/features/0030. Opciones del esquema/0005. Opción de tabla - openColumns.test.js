module.exports = async fooldb => {
  await fooldb.insert("Persona", {
    "nombre": "Persona 5",
    "edad": 40,
    "fecha de nacimiento": "1991/01/10"
  });
  await expectPromiseToThrow(fooldb.insert("Persona", {
    "nombre": "Persona 6",
    "edad": 41,
    "fecha de nacimiento": "1991/01/11",
    "campo extra": "valor random",
  }), "Debería haber fallado el 2o insert a Persona por no tener «openColumns:true» ahora");
};