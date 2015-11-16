"use strict"
var process = require('child_process');
var assert = require('assert');

module.exports = function() {
  return new constructor;
}

var constructor = function() {
  this.options = {};
  this.expectations = [];

  constructor.prototype.cmd = function(val) {
    this.cmd = val;
    return this;
  };

  constructor.prototype.expect = function(var1, var2) {
    if (arguments.length > 1) {
      this.expectations.push({ "type": var2.constructor.name, "matcher": var1, "value": var2 });
    } else {
      this.expectations.push({ "type": var1.constructor.name, "value": var1 });
    }
    return this;
  };

  [ "cwd", "env", "timeout", "uid", "gid" ].forEach(function(opt) {
    constructor.prototype[opt] = function(val) {
      this.options[opt] = val;
      return this;
    };
  });

  constructor.prototype.end = function(cb) {
    var expectations = this.expectations;
    if (this.cmd === null) { throw new Error(".end called before command set") }
    process.exec(this.cmd, this.options, function(err, stdout, stderr){
      try {
        runAllAsserts(expectations, err, stdout, stderr)
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

};

function runAllAsserts (expectations, err, stdout, stderr) {
  expectations.forEach(function(exp){
    // Set value
    if (exp.matcher === 'stdout') { var value = stdout; }
    if (exp.matcher === 'stderr') { var value = stderr; }
    // Make assertions
    if (exp.type === 'Number' && err) { assert.equal(err.code, exp.value,
      "Expected exit code of "+exp.value+" got "+err.code); }
    if (exp.type === 'String') { assert.equal(value, exp.value,
      "Expected "+exp.matcher+" to equal "+exp.value+" got "+value); }
    if (exp.type === 'RegExp') { assert(exp.value.test(value),
      "Expected "+exp.matcher+" to match "+exp.value+" got "+value) }
  });
}
