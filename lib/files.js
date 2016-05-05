module.exports = Files;

function Files() {}

Files.prototype.handler = function($happn, req, res) {
  console.log($happn.config);
  res.end();
};

