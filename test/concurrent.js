const chai = require('chai');
const assert = chai.assert;
const concurrent = require('../lib/concurrent');

describe('concurrent tasks', function () {

  it('should return promises (part1)', function (done) {

    var p1 = concurrent(function (resolve, reject) {
      setTimeout(function () {
        resolve('concurrent is a success');
      }, 50);
    });

    p1.then(function (msg) {
      done(msg === 'concurrent is a success' ? undefined : 'did not success');
    }, function () {
      done('this should be success');
    });
  });

  it('should return promises (part2)', function (done) {

    var p2 = concurrent(function (resolve, reject) {
      setTimeout(function () {
        reject('concurrent is still a success');
      }, 50);
    });

    p2.then(function () {
      done('this should be failed');
    }, function (msg) {
      done(msg === 'concurrent is still a success' ? undefined : 'did not fail');
    });
  });

  it('should be stacked regardless of result', function () {

    var list = [];

    concurrent(function (resolve, reject) {
      setTimeout(function () {
        list.push(0);
        resolve();
      }, 50);
    });

    concurrent(function (resolve, reject) {
      setTimeout(function () {
        list.push(1);
        reject();
      }, 10);
    });

    concurrent(function (resolve, reject) {
      setTimeout(function () {
        list.push(2);
        resolve();
      }, 0);
    });

    concurrent(function (resolve, reject) {
      setTimeout(function () {
        list.push(3);
        reject();
      }, 40);
    });

    concurrent(function (resolve, reject) {
      setTimeout(function () {
        list.push(4);
        resolve();
      }, 20);
    });

    return concurrent(function (resolve, reject) {
      setTimeout(function () {
        list.push(5);
        assert.sameDeepMembers(list, [0,1,2,3,4,5]);
        resolve();
      }, 30);
    });
  });

});
