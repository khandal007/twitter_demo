/**
 * is-authorised-api
 *
 * A simple policy that blocks requests from non-super-admin.
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
  //console.log(req);
  if (!req.me) {
   // console.log("Kahi tum idhar to nehi ho");
   // console.log(req.session);
    return res.unauthorized();
  }//•

 
  return proceed();

};
