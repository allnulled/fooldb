module.exports = {
  tables: {
    "Personas": {
      columns: {
        "nombre": { type: "string", unique: true, required: true },
        "edad": { type: "number", required: true },
        "fecha de nacimiento": { type: "day", required: true },
      }
    }
  }
};