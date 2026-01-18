const fs = require("fs");
const path = require("path");

const AssertionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};

const assertion = function (condition, message) {
  if (!condition) throw new AssertionError(message);
};

const Fooldb = class {

  static create(...args) {
    return new this(...args);
  }

  static defaultOptions = {
    forceSchema: true,
    trace: true
  }

  static uidAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  static generateUuid() {
    let uid = "";
    for (let i = 0; i < 10; i++) {
      uid += this.uidAlphabet[Math.floor(Math.random() * this.uidAlphabet.length)];
    }
    return uid;
  }

  $trace(message) {
    if (this.options.trace) {
      console.log("[trace][fooldb] " + message);
    }
  }

  constructor(basedir, options = {}) {
    this.basedir = basedir;
    this.options = Object.assign({}, this.constructor.defaultOptions, options);
    this.schema = null;
    this.$loadSchemaFromBasedir();
  }

  $composePath(...subpaths) {
    this.$trace("Fooldb.prototype.$composePath");
    return path.resolve(this.basedir, ...subpaths);
  }

  $loadSchemaFromBasedir() {
    this.$trace("Fooldb.prototype.$loadSchemaFromBasedir");
    const schemaPath = this.$composePath("schema.js");
    try {
      delete require.cache[schemaPath];
      this.schema = require(schemaPath);
    } catch (error) {
      // @OK: no schema here
    }
  }

  async $checkTableValueBySchema(table, value, operation) {
    this.$trace("Fooldb.prototype.$checkTableValueBySchema");
    if (!this.options.forceSchema) {
      this.$trace("Schema constrictions are not activated");
      return false;
    }
    assertion(typeof this.schema === "object", `Database requires a schema because option «forceSchema» is activated while «${operation}» on «$checkTableValueBySchema»`);
    assertion(table in this.schema.tables, `Required parameter «table» to exist in «this.schema» on «Fooldb.prototype.$checkTableValueBySchema»`);
    // File & reader:
    const file = this.$composePath(`data/${table}/data.jsonl`);
    const readline = require("readline").createInterface({
      input: fs.createReadStream(file, { encoding: "utf8" }),
      crlfDelay: Infinity
    });
    // Column definitions:
    const columnDefinitions = this.schema.tables[table].columns;
    const columnIds = Object.keys(columnDefinitions);
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
        assertion(hasColumn, `Schema constraint «required» requires column «${table}.${columnId}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
      }
      Checking_type: {
        // Si no fuerza el tipo, salta el paso:
        if (typeof mustBeType === "undefined") {
          break Checking_type;
        }
        // Si no es requerido y...
        if (!isRequired) {
          // ...tampoco es definido, salta el paso:
          if(typeof value[columnId] === "undefined") {
            break Checking_type;
          }
        }
        // Si es un update y...
        if (operation === "updating") {
          // ...tampoco es definido, salta el paso:
          if(typeof value[columnId] === "undefined") {
            break Checking_type;
          }
        }
        // Comprobación del tipo:
        const matchesType = typeof value[columnId] === mustBeType;
        assertion(matchesType, `Schema constraint «type» requires column «${table}.${columnId}» to be type «${mustBeType}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
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
          assertion(!matchesValue, `Schema constraint «unique» is avoiding to duplicate «${table}#${row.uid}.${columnId}» while «${operation}» on «Fooldb.prototype.$checkTableValueBySchema»`);
        }
      }
    }
  }

  async $pickNextId(table) {
    this.$trace("Fooldb.prototype.$pickNextId");
    const filepathForIds = this.$composePath(`data/${table}/ids.json`);
    const contents = await fs.promises.readFile(filepathForIds, "utf8");
    const json = JSON.parse(contents);
    const uid = json.nextId++;
    await fs.promises.writeFile(filepathForIds, JSON.stringify(json), "utf8");
    return uid;
  }

  async $existsNode(fileOrDirectory) {
    this.$trace("Fooldb.prototype.$existsNode");
    try {
      await fs.promises.access(fileOrDirectory)
      return true;
    } catch (error) {
      return false;
    }
  }

  setSchema(schema) {
    this.$trace("Fooldb.prototype.setSchema");
    this.schema = schema;
    return this;
  }

  async ensureTable(table) {
    this.$trace("Fooldb.prototype.ensureTable");
    const dirpath = this.$composePath(`data/${table}`);
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

  async select(table, filter) {
    this.$trace("Fooldb.prototype.select");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.select»");
    assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.select»");
    const file = this.$composePath(`data/${table}/data.jsonl`);
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
   * ## `Fooldb.prototype.initialize(table:String, value:Object)`
   * 
   * Este método llama a insert por debajo.
   * 
   * Lo único que si el (primer) error que lanza el insert es un error de duplicación, no propaga el error, simplemente devuelve `false`.
   * 
   */
  async initialize(table, value) {
    this.$trace("Fooldb.prototype.initialize");
    try {
      await this.insert(table, value);
      return true;
    } catch (error) {
      if (error.message.startsWith("Schema constraint «unique»")) {
        return false;
      }
      throw error;
    }
  }

  async insert(table, value) {
    this.$trace("Fooldb.prototype.insert");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.insert»");
    assertion((typeof value === "object") && (value !== null), "Parameter «value» must be «object» on «Fooldb.prototype.insert»");
    await this.$checkTableValueBySchema(table, value, "inserting");
    const file = this.$composePath(`data/${table}/data.jsonl`);
    const uid = await this.$pickNextId(table);
    const record = Object.assign({}, value, { uid });
    const line = JSON.stringify(record) + "\n";
    await fs.promises.appendFile(file, line, "utf8");
    return uid;
  }

  async update(table, filter, value) {
    this.$trace("Fooldb.prototype.update");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.update»");
    assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.update»");
    assertion((typeof value === "object") && (value !== null), "Parameter «value» must be «object» on «Fooldb.prototype.update»");
    await this.$checkTableValueBySchema(table, value, "updating");
    const uuid = this.constructor.generateUuid();
    const file = this.$composePath(`data/${table}/data.jsonl`);
    const tmpFile = this.$composePath(`data/${table}/temporary-${uuid}.jsonl`);
    const updatedUids = [];
    const readStream = fs.createReadStream(file, { encoding: "utf8" });
    const writeStream = fs.createWriteStream(tmpFile, { encoding: "utf8" });
    const readline = require("readline").createInterface({
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
  }

  async delete(table, filter) {
    this.$trace("Fooldb.prototype.delete");
    assertion(typeof table === "string", "Parameter «table» must be «string» on «Fooldb.prototype.delete»");
    assertion(typeof filter === "function", "Parameter «filter» must be «function» on «Fooldb.prototype.delete»");
    const uuid = this.constructor.generateUuid();
    const file = this.$composePath(`data/${table}/data.jsonl`);
    const tmpFile = this.$composePath(`data/${table}/temporary-${uuid}.jsonl`);
    const deletedUids = [];
    const readStream = fs.createReadStream(file, { encoding: "utf8" });
    const writeStream = fs.createWriteStream(tmpFile, { encoding: "utf8" });
    const readline = require("readline").createInterface({
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
  }

};

module.exports = Fooldb;