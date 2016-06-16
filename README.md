# PRHONE MDB

[![npm version](https://badge.fury.io/js/prhone-mdb.svg)](https://badge.fury.io/js/prhone-mdb)
[![Build Status](https://travis-ci.org/romelperez/prhone-mdb.svg?branch=master)](https://travis-ci.org/romelperez/prhone-mdb)

> PRHONE Mini-DataBase.

Mini-database manager using Node file system API in a relational way for simple storing or for practicing Node web servers without using a real DBMS.

- Promises are used to handle operations.
- Uses a JSON file to store the data.
- All data is stored in tables.
- The identifier of each item in each table is a number and its name is `id`.
- When creating a new item:
  - If table does not exists, it's created automatically.
  - The item created in an empty table starts with `id` value `0`.
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
  console.log('New fruit:', fruit);  // { id: 0, name: 'apple', color: 'red' }
}, err => {
  console.log('Error:', err);  // If an error occurs.
});

// Create a new item in fruits collection.
db.create('fruits', { name: 'lemon', color: 'yellow' }).then(fruit => {
  console.log('New fruit:', fruit);  // { id: 1, name: 'lemon', color: 'yellow' }
}, err => {
  console.log('Error:', err);
});

db.getById('fruits', 0).then(fruit => {
  console.log('Fruit:', fruit);  // { id: 0, name: 'apple', color: 'red' }
});

db.updateById('fruits', 0, { color: 'green' }).then(fruit => {
  console.log('Modified fruit:', fruit);  // { id: 0, name: 'apple', color: 'green' }
});

db.getById('fruits', 0).then(fruit => {
  console.log('Fruit:', fruit);  // { id: 0, name: 'apple', color: 'green' }
});
```

## API

--

## License

[MIT](./LICENSE)
