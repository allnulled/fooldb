const main = async function () {
  await require("@allnulled/javadoc-brute").extractComments({
    include: [`${__dirname}/../fooldb.js`],
    exclude: ["node_modules"],
    output: `${__dirname}/../API.md`,
  });
};

main();