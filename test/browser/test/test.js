const mainTest = async function () {
  assertion(true, "Iniciando tests de Fooldb...");
  assertion(typeof Fooldb !== "undefined", "Fooldb existe como global");
  assertion(typeof FooldbBrowserPolyfill !== "undefined", "FooldbBrowserPolyfill existe como global");
  assertion(true, "Eliminando todos los nodos anteriores", "title");
  Eliminar_nodos_anteriores: {
    await FooldbBrowserPolyfill.IndexedDBInterface.deleteAll();
  }
  Parche_para_crear_el_directorio_inicial: {
    await FooldbBrowserPolyfill.fs.promises.mkdir("/test");
    await FooldbBrowserPolyfill.fs.promises.mkdir("/test/databases");
    await FooldbBrowserPolyfill.fs.promises.mkdir("/test/databases/db1");
  }
  Parche_para_importar_esquemas_de_tests: {
    const allDatabaseIds = FooldbBrowserRequire.allModulesByOrder.filter(file => file.startsWith("/test/databases/"));
    for (let index = 0; index < allDatabaseIds.length; index++) {
      const databaseId = allDatabaseIds[index];
      await FooldbBrowserPolyfill.fs.promises.mkdir(databaseId.replace(/\/schema\.json$/g, ""));
      const databaseSchema = await FooldbBrowserRequire(databaseId);
      // @CAUTION: Cuidado con esta línea si más adelante metemos functions en el schema.json:
      await FooldbBrowserPolyfill.fs.promises.writeFile(databaseId, JSON.stringify(databaseSchema, null, 2));
    }
  }
  assertion(true, "Creando una instancia de Fooldb", "title");
  const fooldb = await Fooldb.load("/test/databases/db1");
  Exportar_instancia_de_tests: {
    window.FOOLDB_FOR_TESTS = fooldb;
  }
  // Y aquí ejecutamos los mismos tests de node.js en el browser:
  Ejecucion_de_tests: {
    const allTestIds = FooldbBrowserRequire.allModulesByOrder.filter(file => file.startsWith("/test/features/"));
    try {
      for (let index = 0; index < allTestIds.length; index++) {
        const testId = allTestIds[index];
        assertion(true, `Iniciando test: ${testId}`, "title");
        const testFunction = await FooldbBrowserRequire(testId);
        await testFunction(fooldb);
      }
    } catch (error) {
      console.error(error);
      assertion(false, `${error.name}: ${error.message}\n\n${error.stack}\n`);
    }
    assertion(true, `Tests terminados con éxito!`, "title");
  }
};