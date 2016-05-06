module.exports = Files;

function Files() {
  this.routes = [];
}

Files.prototype.handler = function($happn, req, res) {
  console.log($happn.config);

  if (!this._setPathRoutes($happn)) {
    res.statusCode = 500;
    return res.end('happner-files missing routes config');
  }

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
