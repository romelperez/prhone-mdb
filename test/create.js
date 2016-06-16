const chai = require('chai');
const MDB = require('../lib');

const assert = chai.assert;
const db = new MDB(`${__dirname}/dbs/db2.json`);

describe('create a database with empty file', function () {

  it('create a new item in new table', function () {
    return db.create('browsers', { name: 'chrome' }).then(function (browser) {
      assert.isObject(browser);
      assert.propertyVal(browser, 'id', 0, 'First new item should have id 0');
      assert.propertyVal(browser, 'name', 'chrome');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('create a new item in created table', function () {
    return db.create('browsers', { name: 'firefox' }).then(function (browser) {
      assert.isObject(browser);
      assert.propertyVal(browser, 'id', 1, 'New items in created tables should set id incrementally');
      assert.propertyVal(browser, 'name', 'firefox');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('create a new similar item', function () {
    return db.create('browsers', { name: 'firefox' }).then(function (browser) {
      assert.isObject(browser);
      assert.propertyVal(browser, 'id', 2, 'New items in created tables should set id incrementally');
      assert.propertyVal(browser, 'name', 'firefox');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('create another table', function () {
    return db.create('persons', { name: 'john' }).then(function (person) {
      assert.isObject(person);
      assert.propertyVal(person, 'id', 0, 'First new item should have id 0');
      assert.propertyVal(person, 'name', 'john');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('fetch a created item', function () {
    return db.getById('browsers', 1).then(function (browser) {
      assert.isObject(browser);
      assert.propertyVal(browser, 'id', 1);
      assert.propertyVal(browser, 'name', 'firefox');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('fetch all items of one table recently created', function () {
    return db.getAll('browsers').then(function (browsers) {
      const expectedItems = [{"name":"chrome","id":0},{"name":"firefox","id":1},{"name":"firefox","id":2}];
      assert.isArray(browsers);
      assert.lengthOf(browsers, 3);
      assert.includeDeepMembers(browsers, expectedItems);
    }, function (err) {
      assert.isOk(false);
    });
  });
});
