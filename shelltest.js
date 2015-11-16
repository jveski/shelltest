"use strict"
var process = require('child_process');
var assert = require('./lib/assertion');

module.exports = function() {
  return new constructor;
}

var constructor = function() {
  this.options = {};
  this.assertions = [];
};

var proto = constructor.prototype;

proto.cmd = buildSetter("cmd");
proto.cwd = buildSetter("cwd");
proto.env = buildSetter("env");
proto.timeout = buildSetter("timeout");
proto.uid = buildSetter("uid");
proto.gid = buildSetter("gid");

// Expect takes user input and pushes
// assertion objects onto the test
proto.expect = function(arg1, arg2) {
  if (arguments.length > 1) {
    this.assertions.push(new assert.value(arg1, arg2));
  } else {
    this.assertions.push(new assert.exitCode(arg1));
  }

  return this;
};

proto.end = function(cb) {
  var assertions = this.assertions;
  if (this.cmd === null) { throw new Error(".end called before command set") }
  process.exec(this.cmd, this.options, function(err, stdout, stderr){
    try {
      var code = err === null ? 0 : err.code;
      runAssertions(assertions, code, stdout, stderr);
    } catch (e) {
      if (cb) {
        cb(e, stdout, stderr);
        return
      } else {
        throw e
      }
    }
    if (cb) {
      cb(err ? err : null, stdout, stderr);
    }
  });
  return this;
};

// buildSetter returns a function that
// takes a value and assigns it to the
// key on the object.
function buildSetter(key) {
  // If the key is cmd, set the cmd var
  // not the cmd key on the options obj
  if (key === "cmd") {
    return function(val) {
      this.cmd = val;
      return this;
    }
  } else {
    return function(val) {
      this.options[key] = val;
      return this;
    }
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
