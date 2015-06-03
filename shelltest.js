var process = require('child_process');
var assert = require('assert');

// Construct a new shelltest
module.exports = function() {
  return new shelltest;
}

var shelltest = function() {
  this.options = {};
  this.expectations = [];

  shelltest.prototype.cmd = function(val) {
    this.cmd = val;
    return this;
  };

  shelltest.prototype.expect = function(var1, var2) {
    if (var2) {
      this.expectations.push({ "type": var2.constructor.name, "matcher": var1, "value": var2 });
    } else {
      this.expectations.push({ "type": var1.constructor.name, "value": var1 });
    }
    return this;
  };

  [ "cwd", "env", "timeout", "uid", "gid", ].forEach(function(opt) {
    shelltest.prototype[opt] = function(val) {
      this.options[opt] = val;
      return this;
    };
  });

  shelltest.prototype.end = function(cb) {
    var me = this;
    process.exec(this.cmd, this.options, function(err, stdout, stderr){
      me.expectations.forEach(function(exp){
        if (exp.matcher === 'stdout') { var value = stdout; }
        if (exp.matcher === 'stderr') { var value = stderr; }
        if (exp.type === 'Number') { assert.equal(err.code, exp.value); }
        if (exp.type === 'String') { assert.equal(value, exp.value); }
        if (exp.type === 'RegExp') { assert(exp.value.test(value)) }
      });
    });
    if (cb) { cb(); }
    return this;
  };

};
