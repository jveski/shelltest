var process = require('child_process');
var assert = require('assert');

// Construct a new shelltest
module.exports = function() {
  return new shelltest;
}

var shelltest = function() {
  this.options = {};
  this.expectations = [];

  // Set the command
  shelltest.prototype.cmd = function(val) {
    this.cmd = val;
    return this;
  };

  // Run the command and process expectations
  shelltest.prototype.end = function(cb) {
    var me = this;
    process.exec(this.cmd, this.options, function(err, stdout, stderr){
      me.expectations.forEach(function(exp){
        var input = stdout;
        // Evaluate expectations
      });
    });
    return this;
  };

  // Add an expectation
  shelltest.prototype.expect = function(var1, var2) {
    this.expectations.push({ "type": var2.constructor.name, "matcher": var2, "value": var1 });
    return this;
  };

  // Add setters for each child_process option
  [ "cwd", "env", "timeout", "uid", "gid", ].forEach(function(opt) {
    shelltest.prototype[opt] = function(val) {
      this.options[opt] = val;
      return this;
    };
  });

};
