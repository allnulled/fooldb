const fs = require("fs");

const generateTOCFromMarkdown = function (mdText) {
  const lines = mdText.split(/\r?\n/);
  const toc = [];
  const headingRegex = /^(#{1,6})\s+(.*)$/; // Coincide con # H1, ## H2, etc.
  for (const line of lines) {
    const match = line.match(headingRegex);
    if (match) {
      const level = match[1].length; // número de #
      let title = match[2].trim();
      // Genera un id-friendly para link ancla
      const anchor = title.toLowerCase()
        .replace(/[^\w\s-]/g, "")  // quita caracteres raros
        .replace(/\s+/g, "-");     // espacios -> guiones
      const indent = "  ".repeat(level - 1);
      toc.push(`${indent}1. [${title}](#${anchor})`);
    }
  }
  return toc.join("\n");
};

const main = async function () {
  const apiFile = `${__dirname}/../API.md`;
  await require("@allnulled/javadoc-brute").extractComments({
    include: [`${__dirname}/../fooldb.js`],
    exclude: ["node_modules"],
    output: apiFile,
  });
  const md = await fs.promises.readFile(apiFile, "utf8");
  const mdToc = generateTOCFromMarkdown(md);
  const mdWithToc = md.replace("{{ TOC }}", mdToc);
  await fs.promises.writeFile(apiFile, mdWithToc, "utf8");
};

main();
