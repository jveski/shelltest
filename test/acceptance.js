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
    exec.yields({"code": 0}, "test_stdout", "test_stderr");
  });

  it('should run the command', function(){
    shelltest().cmd(testCmd).end();
    expect(exec).to.have.been.calledWith(testCmd);
  });

  describe('options', function(){
    it('should honor configuration of the cwd', function(){
      shelltest().cmd(testCmd).cwd("testcwd").end();
      expect(exec).to.have.been.calledWith(testCmd, {"cwd": "testcwd"});
    });

    it('should honor configuration of the env', function(){
      shelltest().cmd(testCmd).env({"testkey": "testval"}).end();
      expect(exec).to.have.been.calledWith(testCmd, {"env": {"testkey": "testval"}});
    });

    it('should honor configuration of the timeout', function(){
      shelltest().cmd(testCmd).timeout(10).end();
      expect(exec).to.have.been.calledWith(testCmd, {"timeout": 10});
    });

    it('should honor configuration of the uid', function(){
      shelltest().cmd(testCmd).uid(11).end();
      expect(exec).to.have.been.calledWith(testCmd, {"uid": 11});
    });

    it('should honor configuration of the gid', function(){
      shelltest().cmd(testCmd).gid(12).end();
      expect(exec).to.have.been.calledWith(testCmd, {"gid": 12});
    });

    it('should fire callback passed to end', function(){
      var stub = sinon.stub();
      shelltest().cmd(testCmd).end(stub);
      expect(stub).to.have.been.called;
    });
  });

  describe('assertions', function(){
    it('should throw error when regex stdout expectation is not met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stdout', /^fail/).end()}).to.throw();
    });

    it('should not throw error when regex stdout expectation is met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stdout', /^test/).end()}).to.not.throw();
    });

    it('should throw error when string stdout expectation is not met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stdout', 'match').end()}).to.throw();
    });

    it('should not throw error when string stdout expectation is met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stdout', 'test_stdout').end()}).to.not.throw();
    });

    it('should throw error when regex stderr expectation is not met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stderr', /^fail/).end()}).to.throw();
    });

    it('should not throw error when regex stderr expectation is met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stderr', /^test/).end()}).to.not.throw();
    });

    it('should throw error when string stderr expectation is not met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stderr', 'match').end()}).to.throw();
    });

    it('should not throw error when string stderr expectation is met', function(){
      expect(function(){shelltest().cmd(testCmd).expect('stderr', 'test_stderr').end()}).to.not.throw();
    });

    it('should throw error when exit code expectation is not met', function(){
      expect(function(){shelltest().cmd(testCmd).expect(1).end()}).to.throw("Expected exit code of 1 got 0");
    });

    it('should not throw error when exit code expectation is met', function(){
      expect(function(){shelltest().cmd(testCmd).expect(0).end()}).to.not.throw();
    });

    it('should not throw error when command exits without an error', function(){
      exec.yields(null, "test_stdout", "test_stderr");
      expect(function(){shelltest().cmd(testCmd).expect(0).end()}).to.not.throw();
    });
  });

});
