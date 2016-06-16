const chai = require('chai');
const MDB = require('../lib');

const assert = chai.assert;
const db = new MDB(`${__dirname}/dbs/db3.json`);

describe('an already created database', function () {

  it('getAll should return the same items (part1)', function () {
    return db.getAll('fruits').then(function (fruits) {
      const expectedItems = [{
        "id": 0,
        "name": "apple"
      }, {
        "id": 1,
        "name": "lemon"
      }, {
        "id": 2,
        "name": "orange"
      }, {
        "id": 3,
        "name": "strawberry"
      }, {
        "id": 4,
        "name": "coconut"
      }];
      assert.isArray(fruits);
      assert.lengthOf(fruits, 5);
      assert.includeDeepMembers(fruits, expectedItems);
    }, function (err) {
      assert.isOk(false);
    });
  });

  it('getAll should return the same items (part2)', function () {
    return db.getAll('cars').then(function (fruits) {
      const expectedItems = [{
        "id": 0,
        "name": "lamborghini"
      }, {
        "id": 1,
        "name": "audi"
      }, {
        "id": 2,
        "name": "bmw"
      }];
      assert.isArray(fruits);
      assert.lengthOf(fruits, 3);
      assert.includeDeepMembers(fruits, expectedItems);
    }, function (err) {
      assert.isOk(false);
    });
  });

  it('get an item by id', function () {
    return db.getById('fruits', 3).then(function (fruit) {
      assert.isObject(fruit);
      assert.propertyVal(fruit, 'id', 3);
      assert.propertyVal(fruit, 'name', 'strawberry');
    }, function (err) {
      assert.isOk(false);
    });
  });
});
