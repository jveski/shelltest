(function () {
  "use strict";
  var lib = require('./lib/shelltest');

  module.exports = function() {
    return new lib.shelltest;
  };
})();
