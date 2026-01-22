Fooldb_core_api: {
  /**
   * 
   * # API de Fooldb
   * 
   * {{ TOC }}
   * 
   */

  // No debería haber imports externos.

  /**
   * 
   * ## `Fooldb.runningOn:Object`
   * 
   * **Uso interno solamente.**
   * 
   * Contiene indicadores del entorno donde está funcionando el javascript.
   * 
   * ```js
   * {
   *   browser: Boolean,
   *   browserOnly: Boolean,
   *   nodejs: Boolean,
   *   nodejsOnly: Boolean,
   * }
   * ```
   * 
   */
  const runningOn = {
    browser: (typeof window !== "undefined"),
    browserOnly: (typeof window !== "undefined") && (typeof global === "undefined"),
    nodejs: (typeof global !== "undefined"),
    nodejsOnly: (typeof window === "undefined") && (typeof global !== "undefined"),
  };

  /**
   * 
   * ## `Fooldb.AssertionError:Error`
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
   * ## `Fooldb.assertion(condition:Boolean, message:String)`
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
   * ## `Fooldb.ConstraintError:Error`
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
   * ## `Fooldb.MultipleConstraintErrors:Array`
   * 
   * **Uso interno solamente.**
   * 
   * Tipo de array. Para acumular errores de constricción del esquema.
   * 
   */
  const MultipleConstraintErrors = class extends Array {

    /**
     * 
     * ## `Fooldb.MultipleConstraintErrors.prototype.assertion(condition:Boolean, message:String)`
     * 
     * **Uso interno solamente.**
     * 
     * Método para aplicar aserciones, pero en lugar de lanzar error, solo acumula el mensaje de error en el array.
     * 
     * 
     */
    assertion(condition, message) {
      if (!condition) {
        this.push(message);
        return false;
      }
      return true;
    }

    /**
     * 
     * ## `Fooldb.MultipleConstraintErrors.prototype.throwIfAny()`
     * 
     * **Uso interno solamente.**
     * 
     * Método que lanza un error `ConstraintError` con los errores acumulados.
     * 
     */
    throwIfAny() {
      if (!this.length) {
        return false;
      }
      throw new ConstraintError(JSON.stringify(this, null, 2));
    }

    /**
     * 
     * ## `Fooldb.MultipleConstraintErrors.prototype.throwIfAnyExcept(errorStartingWith:String)`
     * 
     * **Uso interno solamente.**
     * 
     * Igual que el anterior, pero ignorando los errores que empiecen por el String especificado en el parámetro.
     * 
     * Se usa cuando se llama a `Fooldb.prototype.initialize(...)` y lanza errores de duplicación, para silenciarlos.
     * 
     */
    throwIfAnyExcept(errorStartingWith) {
      if (!this.length) {
        return false;
      }
      const notIgnoredErrors = [];
      for (let index = this.length - 1; index >= 0; index--) {
        const errorMessage = this[index];
        if (!errorMessage.startsWith(errorStartingWith)) {
          notIgnoredErrors.push(errorMessage);
        }
      }
      if (notIgnoredErrors.length) {
        throw new ConstraintError(JSON.stringify(notIgnoredErrors, null, 2));
      }
    }

  };


  /**
   * 
   * ## `Fooldb`
   * 
   * Clase principal de la que cuelga toda la API del framework.
   * 
   */
  const Fooldb = class {

    static $trace(message) {
      if (this.staticOptions.trace) {
        console.log("[trace][Fooldb] " + message);
      }
    }

    static staticOptions = {
      trace: true,
    };

    static AssertionError = AssertionError;

    static ConstraintError = ConstraintError;

    static MultipleConstraintErrors = MultipleConstraintErrors;

    static assertion = assertion;

    static runningOn = runningOn;

    static fs = runningOn.browserOnly ? FooldbBrowserPolyfill.fs : require("fs");

    static path = runningOn.browserOnly ? FooldbBrowserPolyfill.path : require("path");

    static readline = runningOn.browserOnly ? FooldbBrowserPolyfill.readline : require("readline");

    /**
     * 
     * ## `Fooldb.create(basedir:String)`
     * 
     * Método que llama internamente al `Fooldb.constructor(basedir)`. Pero no al `load`, que es necesario para cargar el `schema.js`.
     * 
     * Se recomienda usar directamente `await Fooldb.load(basedir)` para obtener una instancia cargada de `Fooldb`.
     * 
     */
    static create(...args) {
      return new this(...args);
    }

    /**
     * 
     * ## `async Fooldb.load(basedir:String):Fooldb`
     * 
     * Método que llama al `Fooldb.constructor(basedir)` y al `await Fooldb.prototype.load()`.
     * 
     * Devuelve la instancia de `Fooldb` con el `schema` cargado.
     * 
     */
    static async load(...args) {
      this.$trace("Fooldb.load");
      const fooldb = new this(...args);
      return await fooldb.load();
    }

    /**
     * 
     * ## `Fooldb.defaultOptions:Object`
     * 
     * **Uso interno solamente.**
     * 
     * Objeto con las opciones por defecto, que son:
     * 
     * ```js
     * {
     *   trace: true
     * }
     * ```
     * 
     */
    static defaultOptions = {
      trace: true
    };

    /**
     * 
     * ## `Fooldb.uuidAlphabet:Array<String>`
     * 
     * **Uso interno solamente.**
     * 
     * Caracteres utilizados para generar identificadores únicos largos. Incluye el alfabeto en minúsculas solamente.
     * 
     */
    static uuidAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    /**
     * 
     * ## `Fooldb.basicTypes:Array<String>`
     * 
     * **Uso interno solamente.**
     * 
     * Lista de tipos básicos admitidos. Estos tipos no tienen un formato de validación especial. Son: `string`, `object`, `function`, `number`, `boolean`.
     * 
     */
    static basicTypes = ["string", "object", "function", "number", "boolean"];

    /**
     * 
     * ## `Fooldb.constructor(basedir:String, options:Object = {})`
     * 
     * Método constructor.
     * 
     * Establece `this.basedir` basándose en el parámetro.
     * 
     * Establece `this.options` basándose en `this.constructor.defaultOptions` y el parámetro.
     * 
     * Finalmente, inicializa el `this.schema` llamando a `this.loadSchemaFromBasedir()`.
     * 
     */
    constructor(basedir, options = {}) {
      this.options = Object.assign({}, this.constructor.defaultOptions, options);
      this.$trace("Fooldb.prototype.constructor");
      this.basedir = basedir;
      this.schema = null;
    }

    DEBUG(message) {
      console.log("[DEBUG] " + message);
    }

    INSPECT(something) {
      console.log("[INSPECT]", something);
    }

    /**
     * 
     * ## `Fooldb.prototype.generateUuid(len:Number = 10)`
     * 
     * **Uso interno solamente.**
     * 
     * Genera un identificador único largo. 
     * 
     */
    generateUuid(len = 10) {
      this.$trace("Fooldb.prototype.generateUuid");
      let uid = "";
      for (let i = 0; i < len; i++) {
        uid += this.constructor.uuidAlphabet[Math.floor(Math.random() * this.constructor.uuidAlphabet.length)];
      }
      return uid;
    }

    /**
     * 
     * ## `Fooldb.prototype.isValidDay(text:String):Boolean`
     * 
     * Método que comprueba si un texto es un **día válido**. El formato es: `AAAA/MM/DD`.
     * 
     */
    isValidDay(text) {
      this.$trace("Fooldb.prototype.isValidDay");
      if (typeof text !== "string") {
        return false;
      }
      return text.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/g).length !== 0;
    }

    /**
     * 
     * ## `Fooldb.prototype.isValidHour(text:String):Boolean`
     * 
     * Método que comprueba si un texto es una **hora válida**. El formato es: `HH:mm:ss`.
     * 
     */
    isValidHour(text) {
      this.$trace("Fooldb.isValidHour");
      if (typeof text !== "string") {
        return false;
      }
      return text.match(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/g).length !== 0;
    }

    /**
     * 
     * ## `Fooldb.prototype.isValidMoment(text:String):Boolean`
     * 
     * Método que comprueba si un texto es una **hora válida**. El formato es: `AAAA/MM/DD HH:mm:ss`.
     * 
     */
    isValidMoment(text) {
      this.$trace("Fooldb.isValidMoment");
      if (typeof text !== "string") {
        return false;
      }
      return text.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}\:[0-9]{2}\:[0-9]{2}$/g).length !== 0;
    }

    /**
     * 
     * ## `async Fooldb.prototype.$closeFileHandlers(readliner:Readline, readStream:ReaderStream, writeStream:WriterStream, tmpFile:String)`
     * 
     * **Uso interno solamente.**
     * 
     * Método que destruye los streams que haya abiertos y elimina el fichero temporal si existe.
     * 
     * **Nota:** esta función ha dado muchos problemas. Ahora parece que va perfecto. La API de Streams de Node.js es muy poderosa, 
     * aunque estés trabajando a nivel de JavaScript, puedes poner programas a funcionar contra volúmenes de datos infinitos. Todas las otras 
     * APIs de ficheros de Node.js, no te permitirían eso.
     * 
     * Este método es clave para que la base de datos no deje *filehandlers* abiertos, y haya inconsistencias luego entre operaciones de ficheros, 
     * mientras los ficheros puedan escalar a magnitudes mayores.
     * 
     */
    async $closeFileHandlers(readliner, readStream, writeStream, tmpFile) {
      this.$trace("Fooldb.prototype.$closeFileHandlers");
      if (readliner) {
        readliner.close();
      }
      if (writeStream && !writeStream.destroyed) {
        await new Promise(resolve => {
          writeStream.once("finish", resolve);
          writeStream.once("error", resolve);
          writeStream.end();
        });
      }
      if (readStream && !readStream.destroyed) {
        await new Promise(resolve => {
          readStream.once("close", resolve);
          readStream.once("error", resolve);
          readStream.destroy();
        });
      }
      if (tmpFile && await this.existsNode(tmpFile)) {
        try {
          await this.constructor.fs.promises.unlink(tmpFile);
        } catch (_) {
          // @OK
        }
      }
    }

    /**
     * 
     * ## `Fooldb.prototype.findMissingElements(array1:Array, array2:Array):Array`
     * 
     * **Uso interno principalmente.**
     * 
     * Método que encuentra los elementos del `array1` que **no aparecen** en el `array2`.
     * 
     */
    findMissingElements(array1, array2) {
      this.$trace("Fooldb.prototype.findMissingElements");
      const set2 = new Set(array2);
      return array1.filter(item => !set2.has(item));
    }

    /**
     * 
     * ## `Fooldb.prototype.removeElementFromArray(item:any, array:Array)`
     * 
     * **Uso interno principalmente.**
     * 
     * Método que elimina un elemento de un array.
     * 
     */
    removeElementFromArray(item, array) {
      this.$trace("Fooldb.prototype.removeElementFromArray");
      const pos = array.indexOf(item);
      if (pos === -1) return false;
      array.splice(pos, 1);
    }

    /**
     * 
     * ## `Fooldb.prototype.isArrayOfIntegers(arrayOfNumbers:Array<Integer>):Boolean`
     * 
     * **Uso interno principalmente.**
     * 
     * Método que comprueba (devolviendo booleano) si el parámetro es:
     * 
     *   - un `Array`
     *   - con elementos solamente de tipo `Integer`
     * 
     */
    isArrayOfIntegers(arrayOfNumbers) {
      this.$trace("Fooldb.prototype.isArrayOfIntegers");
      const isArray = Array.isArray(arrayOfNumbers);
      if (!isArray) return false;
      for (let index = 0; index < arrayOfNumbers.length; index++) {
        const isInteger = Number.isInteger(arrayOfNumbers[index]);
        if (!isInteger) {
          return false;
        }
      }
      return true;
    }

    /**
     * 
     * ## `async Fooldb.prototype.wait(ms:Number)`
     * 
     * **Uso interno solamente.**
     * 
     * Método que lanza una espera de tantos milisegundos como `ms:Number`.
     * 
     */
    wait(ms) {
      this.$trace("Fooldb.prototype.wait");
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
      });
    }

    /**
     * 
     * ## `async Fooldb.prototype.existsNode(fileOrDirectory:String):Boolean`
     * 
     * **Uso interno solamente.**
     * 
     * Método que devuelve un booleano indicando si el nodo existe como fichero o directorio.
     * 
     */
    async existsNode(fileOrDirectory) {
      this.$trace("Fooldb.prototype.existsNode");
      try {
        await this.constructor.fs.promises.access(fileOrDirectory);
        return true;
      } catch (error) {
        return false;
      }
    }

    /**
     * 
     * ## `async Fooldb.prototype.readJson(file:String):any`
     * 
     * **Uso interno solamente.**
     * 
     * Método para leer un JSON.
     * 
     */
    async readJson(file) {
      this.$trace("Fooldb.prototype.readJson");
      const json = await this.constructor.fs.promises.readFile(file, "utf8");
      const data = JSON.parse(json);
      return data;
    }

    /**
     * 
     * ## `async Fooldb.prototype.writeJson(file:String, data:any)`
     * 
     * **Uso interno solamente.**
     * 
     * Método para escribir un JSON.
     * 
     */
    async writeJson(file, data) {
      this.$trace("Fooldb.prototype.writeJson");
      const json = JSON.stringify(data);
      await this.constructor.fs.promises.writeFile(file, json, "utf8");
      return data;
    }

    /**
     * 
     * ## `async Fooldb.rmdirRecursively(file:String)`
     * 
     * **Uso interno principalmente.**
     * 
     * Elimina ficheros recursivamente, de forma 100% segura.
     * 
     * No vuelve de la Promise por simplemente haber dejado *encoladas* las operaciones de eliminación, como según ChatGPT hace `fs.promises.rm(file, {recursive:true})`.
     * 
     * Este método repasa los nodos recursivamente a mano, y vuelve solo cuando se han borrado todos.
     * 
     */
    async deleteRecursively(directory) {
      this.$trace("Fooldb.deleteRecursively");
      let nodes;
      try {
        nodes = await this.constructor.fs.promises.readdir(directory, { withFileTypes: true });
      } catch (error) {
        if (error.code === "ENOENT") {
          return; // ya borrado
        }
        throw error;
      }
      for (const entry of nodes) {
        const fullPath = this.constructor.path.resolve(directory, entry.name);
        if (entry.isDirectory()) {
          await this.deleteRecursively(fullPath);
        } else {
          await this.constructor.fs.promises.unlink(fullPath);
        }
      }
      await this.constructor.fs.promises.rm(directory, { recursive: true }); // finalmente borramos el directorio vacío
    }


    /**
     * 
     * ## `Fooldb.prototype.$trace(message:String)`
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
     * ## `async Fooldb.prototype.load():Fooldb`
     * 
     * Método que **es necesario llamar** para que cargue el `schema.js`, que es necesario tener cargado para poder hacer operaciones.
     * 
     * El método es asíncrono porque el fichero en browser se carga asíncronamente.
     * 
     * Por debajo se llama a `await Fooldb.prototype.loadSchemaFromBasedir()`.
     * 
     */
    async load() {
      this.$trace("Fooldb.prototype.load");
      await this.loadSchemaFromBasedir();
      return this;
    }

    trace = {
      /**
       * 
       * ## `Fooldb.prototype.trace.activate()`
       * 
       * Activa la opción de trace.
       * 
       */
      activate: () => {
        this.$trace("Fooldb.prototype.trace.activate");
        this.options.trace = true;
      },
      /**
       * 
       * ## `Fooldb.prototype.trace.deactivate()`
       * 
       * Desactiva la opción de trace.
       * 
       */
      deactivate: () => {
        this.$trace("Fooldb.prototype.trace.deactivate");
        this.options.trace = false;
      }
    }

    /**
     * 
     * ## `Fooldb.prototype.composePath(...subpaths:Array<String>)`
     * 
     * Método para construir rutas relativas a `this.basedir`.
     * 
     */
    composePath(...subpaths) {
      this.$trace("Fooldb.prototype.composePath");
      return this.constructor.path.resolve(this.basedir, ...subpaths);
    }

    /**
     * 
     * ## `async Fooldb.prototype.loadSchemaFromBasedir()`
     * 
     * Método que carga el `${this.basedir}/schema.js` (debe haberlo, si no lanzará un error) utilizando `require` en node.js y `await FooldbBrowserPolyfill.require` en browser. Borra el `require.cache` antes.
     * 
     * Para ver un ejemplo de `schema` puedes ir a [test/db1/schema.js](https://github.com/allnulled/fooldb/blob/main/test/db1/schema.js).
     * 
     */
    async loadSchemaFromBasedir() {
      this.$trace("Fooldb.prototype.loadSchemaFromBasedir");
      const schemaPath = this.composePath("schema.js");
      // El `schema.js` es obligatorio.
      if (runningOn.browserOnly) {
        this.schema = await FooldbBrowserRequire(schemaPath);
      } else {
        delete require.cache[schemaPath];
        this.schema = require(schemaPath);
      }
    }

    /**
     * 
     * ## `Fooldb.prototype.$findMissingUids(table:String, uids:Array<Integer>):Array<Integer>`
     * 
     * **Uso interno principalmente.**
     * 
     * Método que encuentra los `uid:Integer` que no aparecen en la `table:String` especificada.
     * 
     * Por debajo usa `Fooldb.prototype.select` y `Fooldb.prototype.findMissingElements`.
     * 
     */
    async $findMissingUids(table, uids) {
      this.$trace("Fooldb.prototype.$findMissingUids");
      const matchedRows = await this.select(table, row => {
        return uids.indexOf(row.uid) !== -1;
      });
      const matchedUids = matchedRows.map(row => row.uid);
      const missingUids = this.findMissingElements(uids, matchedUids);
      return missingUids;
    }

    /**
     * 
     * ## `async Fooldb.prototype.$checkTableValueBySchema(table:String, row:Object, operation:String):MultipleConstraintErrors`
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
     * Las comprobaciones que se llevan a cabo son, iterando las columnas del esquema:
     * 
     * - Comprobación 1: si es `nullable:false`
     *    - Si es operación `updating` se evita: porque se supone que el `row` puede tener el valor que se omite
     *    - Si es operación `inserting` o `initializing`: se comprueba que la columna no sea `undefined` en el `row`.
     * - Comprobación 2: si es `type:any`
     *    - Si no especifica el tipo, se salta el paso
     *    - Si no es `nullable:false` y no especifica la columna en la `row`, se salta el paso
     *    - Si es operación `updating` y no especifica la columna en la `row`, se salta el paso
     *    - Comprueba que el tipo sea válido, sea tipo básico o avanzado.
     * - Comprobación 3: si es `unique:true`
     *    - Si no requiere de ser `unique`, se salta el paso.
     *    - Comprueba que el `data/${table}/indexes/${column}.json` no tenga el valor especificado en la columna
     *       - O de tenerlo, es el mismo `uid`
     * - Comprobación 4: si la tabla tiene `openColumns:true` o no:
     *    - Si tiene `openColumns:true`, se salta el paso.
     *    - Comprueba que todas las propiedades de `row` estén en el `this.schema[table].columns` como claves.
     * 
     */
    async $checkTableValueBySchema(table, row, operation) {
      this.$trace("Fooldb.prototype.$checkTableValueBySchema");
      assertion(typeof this.schema === "object", `Required configuration «schema» to be an object on «$checkTableValueBySchema»`);
      assertion(table in this.schema.tables, `Required parameter «table» to exist in «this.schema» on «Fooldb.prototype.$checkTableValueBySchema»`);
      // File & reader:
      const file = this.composePath(`data/${table}/data.jsonl`);
      // Prepare MultipleConstraintErrors instance:
      const constraintErrors = new MultipleConstraintErrors();
      let readStream = null;
      let readliner = null;
      try {
        // Retrieve column definitions:
        const columnDefinitions = this.schema.tables[table].columns;
        const columnIds = Object.keys(columnDefinitions);
        // Iterate columns:
        const isUpdating = operation === "updating";
        const isInserting = operation === "inserting";
        const isInitializing = operation === "initializing";
        // Comprobación de schema.tables[table].openColumns:
        Checking_open_columns: {
          const hasOpenColumns = this.schema.tables[table].openColumns || false;
          if (hasOpenColumns) {
            break Checking_open_columns;
          }
          const rowColumnIds = Object.keys(row);
          const extraColumns = this.findMissingElements(rowColumnIds, columnIds);
          this.removeElementFromArray("uid", extraColumns);
          constraintErrors.assertion(extraColumns.length === 0, `Schema constraint «table.openColumns» is not admitting «${table}» to have columns «${extraColumns.join("»,«")}» on «Fooldb.prototype.$checkTableValueBySchema»`);
        }
        for (let index = 0; index < columnIds.length; index++) {
          // Cogemos nombre y definición de la columna:
          const columnId = columnIds[index];
          const columnDefinition = columnDefinitions[columnId];
          // Parcheamos undefineds en inserting o initializing cuando es nullable con null:
          if (typeof row[columnId] === "undefined" && (isInserting || isInitializing)) {
            row[columnId] = null;
          }
          // Cogemos variables interesantes sobre el valor y la definición de la columna:
          const isUndefined = typeof row[columnId] === "undefined";
          const isNull = (!isUndefined) && (row[columnId] === null);
          // Por defecto, todos los campos son nullable, esto significa que solo tiene sentido especificar `nullable:false` en el `schema.js`
          const isNullable = typeof columnDefinition.nullable === "undefined" ? false : columnDefinition.nullable;
          const mustBeUnique = columnDefinition.unique === true;
          const mustBeType = columnDefinition.type || undefined;
          Checking_nullable: {
            // Si es nulable, salta el paso:
            if (isNullable) {
              break Checking_nullable;
            }
            // Si es un update, se supone que puede estar ya en el row, así que no se comprueba:
            if (isUpdating) {
              break Checking_nullable;
            }
            // Comprobación del require:
            const hasColumn = typeof row[columnId] !== "undefined";
            constraintErrors.assertion(hasColumn, `Schema constraint «column.nullable» requires column «${table}.${columnId}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
          }
          Checking_type: {
            // Si no fuerza el tipo, salta el paso:
            if (typeof mustBeType === "undefined") {
              break Checking_type;
            }
            // Si es un update y tampoco es definido, salta el paso:
            if (isUpdating && isUndefined) {
              break Checking_type;
            }
            // Si es nulable y es nulo, salta el paso:
            if (isNull && isNullable) {
              break Checking_type;
            }
            // Comprobación del tipo:
            if (this.constructor.basicTypes.indexOf(mustBeType) !== -1) {
              // Si el tipo es un básico:
              constraintErrors.assertion(typeof row[columnId] === mustBeType, `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
            } else {
              // Si el tipo no es un básico:
              if (mustBeType === "integer") {
                constraintErrors.assertion(Number.isInteger(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
              } else if (mustBeType === "array") {
                constraintErrors.assertion(Array.isArray(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
              } else if (mustBeType === "day") {
                constraintErrors.assertion(this.isValidDay(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
              } else if (mustBeType === "hour") {
                constraintErrors.assertion(this.isValidHour(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
              } else if (mustBeType === "moment") {
                constraintErrors.assertion(this.isValidMoment(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`)
              } else if (mustBeType === "referred-object") {
                const referredTable = columnDefinition.referredTable;
                const isNumber = constraintErrors.assertion(typeof row[columnId] === "number", `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be number on «Fooldb.prototype.$checkTableValueBySchema»`);
                if (!isNumber) {
                  break Checking_type;
                }
                const missingUids = await this.$findMissingUids(referredTable, [row[columnId]]);
                constraintErrors.assertion(missingUids.length === 0, `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to exist as «uid» in «${referredTable}» on «Fooldb.prototype.$checkTableValueBySchema»`);
              } else if (mustBeType === "referred-array") {
                const referredTable = columnDefinition.referredTable;
                const isArray = constraintErrors.assertion(Array.isArray(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be array on «Fooldb.prototype.$checkTableValueBySchema»`);
                if (!isArray) {
                  break Checking_type;
                }
                const isArrayOfIntegers = constraintErrors.assertion(this.isArrayOfIntegers(row[columnId]), `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to be array of numbers on «Fooldb.prototype.$checkTableValueBySchema»`);
                if (!isArrayOfIntegers) {
                  break Checking_type;
                }
                const missingUids = await this.$findMissingUids(referredTable, row[columnId]);
                constraintErrors.assertion(missingUids.length === 0, `Schema constraint «column.type» in case «${mustBeType}» requires column «${table}.${columnId}» to exist as «uid» in «${referredTable}» on «Fooldb.prototype.$checkTableValueBySchema»`);
              } else {
                throw new Error(`Type «${mustBeType}» on «schema» is not recognized as type on column «${table}.${columnId}» on «Fooldb.prototype.$checkTableValueBySchema»`);
              }
            }
          }
          Checking_unique: {
            // Si no tiene por qué ser unique, se salta el paso:
            if (!mustBeUnique) {
              break Checking_unique;
            }
            // Si es nulable y es nulo, salta el paso:
            if (isNull && isNullable) {
              break Checking_unique;
            }
            // Iniciamos los lectores:
            readStream = this.constructor.fs.createReadStream(file, { encoding: "utf8" });
            readliner = this.constructor.readline.createInterface({
              input: readStream,
              crlfDelay: Infinity
            });
            // Y aquí se hace un cuello de botella según ChatGPT, pero es lo que hay de momento:
            Iterating_rows:
            for await (const line of readliner) {
              // Esta línea la metió ChatGPT para sugerir que, en un futuro, donde pudiera haber indexación, las líneas en blanco permanecerían en las rows eliminadas, y el número de línea serviría como índice.
              if (!line.trim()) continue;
              const value = JSON.parse(line);
              // Si es el mismo row, salta el row:
              if (value.uid === row.uid) {
                continue Iterating_rows;
              }
              constraintErrors.assertion(value[columnId] !== row[columnId], `Schema constraint «column.unique» is avoiding to duplicate «${table}#${value.uid}.${columnId}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
            }
            // Cerramos los streams y readliners:
            await this.$closeFileHandlers(readliner, readStream, null, null);
          }
        }
      } finally {
        await this.$closeFileHandlers(readliner, readStream, null, null);
      }
      return constraintErrors;
    }

    /**
     * 
     * ## `async Fooldb.prototype.$pickNextId(table:String):String`
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
      const contents = await this.constructor.fs.promises.readFile(filepathForIds, "utf8");
      const json = JSON.parse(contents);
      const uid = json.NEXT_ID++;
      await this.constructor.fs.promises.writeFile(filepathForIds, JSON.stringify(json), "utf8");
      return uid;
    }

    /**
     * 
     * ## `async Fooldb.prototype.ensureTable(table:String)`
     * 
     * Método que inicializa:
     * 
     * - El directorio de datos: `${this.basedir}/data`
     * - El directorio de tabla: `${this.basedir}/data/${table}`
     * - El fichero de datos: `${this.basedir}/data/${table}/data.jsonl`
     * - El fichero de uids: `${this.basedir}/data/${table}/ids.json`
     * 
     */
    async ensureTable(table) {
      this.$trace("Fooldb.prototype.ensureTable");
      const datadir = this.composePath(`data`);
      const tabledir = `${datadir}/${table}`;
      const tableDataFile = `${tabledir}/data.jsonl`;
      const tableIdsFile = `${tabledir}/ids.json`;
      Inicializar_carpeta_de_data: {
        const exists = await this.existsNode(datadir);
        if (!exists) {
          await this.constructor.fs.promises.mkdir(datadir);
        }
      }
      Inicializar_carpeta_de_tabla: {
        const exists = await this.existsNode(tabledir);
        if (!exists) {
          await this.constructor.fs.promises.mkdir(tabledir);
        }
      }
      Inicializar_fichero_de_datos: {
        const exists = await this.existsNode(tableDataFile);
        if (!exists) {
          await this.constructor.fs.promises.writeFile(tableDataFile, "", "utf8");
        }
      }
      Inicializar_fichero_de_ids: {
        const exists = await this.existsNode(tableIdsFile);
        if (!exists) {
          await this.constructor.fs.promises.writeFile(tableIdsFile, JSON.stringify({ NEXT_ID: 1 }), "utf8");
        }
      }
    }

    /**
     * 
     * ## `async Fooldb.prototype.ensureTablesBySchema()`
     * 
     * Método que llama a `Fooldb.prototype.ensureTable` para cada tabla que haya definida en el `this.schema`.
     * 
     */
    async ensureTablesBySchema() {
      this.$trace("Fooldb.prototype.ensureTablesBySchema");
      const tableIds = Object.keys(this.schema.tables);
      for (let index = 0; index < tableIds.length; index++) {
        const tableId = tableIds[index];
        await this.ensureTable(tableId);
      }
    }

    /**
     * 
     * ## `async Fooldb.prototype.resetTablesBySchema()`
     * 
     * Método que elimina toda la base de datos, y vuelve a crear las carpetas de las tablas, desde 0.
     * 
     * Elimina tanto nodos como ids.
     * 
     * Usar con precaución.
     * 
     */
    async resetTablesBySchema() {
      this.$trace("Fooldb.prototype.resetTablesBySchema");
      await this.deleteRecursively(`${this.basedir}/data`);
      await this.ensureTablesBySchema();
    }

    /**
     * 
     * ## `async Fooldb.prototype.select(table:String, filter:Function):Array<Object>`
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
      const readStream = this.constructor.fs.createReadStream(file, { encoding: "utf8" });
      const readliner = this.constructor.readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      });
      try {
        for await (const line of readliner) {
          // Esta línea la metió ChatGPT para sugerir que, en un futuro, donde pudiera haber indexación, las líneas en blanco permanecerían en las rows eliminadas, y el número de línea serviría como índice.
          if (!line.trim()) continue;
          const row = JSON.parse(line);
          let result = false;
          try {
            result = filter(row);
          } catch (error) {
            result = false;
          }
          if (result) {
            dataset.push(row);
          }
        }
      } finally {
        await this.$closeFileHandlers(readliner, readStream, null, null);
      }
      return dataset;
    }

    /**
     * 
     * ## `async Fooldb.prototype.initialize(table:String, row:Object)`
     * 
     * Este método es un insert con silencios.
     * 
     * Lo único que si solo lanza errores de duplicación, no propaga el error, simplemente devuelve `false` y no inserta nada.
     * 
     */
    async initialize(table, row) {
      this.$trace("Fooldb.prototype.initialize");
      assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.initialize»");
      assertion((typeof row === "object") && (row !== null), "Parameter «row» must be «object» on «Fooldb.prototype.initialize»");
      const constraintErrors = await this.$checkTableValueBySchema(table, row, "initializing");
      constraintErrors.throwIfAnyExcept("Schema constraint «column.unique»");
      if (constraintErrors.length) {
        // Si tiene errores, no se inserta:
        return false;
      }
      const file = this.composePath(`data/${table}/data.jsonl`);
      const uid = await this.$pickNextId(table);
      const uuid = this.generateUuid();
      const record = Object.assign({ uid, uuid }, row);
      const line = JSON.stringify(record) + "\n";
      await this.constructor.fs.promises.appendFile(file, line, "utf8");
      return uid;
    }

    /**
     * 
     * ## `async Fooldb.prototype.insert(table:String, row:Object):String`
     * 
     * Método para insertar una row en una tabla. Hará las comprobaciones pertinentes de constricción de esquema antes.
     * 
     */
    async insert(table, row) {
      this.$trace("Fooldb.prototype.insert");
      assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.insert»");
      assertion((typeof row === "object") && (row !== null), "Parameter «row» must be «object» on «Fooldb.prototype.insert»");
      const constraintErrors = await this.$checkTableValueBySchema(table, row, "inserting");
      constraintErrors.throwIfAny();
      const file = this.composePath(`data/${table}/data.jsonl`);
      const uid = await this.$pickNextId(table);
      const record = Object.assign({}, row, { uid });
      const line = JSON.stringify(record) + "\n";
      await this.constructor.fs.promises.appendFile(file, line, "utf8");
      return uid;
    }

    /**
     * 
     * ## `async Fooldb.prototype.update(table:String, filter:Function, value:Object):Array<Integer>`
     * 
     * Método para actualizar registros de una tabla.
     * 
     * Devuelve los `uid:Integer` alterados por la operación.
     * 
     */
    async update(table, filter, values) {
      this.$trace("Fooldb.prototype.update");
      assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.update»");
      assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.update»");
      assertion((typeof values === "object") && (values !== null), "Parameter «values» must be «object» on «Fooldb.prototype.update»");
      const constraintErrors = await this.$checkTableValueBySchema(table, values, "updating");
      constraintErrors.throwIfAny();
      const uuid = this.generateUuid();
      const file = this.composePath(`data/${table}/data.jsonl`);
      const tmpFile = this.composePath(`data/${table}/temporary-${uuid}.jsonl`);
      const updatedIds = [];
      let writeStream;
      let readStream;
      let readliner;
      try {
        readStream = this.constructor.fs.createReadStream(file, { encoding: "utf8" });
        writeStream = this.constructor.fs.createWriteStream(tmpFile, { encoding: "utf8" });
        readliner = this.constructor.readline.createInterface({
          input: readStream,
          crlfDelay: Infinity
        });
        let updatedRecord = undefined;
        Iterating_rows:
        for await (const line of readliner) {
          if (!line.trim()) continue Iterating_rows;
          const row = JSON.parse(line);
          if (filter(row)) {
            updatedRecord = Object.assign({}, row, values);
            updatedIds.push(updatedRecord.uid);
            writeStream.write(JSON.stringify(updatedRecord) + "\n");
          } else {
            writeStream.write(line + "\n");
          }
        }
        await this.$closeFileHandlers(readliner, readStream, writeStream, null);
        await this.constructor.fs.promises.rename(tmpFile, file);
        return updatedIds;
      } finally {
        await this.$closeFileHandlers(readliner, readStream, writeStream, tmpFile);
      }
    }

    /**
     * 
     * ## `async Fooldb.prototype.delete(table:String, filter:Function):Array<Integer>`
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
      const uuid = this.generateUuid();
      const file = this.composePath(`data/${table}/data.jsonl`);
      const tmpFile = this.composePath(`data/${table}/temporary-${uuid}.jsonl`);
      const deletedIds = [];
      let readStream;
      let writeStream;
      let readliner;
      try {
        readStream = this.constructor.fs.createReadStream(file, { encoding: "utf8" });
        writeStream = this.constructor.fs.createWriteStream(tmpFile, { encoding: "utf8" });
        readliner = this.constructor.readline.createInterface({
          input: readStream,
          crlfDelay: Infinity
        });
        for await (const line of readliner) {
          // Esta línea la metió ChatGPT para sugerir que, en un futuro, donde pudiera haber indexación, las líneas en blanco permanecerían en las rows eliminadas, y el número de línea serviría como índice.
          if (!line.trim()) continue;
          const obj = JSON.parse(line);
          if (filter(obj)) {
            deletedIds.push(obj.uid);
            continue;
          }
          writeStream.write(line + "\n");
        }
        await this.$closeFileHandlers(readliner, readStream, writeStream, null);
        await this.constructor.fs.promises.rename(tmpFile, file);
        return deletedIds;
      } finally {
        await this.$closeFileHandlers(readliner, readStream, writeStream, tmpFile);
      }
    }

  };

  globalThis.Fooldb = Fooldb;

  if (typeof module !== "undefined") {
    module.exports = Fooldb;
  } else {
    window.Fooldb = Fooldb;
  }

}