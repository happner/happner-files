var Happner = require('happner-2');
var path = require('path');
var request = require('request');
var fs = require('fs');
var rimraf = require('rimraf');
var should = require('should');
var http = require('http');

describe.only(path.basename(__filename), function() {

  before(function(done) {
    var _this = this;
    Happner.create({
      name: 'SERVER',
      host: '127.0.0.1',
      port: 8080,
      util: {
        logLevel: 'debug',
        logComponents: ['happner-files']
      },
      modules: {
        'happner-files': {
          path: path.dirname(__dirname)
        }
      },
      components: {
        'happner-files': {
          path: {
            routes: {
              '/': __dirname + path.sep + 'tmp'
            }
          },
          web: {
            routes: {
              files: 'handler'
            }
          }
        }
      }
    }).then(function(mesh) {
      _this.server = mesh;
      done();
    }).catch(done);
  });

  after(function(done) {
    this.server.stop(done);
  });

  it('can post a file to the server', function(done) {

  const options = {
    hostname: '127.0.0.1',
    port: 8080,
    path: '/happner-files/files/some/path/LICENSE',
    method: 'OPTIONS',
    headers: {
    }
  };

  const req = http.request(options, (res) => {
    res.should.have.property("statusCode",204)
    res.headers.should.have.property("access-control-allow-origin", "*")
    res.headers.should.have.property("access-control-allow-methods", "GET, PUT, OPTIONS")
    res.headers.should.have.property("access-control-allow-headers", "Content-Type, Content-Size, Access-Control-Allow-Origin")
    done()
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    done(e)
  });


  req.end();


  });
});
