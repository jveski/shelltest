(function () {
  "use strict";
  var assert = require('assert');

  // Value constructs a new assertion on an
  // attribute of the test case execution.
  //
  // This assertion type takes an attribute
  // and expectation value, and will raise
  // an assertion error if the attribute's
  // value does not match the expectation.
  module.exports.value = function(attribute, expectation) {
    this.attribute = attribute;
    this.expectation = expectation;
  };

  module.exports.value.prototype.assert = function(value) {
    if (this.expectation.constructor.name === "RegExp") {
      assert(this.expectation.test(value), "Expected " + this.attribute + " to match " + this.expectation + " got " + value);
    } else {
      assert.equal(value, this.expectation, "Expected " + this.attribute + " to equal " + this.expectation + " got " + value);
    }
  };

  // ExitCode constructs a new assertion on
  // the exit code of a test case execution.
  //
  // This assertion type takes the expected
  // exit code and raises an assertion error
  // if the real exit code doesn't match the
  // expectation.
  module.exports.exitCode = function(expectation) {
    this.expectation = expectation;
  };

  module.exports.exitCode.prototype.assert = function(_, code) {
    assert.equal(code, this.expectation, "Expected exit code of " + this.expectation + " got " + code);
  };
})();
