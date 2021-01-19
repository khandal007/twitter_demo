/**
 * is-login
 *
 * A simple policy that blocks requests from non-admin.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {
  // First, check whether the request comes from a logged-in user.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).

  if (!req.me) {
    return res.unauthorized();
  }//•

  if(!req.session.allTypes){
  	var qry = "SELECT id,type_name,type_code FROM account_types WHERE isActive = 1 ORDER BY type_name ASC";
  	var typeResult = await sails.sendNativeQuery(qry);
    if(!typeResult){
          req.session.allTypes = [];
        }else{
          req.session.allTypes = typeResult.rows;
        }
  }
  
  // IWMIH, we've got ourselves a "admin".
  return proceed();

};
