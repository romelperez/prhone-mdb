const chai = require('chai');
const MDB = require('../lib');

const assert = chai.assert;
const db = new MDB(`${__dirname}/dbs/db1.json`);

describe('corrupt databases', function () {

  it('create should throw error', function () {
    return db.create('table1', { field1: 'something' }).then(function () {
      assert.isOk(false);
    }, function (e) {
      assert.isOk(!!e);
    });
  });

  it('getAll should throw error', function () {
    return db.getAll('table1').then(function () {
      assert.isOk(false);
    }, function (e) {
      assert.isOk(!!e);
    });
  });

  it('getById should throw error', function () {
    return db.getById('table1', 0).then(function () {
      assert.isOk(false);
    }, function (e) {
      assert.isOk(!!e);
    });
  });

  it('updateById should throw error', function () {
    return db.updateById('table1', 0, { field1: 'something' }).then(function () {
      assert.isOk(false);
    }, function (e) {
      assert.isOk(!!e);
    });
  });

  it('removeById should throw error', function () {
    return db.removeById('table1', 0).then(function () {
      assert.isOk(false);
    }, function (e) {
      assert.isOk(!!e);
    });
  });
});
