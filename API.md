# API de Fooldb

1. [API de Fooldb](#api-de-fooldb)
  2. [`Fooldb.runningOn:Object`](#fooldbrunningonobject)
  3. [`Fooldb.AssertionError:Error`](#fooldbassertionerrorerror)
  4. [`Fooldb.assertion(condition:Boolean, message:String)`](#fooldbassertionconditionboolean-messagestring)
  5. [`Fooldb.ConstraintError:Error`](#fooldbconstrainterrorerror)
  6. [`Fooldb.MultipleConstraintErrors:Array`](#fooldbmultipleconstrainterrorsarray)
  7. [`Fooldb.MultipleConstraintErrors.prototype.assertion(condition:Boolean, message:String)`](#fooldbmultipleconstrainterrorsprototypeassertionconditionboolean-messagestring)
  8. [`Fooldb.MultipleConstraintErrors.prototype.throwIfAny()`](#fooldbmultipleconstrainterrorsprototypethrowifany)
  9. [`Fooldb.MultipleConstraintErrors.prototype.throwIfAnyExcept(errorStartingWith:String)`](#fooldbmultipleconstrainterrorsprototypethrowifanyexcepterrorstartingwithstring)
  10. [`Fooldb`](#fooldb)
  11. [`Fooldb.create(basedir:String)`](#fooldbcreatebasedirstring)
  12. [`async Fooldb.load(basedir:String):Fooldb`](#async-fooldbloadbasedirstringfooldb)
  13. [`Fooldb.defaultOptions:Object`](#fooldbdefaultoptionsobject)
  14. [`Fooldb.uuidAlphabet:Array<String>`](#fooldbuuidalphabetarraystring)
  15. [`Fooldb.basicTypes:Array<String>`](#fooldbbasictypesarraystring)
  16. [`Fooldb.constructor(basedir:String, options:Object = {})`](#fooldbconstructorbasedirstring-optionsobject-)
  17. [`Fooldb.prototype.generateUuid(len:Number = 10)`](#fooldbprototypegenerateuuidlennumber-10)
  18. [`Fooldb.prototype.isValidDay(text:String):Boolean`](#fooldbprototypeisvaliddaytextstringboolean)
  19. [`Fooldb.prototype.isValidHour(text:String):Boolean`](#fooldbprototypeisvalidhourtextstringboolean)
  20. [`Fooldb.prototype.isValidMoment(text:String):Boolean`](#fooldbprototypeisvalidmomenttextstringboolean)
  21. [`async Fooldb.prototype.closeFileHandlers(readliner:Readline, readStream:ReaderStream, writeStream:WriterStream, tmpFile:String)`](#async-fooldbprototypeclosefilehandlersreadlinerreadline-readstreamreaderstream-writestreamwriterstream-tmpfilestring)
  22. [`Fooldb.prototype.findMissingElements(array1:Array, array2:Array):Array`](#fooldbprototypefindmissingelementsarray1array-array2arrayarray)
  23. [`Fooldb.prototype.removeElementFromArray(item:any, array:Array)`](#fooldbprototyperemoveelementfromarrayitemany-arrayarray)
  24. [`Fooldb.prototype.isArrayOfIntegers(arrayOfNumbers:Array<Integer>):Boolean`](#fooldbprototypeisarrayofintegersarrayofnumbersarrayintegerboolean)
  25. [`async Fooldb.prototype.wait(ms:Number)`](#async-fooldbprototypewaitmsnumber)
  26. [`async Fooldb.prototype.existsNode(fileOrDirectory:String):Boolean`](#async-fooldbprototypeexistsnodefileordirectorystringboolean)
  27. [`async Fooldb.prototype.readJson(file:String):any`](#async-fooldbprototypereadjsonfilestringany)
  28. [`async Fooldb.prototype.writeJson(file:String, data:any)`](#async-fooldbprototypewritejsonfilestring-dataany)
  29. [`async Fooldb.prototype.deleteFilesRecursively(file:String)`](#async-fooldbprototypedeletefilesrecursivelyfilestring)
  30. [`Fooldb.prototype.$trace(message:String)`](#fooldbprototypetracemessagestring)
  31. [`async Fooldb.prototype.load():Fooldb`](#async-fooldbprototypeloadfooldb)
  32. [`Fooldb.prototype.trace.activate()`](#fooldbprototypetraceactivate)
  33. [`Fooldb.prototype.trace.deactivate()`](#fooldbprototypetracedeactivate)
  34. [`Fooldb.prototype.composePath(...subpaths:Array<String>)`](#fooldbprototypecomposepathsubpathsarraystring)
  35. [`async Fooldb.prototype.loadSchemaFromBasedir()`](#async-fooldbprototypeloadschemafrombasedir)
  36. [`Fooldb.prototype.findMissingUids(table:String, uids:Array<Integer>):Array<Integer>`](#fooldbprototypefindmissinguidstablestring-uidsarrayintegerarrayinteger)
  37. [`async Fooldb.prototype.checkTableValueBySchema(table:String, row:Object, operation:String):MultipleConstraintErrors`](#async-fooldbprototypechecktablevaluebyschematablestring-rowobject-operationstringmultipleconstrainterrors)
  38. [`async Fooldb.prototype.pickNextId(table:String):String`](#async-fooldbprototypepicknextidtablestringstring)
  39. [`async Fooldb.prototype.lockDatabase()`](#async-fooldbprototypelockdatabase)
  40. [`async Fooldb.prototype.unlockDatabase()`](#async-fooldbprototypeunlockdatabase)
  41. [`async Fooldb.prototype.withLock(callback:AsyncFunction)`](#async-fooldbprototypewithlockcallbackasyncfunction)
  42. [`async Fooldb.prototype.copify(data:Jsonable)`](#async-fooldbprototypecopifydatajsonable)
  43. [`async Fooldb.prototype.ensureTable(table:String)`](#async-fooldbprototypeensuretabletablestring)
  44. [`async Fooldb.prototype.ensureTablesBySchema()`](#async-fooldbprototypeensuretablesbyschema)
  45. [`async Fooldb.prototype.resetTablesBySchema()`](#async-fooldbprototyperesettablesbyschema)
  46. [`async Fooldb.prototype.validateSchema(partialSchema:Object)`](#async-fooldbprototypevalidateschemapartialschemaobject)
  47. [`async Fooldb.prototype.validateSchemaTable(tableSchema:Object)`](#async-fooldbprototypevalidateschematabletableschemaobject)
  48. [`async Fooldb.prototype.validateSchemaColumn(columnSchema:Object)`](#async-fooldbprototypevalidateschemacolumncolumnschemaobject)
  49. [`async Fooldb.prototype.setSchema(schema:Object)`](#async-fooldbprototypesetschemaschemaobject)
  50. [`async Fooldb.prototype.expandSchema(schemaExpansion:Object)`](#async-fooldbprototypeexpandschemaschemaexpansionobject)
  51. [`async Fooldb.prototype.select(table:String, filter:Function):Array<Object>`](#async-fooldbprototypeselecttablestring-filterfunctionarrayobject)
  52. [`async Fooldb.prototype.initialize(table:String, row:Object)`](#async-fooldbprototypeinitializetablestring-rowobject)
  53. [`async Fooldb.prototype.insert(table:String, row:Object):String`](#async-fooldbprototypeinserttablestring-rowobjectstring)
  54. [`async Fooldb.prototype.update(table:String, filter:Function, value:Object):Array<Integer>`](#async-fooldbprototypeupdatetablestring-filterfunction-valueobjectarrayinteger)
  55. [`async Fooldb.prototype.delete(table:String, filter:Function):Array<Integer>`](#async-fooldbprototypedeletetablestring-filterfunctionarrayinteger)

## `Fooldb.runningOn:Object`

**Uso interno solamente.**

Contiene indicadores del entorno donde está funcionando el javascript.

```js
{
  browser: Boolean,
  browserOnly: Boolean,
  nodejs: Boolean,
  nodejsOnly: Boolean,
}
```

## `Fooldb.AssertionError:Error`

**Uso interno solamente.**

Tipo de error. Para aserciones.

## `Fooldb.assertion(condition:Boolean, message:String)`

**Uso interno solamente.**

Método para lanzar error tipo `AssertionError`.

## `Fooldb.ConstraintError:Error`

**Uso interno solamente.**

Tipo de error. Para errores de constricciones del esquema de datos.

## `Fooldb.MultipleConstraintErrors:Array`

**Uso interno solamente.**

Tipo de array. Para acumular errores de constricción del esquema.

## `Fooldb.MultipleConstraintErrors.prototype.assertion(condition:Boolean, message:String)`

**Uso interno solamente.**

Método para aplicar aserciones, pero en lugar de lanzar error, solo acumula el mensaje de error en el array.

## `Fooldb.MultipleConstraintErrors.prototype.throwIfAny()`

**Uso interno solamente.**

Método que lanza un error `ConstraintError` con los errores acumulados.

## `Fooldb.MultipleConstraintErrors.prototype.throwIfAnyExcept(errorStartingWith:String)`

**Uso interno solamente.**

Igual que el anterior, pero ignorando los errores que empiecen por el String especificado en el parámetro.

Se usa cuando se llama a `Fooldb.prototype.initialize(...)` y lanza errores de duplicación, para silenciarlos.

## `Fooldb`

Clase principal de la que cuelga toda la API del framework.

## `Fooldb.create(basedir:String)`

Método que llama internamente al `Fooldb.constructor(basedir)`. Pero no al `load`, que es necesario para cargar el `schema.json`.

Se recomienda usar directamente `await Fooldb.load(basedir)` para obtener una instancia cargada de `Fooldb`.

## `async Fooldb.load(basedir:String):Fooldb`

Método que llama al `Fooldb.constructor(basedir)` y al `await Fooldb.prototype.load()`.

Devuelve la instancia de `Fooldb` con el `schema` cargado.

## `Fooldb.defaultOptions:Object`

**Uso interno solamente.**

Objeto con las opciones por defecto, que son:

```js
{
  trace: true
}
```

## `Fooldb.uuidAlphabet:Array<String>`

**Uso interno solamente.**

Caracteres utilizados para generar identificadores únicos largos. Incluye el alfabeto en minúsculas solamente.

## `Fooldb.basicTypes:Array<String>`

**Uso interno solamente.**

Lista de tipos básicos admitidos. Estos tipos no tienen un formato de validación especial. Son: `string`, `object`, `function`, `number`, `boolean`.

## `Fooldb.constructor(basedir:String, options:Object = {})`

Método constructor.

Establece `this.basedir` basándose en el parámetro.

Establece `this.options` basándose en `this.constructor.defaultOptions` y el parámetro.

Finalmente, inicializa el `this.schema` llamando a `this.loadSchemaFromBasedir()`.

## `Fooldb.prototype.generateUuid(len:Number = 10)`

**Uso interno solamente.**

Genera un identificador único largo.

## `Fooldb.prototype.isValidDay(text:String):Boolean`

Método que comprueba si un texto es un **día válido**. El formato es: `AAAA/MM/DD`.

## `Fooldb.prototype.isValidHour(text:String):Boolean`

Método que comprueba si un texto es una **hora válida**. El formato es: `HH:mm:ss`.

## `Fooldb.prototype.isValidMoment(text:String):Boolean`

Método que comprueba si un texto es una **hora válida**. El formato es: `AAAA/MM/DD HH:mm:ss`.

## `async Fooldb.prototype.closeFileHandlers(readliner:Readline, readStream:ReaderStream, writeStream:WriterStream, tmpFile:String)`

**Uso interno solamente.**

Método que destruye los streams que haya abiertos y elimina el fichero temporal si existe.

**Nota:** esta función ha dado muchos problemas. Ahora parece que va perfecto. La API de Streams de Node.js es muy poderosa,
aunque estés trabajando a nivel de JavaScript, puedes poner programas a funcionar contra volúmenes de datos infinitos. Todas las otras
APIs de ficheros de Node.js, no te permitirían eso.

Este método es clave para que la base de datos no deje *filehandlers* abiertos, y haya inconsistencias luego entre operaciones de ficheros,
mientras los ficheros puedan escalar a magnitudes mayores.

## `Fooldb.prototype.findMissingElements(array1:Array, array2:Array):Array`

**Uso interno principalmente.**

Método que encuentra los elementos del `array1` que **no aparecen** en el `array2`.

## `Fooldb.prototype.removeElementFromArray(item:any, array:Array)`

**Uso interno principalmente.**

Método que elimina un elemento de un array.

## `Fooldb.prototype.isArrayOfIntegers(arrayOfNumbers:Array<Integer>):Boolean`

**Uso interno principalmente.**

Método que comprueba (devolviendo booleano) si el parámetro es:

  - un `Array`
  - con elementos solamente de tipo `Integer`

## `async Fooldb.prototype.wait(ms:Number)`

**Uso interno solamente.**

Método que lanza una espera de tantos milisegundos como `ms:Number`.

## `async Fooldb.prototype.existsNode(fileOrDirectory:String):Boolean`

**Uso interno solamente.**

Método que devuelve un booleano indicando si el nodo existe como fichero o directorio.

## `async Fooldb.prototype.readJson(file:String):any`

**Uso interno solamente.**

Método para leer un JSON.

## `async Fooldb.prototype.writeJson(file:String, data:any)`

**Uso interno solamente.**

Método para escribir un JSON.

## `async Fooldb.prototype.deleteFilesRecursively(file:String)`

**Uso interno principalmente.**

Elimina ficheros recursivamente, de forma 100% segura.

No vuelve de la Promise por simplemente haber dejado *encoladas* las operaciones de eliminación, como según ChatGPT hace `fs.promises.rm(file, {recursive:true})`.

Este método repasa los nodos recursivamente a mano, y vuelve solo cuando se han borrado todos.

## `Fooldb.prototype.$trace(message:String)`

**Uso interno solamente.**

Método para traza de llamadas. Imprime por consola un mensaje de traza si `this.options.trace` está en `true`.

## `async Fooldb.prototype.load():Fooldb`

Método que **es necesario llamar** para que cargue el `schema.json`, que es necesario tener cargado para poder hacer operaciones.

El método es asíncrono porque el fichero en browser se carga asíncronamente.

Por debajo se llama a `await Fooldb.prototype.loadSchemaFromBasedir()`.

## `Fooldb.prototype.trace.activate()`

Activa la opción de trace.

## `Fooldb.prototype.trace.deactivate()`

Desactiva la opción de trace.

## `Fooldb.prototype.composePath(...subpaths:Array<String>)`

Método para construir rutas relativas a `this.basedir`.

## `async Fooldb.prototype.loadSchemaFromBasedir()`

Método que carga el `${this.basedir}/schema.json` (debe haberlo, si no lanzará un error) utilizando `readFile` + `JSON.parse`.

Para ver un ejemplo de `schema` puedes ir a [test/db1/schema.json](https://github.com/allnulled/fooldb/blob/main/test/db1/schema.json).

## `Fooldb.prototype.findMissingUids(table:String, uids:Array<Integer>):Array<Integer>`

**Uso interno principalmente.**

Método que encuentra los `uid:Integer` que no aparecen en la `table:String` especificada.

Por debajo usa `Fooldb.prototype.select` y `Fooldb.prototype.findMissingElements`.

## `async Fooldb.prototype.checkTableValueBySchema(table:String, row:Object, operation:String):MultipleConstraintErrors`

**Uso interno solamente.**

Método que acumula y devuelve los errores de constricción.

En `operation` pueden ir: `inserting`, `updating` o `initializing`.

Importante es que no lanza errores, solo los acumula en una instancia `MultipleConstraintErrors` y los devuelve, para que el contexto decida qué hacer.

Esto se hace para separar la comprobación de errores de la gestión de estos.

Las comprobaciones que se llevan a cabo son, iterando las columnas del esquema:

- Comprobación 1: si es `nullable:false`
   - Si es operación `updating` se evita: porque se supone que el `row` puede tener el valor que se omite
   - Si es operación `inserting` o `initializing`: se comprueba que la columna no sea `undefined` en el `row`.
- Comprobación 2: si es `type:any`
   - Si no especifica el tipo, se salta el paso
   - Si no es `nullable:false` y no especifica la columna en la `row`, se salta el paso
   - Si es operación `updating` y no especifica la columna en la `row`, se salta el paso
   - Comprueba que el tipo sea válido, sea tipo básico o avanzado.
- Comprobación 3: si es `unique:true`
   - Si no requiere de ser `unique`, se salta el paso.
   - Comprueba que el `data/${table}/indexes/${column}.json` no tenga el valor especificado en la columna
      - O de tenerlo, es el mismo `uid`
- Comprobación 4: si la tabla tiene `openColumns:true` o no:
   - Si tiene `openColumns:true`, se salta el paso.
   - Comprueba que todas las propiedades de `row` estén en el `this.schema[table].columns` como claves.

## `async Fooldb.prototype.pickNextId(table:String):String`

**Uso interno solamente.**

Método que:

 - Lee el `${this.basedir}/data/${table}/ids.json`
 - Saca el último `uid`
 - Lo incrementa y lo persiste
 - Devuelve el `uid` sacado.

## `async Fooldb.prototype.lockDatabase()`

**Uso interno solamente.**

Método para bloquear operaciones de persistencia en la base de datos.

**Nota:** actualmente usa una variable interna, por lo cual solo funciona con 1 mismo objeto de base de datos.

## `async Fooldb.prototype.unlockDatabase()`

**Uso interno solamente.**

Método para desbloquear operaciones de persistencia en la base de datos.

**Nota:** actualmente usa una variable interna, por lo cual solo funciona con 1 mismo objeto de base de datos.

## `async Fooldb.prototype.withLock(callback:AsyncFunction)`

**Uso interno solamente.**

Método que llama a `lockDatabase` y `unlockDatabase` antes y después de una función asícrona, automáticamente.

La API usa este método, y los otros dos solo se usan 1 vez en toda la API, dentro de éste.

**Nota:** actualmente usa una variable interna, por lo cual solo funciona con 1 mismo objeto de base de datos.

## `async Fooldb.prototype.copify(data:Jsonable)`

**Uso interno solamente.**

Método que hace un `JSON.stringify` + `JSON.parse` del `data:Jsonable` que se pase, devolviendo una copia completamente inconexa del parámetro.

## `async Fooldb.prototype.ensureTable(table:String)`

Método que inicializa:

- El directorio de datos: `${this.basedir}/data`
- El directorio de tabla: `${this.basedir}/data/${table}`
- El fichero de datos: `${this.basedir}/data/${table}/data.jsonl`
- El fichero de uids: `${this.basedir}/data/${table}/ids.json`

## `async Fooldb.prototype.ensureTablesBySchema()`

Método que llama a `Fooldb.prototype.ensureTable` para cada tabla que haya definida en el `this.schema`.

## `async Fooldb.prototype.resetTablesBySchema()`

Método que elimina toda la base de datos, y vuelve a crear las carpetas de las tablas, desde 0.

Elimina tanto nodos como ids.

Usar con precaución.

## `async Fooldb.prototype.validateSchema(partialSchema:Object)`

**Uso interno solamente.**

Método que lanza un error cuando `partialSchema:Object` no es un `this.schema` válido.

## `async Fooldb.prototype.validateSchemaTable(tableSchema:Object)`

**Uso interno solamente.**

Método que lanza un error cuando `tableSchema:Object` no es un `this.schema.tables[table]` válido.

## `async Fooldb.prototype.validateSchemaColumn(columnSchema:Object)`

**Uso interno solamente.**

Método que lanza un error cuando `columnSchema:Object` no es un `this.schema.tables[table].columns[column]` válido.

## `async Fooldb.prototype.setSchema(schema:Object)`

**Uso público.**

Método que cambia (y sobreescribe en fichero) el `schema.json`.

## `async Fooldb.prototype.expandSchema(schemaExpansion:Object)`

**Uso público.**

Método que cambia (y sobreescribe en fichero) el `schema.json`, igual que `setSchema`, con la diferencia de dejar permanecer las tablas y columnas que no se mencionan.

## `async Fooldb.prototype.select(table:String, filter:Function):Array<Object>`

Método select de una tabla.

La función `filter` solo recibe el `row:Object`.

## `async Fooldb.prototype.initialize(table:String, row:Object)`

Este método es un insert con silencios.

Lo único que si solo lanza errores de duplicación, no propaga el error, simplemente devuelve `false` y no inserta nada.

## `async Fooldb.prototype.insert(table:String, row:Object):String`

Método para insertar una row en una tabla. Hará las comprobaciones pertinentes de constricción de esquema antes.

## `async Fooldb.prototype.update(table:String, filter:Function, value:Object):Array<Integer>`

Método para actualizar registros de una tabla.

El `value:Object` ignorará las claves `uid` y `uuid`, porque se reservan para la gestión interna de la base de datos.

Devuelve los `uid:Integer` alterados por la operación.

## `async Fooldb.prototype.delete(table:String, filter:Function):Array<Integer>`

Método para eliminar registros de una tabla.

Devuelve los `uid:Integer` eliminados por la operación.

