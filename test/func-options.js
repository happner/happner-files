const Happner = require('happner-2');
const path = require('path');
const should = require('should');
const http = require('http');

describe(path.basename(__filename), function() {

  before(function(done) {
    const _this = this;
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

  it('server handles OPTION request type', function(done) {

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
