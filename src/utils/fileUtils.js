const { Parser } = require('json2csv');

async function jsonToCsv(jsonArray) {
  if (!jsonArray || jsonArray.length === 0) return '';
  const fields = Object.keys(jsonArray[0]);
  const parser = new Parser({ fields });
  return parser.parse(jsonArray);
}

module.exports = { jsonToCsv };
