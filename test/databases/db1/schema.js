module.exports = {
  tables: {
    "Persona": {
      columns: {
        "nombre": {
          type: "string",
          unique: true,
        },
        "edad": {
          type: "number",
        },
        "fecha de nacimiento": {
          type: "day",
        },
      }
    },
    "Lugar": {
      columns: {
        "nombre": {
          type: "string",
          unique: true,
        },
        "presidente": {
          type: "referred-object",
          referredTable: "Persona"
        },
        "habitantes": {
          type: "referred-array",
          referredTable: "Persona",
        }
      }
    }
  }
};