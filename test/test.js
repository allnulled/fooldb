const { globby } = require("globby");
const path = require("path");
const Fooldb = require(__dirname + "/../fooldb.js");
const fooldb = Fooldb.create(__dirname + "/databases/db1");
const inicio = new Date();

global.colorizer = function color(code, text) {
  return "\x1b[" + code + "m" + text + "\x1b[0m";
};

const main = async function() {
  const featureFilesBrute = await globby(__dirname + "/features/**/*.test.js");
  const featureFiles = featureFilesBrute.sort();
  for(let index=0; index<featureFiles.length; index++) {
    const featurePath = featureFiles[index];
    const featureId = featurePath.replace(__dirname + "/", "");
    const momento = (new Date()) - inicio;
    console.log(colorizer(35, `[test][${momento}ms] Iniciando: ${featureId}`));
    const test = require(featurePath);
    await test(fooldb);
  }
};

main();