const MDB = require('../lib');

const db = new MDB(`${__dirname}/dbs/db4.json`);

describe('update items', function () {

  it('update item properties (part1)', function () {
    return db.updateById('users', '1', { name: 'romel' }).then(function (user) {
      assert.isObject(user);
      assert.propertyVal(user, 'id', '1');
      assert.propertyVal(user, 'name', 'romel');
      assert.propertyVal(user, 'email', 'john@mail.com');
    }, function (err) {
      assert.isOk(false);
    });
  });

  it('update item properties (part2)', function () {
    return db.updateById('users', '1', { email: 'romel@mail.com' }).then(function (user) {
      assert.isObject(user);
      assert.propertyVal(user, 'id', '1');
      assert.propertyVal(user, 'name', 'romel');
      assert.propertyVal(user, 'email', 'romel@mail.com');
    }, function (err) {
      assert.isOk(false);
    });
  });

  it('get an updated item', function () {
    return db.getById('users', '1').then(function (user) {
      assert.isObject(user);
      assert.propertyVal(user, 'id', '1');
      assert.propertyVal(user, 'name', 'romel');
      assert.propertyVal(user, 'email', 'romel@mail.com');
    }, function (err) {
      assert.isOk(false);
    });
  });
});

describe('removing items', function () {

  it('remove an item in table', function () {
    return db.removeById('users', '2').then(function () {
      assert.isOk(true);
    }, function (err) {
      assert.isOk(false);
    });
  });

  it('get a removed item', function (done) {
    db.getById('users', '2').then(function () {
      done('Item should have been removed');
    }, function (err) {
      done();
    });
  });
});
