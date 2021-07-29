module.exports = Files;

var path = require('path');
var fs = require('fs');
var os = require('os');
var mkdirp = require('mkdirp');

function Files() {
  this.routes = [];
}

Files.prototype.handler = function($happn, req, res) {
  var targetFilename, targetFunction; // or directory (later)

  if (!this._setPathRoutes($happn)) {
    res.statusCode = 500;
    return res.end('happner-files: config missing path routes');
  }

  if (!(targetFilename = this._matchPathRoute(req.url))) {
    res.statusCode = 500;
    return res.end('happner-files: no matching path route');
  }

  targetFilename = this._transform(targetFilename);
  targetFunction = '_handle' + req.method;

  if (typeof this[targetFunction] !== 'function') {
    res.statusCode = 500;
    return res.end('happner-files: ' + req.method + ' method not implemented');
  }
  if(res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Size, Access-Control-Allow-Origin'
    );
  }
  this[targetFunction]($happn, targetFilename, req, res);
};

Files.prototype._setPathRoutes = function($happn) {
  if (this.routes.length > 0) return true;
  if (!$happn.config.path) return false;
  if (!$happn.config.path.routes) return false;
  var routes = this.routes;
  Object.keys($happn.config.path.routes).forEach(function(key) {
    var regex = new RegExp('^' + key);
    var path = $happn.config.path.routes[key];
    routes.push({match: regex, path: path});
  });
  return true;
};

Files.prototype._matchPathRoute = function(url) {
  var targetFilename, i;
  for (i = 0; i < this.routes.length; i++) {
    if (!url.match(this.routes[i].match)) continue;
    targetFilename = url.replace(this.routes[i].match, this.routes[i].path + path.sep);
    if (os.platform() === 'win32') {
      targetFilename = targetFilename.replace(/\//g, '\\');
    }
    return path.normalize(targetFilename);
  }
  return false;
};

Files.prototype._transform = function(targetFilename) {
  return targetFilename;
};

Files.prototype._handlePOST = function($happn, targetFilename, req, res) {
  $happn.log.$$DEBUG('processing %s %s to %s', req.method, req.url, targetFilename);
  mkdirp(path.dirname(targetFilename), function(error) {
    if (error) {
      res.statusCode = 500;
      return res.end('happner-files: failed to create directory');
    }
    var stream = fs.createWriteStream(targetFilename);
    var errored = false;

    // stream.pipe(req); // why not?

    req.on('data', function(buf) {
      stream.write(buf);
    });

    req.on('end', function() {
      stream.end();
    });

    req.on('error', function(error) {
      $happn.log.warn('request error', error);
      res.statusCode = 500;
      res.end('happner-files: request error');
      stream.end();
      errored = true;
    });

    stream.on('error', function(error) {
      $happn.log.warn('stream error', error);
      res.statusCode = 500;
      res.end('happner-files: stream error');
      stream.end();
      errored = true;
    });

    stream.on('close', function() {
      if (errored) return;
      res.statusCode = 201;
      res.end();
    });
  });
};


Files.prototype._handleGET = function($happn, targetFilename, req, res) {
  $happn.log.$$DEBUG('processing %s %s to %s', req.method, req.url, targetFilename);
  fs.lstat(targetFilename, function(error, stat) {
    if (error) {
      if (error.code === 'ENOENT') {
        res.statusCode = 404;
        return res.end();
      }
      $happn.log.error('GET error', error);
      res.statusCode = 500;
      return res.end();
    }

    if (stat.isDirectory()) {
      res.statusCode = 404;
      return res.end();
    }

    var stream = fs.createReadStream(targetFilename);
    stream.pipe(res);

  });
};


Files.prototype._handleOPTIONS = function($happn, targetFilename, req, res) {
  res.statusCode = 204;
  return res.end();
};
