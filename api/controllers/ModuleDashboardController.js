/**
 * ModuleDashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
   dashboard:async function(req,res){
       var breadcrumbData = { 
              pageTitle : "Dashboard"
        };
        var query = `SELECT att.id,att.type_name, getModeBalance(att.id,2,1) as processedTotal, getModeBalance(att.id,2,2) as lavel1Total, getModeBalance(att.id,2,3) as level2Total FROM account_types att`;
           // console.log(query);
            var totalresult = await sails.sendNativeQuery(query);
            if(!totalresult){ 
              var sendObj = [];
            }else{
              var sendObj = totalresult.rows;
            } 
            var whereQuery = "";
            if(req.session.currentFinancialStart){
              if(req.session.currentFinancialStart != -1){
                whereQuery = `${whereQuery} AND transaction_for_date >= '${req.session.currentFinancialStart}' AND transaction_for_date <= '${req.session.currentFinancialEnd}'`;
              }
            }
           // console.log(sendObj);
            var query2 = `SELECT pm.id, pm.modeName, pm.payment_type, pm.category, (SELECT SUM(transaction_amount) FROM account_transactions WHERE transaction_mode = pm.id AND transaction_status=1 AND transaction_company = 2${whereQuery}) as processed_amount, (SELECT COUNT(id) from account_transactions where transaction_status = 3 AND transaction_company = 2 AND transaction_mode =pm.id AND transaction_head IS null${whereQuery}) AS pending_tr,
              (SELECT SUM(transaction_amount) FROM account_transactions WHERE transaction_mode = pm.id AND transaction_status=2 AND transaction_company = 2${whereQuery}) as level1_amount, 
              (SELECT SUM(transaction_amount) FROM account_transactions WHERE transaction_mode = pm.id AND transaction_status=3 AND transaction_company = 2${whereQuery}) as level2_amount 
              FROM payment_modes pm ORDER BY pm.category DESC`;
             // console.log(query2);
            var totalamount = await sails.sendNativeQuery(query2);
            if(!totalamount){ 
              var totalObj = [];
            }else{
              var totalObj = totalamount.rows;
            } 
            //console.log(totalObj);
            res.view('pages/super-dashboard/module_dashboard', {breadcrumb: breadcrumbData, totalObj:totalObj,dataObj:sendObj});
    },
};