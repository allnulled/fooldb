const Fooldb = require(__dirname + "/fooldb.js");

const fooldb = Fooldb.create(__dirname + "/test/db1");

const main = async function() {

  await fooldb.ensureTable("Personas");
  await fooldb.initialize("Personas", { nombre: "Carlos", edad: 35, "fecha de nacimiento": "1991/01/05" });
  await fooldb.initialize("Personas", { nombre: "Carlos", edad: 35, "fecha de nacimiento": "1991/01/05" });
  await fooldb.initialize("Personas", { nombre: "Eustaquio", edad: 35, "fecha de nacimiento": "1991/01/01" });
  await fooldb.update("Personas", row => row.nombre === "Carlos", { edad: 36 });
  await fooldb.delete("Personas", row => row.nombre === "Carlos");
  await fooldb.delete("Personas", row => row.nombre === "Eustaquio");

};

main();