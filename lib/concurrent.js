var isRunning = false;
var tasks = [];

var run = function () {
  if (isRunning) return;
  var next = tasks.shift();
  if (next) {
    isRunning = true;
    next.all = function () {
      isRunning = false;
      run();
    };
    next(next.resolve, next.reject);
  }
};

module.exports = function (task) {

  var promise = new Promise(function (resolve, reject) {
    var _this = this;
    task.all = function () {};
    task.resolve = function () {
      task.all();
      resolve.apply(_this, arguments);
    };
    task.reject = function () {
      task.all();
      reject.apply(_this, arguments);
    };
  });

  tasks.push(task);
  run();

  return promise;
};
