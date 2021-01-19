var jwt = require('jsonwebtoken');
var jwtSecret = sails.config.jwtSecret;

module.exports = {
  issue: function (payload) {
    token = jwt.sign(payload, jwtSecret, {expiresIn: 86400 * 365})
    return token
  },

  verify: function (token, callback) {
    return jwt.verify(token, jwtSecret, callback);
  }
}
