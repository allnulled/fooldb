module.exports = async fooldb => {
  const Persona1 = await fooldb.insert("Persona", {
    "nombre": "Persona1",
    "edad": 35,
    "fecha de nacimiento": "1991/01/05"
  });
  const Persona2 = await fooldb.insert("Persona", {
    "nombre": "Persona2",
    "edad": 35,
    "fecha de nacimiento": "1991/01/10"
  });
  const Persona3 = await fooldb.insert("Persona", {
    "nombre": "Persona3",
    "edad": 35,
    "fecha de nacimiento": "1991/01/15"
  });
  const Lugar1 = await fooldb.insert("Lugar", {
    "nombre": "Lugar1",
    "presidente": Persona1,
    "habitantes": [Persona1, Persona2, Persona3],
  });
  const Lugar2 = await fooldb.insert("Lugar", {
    "nombre": "Lugar2",
    "presidente": Persona1,
    "habitantes": [Persona1, Persona2, Persona3],
  });
};