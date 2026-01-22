const fs = require("fs");
const path = require("path");
const child_process = require("child_process")
const projectDir = path.resolve(`${__dirname}/..`);

const wrapAsTestModule = function(id, content) {
  let output = "";
  output += `(function(factory) {\n`;
  output += `  const modulez = {};\n`;
  output += `  factory(modulez);\n`;
  output += `  const exportation = modulez.exports;\n`;
  output += `  __DEFINE_MODULE__(${JSON.stringify(id)}, exportation);\n`;
  output += `})(function(module) {\n`;
  output += `  ${content}\n`;
  output += `});\n`;
  return output;
};

const wrapAsTestBundle = function(content) {
  let output = "";
  output += `window.requireInBrowser = (function(make) {\n`;
  output += `  const definitions = {};\n`;
  output += `  const definitionsByOrder = [];\n`;
  output += `  const defineModule = function(id, value) {\n`;
  output += `    definitions[id] = value;\n`;
  output += `    definitionsByOrder.push(id);\n`;
  output += `  };\n`;
  output += `  make(defineModule);\n`;
  output += `  const requirer = function(id) {\n`;
  output += `    if(!(id in definitions)) {\n`;
  output += `      throw new Error("Module «" + id + "» was not found");\n`;
  output += `    }\n`;
  output += `    return definitions[id];\n`;
  output += `  };\n`;
  output += `  requirer.allModules = definitions;\n`;
  output += `  requirer.allModulesByOrder = definitionsByOrder;\n`;
  output += `  return requirer;\n`;
  output += `})(function(__DEFINE_MODULE__) {\n`;
  output += `  ${content}\n`;
  output += `})\n`;
  return output;
};

const main = async function () {

  Export_library_to_browser_test: {
    fs.copyFileSync(`${projectDir}/fooldb.js`, `${projectDir}/test/browser/lib/fooldb.js`);
    fs.copyFileSync(`${projectDir}/fooldb.browser-polyfill.js`, `${projectDir}/test/browser/lib/fooldb.browser-polyfill.js`);
  }

  Buil_test_for_browser: {
    const { globby } = require("globby");
    const featureFilesBrute = await globby(`${projectDir}/test/features/**/*.test.js`);
    const featureFiles = [`${projectDir}/test/databases/db1/schema.js`].concat(featureFilesBrute.sort());
    let content = "";
    for(let index=0; index<featureFiles.length; index++) {
      const featureFile = featureFiles[index];
      const featureId = featureFile.replace(projectDir, "");
      const featureTest = await fs.promises.readFile(featureFile, "utf8");
      content += wrapAsTestModule(featureId, featureTest);
    }
    content = wrapAsTestBundle(content);
    const outputFile = `${projectDir}/test/browser/test/modules.js`;
    fs.writeFileSync(outputFile, content, "utf8");
    try {
      child_process.execSync(`js-beautify ${JSON.stringify(outputFile)} -o ${JSON.stringify(outputFile)}`);
    } catch (error) {
      console.error(error);
      console.log("No pasa nada por este error, pero el JS de salida no se estará formateando bonito. Y probablemente se deba a algún error de sintaxis que acabe petando cuando se corran los tests en el browser.");
    }
  }

};

main();