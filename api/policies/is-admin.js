/**
 * is-admin
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

  // Then check that this user is a "admin".
  if (req.me.userRole != 55) {
    return res.forbidden();
  }//•

   if(req.me.userRole == 55){
    var curQry = `SELECT acm.id,acm.master_name,acm.parent_id,acm.master_slug,acm.sell_slug,acm.sell_year_dash,acm.state_id,acm.billing_company,ass.gst_code,ass.state_name FROM account_user_companies auc
                  INNER JOIN account_company_master acm
                  ON acm.id = auc.company_id
                  INNER JOIN account_states ass on acm.state_id = ass.id
                  WHERE auc.user_id = ${req.me.id}
                  ORDER BY acm.parent_id`;
    var companyResult = await sails.sendNativeQuery(curQry);
    if(!companyResult){
          var sendObj = [];
        }else{
          var sendObj = companyResult.rows;

        }
        if(!req.session.allCompanies){
           req.session.allCompanies = sendObj;
        }
        if(!req.session.allCompanyIds){
          var Ids = [];
          await sendObj.map(function(data,i){
            Ids.push(parseInt(data.id));
          })
          req.session.allCompanyIds = Ids;
        }

        //console.log(sendObj);
        if(!req.session.currentCompany){
              res.redirect('/company/control-dashboard');
             //req.session.currentCompany = sendObj[0];
        }

       
  }
  req.setLocale(req.me.languagePreference);
  // IWMIH, we've got ourselves a "admin".
  return proceed();

};
