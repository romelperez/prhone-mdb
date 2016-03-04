const fs = require('fs');
const _ = require('underscore');


/**
 * Initialize the database.
 *
 * @param  {Object} conf - The database configuration.
 */
module.exports = function (file) {

  this.file = file || __dirname + '/data.json';

	/**
	 * Create a new row in a table.
	 *
	 * @param  {String} tableName - The table name.
	 * @param  {Object} data - The new row.
	 * @return {Promise} - A promise to know when it ends.
	 */
  this.create = function (tableName, data) {

    var file = this.file;

    return new Promise(function (resolve, reject) {

      fs.readFile(file, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        try {
          result = JSON.parse(result);
        } catch (e) {
          result = {};
        }

        var table = result[tableName];

        if (!table) {
          result[tableName] = table = [];
        }

        var newId = 1;
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
   *
   * @param  {String} tableName - The table name.
   * @return {Promise} - A promise to know the results.
   */
  this.getAll = function (tableName) {

    var file = this.file;

    return new Promise(function (resolve, reject) {

      fs.readFile(file, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        try {
          result = JSON.parse(result);

          var table = result[tableName];

          if (!table) {
            resolve([]);
          } else {
            resolve(table);
          }
        } catch (e) {
          resolve([]);
        }
      });
    });
  };

  /**
   * Get a row by id in a table.
   *
   * @param  {String} tableName - The table name.
   * @param  {Number} id - The identifier.
   * @return {Promise} - The promise to know the result.
   */
  this.getById = function (tableName, id) {

    var file = this.file;

    return new Promise(function (resolve, reject) {

      fs.readFile(file, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        try {
          result = JSON.parse(result);
        } catch (e) {
          return resolve();
        }

        var table = result[tableName] || [];

        var row = _(table).findWhere({ id });

        resolve(row);
      });
    });
  };

  /**
   * Update a row by the identifier in a table.
   *
   * @param  {String} tableName - The table name.
   * @param  {Number} id - The identifier.
   * @param  {Object} data - The updated data. This is merged with the current
   * data.
   * @return {Promise} - A promise to know when the data is updated.
   */
  this.updateById = function (tableName, id, data) {

    var file = this.file;
    var errNotFound = `Row with identifier ${id} was not found in table "${tableName}".`;

    return new Promise(function (resolve, reject) {

      fs.readFile(file, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        try {
          result = JSON.parse(result);
        } catch (e) {
          return reject(errNotFound);
        }

        var table = result[tableName];

        if (!table) {
          return reject(errNotFound);
        }

        var row = _(table).findWhere({ id });

        if (!row) {
          return reject(errNotFound);
        }

        _(row).extend(data);

        var toStore = JSON.stringify(result);

        fs.writeFile(file, toStore, 'utf8', function (err, result) {

          if (err) {
            return reject(err);
          }

          resolve(row);
        });
      });
    });
  };

  /**
   * Remove a row by identifier from a table.
   *
   * @param  {String} tableName - The table name.
   * @param  {Number} id - The identifier.
   * @return {Promise} - A promise to know the result.
   */
  this.removeById = function (tableName, id) {

    var file = this.file;
    var errNotFound = `Row with identifier ${id} was not found in table "${tableName}".`;

    return new Promise(function (resolve, reject) {

      fs.readFile(file, 'utf8', function (err, result) {

        if (err) {
          return reject(err);
        }

        try {
          result = JSON.parse(result);
        } catch (e) {
          return resolve();
        }

        if (!result[tableName]) {
          return resolve();
        }

        if (!_(result[tableName]).findWhere({ id })) {
          return resolve();
        }

        result[tableName] = _(result[tableName]).reject(row => row.id === id);

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

};
