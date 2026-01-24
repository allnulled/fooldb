- [x] Permitir nuevos tipos avanzados:
   - [x] reference-object
   - [x] reference-array
- [x] Comprueba que todos los campos del row son columnas definidas en el schema
   - [x] A no ser que la tabla tenga `openColumns:true`.
- [x] Tests para cada tipo de dato
- [x] Rellenar los campos vacíos que tengan `nullable:true` con `null`
- [x] Tests para cada feature.

24/01/2026

- [ ] Soporte para múltiples tipos básicos simultáneos:
   - [ ] Primero, que soporte, tal y como está, varios tipos básicos a la vez:
      - [ ] Por ejemplo: `type: ["string", "number"]`
   - [ ] Segundo, nullable pasa a ser `type: "null"` y no `nullable: true`
   - [ ] Pueden ser múltiples tipos a la vez:
      - [ ] Como: `type: ["string", "number", "date", "null"]`

Ya veremos, porque hay cosas, como el unique, que quedan incongruentes, pero:

- [ ] Soporte para múltiples tipos referidos simultáneos:
   - [ ] Empieza como:
      - [ ] para objeto único: `type: ["@Persona"]`
      - [ ] para listas: `type: ["*@Lugar", "*@Origen"]`
      - [ ] se elimina: `referredTable` y se quedan solo: `type`



23/01/2026

- [x] Concurrencia
   - [x] Métodos `lock` y `unlock`
   - [x] Fichero `/${database}/locked.txt`
   - [x] Bloquea los inserts, updates y deletes de toda la base de datos
- [ ] Alteraciones del esquema
   - [x] pasar de `schema.js` a `schema.json`
      - [x] vigilar en el browser que hay alguna complicación más
   - [x] `setSchema(...)`
   - [x] `expandSchema(...)`
   - [x] Todos con sus comprobaciones
      - [x] Almenos de integridad formal/superficial
      - [x] Y bloquear las operaciones no permitidas
- [x] Proteger las claves `uid` y `uuid`

??/??/2026

- Operaciones de esquema complementarias convenientes:
   - [ ] `deleteTable(...)`
      - [ ] requiere que no haya registros con ese nombre de tabla
      - [ ] requiere que no haya registros referenciados con ese nombre de tabla
   - [ ] `deleteColumn(...)`
      - [ ] requiere que no haya registros con ese nombre de columna
      - [ ] requiere que no haya registros referenciados con ese nombre de columna
- [ ] Soporte de funciones
   - [ ] extraer `blankFunction`
- [ ] Operaciones masivas
   - [ ] `bulkInsert` básicamente
- [ ] Soporte para operaciones de tipos raros:
   - [ ] con arrays y listas referidas: `push, pull, shift, unshift, splice, insertBefore, insertAfter, concatenate`
   - [ ] con objetos y objetos referidos: `extend, deleteByKeys, deleteByValues`
   - [ ] con numbers: `increase, decrease`
   - [ ] con strings: `append, prepend`

??/??/2026

Más adelante:

- [ ] Hacer que pase el test de casos de violación de seguridad:
   - [ ] Que no se pueda actualizar el `uid` ni el `uuid`
   - [ ] Pero siga respetando 
- [ ] Soporte para tipo function
   - [ ] Sin hydrate todavía
- [ ] reference-query con operadores:
   - [ ] AND/OR
   - [ ] "="
   - [ ] "!="
   - [ ] "<"
   - [ ] "<="
   - [ ] ">"
   - [ ] ">="
   - [ ] "is null"
   - [ ] "is not null"
   - [ ] "is in"
   - [ ] "is not in"
   - [ ] "is like"
   - [ ] "is not like"
   - [ ] "has"
   - [ ] "has not"
- [ ] Permitir columnas tipo:
   - [ ] "createdAt"
   - [ ] "updatedAt"