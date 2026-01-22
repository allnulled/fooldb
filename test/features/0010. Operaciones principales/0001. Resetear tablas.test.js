module.exports = async fooldb => {

  await fooldb.resetTablesBySchema();

  await fooldb.wait(10);
  
  assertion(await fooldb.existsNode(fooldb.basedir + "/data"), "El directorio «data» debería existir ahora");
  
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Lugar"), "El directorio «data/Lugar» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Lugar/data.jsonl"), "El fichero «data/Lugar/data.jsonl» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Lugar/ids.json"), "El fichero «data/Lugar/ids.json» debería existir ahora");
  
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Persona"), "El directorio «data/Persona» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Persona/data.jsonl"), "El fichero «data/Persona/data.jsonl» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Persona/ids.json"), "El fichero «data/Persona/ids.json» debería existir ahora");
  
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo no identificado"), "El directorio «data/Tipo no identificado» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo no identificado/data.jsonl"), "El fichero «data/Tipo no identificado/data.jsonl» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo no identificado/ids.json"), "El fichero «data/Tipo no identificado/ids.json» debería existir ahora");

  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo único y nulo"), "El directorio «data/Tipo único y nulo» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo único y nulo/data.jsonl"), "El fichero «data/Tipo único y nulo/data.jsonl» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo único y nulo/ids.json"), "El fichero «data/Tipo único y nulo/ids.json» debería existir ahora");

  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Todos los tipos"), "El directorio «data/Todos los tipos» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Todos los tipos/data.jsonl"), "El fichero «data/Todos los tipos/data.jsonl» debería existir ahora");
  assertion(await fooldb.existsNode(fooldb.basedir + "/data/Todos los tipos/ids.json"), "El fichero «data/Todos los tipos/ids.json» debería existir ahora");

};