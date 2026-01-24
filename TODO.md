- [x] Permitir nuevos tipos avanzados:
   - [x] reference-object
   - [x] reference-array
- [x] Comprueba que todos los campos del row son columnas definidas en el schema
   - [x] A no ser que la tabla tenga `openColumns:true`.
- [x] Tests para cada tipo de dato
- [x] Rellenar los campos vacíos que tengan `nullable:true` con `null`
- [x] Tests para cada feature.

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
   - [ ] `deleteTable(...)`
      - [ ] requiere que no haya registros con ese nombre de tabla
      - [ ] requiere que no haya registros referenciados con ese nombre de tabla
   - [ ] `deleteColumn(...)`
      - [ ] requiere que no haya registros con ese nombre de columna
      - [ ] requiere que no haya registros referenciados con ese nombre de columna
- [x] Proteger las claves `uid` y `uuid`
- [ ] Soporte de funciones
- [ ] Operaciones masivas
- [ ] Operaciones para operaciones de tipos

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