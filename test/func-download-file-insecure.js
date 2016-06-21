var Happner = require('happner');
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

  before(function(done) {
    fs.writeFile(__dirname + path.sep + 'tmp' + path.sep + 'FILENAME', "FILE CONTENT", done);
  });

  after(function(done) {
    this.server.stop(done);
  });

  after(function(done) {
    fs.unlink(__dirname + path.sep + 'tmp' + path.sep + 'FILENAME', done);
  });

  xit('can get a file from the server', function(done) {
    var url = 'http://127.0.0.1:8080/happner-files/files/FILENAME';


    done();
  });
});
