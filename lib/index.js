const fs = require('fs');
const uuid = require('uuid');
const _ = require('lodash');
const concurrent = require('./concurrent');

const errCorrupt = 'Database is corrupt.';


/**
 * Database class.
 * @param  {String} file - The absolute path to the JSON file which will serve
 * as database.
 */
var MDB = function (file) {
  this.file = file || process.cwd() + '/data.json';
};

/**
 * Create a new row in a table.
 * @param  {String} tableName - The table name.
 * @param  {Object} data - The new row.
 * @return {Promise}
 */
MDB.prototype.create = function (tableName, data) {

  if (typeof tableName !== 'string' || !tableName) {
    throw new Error('Table name (first parameter) should be a string');
  }
  if (typeof data !== 'object') {
    throw new Error('Data (second parameter) should be an object');
  }

  var file = this.file;

  return concurrent((resolve, reject) => {

    fs.readFile(file, 'utf8', function (err, result) {

      if (err) {
        return reject(err);
      }

      try {
        result = result.length ? JSON.parse(result) : {};
      } catch (e) {
        return reject(errCorrupt);
      }

      var table = result[tableName];

      if (!table) {
        result[tableName] = table = [];
      }

      data.id = uuid.v4();
      table.push(data);

      var toStore = JSON.stringify(result);

      fs.writeFile(file, toStore, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  });
};

/**
 * Get all the current rows in a table.
 * @param  {String} tableName - The table name.
 * @return {Promise}
 */
MDB.prototype.getAll = function (tableName) {

  if (typeof tableName !== 'string' || !tableName) {
    throw new Error('Table name (first parameter) should be a string');
  }

  var file = this.file;

  return concurrent((resolve, reject) => {

    fs.readFile(file, 'utf8', function (err, result) {

      if (err) {
        return reject(err);
      }

      try {
        result = result.length ? JSON.parse(result) : {};
      } catch (e) {
        return reject(errCorrupt);
      }

      var table = result[tableName];

      if (!table) {
        resolve([]);
      } else {
        resolve(table);
      }
    });
  });
};

/**
 * Get a row by id in a table.
 * @param  {String} tableName - The table name.
 * @param  {String} id - The identifier.
 * @return {Promise}
 */
MDB.prototype.getById = function (tableName, id) {

  if (typeof tableName !== 'string' || !tableName) {
    throw new Error('Table name (first parameter) should be a string');
  }
  if (typeof id !== 'string' || !id) {
    throw new Error('Identifier (second parameter) should be a string');
  }

  id = String(id);

  var file = this.file;
  var errNotFound = `Item in table ${tableName} with id ${id} was not found.`;

  return concurrent((resolve, reject) => {

    fs.readFile(file, 'utf8', function (err, result) {

      if (err) {
        return reject(err);
      }

      try {
        result = result.length ? JSON.parse(result) : {};
      } catch (e) {
        return reject(errCorrupt);
      }

      var table = result[tableName] || [];
      var item = table.find(function (item) {
        return item.id === id;
      });

      if (!item) {
        return reject(errNotFound);
      }

      resolve(item);
    });
  });
};

/**
 * Update a row by the identifier in a table.
 * @param  {String} tableName - The table name.
 * @param  {String} id - The identifier.
 * @param  {Object} data - The updated data. This is merged with the current
 * data.
 * @return {Promise}
 */
MDB.prototype.updateById = function (tableName, id, data) {

  if (typeof tableName !== 'string' || !tableName) {
    throw new Error('Table name (first parameter) should be a string');
  }
  if (typeof id !== 'string' || !id) {
    throw new Error('Identifier (second parameter) should be a string');
  }
  if (typeof data !== 'object') {
    throw new Error('Data (third parameter) should be an object');
  }

  id = String(id);

  var file = this.file;
  var errNotFound = `Item in table ${tableName} with id ${id} was not found.`;

  return concurrent((resolve, reject) => {

    fs.readFile(file, 'utf8', function (err, result) {

      if (err) {
        return reject(err);
      }

      try {
        result = result.length ? JSON.parse(result) : {};
      } catch (e) {
        return reject(errCorrupt);
      }

      var table = result[tableName];

      if (!table) {
        return reject(errNotFound);
      }

      var item = table.find(function (item) {
        return item.id === id;
      });

      if (!item) {
        return reject(errNotFound);
      }

      result[tableName] = result[tableName].map(function (item) {
        if (item.id === id) {
          return _(item).extend(data);
        }
        return item;
      });

      var toStore = JSON.stringify(result);

      fs.writeFile(file, toStore, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        resolve(item);
      });
    });
  });
};

/**
 * Remove a row by identifier from a table.
 * @param  {String} tableName - The table name.
 * @param  {String} id - The identifier.
 * @return {Promise}
 */
MDB.prototype.removeById = function (tableName, id) {

  if (typeof tableName !== 'string' || !tableName) {
    throw new Error('Table name (first parameter) should be a string');
  }
  if (typeof id !== 'string' || !id) {
    throw new Error('Identifier (second parameter) should be a string');
  }

  id = String(id);

  var file = this.file;
  var errNotFound = `Item in table ${tableName} with id ${id} was not found.`;

  return concurrent((resolve, reject) => {

    fs.readFile(file, 'utf8', function (err, result) {

      if (err) {
        return reject(err);
      }

      try {
        result = result.length ? JSON.parse(result) : {};
      } catch (e) {
        return reject(errCorrupt);
      }

      if (!result[tableName]) {
        return resolve();
      }

      var itemFound = result[tableName].find(function (item) {
        return item.id === id;
      });

      if (!itemFound) {
        return resolve();
      }

      result[tableName] = _(result[tableName]).reject(item => item.id === id);

      var toStore = JSON.stringify(result);

      fs.writeFile(file, toStore, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
};

module.exports = MDB;
