/**
 * 
 * # fooldb
 * 
 * Base de datos basada en node.js y jsonl.
 * 
 * ## Instalación
 * 
 * ```sh
 * git clone https://github.com/allnulled/fooldb.git .
 * npm install
 * ```
 * 
 * ## Uso
 * 
 * Para ver más, puedes mirar el [test.js](https://github.com/allnulled/fooldb/blob/main/test.js)
 * 
 * ## Referencia
 * 
 */
const fs = require("fs");
const path = require("path");

/**
 * 
 * ### `Fooldb.AssertionError:Error`
 * 
 * **Uso interno solamente.**
 * 
 * Tipo de error. Para aserciones.
 * 
 */
const AssertionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};

/**
 * 
 * ### `Fooldb.assertion(condition:Boolean, message:String)`
 * 
 * **Uso interno solamente.**
 * 
 * Método para lanzar error tipo `AssertionError`.
 * 
 */
const assertion = function (condition, message) {
  if (!condition) throw new AssertionError(message);
};

/**
 * 
 * ### `Fooldb.ConstraintError:Error`
 * 
 * **Uso interno solamente.**
 * 
 * Tipo de error. Para errores de constricciones del esquema de datos.
 * 
 */
const ConstraintError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ConstraintError";
  }
};

/**
 * 
 * ### `Fooldb.MultipleConstraintErrors:Array`
 * 
 * **Uso interno solamente.**
 * 
 * Tipo de array. Para acumular errores de constricción del esquema.
 * 
 */
const MultipleConstraintErrors = class extends Array {

  /**
   * 
   * ### `Fooldb.MultipleConstraintErrors.prototype.assertion(condition:Boolean, message:String)`
   * 
   * **Uso interno solamente.**
   * 
   * Método para aplicar aserciones, pero en lugar de lanzar error, solo acumula el mensaje de error en el array.
   * 
   * 
   */
  assertion(condition, message) {
    if(!condition) this.push(message);
  }

  /**
   * 
   * ### `Fooldb.MultipleConstraintErrors.prototype.throwIfAny()`
   * 
   * **Uso interno solamente.**
   * 
   * Método que lanza un error `ConstraintError` con los errores acumulados.
   * 
   */
  throwIfAny() {
    if(!this.length) {
      return false;
    }
    throw new ConstraintError(JSON.stringify(this, null, 2));
  }

  /**
   * 
   * ### `Fooldb.MultipleConstraintErrors.prototype.throwIfAnyExcept(errorStartingWith:String)`
   * 
   * **Uso interno solamente.**
   * 
   * Igual que el anterior, pero ignorando los errores que empiecen por el String especificado en el parámetro.
   * 
   * Se usa cuando se llama a `Fooldb.prototype.initialize(...)` y lanza errores de duplicación, para silenciarlos.
   * 
   */
  throwIfAnyExcept(errorStartingWith) {
    if(!this.length) {
      return false;
    }
    const notIgnoredErrors = [];
    for(let index=this.length-1; index>=0; index--) {
      const errorMessage = this[index];
      if(!errorMessage.startsWith(errorStartingWith)) {
        notIgnoredErrors.push(errorMessage);
      }
    }
    if(notIgnoredErrors.length) {
      throw new ConstraintError(JSON.stringify(notIgnoredErrors, null, 2));
    }
  }

};


/**
 * 
 * ### `Fooldb`
 * 
 * Clase principal de la que cuelga toda la API del framework.
 * 
 */
