module.exports = async fooldb => {
  const uid = await fooldb.insert("Todos los tipos", {
    "cualquier campo": true,
  });
  const matches = await fooldb.select("Todos los tipos", row => row.uid === uid);
  assertion(matches.length === 1, "Matches tendría que ser 1 ahora");
  const item = matches[0];
  const columnIds = Object.keys(fooldb.schema.tables["Todos los tipos"].columns);
  for(let index=0; index<columnIds.length; index++) {
    const columnId = columnIds[index];
    assertion(item[columnId] === null, `La columna «${columnId}» debería ser null ahora`);
  }
};
