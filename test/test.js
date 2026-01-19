const Fooldb = require(__dirname + "/../fooldb.js");

const fooldb = Fooldb.create(__dirname + "/databases/db1");

const main = async function() {

  // Asseguramos todas las tablas:
  await fooldb.ensureTablesBySchema();
  // Vacíamos las tablas:
  await fooldb.emptyTables(["Persona", "Lugar"]);
  // Inicializamos algunos datos:
  const persona1 = await fooldb.initialize("Persona", { nombre: "Carlos", edad: 35, "fecha de nacimiento": "1991/01/05" });
  const persona2 = await fooldb.initialize("Persona", { nombre: "Eustaquio", edad: 35, "fecha de nacimiento": "1991/01/01" });
  // Actualizamos:
  await fooldb.update("Persona", row => row.nombre === "Carlos", { edad: 36 });
  
  Prueba_de_objetos_referenciados: {
    await fooldb.initialize("Lugar", { nombre: "Cronolandia", presidente: persona1, habitantes: [persona1, persona2] });
  }

};

main();