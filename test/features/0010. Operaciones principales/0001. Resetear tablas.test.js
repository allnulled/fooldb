module.exports = async fooldb => {
  await fooldb.resetTablesBySchema();
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data"), "El directorio «data» debería existir ahora");
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data/Lugar"), "El directorio «data/Lugar» debería existir ahora");
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data/Lugar/data.jsonl"), "El fichero «data/Lugar/data.jsonl» debería existir ahora");
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data/Lugar/ids.json"), "El fichero «data/Lugar/ids.json» debería existir ahora");
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data/Persona"), "El directorio «data/Persona» debería existir ahora");
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data/Persona/data.jsonl"), "El fichero «data/Persona/data.jsonl» debería existir ahora");
  assertion(await Fooldb.existsNode(fooldb.basedir + "/data/Persona/ids.json"), "El fichero «data/Persona/ids.json» debería existir ahora");
};