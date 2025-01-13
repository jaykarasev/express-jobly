const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * This helper is used to dynamically create part of an SQL query for updating
 * specific fields in a database table.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} An object containing:
 *   - `setCols` {string} - The SQL `SET` clause for the `UPDATE` statement, with
 *     placeholders for parameterized queries. Example: `"first_name"=$1, "age"=$2`
 *   - `values` {Array} - The array of values to be used with the placeholders
 *     in the `SET` clause. Example: `["Aliya", 32]`
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
