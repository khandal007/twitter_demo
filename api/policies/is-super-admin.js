/**
 * is-super-admin
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
   console.log("Kahi tum idhar to nehi ho");
   // console.log(req.session);
    return res.unauthorized();
  }//•

  // Then check that this user is a "super admin".
  if (req.me.isSuperAdmin <=0) {
    return res.forbidden();
  }//•
  console.log("locael is ",req.me.languagePreference);
  req.setLocale(req.me.languagePreference);

  /*if(req.me.userRole == 65){
    if(req.me.isSuperAdmin == 1){
      var curQry = `SELECT acm.id,acm.master_name,acm.parent_id,acm.master_slug,acm.sell_slug,acm.sell_year_dash,acm.state_id,acm.billing_company,ass.gst_code,ass.state_name FROM account_company_master acm INNER JOIN account_states ass on acm.state_id = ass.id ORDER BY id ASC`;
    }else{
      var curQry = `SELECT acm.id,acm.master_name,acm.parent_id,acm.master_slug,acm.sell_slug,acm.sell_year_dash,acm.state_id,acm.billing_company,ass.gst_code,ass.state_name FROM account_user_companies auc
                  INNER JOIN account_company_master acm
                  ON acm.id = auc.company_id
                  INNER JOIN account_states ass on acm.state_id = ass.id
                  WHERE auc.user_id = ${req.me.id}
                  ORDER BY acm.parent_id`;
    }
     // var curQry = `SELECT acm.id,acm.master_name,acm.parent_id FROM account_user_companies auc
     //              INNER JOIN account_company_master acm
     //              ON acm.id = auc.company_id
     //              WHERE auc.user_id = ${req.me.id}
     //              ORDER BY acm.parent_id`;
    var companyResult = await sails.sendNativeQuery(curQry);
    if(!companyResult){
          var sendObj = [];
        }else{
          var sendObj = companyResult.rows;

        }
       // console.log(sendObj, 'sendObj');
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
            // req.session.currentCompany = sendObj[0];
             res.redirect('/company/control-dashboard');
             
        }

      
  }*/



  // IWMIH, we've got ourselves a "super admin".
  return proceed();

};
