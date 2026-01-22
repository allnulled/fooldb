module.exports = async fooldb => {
  console.log("swing 1");
  const Persona1 = await fooldb.insert("Persona", {
    "nombre": "Persona1",
    "edad": 35,
    "fecha de nacimiento": "1991/01/05"
  });
  console.log("swing 2");
  const Persona2 = await fooldb.insert("Persona", {
    "nombre": "Persona2",
    "edad": 35,
    "fecha de nacimiento": "1991/01/10"
  });
  console.log("swing 3");
  const Persona3 = await fooldb.insert("Persona", {
    "nombre": "Persona3",
    "edad": 35,
    "fecha de nacimiento": "1991/01/15"
  });
  console.log("swing 4");
  const Lugar1 = await fooldb.insert("Lugar", {
    "nombre": "Lugar1",
    "presidente": Persona1,
    "habitantes": [Persona1, Persona2, Persona3],
  });
  console.log("swing 5");
  const Lugar2 = await fooldb.insert("Lugar", {
    "nombre": "Lugar2",
    "presidente": Persona1,
    "habitantes": [Persona1, Persona2, Persona3],
  });
  console.log("swing 6");
};