const MDB = require('../lib');

const db = new MDB(`${__dirname}/dbs/db2.json`);

describe('create a database with empty file', function () {

  before(function () {
    this.createdItemId = null;
  });

  it('create a new item in new table', function () {
    return db.create('browsers', { name: 'chrome' }).then(function (browser) {
      expect(browser).to.be.an('object').to.have.property('id').to.be.an('string');
      assert.propertyVal(browser, 'name', 'chrome');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('create a new item in created table', function () {
    return db.create('browsers', { name: 'firefox' }).then(function (browser) {
      expect(browser).to.be.an('object').to.have.property('id').to.be.an('string');
      assert.propertyVal(browser, 'name', 'firefox');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('create a new similar item', function () {

    var _this = this;

    return db.create('browsers', { name: 'firefox' }).then(function (browser) {
      expect(browser).to.be.an('object').to.have.property('id').to.be.an('string');
      assert.propertyVal(browser, 'name', 'firefox');

      // Store created id to fetch it later.
      _this.createdItemId = browser.id;

    }, function (e) {
      assert.isOk(false);
    });
  });

  it('create another table', function () {
    return db.create('persons', { name: 'john' }).then(function (person) {
      expect(person).to.be.an('object').to.have.property('id').to.be.an('string');
      assert.propertyVal(person, 'name', 'john');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('fetch a created item', function () {

    const _this = this;

    return db.getById('browsers', this.createdItemId).then(function (browser) {
      assert.isObject(browser);
      assert.propertyVal(browser, 'id', _this.createdItemId);
      assert.propertyVal(browser, 'name', 'firefox');
    }, function (e) {
      assert.isOk(false);
    });
  });

  it('fetch all items of one table recently created', function () {
    return db.getAll('browsers').then(function (browsers) {
      const expectedItems = [
        {name: "chrome"},
        {name: "firefox"},
        {name: "firefox"}
      ];
      expect(browsers).to.be.an('array').to.have.lengthOf(3);
      browsers.forEach(function (browser, index) {
        expect(browser).to.be.an('object');
        expect(browser).to.have.property('name').to.equal(expectedItems[index].name);
      });
    }, function (err) {
      assert.isOk(false);
    });
  });
});
