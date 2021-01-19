module.exports = function (req, res, next) {
  let token;
  let response = {};
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      response.status_code=401;
      response.msg='Format is Authorization: Bearer [token]';

      return res.json(response);
    }
  } else if (req.param('token')) {
    token = req.param('token');

    delete req.query.token;
  } else {
      response.status_code=401;
      response.msg='You are not permitted to perform this action.';
      return res.json(response);
  }

  JwtService.verify(token, function(err, decoded){
    if (err){
      response.status_code=401;
      response.msg='Invalid Token!';
      return res.json(response);
    } 
    req.token = token;
    User.findOne({id: decoded.id}).then(function(user){
      req.me= user;
      req.me['device_type'] = 2;
      // req.currentUser = {}
      // req.currentUser.user_id = user.id;
      // req.currentUser.fullName = user.fullName;
      // req.currentUser.isSuperAdmin = user.isSuperAdmin;
      // req.currentUser.loginVia = user.loginVia;
      // req.currentUser.userRole = user.userRole;
      // req.currentUser.languagePreference = user.languagePreference;
      // req.currentUser.company_id = user.company_id;
      return next();
    })
  });

}