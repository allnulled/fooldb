module.exports = async fooldb => {
  assertion(typeof fooldb.schema.tables.Lugar.columns.capital === "undefined", "La columna Lugar.capital debería ser undefined ahora");
  await fooldb.expandSchema({
    tables: {
      Lugar: {
        columns: {
          capital: {
            type: "string",
            nullable: false,
          }
        }
      }
    }
  });
  assertion(typeof fooldb.schema.tables.Lugar.columns.capital === "object", "La columna Lugar.capital debería ser object ahora");
};