const Fooldb = class {

  static AssertionError = AssertionError;

  static ConstraintError = ConstraintError;

  static MultipleConstraintErrors = MultipleConstraintErrors;

  static assertion = assertion;

  /**
   * 
   * ### `Fooldb.create(...args)`
   * 
   * Llama internamente al constructor.
   * 
   */
  static create(...args) {
    return new this(...args);
  }

  /**
   * 
   * ### `Fooldb.defaultOptions:Object`
   * 
   * **Uso interno solamente.**
   * 
   * Objeto con las opciones por defecto, que son:
   * 
   * ```js
   * {
   *   forceSchema: true,
   *   trace: true
   * }
   * ```
   * 
   */
  static defaultOptions = {
    forceSchema: true,
    trace: true
  };

  /**
   * 
   * ### `Fooldb.uuidAlphabet:Array<String>`
   * 
   * **Uso interno solamente.**
   * 
   * Caracteres utilizados para generar identificadores únicos largos. Incluye el alfabeto en minúsculas solamente.
   * 
   */
  static uuidAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  /**
   * 
   * ### `Fooldb.generateUuid(len:Number = 10)`
   * 
   * **Uso interno solamente.**
   * 
   * Genera un identificador único largo. 
   * 
   */
  static generateUuid(len = 10) {
    let uid = "";
    for (let i = 0; i < len; i++) {
      uid += this.uuidAlphabet[Math.floor(Math.random() * this.uuidAlphabet.length)];
    }
    return uid;
  }

  /**
   * 
   * ### `Fooldb.basicTypes:Array<String>`
   * 
   * **Uso interno solamente.**
   * 
   * Lista de tipos básicos admitidos. Estos tipos no tienen un formato de validación especial. Son: `string`, `object`, `function`, `number`, `boolean`.
   * 
   */
  static basicTypes = ["string", "object", "function", "number", "boolean"];

  /**
   * 
   * ### `Fooldb.isValidDay(text:String):Boolean`
   * 
   * Método que comprueba si un texto es un **día válido**. El formato es: `AAAA/MM/DD`.
   * 
   */
  static isValidDay(text) {
    return text.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/g).length !== 0;
  }

  /**
   * 
   * ### `Fooldb.isValidHour(text:String):Boolean`
   * 
   * Método que comprueba si un texto es una **hora válida**. El formato es: `HH:mm:ss`.
   * 
   */
  static isValidHour(text) {
    return text.match(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/g).length !== 0;
  }

  /**
   * 
   * ### `Fooldb.isValidMoment(text:String):Boolean`
   * 
   * Método que comprueba si un texto es una **hora válida**. El formato es: `AAAA/MM/DD HH:mm:ss`.
   * 
   */
  static isValidMoment(text) {
    return text.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}\:[0-9]{2}\:[0-9]{2}$/g).length !== 0;
  }

  /**
   * 
   * ### `async Fooldb.$cleanStreams(readStream:ReaderStream, writeStream:WriterStream, tmpFile:String)`
   * 
   * **Uso interno solamente.**
   * 
   * Método que destruye los streams que haya abiertos y elimina el fichero temporal si existe.
   * 
   */
  static async $cleanStreams(readStream, writeStream, tmpFile) {
    try {
      if (writeStream && !writeStream.closed) writeStream.destroy();
      if (readStream && !readStream.closed) readStream.destroy();
      if (await this.$existsNode(tmpFile)) {
        await fs.promises.unlink(tmpFile);
      }
    } catch (_) {
      // Silenciar: limpieza best-effort
    }
  }

  /**
   * 
   * ### `Fooldb.prototype.$trace(message:String)`
   * 
   * **Uso interno solamente.**
   * 
   * Método para traza de llamadas. Imprime por consola un mensaje de traza si `this.options.trace` está en `true`.
   * 
   */
  $trace(message) {
    if (this.options.trace) {
      console.log("[trace][fooldb] " + message);
    }
  }

  /**
   * 
   * ### `Fooldb.constructor(basedir:String, options:Object = {})`
   * 
   * Método constructor.
   * 
   * Establece `this.basedir` basándose en el parámetro.
   * 
   * Establece `this.options` basándose en `this.constructor.defaultOptions` y el parámetro.
   * 
   * Finalmente, inicializa el `this.schema` llamando a `this.$loadSchemaFromBasedir()`.
   * 
   */
  constructor(basedir, options = {}) {
    this.basedir = basedir;
    this.options = Object.assign({}, this.constructor.defaultOptions, options);
    this.schema = null;
    this.$loadSchemaFromBasedir();
  }

  /**
   * 
   * ### `Fooldb.prototype.composePath(...subpaths:Array<String>)`
   * 
   * Método para construir rutas relativas a `this.basedir`.
   * 
   */
  composePath(...subpaths) {
    this.$trace("Fooldb.prototype.composePath");
    return path.resolve(this.basedir, ...subpaths);
  }

  /**
   * 
   * ### `Fooldb.prototype.$loadSchemaFromBasedir()`
   * 
   * Método que carga el `${this.basedir}/schema.js` (de haberlo, si no falla silenciosamente) utilizando `require`. Borra el caché antes.
   * 
   * Para ver un ejemplo de `schema` puedes ir a [test/db1/schema.js](https://github.com/allnulled/fooldb/blob/main/test/db1/schema.js).
   * 
   */
  $loadSchemaFromBasedir() {
    this.$trace("Fooldb.prototype.$loadSchemaFromBasedir");
    const schemaPath = this.composePath("schema.js");
    try {
      delete require.cache[schemaPath];
      this.schema = require(schemaPath);
    } catch (error) {
      // @OK: no schema here
    }
  }

  /**
   * 
   * ### `async Fooldb.prototype.$checkTableValueBySchema(table:String, value:Object, operation:String):MultipleConstraintErrors`
   * 
   * **Uso interno solamente.**
   * 
   * Método que acumula y devuelve los errores de constricción.
   * 
   * En `operation` pueden ir: `inserting`, `updating` o `initializing`.
   * 
   * Importante es que no lanza errores, solo los acumula en una instancia `MultipleConstraintErrors` y los devuelve, para que el contexto decida qué hacer.
   * 
   * Esto se hace para separar la comprobación de errores de la gestión de estos.
   * 
   */
  async $checkTableValueBySchema(table, value, operation) {
    this.$trace("Fooldb.prototype.$checkTableValueBySchema");
    if (!this.options.forceSchema) {
      this.$trace("Schema constrictions are not activated");
      return false;
    }
    assertion(typeof this.schema === "object", `Database requires a schema because option «forceSchema» is activated while «${operation}» on «$checkTableValueBySchema»`);
    assertion(table in this.schema.tables, `Required parameter «table» to exist in «this.schema» on «Fooldb.prototype.$checkTableValueBySchema»`);
    // File & reader:
    const file = this.composePath(`data/${table}/data.jsonl`);
    const readline = require("readline").createInterface({
      input: fs.createReadStream(file, { encoding: "utf8" }),
      crlfDelay: Infinity
    });
    // Column definitions:
    const columnDefinitions = this.schema.tables[table].columns;
    const columnIds = Object.keys(columnDefinitions);
    // Prepare MultipleConstraintErrors instance:
    const constraintErrors = new MultipleConstraintErrors();
    // Iterate columns:
    for (let index = 0; index < columnIds.length; index++) {
      const columnId = columnIds[index];
      const columnDefinition = columnDefinitions[columnId];
      const isRequired = columnDefinition.required === true;
      const mustBeUnique = columnDefinition.unique === true;
      const mustBeType = columnDefinition.type || undefined;
      Checking_required: {
        // Si no es requerido, salta el paso:
        if (!isRequired) {
          break Checking_required;
        }
        // Si es un update, se supone que puede estar ya en el row, así que no se comprueba:
        if (operation === "updating") {
          break Checking_required;
        }
        // Comprobación del require:
        const hasColumn = typeof value[columnId] !== "undefined";
        constraintErrors.assertion(hasColumn, `Schema constraint «required» requires column «${table}.${columnId}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
      }
      Checking_type: {
        // Si no fuerza el tipo, salta el paso:
        if (typeof mustBeType === "undefined") {
          break Checking_type;
        }
        // Si no es requerido y...
        if (!isRequired) {
          // ...tampoco es definido, salta el paso:
          if (typeof value[columnId] === "undefined") {
            break Checking_type;
          }
        }
        // Si es un update y...
        if (operation === "updating") {
          // ...tampoco es definido, salta el paso:
          if (typeof value[columnId] === "undefined") {
            break Checking_type;
          }
        }
        // Comprobación del tipo:
        if(this.constructor.basicTypes.indexOf(mustBeType) !== -1) {
          const matchesType = typeof value[columnId] === mustBeType;
          constraintErrors.assertion(matchesType, `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
        } else {
          if(mustBeType === "integer") {
            constraintErrors.assertion(Number.isInteger(value[columnId]), `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
          } else if(mustBeType === "array") {
            constraintErrors.assertion(Array.isArray(value[columnId]), `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
          } else if(mustBeType === "day") {
            constraintErrors.assertion(this.constructor.isValidDay(value[columnId]), `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
          } else if(mustBeType === "hour") {
            constraintErrors.assertion(this.constructor.isValidHour(value[columnId]), `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
          } else if(mustBeType === "moment") {
            constraintErrors.assertion(this.constructor.isValidMoment(value[columnId]), `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
          }
        }
      }
      Checking_unique: {
        if (!mustBeUnique) {
          break Checking_unique;
        }
        Iterating_rows:
        for await (const line of readline) {
          if (!line.trim()) continue;
          const row = JSON.parse(line);
          // Si es el mismo row, salta el row:
          if (row.uid === value.uid) {
            continue Iterating_rows;
          }
          const matchesValue = row[columnId] === value[columnId];
          constraintErrors.assertion(!matchesValue, `Schema constraint «unique» is avoiding to duplicate «${table}#${row.uid}.${columnId}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
        }
      }
    }
    return constraintErrors;    
  }

  /**
   * 
   * ### `async Fooldb.prototype.$pickNextId(table:String):String`
   * 
   * **Uso interno solamente.**
   * 
   * Método que:
   * 
   *  - Lee el `${this.basedir}/data/${table}/ids.json`
   *  - Saca el último `uid`
   *  - Lo incrementa y lo persiste
   *  - Devuelve el `uid` sacado.
   * 
   */
  async $pickNextId(table) {
    this.$trace("Fooldb.prototype.$pickNextId");
    const filepathForIds = this.composePath(`data/${table}/ids.json`);
    const contents = await fs.promises.readFile(filepathForIds, "utf8");
    const json = JSON.parse(contents);
    const uid = json.nextId++;
    await fs.promises.writeFile(filepathForIds, JSON.stringify(json), "utf8");
    return uid;
  }

  /**
   * 
   * ### `Fooldb.prototype.$existsNode(fileOrDirectory:String):Boolean`
   * 
   * **Uso interno solamente.**
   * 
   * Método que devuelve un booleano indicando si el nodo existe como fichero o directorio.
   * 
   */
  async $existsNode(fileOrDirectory) {
    this.$trace("Fooldb.prototype.$existsNode");
    try {
      await fs.promises.access(fileOrDirectory)
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 
   * ### `async Fooldb.prototype.ensureTable(table:String)`
   * 
   * Método que inicializa:
   * 
   * - El directorio de tabla: `${this.basedir}/data/${table}`
   * - El fichero de datos: `${this.basedir}/data/${table}/data.jsonl`
   * - El fichero de uids: `${this.basedir}/data/${table}/ids.json`
   * 
   */
  async ensureTable(table) {
    this.$trace("Fooldb.prototype.ensureTable");
    const dirpath = this.composePath(`data/${table}`);
    const filepathForData = `${dirpath}/data.jsonl`;
    const filepathForIds = `${dirpath}/ids.json`;
    Inicializar_carpeta: {
      const exists = await this.$existsNode(dirpath);
      if (!exists) {
        await fs.promises.mkdir(dirpath);
      }
    }
    Inicializar_fichero_de_datos: {
      const exists = await this.$existsNode(filepathForData);
      if (!exists) {
        await fs.promises.writeFile(filepathForData, "", "utf8");
      }
    }
    Inicializar_fichero_de_ids: {
      const exists = await this.$existsNode(filepathForIds);
      if (!exists) {
        await fs.promises.writeFile(filepathForIds, JSON.stringify({ nextId: 0 }), "utf8");
      }
    }
  }

  /**
   * 
   * ### `async Fooldb.prototype.emptyTable(table:String)`
   * 
   * Método que vacía una tabla, sobreescribiendo en blanco el `${this.basedir}/data/${table}/data.jsonl`.
   * 
   */
  async emptyTable(table) {
    this.$trace("Fooldb.prototype.ensureTable");
    const filepathForData = this.composePath(`data/${table}/data.jsonl`);
    await fs.promises.writeFile(filepathForData, "", "utf8");
  }

  /**
   * 
   * ### `async Fooldb.prototype.select(table:String, filter:Function):Array<Object>`
   * 
   * Método select de una tabla.
   * 
   * La función `filter` solo recibe el `row:Object`.
   * 
   */
  async select(table, filter) {
    this.$trace("Fooldb.prototype.select");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.select»");
    assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.select»");
    const file = this.composePath(`data/${table}/data.jsonl`);
    const dataset = [];
    const readline = require("readline").createInterface({
      input: fs.createReadStream(file, { encoding: "utf8" }),
      crlfDelay: Infinity
    });
    for await (const line of readline) {
      if (!line.trim()) continue;
      const row = JSON.parse(line);
      if (filter(row)) {
        dataset.push(row);
      }
    }
    return dataset;
  }

  /**
   * 
   * ### `Fooldb.prototype.initialize(table:String, value:Object)`
   * 
   * Este método es un insert con silencios.
   * 
   * Lo único que si solo lanza errores de duplicación, no propaga el error, simplemente devuelve `false` y no inserta nada.
   * 
   */
  async initialize(table, value) {
    this.$trace("Fooldb.prototype.initialize");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.initialize»");
    assertion((typeof value === "object") && (value !== null), "Parameter «value» must be «object» on «Fooldb.prototype.initialize»");
    const constraintErrors = await this.$checkTableValueBySchema(table, value, "initializing");
    constraintErrors.throwIfAnyExcept("Schema constraint «unique»");
    if(constraintErrors.length) {
      // Si tiene errores, no se inserta:
      return false;
    }
    const file = this.composePath(`data/${table}/data.jsonl`);
    const uid = await this.$pickNextId(table);
    const uuid = this.constructor.generateUuid();
    const record = Object.assign({ uid, uuid }, value);
    const line = JSON.stringify(record) + "\n";
    await fs.promises.appendFile(file, line, "utf8");
    return uid;
  }

  /**
   * 
   * ### `Fooldb.prototype.insert(table:String, value:Object):String`
   * 
   * Método para insertar una row en una tabla. Hará las comprobaciones pertinentes de constricción de esquema antes.
   * 
   */
  async insert(table, value) {
    this.$trace("Fooldb.prototype.insert");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.insert»");
    assertion((typeof value === "object") && (value !== null), "Parameter «value» must be «object» on «Fooldb.prototype.insert»");
    const constraintErrors = await this.$checkTableValueBySchema(table, value, "inserting");
    constraintErrors.throwIfAny();
    const file = this.composePath(`data/${table}/data.jsonl`);
    const uid = await this.$pickNextId(table);
    const record = Object.assign({}, value, { uid });
    const line = JSON.stringify(record) + "\n";
    await fs.promises.appendFile(file, line, "utf8");
    return uid;
  }

  /**
   * 
   * ### `Fooldb.prototype.update(table:String, filter:Function, value:Object):Array<Integer>`
   * 
   * Método para actualizar registros de una tabla.
   * 
   * Devuelve los `uid:Integer` alterados por la operación.
   * 
   */
  async update(table, filter, value) {
    this.$trace("Fooldb.prototype.update");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.update»");
    assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.update»");
    assertion((typeof value === "object") && (value !== null), "Parameter «value» must be «object» on «Fooldb.prototype.update»");
    const constraintErrors = await this.$checkTableValueBySchema(table, value, "updating");
    constraintErrors.throwIfAny();
    const uuid = this.constructor.generateUuid();
    const file = this.composePath(`data/${table}/data.jsonl`);
    const tmpFile = this.composePath(`data/${table}/temporary-${uuid}.jsonl`);
    const updatedUids = [];
    let writeStream;
    let readStream;
    let readline;
    try {
      readStream = fs.createReadStream(file, { encoding: "utf8" });
      writeStream = fs.createWriteStream(tmpFile, { encoding: "utf8" });
      readline = require("readline").createInterface({
        input: readStream,
        crlfDelay: Infinity
      });
      Iterating_rows:
      for await (const line of readline) {
        if (!line.trim()) continue Iterating_rows;
        const obj = JSON.parse(line);
        if (filter(obj)) {
          const updated = Object.assign({}, obj, value);
          updatedUids.push(updated.uid);
          writeStream.write(JSON.stringify(updated) + "\n");
        } else {
          writeStream.write(line + "\n");
        }
      }
      await new Promise(resolve => writeStream.end(resolve));
      await fs.promises.rename(tmpFile, file);
      return updatedUids;
    } finally {
      await this.constructor.$cleanStreams(readStream, writeStream, tmpFile);
    }
  }

  /**
   * 
   * ### `Fooldb.prototype.delete(table:String, filter:Function):Array<Integer>`
   * 
   * Método para eliminar registros de una tabla.
   * 
   * Devuelve los `uid:Integer` eliminados por la operación.
   * 
   */
  async delete(table, filter) {
    this.$trace("Fooldb.prototype.delete");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.delete»");
    assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.delete»");
    const uuid = this.constructor.generateUuid();
    const file = this.composePath(`data/${table}/data.jsonl`);
    const tmpFile = this.composePath(`data/${table}/temporary-${uuid}.jsonl`);
    const deletedUids = [];
    let readStream;
    let writeStream;
    let readline;
    try {
      readStream = fs.createReadStream(file, { encoding: "utf8" });
      writeStream = fs.createWriteStream(tmpFile, { encoding: "utf8" });
      readline = require("readline").createInterface({
        input: readStream,
        crlfDelay: Infinity
      });
      for await (const line of readline) {
        if (!line.trim()) continue;
        const obj = JSON.parse(line);
        if (filter(obj)) {
          if (obj.uid) deletedUids.push(obj.uid);
          continue;
        }
        writeStream.write(line + "\n");
      }
      await new Promise(resolve => writeStream.end(resolve));
      await fs.promises.rename(tmpFile, file);
      return deletedUids;
    } finally {
      await this.constructor.$cleanStreams(readStream, writeStream, tmpFile);
    }
  }

};

module.exports = Fooldb;

/**
 * 
 * ## Más información
 * 
 * Para más información, puedes consultar los tests.
 * 
 */