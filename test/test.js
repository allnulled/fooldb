const { globby } = require("globby");
const path = require("path");
const Fooldb = require(__dirname + "/../fooldb.js");
const fooldb = Fooldb.create(__dirname + "/databases/db1");

const main = async function() {
  const featureFiles = await globby(__dirname + "/features/**/*.test.js");
  for(let index=0; index<featureFiles.length; index++) {
    const featurePath = featureFiles[index];
    const featureId = featurePath.replace(__dirname + "/", "");
    console.log(`[test] Iniciando: ${featureId}`);
    const test = require(featurePath);
    await test(fooldb);
  }
};

main();