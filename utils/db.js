// utils that promisfy sqlite3 calls
// allows for async await
const db = global.db;

/**
 * @purpose enables async/await usage with SQLite db.all
 * @input   sql - the SQL query string 
 *          params - an array of parameters
 * @output  returns a promise that resolves with rows from DB
 */
function dbAll(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * @purpose enables async/await usage with SQLite db.get
 * @input   sql - the SQL query string 
 *          params - an array of parameters
 * @output  returns a promise that resolves with a single row
 */
function dbGet(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * @purpose enables async/await usage with SQLite db.run
 * @input   sql - the SQL query string 
 *          params - an array of parameters
 * @output  returns a promise that resolves with 
 *          ID of the row and the row that was inserted
 */
function dbRun(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, 
        function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

module.exports = { dbAll, dbGet, dbRun };