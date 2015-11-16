(function () {
  "use strict";
  var process = require('child_process');
  var assert = require('./assertion');

  module.exports.shelltest = function() {
    this.options = {};
    this.assertions = [];
  };

  var proto = module.exports.shelltest.prototype;
  proto.cmd = buildSetter("cmd");
  proto.cwd = buildSetter("cwd");
  proto.env = buildSetter("env");
  proto.timeout = buildSetter("timeout");
  proto.uid = buildSetter("uid");
  proto.gid = buildSetter("gid");

  // Expect takes user input and pushes
  // assertion objects onto the test
  proto.expect = function(arg1, arg2) {
    var hasTwoArgs = arguments.length > 1;
    this.assertions.push(hasTwoArgs ? new assert.value(arg1, arg2) : new assert.exitCode(arg1));
    return this;
  };

  proto.end = function(callback) {
    var assertions = this.assertions; //Bind the assertions array in the local scope

    if (this.cmd === null) { throw new Error(".end called before command set"); }

    process.exec(this.cmd, this.options, function(err, stdout, stderr){
      var code = err === null ? 0 : err.code;

      var evaluator = buildEvaluator(assertions, code, stdout, stderr);
      var evaluatorCallback = buildEvaluatorCallback(stdout, stderr, callback);
      proxyErrorToCallback(evaluator, evaluatorCallback);

      // Invoke the callback function with the error, stdout, and stderr if provided
      if (callback) { callback(err ? err : null, stdout, stderr); }
    });

    return this;
  };

  // BuildSetter returns a function that
  // takes a value and assigns it to the
  // key on the object.
  function buildSetter(key) {
    if (key === "cmd") {
      return function(val) { this.cmd = val; return this; };
    } else {
      return function(val) { this.options[key] = val; return this; };
    }
  }

  // RunAssertions takes an array of assertion objects,
  // a test execution's code, stdout and stderr, and
  // invokes each assertion with the appropriate value.
  function runAssertions(assertions, code, stdout, stderr) {
    assertions.forEach(function(assertion) {
      var value;
      if (assertion.attribute === 'stdout') { value = stdout; }
      if (assertion.attribute === 'stderr') { value = stderr; }

      assertion.assert(value, code);
    });
  }

  // BuildEvaluator currys the runAssertions function to
  // interface it with the proxyErrorToCallback function.
  function buildEvaluator(assertions, code, stdout, stderr) {
    return function() { runAssertions(assertions, code, stdout, stderr); };
  }

  // BuildEvaluatorCallback currys the evaluator's callback
  // to interface it with the proxyErrorToCallback function.
  function buildEvaluatorCallback(stdout, stderr, callback) {
    return function(runtimeError) {
      if (callback) {
        callback(runtimeError, stdout, stderr);
      } else {
        throw runtimeError;
      }
    };
  }

  // ProxyErrorToCallback takes a function, calls it,
  // handles any errors, and routes them to the provided
  // callback function.
  function proxyErrorToCallback(fn, callback) {
    try {
      fn();
    } catch (e) {
      callback(e);
    }
  }
})();
