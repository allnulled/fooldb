module.exports = async fooldb => {
  new fooldb.constructor.AssertionError("Un mensaje cualquiera");
  try {
    fooldb.constructor.assertion(false);
  } catch { }
  try {
    const mce = new fooldb.constructor.MultipleConstraintErrors();
    mce.assertion(false, "Un mensaje cualquiera");
    mce.throwIfAnyExcept("-");
  } catch (error) {
    assertion(error instanceof fooldb.constructor.ConstraintError, "El error debería ser una instancia de ConstraintError aquí");
  }
  fooldb.trace.deactivate();
  fooldb.isValidDay(0);
  fooldb.isValidHour(0);
  fooldb.isValidMoment(0);
  fooldb.isArrayOfIntegers(["no"]);
  fooldb.isArrayOfIntegers("no");
  fooldb.composePath("whatever");
  Solo_en_nodejs: {
    if (fooldb.constructor.runningOn.nodejsOnly) {
      await fooldb.readJson(__dirname + "/../../../package.json");
      await fooldb.writeJson(__dirname + "/temporary.json", {});
      await fooldb.constructor.fs.promises.unlink(__dirname + "/temporary.json");
    }
  }
  try {
    await fooldb.insert("Lugar", {
      nombre: "whatever",
      presidente: 1,
      habitantes: ["no"]
    });
  } catch (error) { }
  try {
    await fooldb.insert("Tipo no identificado", {});
  } catch (error) { }
  Tipo_unico_y_nulo: {
    const uid1 = await fooldb.insert("Tipo único y nulo", {});
    const uid2 = await fooldb.insert("Tipo único y nulo", {
      "tipo único y nulo": "ok",
      "otro valor": 500,
    });
    await fooldb.update("Tipo único y nulo", row => row.uid === uid2, {
      "uid": uid2, // Esto se pone cuando quieres referirte al mismo, para evitar que la constraint UNIQUE:TRUE te prohiba actualizar el row.
      "tipo único y nulo": "ok",
      "otro valor": 501,
    });
    const matches = await fooldb.select("Tipo único y nulo", row => row.uid === uid2);
    assertion(matches.length === 1, "Matches debería tener 1 row aquí");
    assertion(matches[0]["otro valor"] === 501, "El match debería tener 501 en la columna 'otro valor' ahora");
  }
  Cuando_un_select_lanza_error: {
    await fooldb.select("Tipo único y nulo", () => {
      throw new Error("whatever");
    });
  }
};