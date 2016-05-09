var Files = require('../lib/files');
var should = require('should');

describe('files', function() {
  beforeEach(function() {
    this.files = new Files();
  });

  context('routes', function() {
    it('has an empty set of routes upon initialization', function() {
      this.files.routes.should.eql([]);
    });
  });

  context('handler()', function() {

    beforeEach(function() {
      this.$happn = {
        config: {
        }
      };
      this.req = {
        url: '/the/url'
      };
      this.res = {
        end: function() {}
      };
    });


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
              '/happner-files/files': '/tmp/files'
            }
          }
        }
      };
      this.files._setPathRoutes($happn).should.equal(true);
      this.files.routes.should.eql([
        {match: /^\/happner-files\/files/, path: '/tmp/files'}
      ]);
    });
  });

  context('_matchPathRoute()', function() {
    it('returns the targetFilename with the matching path route substituted in', function(done) {
      this.files.routes = [
        {
          match: /^\/happner-files\/files/,
          path: '/tmp/files'
        }
      ];
      var targetFilename = this.files._matchPathRoute('/happner-files/files/some/name');
      targetFilename.should.equal('/tmp/files/some/name');
      done();
    });

    it('returns the first match', function(done) {
      this.files.routes = [
        {
          match: /^\/happner-files\/trials/,
          path: '/tmp/files'
        },
        {
          match: /^\/happner-files\/files/,
          path: '/tmp/files'
        }
      ];
      var targetFilename = this.files._matchPathRoute('/happner-files/files/some/name');
      targetFilename.should.equal('/tmp/files/some/name');
      done();
    });

    it('returns false if no match', function(done) {
      this.files.routes = [
        {
          match: /^\/happner-files\/trials/,
          path: '/tmp/files'
        }
      ];
      var targetFilename = this.files._matchPathRoute('/happner-files/files/some/name');
      targetFilename.should.equal(false);
      done();
    });
  });

});
