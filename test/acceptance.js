var sinon = require('sinon');
var chai = require("chai");
var expect = chai.expect;
var sinonChai = require("sinon-chai");
var shelltest = require("../shelltest");
var process = require('child_process');

chai.use(sinonChai);

describe('shelltest', function(){

  var testCmd = "echo 'testing123'";

  var exec;
  before(function(){
    exec = sinon.stub(process, "exec");
    exec.yields(null, "test_stdout", null);
  });

  describe('.send', function(){
    it('should run the command', function(){
      shelltest().cmd(testCmd).end();
      expect(exec).to.have.been.calledWith(testCmd);
    });
  });

  describe('.cwd', function(){
    it('should run the command with cwd option', function(){
      shelltest().cmd(testCmd).cwd("testcwd").end();
      expect(exec).to.have.been.calledWith(testCmd, {"cwd": "testcwd"});
    });
  });

  describe('.env', function(){
    it('should run the command with env option', function(){
      shelltest().cmd(testCmd).env({"testkey": "testval"}).end();
      expect(exec).to.have.been.calledWith(testCmd, {"env": {"testkey": "testval"}});
    });
  });

  describe('.timeout', function(){
    it('should run the command with timeout option', function(){
      shelltest().cmd(testCmd).timeout(10).end();
      expect(exec).to.have.been.calledWith(testCmd, {"timeout": 10});
    });
  });

  describe('.uid', function(){
    it('should run the command with uid option', function(){
      shelltest().cmd(testCmd).uid(11).end();
      expect(exec).to.have.been.calledWith(testCmd, {"uid": 11});
    });
  });

  describe('.gid', function(){
    it('should run the command with gid option', function(){
      shelltest().cmd(testCmd).gid(12).end();
      expect(exec).to.have.been.calledWith(testCmd, {"gid": 12});
    });
  });

});
