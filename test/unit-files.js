var Files = require('../lib/files');
var should = require('should');

describe('files', function() {
  before(function() {
    this.files = new Files();
  });

  context('handler()', function() {
    it('is defined', function() {
      this.files.handler.should.be.an.instanceof(Function);
    });
  });

});
