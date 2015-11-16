var sinon = require('sinon');
var chai = require("chai");
var expect = chai.expect;
var sinonChai = require("sinon-chai");
var assert = require("../lib/assertion");

chai.use(sinonChai);

describe('value', function(){
  it('should raise an error if the literal expectation does not match the value', function() {
    var subject = new assert.value();
    subject.attribute = 'stub attribute';
    subject.expectation = 'stub expectation';

    expect(function() {
      subject.assert('stub value')
    }).to.throw('Expected stub attribute to equal stub expectation got stub value');
  });

  it('should not raise an error if the literal expectation matches the value', function() {
    var subject = new assert.value();
    subject.attribute = 'stub attribute';
    subject.expectation = 'stub value';

    expect(function() {
      subject.assert('stub value')
    }).to.not.throw()
  });

  it('should raise an error if the regex expectation does not match the value', function() {
    var subject = new assert.value();
    subject.attribute = 'stub attribute';
    subject.expectation = /stub expectation/;

    expect(function() {
      subject.assert('stub value')
    }).to.throw('Expected stub attribute to match /stub expectation/ got stub value');
  });

  it('should not raise an error if the regex expectation matches the value', function() {
    var subject = new assert.value();
    subject.attribute = 'stub attribute';
    subject.expectation = /stub value/;

    expect(function() {
      subject.assert('stub value')
    }).to.not.throw()
  });
});

describe('exitCode', function() {
  it('should not raise an error if the expectation matches the value', function() {
    var subject = new assert.exitCode(123);

    expect(function() {
      subject.assert(undefined, 123)
    }).to.not.throw()
  });

  it('should raise an error if the expectation does not match the value', function() {
    var subject = new assert.exitCode(123);

    expect(function() {
      subject.assert(undefined, 1)
    }).to.throw('Expected exit code of 123 got 1')
  });
});
