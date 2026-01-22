Fooldb_browser_polyfill: {

  const trace = function (message) {
    console.log(`[trace][fooldb-browser-polyfill] ${message}`);
  };

  const FooldbIDB = (() => {
    const DB_NAME = "fooldb_fs";
    const STORE = "nodes";
    let dbPromise = null;
    // Para abrir la base de datos:
    const open = async function () {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.open");
      if (dbPromise) return dbPromise;
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => {
          const database = e.target.result;
          if (!database.objectStoreNames.contains(STORE)) {
            database.createObjectStore(STORE, { keyPath: "path" });
          }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e.target.error);
      });
      return dbPromise;
    };
    // Para obtener un nodo:
    const get = async function (node) {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.get");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);
        const req = store.get(node);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    };
    // Para actualizar un nodo:
    const put = async function (node) {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.put");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.put(node);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    };
    // Para eliminar un nodo:
    const del = async function (node) {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.delete");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.delete(node);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    };
    // Para listar los nodos:
    const list = async function (prefix) {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.list");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);
        const req = store.openCursor();
        const results = [];
        req.onsuccess = e => {
          const cursor = e.target.result;
          if (!cursor) return resolve(results);
          if (cursor.key.startsWith(prefix)) {
            results.push(cursor.value);
          }
          cursor.continue();
        };
        req.onerror = () => reject(req.error);
      });
    };
    // Para eliminar los nodos:
    const deleteAll = async function () {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.deleteAll");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        // opcional, pero útil para depurar
        tx.onerror = e => reject(e.target.error);
      });
    };
    // Exportar
    return { get, put, delete: del, list, deleteAll };
  })();


  const PolyfillForResolve = function (...subpaths) {
    trace("FooldbBrowserPolyfill.path.resolve");
    let finalPath = "";
    // Itera sobre todos los subpaths:
    for (let index = 0; index < subpaths.length; index++) {
      const subpath = subpaths[index];
      // Si no es string, lanza un error, parecido al de require("path").resolve:
      if (typeof subpath !== "string") {
        throw new Error(`Argument ${index} is expected to be a string but it is «${typeof subpath}» on «path.resolve»`);
      }
      // Si está apendizando (y no es el primer path), usa la barra como unión:
      if ((finalPath !== "") && !finalPath.endsWith("/")) {
        finalPath += "/";
      }
      // Si el subpath empieza con una barra, se carga lo anterior, como require("path").resolve:
      if (subpath.startsWith("/")) {
        finalPath = subpath;
      } else {
        finalPath += subpath;;
      }
    }
    // Al final, quita barras duplicadas:
    return finalPath.replace(/\/+/g, "/");
  };

  const PolyfillForCreateReadStream = function (filepath) {
    trace("FooldbBrowserPolyfill.fs.createReadStream");
    let destroyed = false;
    // Handlers de eventos
    const events = {
      close: [],
      error: [],
      data: [],
      end: [],
    };
    // Función de emit
    const emit = (event, ...args) => {
      if (events[event]) {
        for (const fn of events[event]) {
          try {
            fn(...args);
          } catch (error) {
            console.error(error);
          }
        }
      }
    };
    // Interfaz pública del stream de lectura
    return {
      destroyed: false,
      closed: false,
      // Método destroy
      destroy() {
        destroyed = true;
        this.destroyed = true;
        this.closed = true;
        emit("close");
      },
      // Método once
      once(event, fn) {
        const wrapper = (...args) => {
          fn(...args);
          // auto-remueve después de disparar
          events[event] = events[event].filter(f => f !== wrapper);
        };
        if (!events[event]) events[event] = [];
        events[event].push(wrapper);
      },
      // Método on
      on(event, fn) {
        if (!events[event]) events[event] = [];
        events[event].push(fn);
      },
      // Método iterable
      async *[Symbol.asyncIterator]() {
        try {
          const text = await PolyfillForReadFile(filepath);
          const lines = text.split("\n");
          for (const line of lines) {
            if (destroyed) break;
            yield line;
          }
          emit("end");
          if (!destroyed) this.destroy();
        } catch (err) {
          emit("error", err);
        }
      }
    };
  };

  const PolyfillForCreateWriteStream = function (filepath) {
    trace("FooldbBrowserPolyfill.fs.createWriteStream");
    let buffer = "";
    let destroyed = false;
    const events = {
      finish: [],
      error: [],
    };
    // Método emit
    const emit = (event, ...args) => {
      if (events[event]) {
        for (const fn of events[event]) {
          try {
            fn(...args);
          } catch (error) {
            console.error(error);
          }
        }
      }
    };
    // Interfaz pública del stream de escritura
    return {
      destroyed: false,
      closed: false,
      // Método write
      write(chunk) {
        if (destroyed) throw new Error("Stream is destroyed");
        buffer += chunk;
      },
      // Método end
      end(cb) {
        if (destroyed) return;
        this.closed = true;
        PolyfillForWriteFile(filepath, buffer)
          .then(() => {
            emit("finish");
            if (cb) cb();
          })
          .catch(err => {
            emit("error", err);
            if (cb) cb(err);
          });
      },
      // Método destroy
      destroy() {
        destroyed = true;
        this.destroyed = true;
        this.closed = true;
        buffer = "";
        emit("finish"); // opcional: en Node destroy a veces dispara finish
      },
      // Método once
      once(event, fn) {
        const wrapper = (...args) => {
          fn(...args);
          events[event] = events[event].filter(f => f !== wrapper);
        };
        if (!events[event]) events[event] = [];
        events[event].push(wrapper);
      },
      // Método on
      on(event, fn) {
        if (!events[event]) events[event] = [];
        events[event].push(fn);
      },
    };
  };

  const PolyfillForReaddir = async function (dirpath, options = {}) {
    trace("FooldbBrowserPolyfill.fs.promises.readdir");
    const withFileTypes = options.withFileTypes === true;
    // Normaliza el prefijo: "/a/b" -> "/a/b/"
    let prefix = dirpath;
    if (!prefix.endsWith("/")) prefix += "/";
    const nodes = await FooldbIDB.list(prefix);
    // Mapa para evitar duplicados (importante para directorios implícitos)
    const entries = new Map();
    for (const node of nodes) {
      // Resto del path tras el directorio base
      const rest = node.path.slice(prefix.length);
      if (!rest) continue;
      // Solo primer nivel
      const parts = rest.split("/");
      const name = parts[0];
      // Descarta duplicados
      if (entries.has(name)) continue;
      // Discrimina directorios de ficheros
      const isDir = parts.length > 1 || node.type === "dir";
      // Añade nodo
      entries.set(name, {
        name,
        isDirectory: () => isDir,
        isFile: () => !isDir
      });
    }
    // Devuelve con o sin filetypes
    return withFileTypes ? Array.from(entries.values()) : Array.from(entries.keys());
  }

  const PolyfillForAccess = async function (filepath) {
    trace("FooldbBrowserPolyfill.fs.promises.access");
    const node = await FooldbIDB.get(filepath);
    if (!node) throw new Error(`ENOENT: No such file or directory at «${filepath}»`);
  };

  const PolyfillForAppendFile = async function (filepath, content, encoding = "utf8") {
    trace("FooldbBrowserPolyfill.fs.promises.appendFile");
    // @TODO: comprobar que es un fichero, antes:
    const node = await FooldbIDB.get(filepath);
    if (!node) {
      await PolyfillForWriteFile(filepath, content, encoding);
    } else {
      node.content += String(content);
      await FooldbIDB.put(node);
    }
  };

  const PolyfillForMkdir = async function (dirpath, options = {}) {
    trace("FooldbBrowserPolyfill.fs.promises.mkdir");
    // @TODO: comprobar que el directorio padre existe, antes (a no ser que sea recursive):
    await FooldbIDB.put({
      path: dirpath,
      type: "dir",
      content: "",
    });
  };

  const PolyfillForReadFile = async function (filepath, encoding = "utf8") {
    trace("FooldbBrowserPolyfill.fs.promises.readFile");
    // @TODO: comprobar que es un fichero antes:
    const node = await FooldbIDB.get(filepath);
    if (!node || node.type !== "file") {
      throw new Error("ENOENT");
    }
    return node.content;
  };

  const PolyfillForRename = async function (filepathOrigin, filepathDestination) {
    trace("FooldbBrowserPolyfill.fs.promises.rename");
    // @TODO: comprobar que solo se está cambiando el nombre, no la localización, antes:
    console.log(filepathOrigin);
    const node = await FooldbIDB.get(filepathOrigin);
    console.log(node);
    if (!node) throw new Error("ENOENT");
    node.path = filepathDestination;
    await FooldbIDB.put(node);
    await FooldbIDB.delete(filepathOrigin);
  };

  const PolyfillForRm = async function (dirpath, options = {}) {
    trace("FooldbBrowserPolyfill.fs.promises.rm");
    // @TODO: comprobar que es un directorio antes:
    const recursive = options.recursive === true;
    if (!recursive) {
      await FooldbIDB.delete(dirpath);
      return;
    }
    const nodes = await FooldbIDB.list(dirpath);
    for (const node of nodes) {
      // @TODO: recursivo del todo, que coja los subdirectorios y los elimine antes:
      await FooldbIDB.delete(node.dirpath);
    }
  };

  const PolyfillForUnlink = async function (filepath) {
    trace("FooldbBrowserPolyfill.fs.promises.unlink");
    // @TODO: comprobar que es un fichero antes:
    await FooldbIDB.delete(filepath);
  };

  const PolyfillForWriteFile = async function (nodepath, content, encoding = "utf8") {
    trace("FooldbBrowserPolyfill.fs.promises.writeFile");
    // @TODO: comprobar que existe el directorio padre antes:
    await FooldbIDB.put({
      path: nodepath,
      type: "file",
      content: String(content)
    });
  };

  const PolyfillForCreateInterface = function ({ input }) {
    trace("FooldbBrowserPolyfill.readline.createInterface");
    const iterator = input[Symbol.asyncIterator]();
    return {
      async *[Symbol.asyncIterator]() {
        for await (const line of iterator) {
          yield line;
        }
      },
      close() { }
    };
  };

  window.FooldbBrowserPolyfill = {
    IndexedDBInterface: FooldbIDB,
    path: {
      resolve: PolyfillForResolve,
    },
    fs: {
      createReadStream: PolyfillForCreateReadStream,
      createWriteStream: PolyfillForCreateWriteStream,
      promises: {
        readdir: PolyfillForReaddir,
        access: PolyfillForAccess,
        appendFile: PolyfillForAppendFile,
        mkdir: PolyfillForMkdir,
        readFile: PolyfillForReadFile,
        rename: PolyfillForRename,
        rm: PolyfillForRm,
        unlink: PolyfillForUnlink,
        writeFile: PolyfillForWriteFile,
      }
    },
    readline: {
      createInterface: PolyfillForCreateInterface,
    },
  };

};