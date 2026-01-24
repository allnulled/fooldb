const { globby } = require("globby");
const path = require("path");
const Fooldb = require(__dirname + "/../fooldb.js");
const inicio = new Date();

global.colorizer = function color(code, text) {
  return "\x1b[" + code + "m" + text + "\x1b[0m";
};

const main = async function () {
  const fooldb = await Fooldb.load(__dirname + "/databases/db1");
  const featureFilesBrute = await globby(__dirname + "/features/**/*.test.js");
  const featureFiles = featureFilesBrute.sort();
  let featureId = undefined;
  try {
    for (let index = 0; index < featureFiles.length; index++) {
      const featurePath = featureFiles[index];
      featureId = featurePath.replace(__dirname + "/", "");
      const momento = (new Date()) - inicio;
      console.log(colorizer(35, `[test][${momento}ms] Iniciando test ${index+1}/${featureFiles.length}: ${featureId}`));
      const test = require(featurePath);
      await test(fooldb);
    }
  } catch (error) {
    console.error(colorizer(31, `Error en el test ${featureId}:`));
    console.error(error);
  }
};

main();