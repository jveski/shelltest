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

  it('should run the command', function(){
    shelltest().cmd(testCmd).end();
    expect(exec).to.have.been.calledWith(testCmd);
  });

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

});
