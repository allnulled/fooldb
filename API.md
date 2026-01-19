# API de Fooldb

1. [API de Fooldb](#api-de-fooldb)
  2. [`Fooldb.AssertionError:Error`](#fooldbassertionerrorerror)
  3. [`Fooldb.assertion(condition:Boolean, message:String)`](#fooldbassertionconditionboolean-messagestring)
  4. [`Fooldb.ConstraintError:Error`](#fooldbconstrainterrorerror)
  5. [`Fooldb.MultipleConstraintErrors:Array`](#fooldbmultipleconstrainterrorsarray)
  6. [`Fooldb.MultipleConstraintErrors.prototype.assertion(condition:Boolean, message:String)`](#fooldbmultipleconstrainterrorsprototypeassertionconditionboolean-messagestring)
  7. [`Fooldb.MultipleConstraintErrors.prototype.throwIfAny()`](#fooldbmultipleconstrainterrorsprototypethrowifany)
  8. [`Fooldb.MultipleConstraintErrors.prototype.throwIfAnyExcept(errorStartingWith:String)`](#fooldbmultipleconstrainterrorsprototypethrowifanyexcepterrorstartingwithstring)
  9. [`Fooldb`](#fooldb)
  10. [`Fooldb.create(...args)`](#fooldbcreateargs)
  11. [`Fooldb.defaultOptions:Object`](#fooldbdefaultoptionsobject)
  12. [`Fooldb.uuidAlphabet:Array<String>`](#fooldbuuidalphabetarraystring)
  13. [`Fooldb.generateUuid(len:Number = 10)`](#fooldbgenerateuuidlennumber-10)
  14. [`Fooldb.basicTypes:Array<String>`](#fooldbbasictypesarraystring)
  15. [`Fooldb.isValidDay(text:String):Boolean`](#fooldbisvaliddaytextstringboolean)
  16. [`Fooldb.isValidHour(text:String):Boolean`](#fooldbisvalidhourtextstringboolean)
  17. [`Fooldb.isValidMoment(text:String):Boolean`](#fooldbisvalidmomenttextstringboolean)
  18. [`async Fooldb.$cleanStreams(readStream:ReaderStream, writeStream:WriterStream, tmpFile:String)`](#async-fooldbcleanstreamsreadstreamreaderstream-writestreamwriterstream-tmpfilestring)
  19. [`Fooldb.prototype.$trace(message:String)`](#fooldbprototypetracemessagestring)
  20. [`Fooldb.constructor(basedir:String, options:Object = {})`](#fooldbconstructorbasedirstring-optionsobject-)
  21. [`Fooldb.prototype.composePath(...subpaths:Array<String>)`](#fooldbprototypecomposepathsubpathsarraystring)
  22. [`Fooldb.prototype.$loadSchemaFromBasedir()`](#fooldbprototypeloadschemafrombasedir)
  23. [`async Fooldb.prototype.$checkTableValueBySchema(table:String, value:Object, operation:String):MultipleConstraintErrors`](#async-fooldbprototypechecktablevaluebyschematablestring-valueobject-operationstringmultipleconstrainterrors)
  24. [`async Fooldb.prototype.$pickNextId(table:String):String`](#async-fooldbprototypepicknextidtablestringstring)
  25. [`async Fooldb.prototype.$existsNode(fileOrDirectory:String):Boolean`](#async-fooldbprototypeexistsnodefileordirectorystringboolean)
  26. [`async Fooldb.prototype.ensureTable(table:String)`](#async-fooldbprototypeensuretabletablestring)
  27. [`async Fooldb.prototype.emptyTable(table:String)`](#async-fooldbprototypeemptytabletablestring)
  28. [`async Fooldb.prototype.select(table:String, filter:Function):Array<Object>`](#async-fooldbprototypeselecttablestring-filterfunctionarrayobject)
  29. [`async Fooldb.prototype.initialize(table:String, value:Object)`](#async-fooldbprototypeinitializetablestring-valueobject)
  30. [`async Fooldb.prototype.insert(table:String, value:Object):String`](#async-fooldbprototypeinserttablestring-valueobjectstring)
  31. [`async Fooldb.prototype.update(table:String, filter:Function, value:Object):Array<Integer>`](#async-fooldbprototypeupdatetablestring-filterfunction-valueobjectarrayinteger)
  32. [`async Fooldb.prototype.delete(table:String, filter:Function):Array<Integer>`](#async-fooldbprototypedeletetablestring-filterfunctionarrayinteger)

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

## `Fooldb.create(...args)`

Llama internamente al constructor.

## `Fooldb.defaultOptions:Object`

**Uso interno solamente.**

Objeto con las opciones por defecto, que son:

```js
{
  forceSchema: true,
  trace: true
}
```

## `Fooldb.uuidAlphabet:Array<String>`

**Uso interno solamente.**

Caracteres utilizados para generar identificadores únicos largos. Incluye el alfabeto en minúsculas solamente.

## `Fooldb.generateUuid(len:Number = 10)`

**Uso interno solamente.**

Genera un identificador único largo.

## `Fooldb.basicTypes:Array<String>`

**Uso interno solamente.**

Lista de tipos básicos admitidos. Estos tipos no tienen un formato de validación especial. Son: `string`, `object`, `function`, `number`, `boolean`.

## `Fooldb.isValidDay(text:String):Boolean`

Método que comprueba si un texto es un **día válido**. El formato es: `AAAA/MM/DD`.

## `Fooldb.isValidHour(text:String):Boolean`

Método que comprueba si un texto es una **hora válida**. El formato es: `HH:mm:ss`.

## `Fooldb.isValidMoment(text:String):Boolean`

Método que comprueba si un texto es una **hora válida**. El formato es: `AAAA/MM/DD HH:mm:ss`.

## `async Fooldb.$cleanStreams(readStream:ReaderStream, writeStream:WriterStream, tmpFile:String)`

**Uso interno solamente.**

Método que destruye los streams que haya abiertos y elimina el fichero temporal si existe.

## `Fooldb.prototype.$trace(message:String)`

**Uso interno solamente.**

Método para traza de llamadas. Imprime por consola un mensaje de traza si `this.options.trace` está en `true`.

## `Fooldb.constructor(basedir:String, options:Object = {})`

Método constructor.

Establece `this.basedir` basándose en el parámetro.

Establece `this.options` basándose en `this.constructor.defaultOptions` y el parámetro.

Finalmente, inicializa el `this.schema` llamando a `this.$loadSchemaFromBasedir()`.

## `Fooldb.prototype.composePath(...subpaths:Array<String>)`

Método para construir rutas relativas a `this.basedir`.

## `Fooldb.prototype.$loadSchemaFromBasedir()`

Método que carga el `${this.basedir}/schema.js` (de haberlo, si no falla silenciosamente) utilizando `require`. Borra el caché antes.

Para ver un ejemplo de `schema` puedes ir a [test/db1/schema.js](https://github.com/allnulled/fooldb/blob/main/test/db1/schema.js).

## `async Fooldb.prototype.$checkTableValueBySchema(table:String, value:Object, operation:String):MultipleConstraintErrors`

**Uso interno solamente.**

Método que acumula y devuelve los errores de constricción.

En `operation` pueden ir: `inserting`, `updating` o `initializing`.

Importante es que no lanza errores, solo los acumula en una instancia `MultipleConstraintErrors` y los devuelve, para que el contexto decida qué hacer.

Esto se hace para separar la comprobación de errores de la gestión de estos.

## `async Fooldb.prototype.$pickNextId(table:String):String`

**Uso interno solamente.**

Método que:

 - Lee el `${this.basedir}/data/${table}/ids.json`
 - Saca el último `uid`
 - Lo incrementa y lo persiste
 - Devuelve el `uid` sacado.

## `async Fooldb.prototype.$existsNode(fileOrDirectory:String):Boolean`

**Uso interno solamente.**

Método que devuelve un booleano indicando si el nodo existe como fichero o directorio.

## `async Fooldb.prototype.ensureTable(table:String)`

Método que inicializa:

- El directorio de tabla: `${this.basedir}/data/${table}`
- El fichero de datos: `${this.basedir}/data/${table}/data.jsonl`
- El fichero de uids: `${this.basedir}/data/${table}/ids.json`

## `async Fooldb.prototype.emptyTable(table:String)`

Método que vacía una tabla, sobreescribiendo en blanco el `${this.basedir}/data/${table}/data.jsonl`.

## `async Fooldb.prototype.select(table:String, filter:Function):Array<Object>`

Método select de una tabla.

La función `filter` solo recibe el `row:Object`.

## `async Fooldb.prototype.initialize(table:String, value:Object)`

Este método es un insert con silencios.

Lo único que si solo lanza errores de duplicación, no propaga el error, simplemente devuelve `false` y no inserta nada.

## `async Fooldb.prototype.insert(table:String, value:Object):String`

Método para insertar una row en una tabla. Hará las comprobaciones pertinentes de constricción de esquema antes.

## `async Fooldb.prototype.update(table:String, filter:Function, value:Object):Array<Integer>`

Método para actualizar registros de una tabla.

Devuelve los `uid:Integer` alterados por la operación.

## `async Fooldb.prototype.delete(table:String, filter:Function):Array<Integer>`

Método para eliminar registros de una tabla.

Devuelve los `uid:Integer` eliminados por la operación.

