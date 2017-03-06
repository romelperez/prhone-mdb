# PRHONE MDB

[![npm version](https://badge.fury.io/js/prhone-mdb.svg)](https://badge.fury.io/js/prhone-mdb)
[![Build Status](https://travis-ci.org/romelperez/prhone-mdb.svg?branch=master)](https://travis-ci.org/romelperez/prhone-mdb)
[![prhone](https://img.shields.io/badge/prhone-project-1b38a9.svg)](http://romelperez.com)

> PRHONE Mini-DataBase.

Mini-database manager using Node file system API in a relational way for simple storing or for practicing Node web servers without using a real DBMS.

- Promises are used to handle operations.
- Uses a JSON file to store the data.
- All data is stored in tables.
- The identifier of each item in each table is an UUID v4 and its name is `id`.
- UTF8 is used for encoding.
- When creating a new item:
  - If table does not exists, it's created automatically.
- When getting:
  - Returns an empty array if table is not found.
  - But error if fetching an unique item and it's not found.
- When removing:
  - If item does not exists, will be ok.
- In all cases, if JSON file is corrupt, an error will be returned.

## Install

```bash
npm install --save prhone-mdb
```

## Use

### `__dirname/database.json`

Empty file.

### `__dirname/app.js`

```js
const MDB = require('prhone-mdb');

const db = new MDB(`${__dirname}/database.json`);

// Creates a new collection called `fruits` and create a new item within.
db.create('fruits', { name: 'apple', color: 'red' }).then(fruit => {
  console.log('New fruit:', fruit);
  // { id: 'c846482b-7dbe-4ee3-866c-e3cc06463cd2', name: 'apple', color: 'red' }
}, err => {
  console.log('Error:', err);  // If an error occurs.
});

// Create a new item in fruits collection.
db.create('fruits', { name: 'lemon', color: 'yellow' }).then(fruit => {
  console.log('New fruit:', fruit);
  // { id: '667ba0fd-dfc0-48aa-b8ab-17cd1fc5d48f', name: 'lemon', color: 'yellow' }
}, err => {
  console.log('Error:', err);
});

db.getById('fruits', 'c846482b-7dbe-4ee3-866c-e3cc06463cd2').then(fruit => {
  console.log('Fruit:', fruit);
  // { id: 'c846482b-7dbe-4ee3-866c-e3cc06463cd2', name: 'apple', color: 'red' }
});

db.
  updateById('fruits', 'c846482b-7dbe-4ee3-866c-e3cc06463cd2', { color: 'green' }).
  then(fruit => {
    console.log('Modified fruit:', fruit);
    // { id: 'c846482b-7dbe-4ee3-866c-e3cc06463cd2', name: 'apple', color: 'green' }
  });

db.getById('fruits', 'c846482b-7dbe-4ee3-866c-e3cc06463cd2').then(fruit => {
  console.log('Fruit:', fruit);
  // { id: 'c846482b-7dbe-4ee3-866c-e3cc06463cd2', name: 'apple', color: 'green' }
});
```

## API

### `db MDB(String filePath)`

- `String filePath` the absolute path to a JSON file where to store the data.

### `Promise db.create(String tableName, Object item)`

- `String tableName` The table name. Even if it does not exist.
- `Object item` The new item to create in the table.

#### `.then(function (Object item) {})`

- `Object item` The new item created.

### `Promise db.getById(String tableName, String itemId)`

- `String tableName` The table name.
- `String itemId` The item id.

#### `.then(function (Object item) {})`

- `Object item` The item fetched.

### `Promise db.getAll(String tableName)`

- `String tableName` The table name.

#### `.then(function (Array items) {})`

- `Array items` The collection of all items. If table did not exist, it is an empty array.

### `Promise db.updateById(String tableName, String itemId, Object data)`

- `String tableName` The table name.
- `String itemId` The item id.
- `Object data` The new data of the item. This will be merged.

#### `.then(function (Object item) {})`

- `Object item` The item updated.

### `Promise db.removeById(String tableName, String itemId, Object data)`

- `String tableName` The table name.
- `String itemId` The item id.

#### `.then(function () {})`

The promise will not give parameters.

## License

[MIT](./LICENSE)
