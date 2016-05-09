var Happner = require('happner');
var path = require('path');
var request = require('request');
var fs = require('fs');

describe(path.basename(__filename), function() {

  before(function(done) {
    var _this = this;
    Happner.create({
      name: 'SERVER',
      host: '127.0.0.1',
      port: 8080,
      modules: {
        'happner-files': {
          path: path.dirname(__dirname)
        }
      },
      components: {
        'happner-files': {
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
    var post = request.post(url);
    var stream = fs.createReadStream(fileName);
    stream.pipe(post);
    post.on('error', done);
    stream.on('error', done);
    post.on('end', function() {
      done();
    });
  });
});
