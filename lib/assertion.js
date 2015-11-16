"use strict"
var assert = require('assert');

module.exports.value = function(attribute, expectation) {
  this.attribute = attribute;
  this.expectation = expectation;
}

module.exports.exitCode = function(expectation) {
  this.expectation = expectation;
}

module.exports.value.prototype.assert = function(value) {
  if (this.expectation.constructor.name === "RegExp") {
    assert(this.expectation.test(value), "Expected " + this.attribute + " to match " + this.expectation + " got " + value);
  } else {
    assert.equal(value, this.expectation, "Expected " + this.attribute + " to equal " + this.expectation + " got " + value);
  }
}

module.exports.exitCode.prototype.assert = function(_, code) {
  assert.equal(code, this.expectation, "Expected exit code of " + this.expectation + " got " + code);
}
