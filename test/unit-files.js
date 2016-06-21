var Files = require('../lib/files');
var should = require('should');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

describe('files', function() {
  beforeEach(function() {
    this.files = new Files();
  });

  beforeEach(function() {
    this.$happn = {
      config: {
      },
      log: {
        $$DEBUG: function() {}
      }
    };
    this.req = {
      url: '/the/url'
    };
    this.res = {
      end: function() {}
    };
  });


  context('routes', function() {
    it('has an empty set of routes upon initialization', function() {
      this.files.routes.should.eql([]);
    });
  });

  context('handler()', function() {

    it('is defined', function() {
      this.files.handler.should.be.an.instanceof(Function);
    });

    context('calls _setPathRoutes()', function() {
      it('to load the route regex matchers', function(done) {
        this.files._setPathRoutes = function() {
          done();
          return true;
        };
        this.files.handler(this.$happn, this.req, this.res);
      });
    });

    context('calls _matchPathRoute() with the url', function() {
      it('to get the matching path route', function(done) {
        this.files._setPathRoutes = function() {
          return true;
        };
        this.files._matchPathRoute = function(url) {
          url.should.equal('/the/url');
          done();
        };
        this.files.handler(this.$happn, this.req, this.res);
      });
    });

    it('calls the appropriate METHOD handler', function(done) {
      this.files._setPathRoutes = function() {
        return true;
      };
      this.files._matchPathRoute = function() {
        return '/some/new/path';
      };
      this.req.method = 'POST';
      this.files._handlePOST = function($happn, targetFilename, req, res) {
        targetFilename.should.equal('/some/new/path');
        done();
      };
      this.files.handler(this.$happn, this.req, this.res);
    });

    it('responds 500 on not yet implemented METHOD handlers', function(done) {
      this.files._setPathRoutes = function() {
        return true;
      };
      this.files._matchPathRoute = function() {
        return '/some/new/path';
      };
      this.req.method = 'GET';
      var res = this.res;
      this.res.end = function(body) {
        res.statusCode.should.equal(500);
        body.should.equal('happner-files: GET method not implemented');
        done();
      };
      this.files.handler(this.$happn, this.req, this.res);
    });

  });

  context('_setPathRoutes()', function() {
    it('returns false if no routes config', function() {
      var $happn = {
        config: {}
      };
      this.files._setPathRoutes($happn).should.equal(false);
    });

    it('returns true if routes already exist on "this"', function() {
      var $happn = {
        config: {}
      };
      this.files.routes = [{match: /xxx/, path: '/path'}];
      this.files._setPathRoutes($happn).should.equal(true);
    });

    it('creates a regex matcher for each route in config', function() {
      var $happn = {
        config: {
          path: {
            routes: {
              '/path': '/tmp/files'
            }
          }
        }
      };
      this.files._setPathRoutes($happn).should.equal(true);
      this.files.routes.should.eql([
        {match: new RegExp('^/path'), path: '/tmp/files'} // mocha comparator needs a dynamic regex here
      ]);
    });
  });

  context('_matchPathRoute()', function() {
    it('returns the targetFilename with the matching path route substituted in', function(done) {
      this.files.routes = [
        {
          match: /^\/path/,
          path: '/tmp/files'
        }
      ];
      var targetFilename = this.files._matchPathRoute('/path/some/name');
      targetFilename.should.equal('/tmp/files/some/name');
      done();
    });

    it('returns the first match', function(done) {
      this.files.routes = [
        {
          match: /^\/harth/,
          path: '/tmp/files'
        },
        {
          match: /^\/path/,
          path: '/tmp/files'
        }
      ];
      var targetFilename = this.files._matchPathRoute('/path/some/name');
      targetFilename.should.equal('/tmp/files/some/name');
      done();
    });

    it('returns false if no match', function(done) {
      this.files.routes = [
        {
          match: /^\/garth/,
          path: '/tmp/files'
        }
      ];
      var targetFilename = this.files._matchPathRoute('/path/some/name');
      targetFilename.should.equal(false);
      done();
    });
  });

  context('_handlePOST', function() {
    it('creates the target directory', function(done) {
      var targetFilename = __dirname + path.sep + 'tmp' + path.sep + 'directory' + path.sep + 'filename';
      this.req.on = function(event, handler) {
        if (event === 'end') handler();
      };
      this.res.end = function() {
        fs.lstatSync(path.dirname(targetFilename)); // should exist, or throws to fail test
        rimraf.sync(path.dirname(targetFilename));
        done();
      };
      this.files._handlePOST(this.$happn, targetFilename, this.req, this.res);
    });
  });

  context('_handleGET', function() {
    xit('returns 404 if no such file', function(done) {

    });

    xit('returns 404 if file is a directory', function(done) {
      // Will support directory listing later

    });
  });

  context('windows', function() {
    it('is supported');
  });

});
