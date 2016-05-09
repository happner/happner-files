module.exports = Files;

var path = require('path');

function Files() {
  this.routes = [];
}

Files.prototype.handler = function($happn, req, res) {
  var targetFilename; // or directory (later)

  if (!this._setPathRoutes($happn)) {
    res.statusCode = 500;
    return res.end('happner-files config missing path routes');
  }

  if (!(targetFilename = this._matchPathRoute(req.url))) {
    res.statusCode = 500;
    return res.end('happner-files no matching path route');
  }

  targetFilename = this._transform(targetFilename);

  console.log('got route', targetFilename);

  res.end();
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
  for (var i = 0; i < this.routes.length; i++) {
    if (!url.match(this.routes[i].match)) continue;
    return path.normalize(url.replace(this.routes[i].match, this.routes[i].path));
  }
  return false;
};

Files.prototype._transform = function(targetFilename) {
  return targetFilename;
};
