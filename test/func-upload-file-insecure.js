var Happner = require('happner-2');
var path = require('path');
var request = require('request');
var fs = require('fs');
var rimraf = require('rimraf');
var should = require('should');

describe(path.basename(__filename), function() {

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
    var url = 'http://127.0.0.1:8080/happner-files/files/some/path/LICENSE';
    var fileName = path.normalize(path.dirname(__dirname) + path.sep + 'LICENSE');
    var post = request.post(url, function(err, res) {
      if (res.statusCode == 500) {
        done(new Error('status ' + 500))
      }
    });
    var stream = fs.createReadStream(fileName);
    stream.pipe(post);
    post.on('error', done);
    stream.on('error', done);
    post.on('end', function() {

      var original = fs.readFileSync(fileName).toString();
      var uploaded = fs.readFileSync(
          __dirname + path.sep + 'tmp' + path.sep + 'some' + path.sep + 'path' + path.sep + 'LICENSE'
        ).toString()

      uploaded.should.equal(original);

      rimraf.sync(__dirname + path.sep + 'tmp' + path.sep + 'some');
      done();
    });
  });
});
