const fs = require('fs');
const _ = require('underscore');
const concurrent = require('./concurrent');

const errCorrupt = 'Database is corrupt.';


/**
 * Database class.
 * @param  {String} file - The absolute path to the JSON file which will serve
 * as database.
 */
var MDB = function (file) {
  this.file = file || __dirname + '/data.json';
};

/**
 * Create a new row in a table.
 * @param  {String} tableName - The table name.
 * @param  {Object} data - The new row.
 * @return {Promise}
 */
MDB.prototype.create = function (tableName, data) {

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

      var newId = 0;
      if (table.length) {
        var maxItem = _(table).max(function (item) {
          return item.id;
        });
        newId = maxItem.id + 1;
      }

      data.id = newId;
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
 * @param  {Number} id - The identifier.
 * @return {Promise}
 */
MDB.prototype.getById = function (tableName, id) {

  id = Number(id);

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
      var item = _(table).findWhere({ id });

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
 * @param  {Number} id - The identifier.
 * @param  {Object} data - The updated data. This is merged with the current
 * data.
 * @return {Promise}
 */
MDB.prototype.updateById = function (tableName, id, data) {

  id = Number(id);

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

      var item = _(table).findWhere({ id });

      if (!item) {
        return reject(errNotFound);
      }

      _(item).extend(data);

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
 * @param  {Number} id - The identifier.
 * @return {Promise}
 */
MDB.prototype.removeById = function (tableName, id) {
  
  id = Number(id);

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

      if (!_(result[tableName]).findWhere({ id })) {
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
