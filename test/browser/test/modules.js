window.FooldbBrowserRequire = (function(make) {
    const definitions = {};
    const definitionsByOrder = [];
    const defineModule = function(id, value) {
        definitions[id] = value;
        definitionsByOrder.push(id);
    };
    make(defineModule);
    const requirer = function(id) {
        if (!(id in definitions)) {
            throw new Error("Module «" + id + "» was not found");
        }
        return definitions[id];
    };
    requirer.allModules = definitions;
    requirer.allModulesByOrder = definitionsByOrder;
    return requirer;
})(function(__DEFINE_MODULE__) {
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/databases/db1/schema.json", exportation);
    })(function(module) {
        module.exports = {
            "tables": {
                "Persona": {
                    "columns": {
                        "nombre": {
                            "type": "string",
                            "unique": true
                        },
                        "edad": {
                            "type": "number"
                        },
                        "fecha de nacimiento": {
                            "type": "day"
                        }
                    }
                },
                "Lugar": {
                    "columns": {
                        "nombre": {
                            "type": "string",
                            "unique": true
                        },
                        "presidente": {
                            "type": "referred-object",
                            "referredTable": "Persona"
                        },
                        "habitantes": {
                            "type": "referred-array",
                            "referredTable": "Persona"
                        }
                    }
                },
                "Todos los tipos": {
                    "openColumns": true,
                    "columns": {
                        "nombre de registro": {
                            "type": "string",
                            "nullable": true
                        },
                        "string": {
                            "nullable": true,
                            "type": "string"
                        },
                        "number": {
                            "nullable": true,
                            "type": "number"
                        },
                        "boolean": {
                            "nullable": true,
                            "type": "boolean"
                        },
                        "object": {
                            "nullable": true,
                            "type": "object"
                        },
                        "function": {
                            "nullable": true,
                            "type": "function"
                        },
                        "referred-object": {
                            "nullable": true,
                            "type": "referred-object",
                            "referredTable": "Persona"
                        },
                        "referred-array": {
                            "nullable": true,
                            "type": "referred-array",
                            "referredTable": "Persona"
                        },
                        "integer": {
                            "nullable": true,
                            "type": "integer"
                        },
                        "array": {
                            "nullable": true,
                            "type": "array"
                        },
                        "day": {
                            "nullable": true,
                            "type": "day"
                        },
                        "hour": {
                            "nullable": true,
                            "type": "hour"
                        },
                        "moment": {
                            "nullable": true,
                            "type": "moment"
                        },
                        "notype": {
                            "nullable": true,
                            "type": null
                        }
                    }
                },
                "Tipo no identificado": {
                    "columns": {
                        "tipo no identificado": {
                            "type": "unidentified type"
                        }
                    }
                },
                "Tipo único y nulo": {
                    "columns": {
                        "tipo único y nulo": {
                            "type": "string",
                            "nullable": true,
                            "unique": true
                        },
                        "otro valor": {
                            "type": "integer",
                            "nullable": true,
                            "unique": false
                        }
                    }
                }
            }
        };
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0000. Resetear estados/0010. Resetear esquema al estado inicial.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            const db1SchemaPath = `${fooldb.basedir}/schema.json`;
            const db1SchemaStructure = {
                "tables": {
                    "Persona": {
                        "columns": {
                            "nombre": {
                                "type": "string",
                                "unique": true
                            },
                            "edad": {
                                "type": "number"
                            },
                            "fecha de nacimiento": {
                                "type": "day"
                            }
                        }
                    },
                    "Lugar": {
                        "columns": {
                            "nombre": {
                                "type": "string",
                                "unique": true
                            },
                            "presidente": {
                                "type": "referred-object",
                                "referredTable": "Persona"
                            },
                            "habitantes": {
                                "type": "referred-array",
                                "referredTable": "Persona"
                            }
                        }
                    },
                    "Todos los tipos": {
                        "openColumns": true,
                        "columns": {
                            "nombre de registro": {
                                "type": "string",
                                "nullable": true
                            },
                            "string": {
                                "nullable": true,
                                "type": "string"
                            },
                            "number": {
                                "nullable": true,
                                "type": "number"
                            },
                            "boolean": {
                                "nullable": true,
                                "type": "boolean"
                            },
                            "object": {
                                "nullable": true,
                                "type": "object"
                            },
                            "function": {
                                "nullable": true,
                                "type": "function"
                            },
                            "referred-object": {
                                "nullable": true,
                                "type": "referred-object",
                                "referredTable": "Persona"
                            },
                            "referred-array": {
                                "nullable": true,
                                "type": "referred-array",
                                "referredTable": "Persona"
                            },
                            "integer": {
                                "nullable": true,
                                "type": "integer"
                            },
                            "array": {
                                "nullable": true,
                                "type": "array"
                            },
                            "day": {
                                "nullable": true,
                                "type": "day"
                            },
                            "hour": {
                                "nullable": true,
                                "type": "hour"
                            },
                            "moment": {
                                "nullable": true,
                                "type": "moment"
                            },
                            "notype": {
                                "nullable": true,
                                "type": null
                            }
                        }
                    },
                    "Tipo no identificado": {
                        "columns": {
                            "tipo no identificado": {
                                "type": "unidentified type"
                            }
                        }
                    },
                    "Tipo único y nulo": {
                        "columns": {
                            "tipo único y nulo": {
                                "type": "string",
                                "nullable": true,
                                "unique": true
                            },
                            "otro valor": {
                                "type": "integer",
                                "nullable": true,
                                "unique": false
                            }
                        }
                    }
                }
            };
            await fooldb.constructor.fs.promises.writeFile(db1SchemaPath, JSON.stringify(db1SchemaStructure, null, 2), "utf8");
            await fooldb.load();
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0001. Globalizar métodos utilitarios/0001. El assertion.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = fooldb => {
            globalThis.assertion = function(condition, message) {
                if (condition) {
                    console.log(colorizer(32, "[test][assertion][OK] " + message));
                } else {
                    console.error(colorizer(31, "[test][assertion][FAIL] " + message));
                    throw new fooldb.constructor.AssertionError(message);
                }
            };
        };
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0001. Globalizar métodos utilitarios/0002. El fs.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = fooldb => {
            globalThis.fs = fooldb.constructor.fs;
        };
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0001. Globalizar métodos utilitarios/0003. El Fooldb.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = fooldb => {
            globalThis.Fooldb = fooldb.constructor;
        };
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0001. Globalizar métodos utilitarios/0005. Utilidades de test.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = fooldb => {
            globalThis.expectToThrow = async function(callback, message = "Expected to throw but it did not!") {
                let mustFail = true;
                try {
                    await callback();
                } catch (error) {
                    mustFail = false;
                }
                assertion(!mustFail, message);
            };
            globalThis.expectPromiseToThrow = async function(promise, message = "Expected to throw but it did not!") {
                let mustFail = true;
                try {
                    await promise;
                } catch (error) {
                    mustFail = false;
                }
                assertion(!mustFail, message);
            };
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0010. Operaciones principales/0001. Resetear tablas.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {

            await fooldb.resetTablesBySchema();

            await fooldb.wait(10);

            assertion(await fooldb.existsNode(fooldb.basedir + "/data"), "El directorio «data» debería existir ahora");

            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Lugar"), "El directorio «data/Lugar» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Lugar/data.jsonl"), "El fichero «data/Lugar/data.jsonl» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Lugar/ids.json"), "El fichero «data/Lugar/ids.json» debería existir ahora");

            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Persona"), "El directorio «data/Persona» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Persona/data.jsonl"), "El fichero «data/Persona/data.jsonl» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Persona/ids.json"), "El fichero «data/Persona/ids.json» debería existir ahora");

            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo no identificado"), "El directorio «data/Tipo no identificado» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo no identificado/data.jsonl"), "El fichero «data/Tipo no identificado/data.jsonl» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo no identificado/ids.json"), "El fichero «data/Tipo no identificado/ids.json» debería existir ahora");

            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo único y nulo"), "El directorio «data/Tipo único y nulo» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo único y nulo/data.jsonl"), "El fichero «data/Tipo único y nulo/data.jsonl» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Tipo único y nulo/ids.json"), "El fichero «data/Tipo único y nulo/ids.json» debería existir ahora");

            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Todos los tipos"), "El directorio «data/Todos los tipos» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Todos los tipos/data.jsonl"), "El fichero «data/Todos los tipos/data.jsonl» debería existir ahora");
            assertion(await fooldb.existsNode(fooldb.basedir + "/data/Todos los tipos/ids.json"), "El fichero «data/Todos los tipos/ids.json» debería existir ahora");

        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0010. Operaciones principales/0010. Insertar datos.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            const Persona1 = await fooldb.insert("Persona", {
                "nombre": "Persona1",
                "edad": 35,
                "fecha de nacimiento": "1991/01/05"
            });
            const Persona2 = await fooldb.insert("Persona", {
                "nombre": "Persona2",
                "edad": 35,
                "fecha de nacimiento": "1991/01/10"
            });
            const Persona3 = await fooldb.insert("Persona", {
                "nombre": "Persona3",
                "edad": 35,
                "fecha de nacimiento": "1991/01/15"
            });
            const Lugar1 = await fooldb.insert("Lugar", {
                "nombre": "Lugar1",
                "presidente": Persona1,
                "habitantes": [Persona1, Persona2, Persona3],
            });
            const Lugar2 = await fooldb.insert("Lugar", {
                "nombre": "Lugar2",
                "presidente": Persona1,
                "habitantes": [Persona1, Persona2, Persona3],
            });
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0010. Operaciones principales/0015. Seleccionar datos.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            const Persona1 = await fooldb.select("Persona", row => row.nombre === "Persona1");
            const Lugar1 = await fooldb.select("Lugar", row => row.nombre === "Lugar1");
            assertion(Persona1.length === 1, "Persona1 debería tener 1 row ahora");
            assertion(Lugar1.length === 1, "Lugar1 debería tener 1 row ahora");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0010. Operaciones principales/0020. Actualizar datos.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.update("Persona", row => row.nombre === "Persona2", {
                nombre: "Persona2 modificada"
            })
            await fooldb.update("Lugar", row => row.nombre === "Lugar2", {
                nombre: "Lugar2 modificado"
            })
            const Persona2 = await fooldb.select("Persona", row => row.nombre === "Persona2 modificada");
            const Lugar2 = await fooldb.select("Lugar", row => row.nombre === "Lugar2 modificado");
            assertion(Persona2.length === 1, "Persona2 debería tener 1 row ahora");
            assertion(Lugar2.length === 1, "Lugar2 debería tener 1 row ahora");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0010. Operaciones principales/0025. Eliminar datos.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.delete("Persona", row => row.nombre === "Persona2 modificada");
            await fooldb.delete("Lugar", row => row.nombre === "Lugar2 modificado");
            const Persona2 = await fooldb.select("Persona", row => row.nombre === "Persona2 modificada");
            const Lugar2 = await fooldb.select("Lugar", row => row.nombre === "Lugar2 modificado");
            assertion(Persona2.length === 0, "Persona2 debería tener 0 rows ahora");
            assertion(Lugar2.length === 0, "Lugar2 debería tener 0 rows ahora");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0010. Operaciones principales/030. Inicializar datos.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.initialize("Persona", {
                nombre: "Persona 4",
                edad: 33,
                "fecha de nacimiento": "1991/02/01",
            });
            const allPersonas = await fooldb.select("Persona", row => true);
            assertion(allPersonas.length === 3, "allPersonas debería tener 3 rows ahora");
            await fooldb.initialize("Persona", {
                nombre: "Persona 4",
                edad: 38,
                "fecha de nacimiento": "1991/02/01",
            });
            assertion(allPersonas.length === 3, "allPersonas debería tener 3 rows ahora");
            const persona4 = allPersonas.filter(persona => persona.nombre === "Persona 4")[0];
            assertion(persona4.edad === 33, "Objeto persona4 debería tener edad 33 ahora");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0005. Tipo string.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {string} (1)",
                "string": "texto",
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {string} (2)",
                "string": 100,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{string}» es un número");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0010. Tipo number.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {number} (1)",
                "string": null,
                "number": 100,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {number} (2)",
                "string": null,
                "number": "texto",
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{number}» es un texto");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0015. Tipo boolean.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {boolean} (1)",
                "string": null,
                "number": null,
                "boolean": true,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {boolean} (2)",
                "string": null,
                "number": null,
                "boolean": "texto",
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{boolean}» es un texto");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0020. Tipo object.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {object} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {object} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": "texto",
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{object}» es un texto");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0025. Tipo function.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {function} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": function() {},
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {function} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": "texto",
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{function}» es un texto");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0030. Tipo referred-object.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {referred-object} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": 1,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {referred-object} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": "texto",
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{referred-object}» es un texto");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0035. Tipo referred-array.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {referred-array} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": [1, 3],
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {referred-array} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": "texto",
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{referred-array}» es un texto");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0040. Tipo integer.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {integer} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": 100,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {integer} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": 100.5,
                "array": null,
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{integer}» es un float");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0045. Tipo array.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {array} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": ["cualquier cosa aquí"],
                "day": null,
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {array} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": {},
                "day": null,
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{array}» es un object no-array");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0050. Tipo day.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {day} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": "2026/01/20",
                "hour": null,
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {day} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": "2026/01/20 ",
                "hour": null,
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{day}» es un texto pero no cumple el formato");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0055. Tipo hour.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {hour} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": "15:00:00",
                "moment": null,
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {hour} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": "15:00:00 ",
                "moment": null,
            }), "Debería de haber lanzado un error porque columna «{hour}» es un texto pero no cumple el formato");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0020. Tipos de datos/0060. Tipo moment.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {moment} (1)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": "2026/01/20 15:00:00",
            });
            await expectPromiseToThrow(fooldb.insert("Todos los tipos", {
                "nombre de registro": "Comprobando tipo {moment} (2)",
                "string": null,
                "number": null,
                "boolean": null,
                "object": null,
                "function": null,
                "referred-object": null,
                "referred-array": null,
                "integer": null,
                "array": null,
                "day": null,
                "hour": null,
                "moment": "2026/01/20 15:00:00 ",
            }), "Debería de haber lanzado un error porque columna «{moment}» es un texto pero no cumple el formato");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0030. Opciones del esquema/0005. Opción de tabla - openColumns.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            await fooldb.insert("Persona", {
                "nombre": "Persona 5",
                "edad": 40,
                "fecha de nacimiento": "1991/01/10"
            });
            await expectPromiseToThrow(fooldb.insert("Persona", {
                "nombre": "Persona 6",
                "edad": 41,
                "fecha de nacimiento": "1991/01/11",
                "campo extra": "valor random",
            }), "Debería haber fallado el 2o insert a Persona por no tener «openColumns:true» ahora");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0030. Opciones del esquema/0010. Opción de columna - nullable.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            const uid = await fooldb.insert("Todos los tipos", {
                "cualquier campo": true,
            });
            const matches = await fooldb.select("Todos los tipos", row => row.uid === uid);
            assertion(matches.length === 1, "Matches tendría que ser 1 ahora");
            const item = matches[0];
            const columnIds = Object.keys(fooldb.schema.tables["Todos los tipos"].columns);
            for (let index = 0; index < columnIds.length; index++) {
                const columnId = columnIds[index];
                assertion(item[columnId] === null, `La columna «${columnId}» debería ser null ahora`);
            }
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0040. Completaciones de cobertura/0010. Completaciones.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            new fooldb.constructor.AssertionError("Un mensaje cualquiera");
            try {
                fooldb.constructor.assertion(false);
            } catch {}
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
            fooldb.trace.activate();
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
            } catch (error) {}
            try {
                await fooldb.insert("Tipo no identificado", {});
            } catch (error) {}
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
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0050. Casos de violación de seguridad/0005. Actualizar el uid o uuid de una row.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            const originalRegistro = await fooldb.select("Todos los tipos", row => row["nombre de registro"] === "Comprobando tipo {string} (1)");
            await fooldb.update("Todos los tipos", row => {
                return row["nombre de registro"] === "Comprobando tipo {string} (1)";
            }, {
                uid: "no debería poder sobreescribirse"
            });
            await fooldb.update("Todos los tipos", row => {
                return row["nombre de registro"] === "Comprobando tipo {string} (1)";
            }, {
                uuid: "no debería poder sobreescribirse"
            });
            const finalRegistro = await fooldb.select("Todos los tipos", row => row["nombre de registro"] === "Comprobando tipo {string} (1)");
            assertion(originalRegistro.uid === finalRegistro.uid, "Registro con nombre 'Comprobando tipo {string} (1)' debería seguir teniendo el mismo uid");
            assertion(originalRegistro.uuid === finalRegistro.uuid, "Registro con nombre 'Comprobando tipo {string} (1)' debería seguir teniendo el mismo uuid");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0060. Operaciones masivas/0010. Insert masivo.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {

        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0060. Operaciones masivas/0020. Update masivo.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {

        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0060. Operaciones masivas/0030. Delete masivo.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {

        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/0080. Alteraciones del esquema/0010. Expandir esquema.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            assertion(typeof fooldb.schema.tables.Lugar.columns.capital === "undefined", "La columna Lugar.capital debería ser undefined ahora");
            await fooldb.expandSchema({
                tables: {
                    Lugar: {
                        columns: {
                            capital: {
                                type: "string",
                                nullable: false,
                            }
                        }
                    }
                }
            });
            assertion(typeof fooldb.schema.tables.Lugar.columns.capital === "object", "La columna Lugar.capital debería ser object ahora");
        };;
    });
    (function(factory) {
        const modulez = {};
        factory(modulez);
        const exportation = modulez.exports;
        __DEFINE_MODULE__("/test/features/9900. Resetear estados/0010. Resetear esquema al estado inicial.test.js", exportation);
    })(function(module) {
        module.exports = module.exports = async fooldb => {
            const db1SchemaPath = `${fooldb.basedir}/schema.json`;
            const db1SchemaStructure = {
                "tables": {
                    "Persona": {
                        "columns": {
                            "nombre": {
                                "type": "string",
                                "unique": true
                            },
                            "edad": {
                                "type": "number"
                            },
                            "fecha de nacimiento": {
                                "type": "day"
                            }
                        }
                    },
                    "Lugar": {
                        "columns": {
                            "nombre": {
                                "type": "string",
                                "unique": true
                            },
                            "presidente": {
                                "type": "referred-object",
                                "referredTable": "Persona"
                            },
                            "habitantes": {
                                "type": "referred-array",
                                "referredTable": "Persona"
                            }
                        }
                    },
                    "Todos los tipos": {
                        "openColumns": true,
                        "columns": {
                            "nombre de registro": {
                                "type": "string",
                                "nullable": true
                            },
                            "string": {
                                "nullable": true,
                                "type": "string"
                            },
                            "number": {
                                "nullable": true,
                                "type": "number"
                            },
                            "boolean": {
                                "nullable": true,
                                "type": "boolean"
                            },
                            "object": {
                                "nullable": true,
                                "type": "object"
                            },
                            "function": {
                                "nullable": true,
                                "type": "function"
                            },
                            "referred-object": {
                                "nullable": true,
                                "type": "referred-object",
                                "referredTable": "Persona"
                            },
                            "referred-array": {
                                "nullable": true,
                                "type": "referred-array",
                                "referredTable": "Persona"
                            },
                            "integer": {
                                "nullable": true,
                                "type": "integer"
                            },
                            "array": {
                                "nullable": true,
                                "type": "array"
                            },
                            "day": {
                                "nullable": true,
                                "type": "day"
                            },
                            "hour": {
                                "nullable": true,
                                "type": "hour"
                            },
                            "moment": {
                                "nullable": true,
                                "type": "moment"
                            },
                            "notype": {
                                "nullable": true,
                                "type": null
                            }
                        }
                    },
                    "Tipo no identificado": {
                        "columns": {
                            "tipo no identificado": {
                                "type": "unidentified type"
                            }
                        }
                    },
                    "Tipo único y nulo": {
                        "columns": {
                            "tipo único y nulo": {
                                "type": "string",
                                "nullable": true,
                                "unique": true
                            },
                            "otro valor": {
                                "type": "integer",
                                "nullable": true,
                                "unique": false
                            }
                        }
                    }
                }
            };
            await fooldb.constructor.fs.promises.writeFile(db1SchemaPath, JSON.stringify(db1SchemaStructure, null, 2), "utf8");
            await fooldb.load();
        };;
    });

})