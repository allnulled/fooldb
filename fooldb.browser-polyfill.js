Fooldb_browser_polyfill: {

  const trace = function(message) {
    console.log(`[trace][fooldb-browser-polyfill] ${message}`);
  };

  const FooldbIDB = (() => {
    const DB_NAME = "fooldb_fs";
    const STORE = "nodes";
    let dbPromise = null;
    // Para abrir la base de datos:
    const open = async function() {
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
    const get = async function(path) {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.get");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);
        const req = store.get(path);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    };
    // Para actualizar un nodo:
    const put = async function(node) {
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
    const del = async function(path) {
      trace("FooldbBrowserPolyfill.IndexedDBInterface.delete");
      const database = await open();
      return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.delete(path);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    };
    // Para listar los nodos:
    const list = async function(prefix) {
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
    const deleteAll = async function() {
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
    return { get, put, del, list, deleteAll };
  })();


  const PolyfillForResolve = function (...paths) {
    trace("FooldbBrowserPolyfill.path.resolve");
    let finalPath = "";
    // Itera sobre todos los subpaths:
    for (let index = 0; index < paths.length; index++) {
      const subpath = paths[index];
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

  const PolyfillForCreateReadStream = function (path) {
    trace("FooldbBrowserPolyfill.fs.createReadStream");
    let destroyed = false;
    return {
      closed: false,
      destroy() {
        destroyed = true;
        this.closed = true;
      },
      async *[Symbol.asyncIterator]() {
        if (destroyed) return;
        const text = await PolyfillForReadFile(path);
        const lines = text.split("\n");
        for (const line of lines) {
          if (destroyed) break;
          yield line;
        }
      }
    };
  };

  const PolyfillForCreateWriteStream = function (path) {
    trace("FooldbBrowserPolyfill.fs.createWriteStream");
    let buffer = "";
    return {
      closed: false,
      write(chunk) {
        buffer += chunk;
      },
      end(cb) {
        this.closed = true;
        PolyfillForWriteFile(path, buffer).then(() => cb && cb());
      },
      destroy() {
        this.closed = true;
        buffer = "";
      }
    };
  };

  const PolyfillForReaddir = async function() {
    trace("FooldbBrowserPolyfill.fs.promises.readdir");
  };

  const PolyfillForAccess = async function (path) {
    trace("FooldbBrowserPolyfill.fs.promises.access");
    const node = await FooldbIDB.get(path);
    if (!node) throw new Error(`ENOENT: No such file or directory at «${path}»`);
  };

  const PolyfillForAppendFile = async function (path, content, encoding = "utf8") {
    trace("FooldbBrowserPolyfill.fs.promises.appendFile");
    // @TODO: comprobar que es un fichero, antes:
    const node = await FooldbIDB.get(path);
    if (!node) {
      await PolyfillForWriteFile(path, content, encoding);
    } else {
      node.content += String(content);
      await FooldbIDB.put(node);
    }
  };

  const PolyfillForMkdir = async function (path, options = {}) {
    trace("FooldbBrowserPolyfill.fs.promises.mkdir");
    // @TODO: comprobar que el directorio padre existe, antes (a no ser que sea recursive):
  };

  const PolyfillForReadFile = async function (path, encoding = "utf8") {
    trace("FooldbBrowserPolyfill.fs.promises.readFile");
    // @TODO: comprobar que es un fichero antes:
    const node = await FooldbIDB.get(path);
    if (!node || node.type !== "file") {
      throw new Error("ENOENT");
    }
    return node.content;
  };

  const PolyfillForRename = async function (from, to) {
    trace("FooldbBrowserPolyfill.fs.promises.rename");
    // @TODO: comprobar que solo se está cambiando el nombre, no la localización, antes:
    const node = await FooldbIDB.get(from);
    if (!node) throw new Error("ENOENT");
    node.path = to;
    await FooldbIDB.put(node);
    await FooldbIDB.delete(from);
  };

  const PolyfillForRm = async function (path, options = {}) {
    trace("FooldbBrowserPolyfill.fs.promises.rm");
    // @TODO: comprobar que es un directorio antes:
    const recursive = options.recursive === true;
    if (!recursive) {
      await FooldbIDB.delete(path);
      return;
    }
    const nodes = await FooldbIDB.list(path);
    for (const node of nodes) {
      // @TODO: recursivo del todo, que coja los subdirectorios y los elimine antes:
      await FooldbIDB.delete(node.path);
    }
  };

  const PolyfillForUnlink = async function (path) {
    trace("FooldbBrowserPolyfill.fs.promises.unlink");
    // @TODO: comprobar que es un fichero antes:
    await FooldbIDB.delete(path);
  };

  const PolyfillForWriteFile = async function (path, content, encoding = "utf8") {
    trace("FooldbBrowserPolyfill.fs.promises.writeFile");
    // @TODO: comprobar que existe el directorio padre antes:
    await FooldbIDB.put({
      path,
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