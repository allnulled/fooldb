const mainTest = async function () {
  assertion(true, "Iniciando tests de Fooldb...");
  assertion(typeof Fooldb !== "undefined", "Fooldb existe como global");
  assertion(typeof FooldbBrowserPolyfill !== "undefined", "FooldbBrowserPolyfill existe como global");
  assertion(true, "Creando una instancia de Fooldb", "title");
  const fooldb = Fooldb.create("/fooldb-test");
  assertion(true, "Eliminando todos los nodos anteriores", "title");
  Eliminar_nodos_anteriores: {
    await FooldbBrowserPolyfill.IndexedDBInterface.deleteAll();
  }
  Parche_para_importar_esquemas_de_tests: {
    const allDatabaseIds = requireInBrowser.allModulesByOrder.filter(file => file.startsWith("/test/databases/"));
    for (let index = 0; index < allDatabaseIds.length; index++) {
      const databaseId = allDatabaseIds[index];
      const databaseSchema = requireInBrowser(databaseId);
      // @CAUTION: Cuidado con esta línea si metemos functions en el schema.js:
      await FooldbBrowserPolyfill.fs.promises.writeFile(databaseId, "module.exports = " + JSON.stringify(databaseSchema, null, 2));
    }
  }
  // Y aquí ejecutamos los mismos tests de node.js en el browser:
  Ejecucion_de_tests: {
    const allTestIds = requireInBrowser.allModulesByOrder.filter(file => file.startsWith("/test/features/"));
    for (let index = 0; index < allTestIds.length; index++) {
      const testId = allTestIds[index];
      const testFunction = requireInBrowser(testId);
      await testFunction(fooldb);
    }
  }
};