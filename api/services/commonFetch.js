module.exports = {
    getModeName:async function(modeId,callback){
      var getName="N/A";
      for(var i=0;i<sails.config.constants.payment_mode.length;i++){
        if(sails.config.constants.payment_mode[i].id == modeId){
          getName = sails.config.constants.payment_mode[i].modeName;
          break;
        }
      }
      callback(getName);
      // var getArr = await sails.config.constants.payment_mode.filter(function(data,i){
      //   return data.id === modeId;
      // });
      // console.log(getArr);
      // if(getArr.length == 1){
      //   return getArr[0].modeName;
      // }else{
      //   return "N/A";
      // }

    },
    
    getAll:async function(modelName,whereObj,type,populateStr,callback){
    if(type == 1){
      await sails.models[modelName].find(whereObj).exec(function res(err,getData){
          if(err){
            //console.log(err);
            callback(null);
          }else{
            callback(getData);
          }
      })
    } else {
        await sails.models[modelName].find(whereObj).populate(populateStr).exec(function res(err,getData){
          if(err){
            callback(null);
          }else{
            callback(getData);
        }
      })
    }
  },

  allocatedHeadCompanies:async function(req,headId,companyIds,mode,callback){
      if(headId){
        if(companyIds){
            if(mode){
              await AccountCompany.destroy({head_id:headId});
            }
            var companiesAllocated = [];
              await companyIds.map(function(ids){
                var Obj = {};
                Obj.company_id = parseInt(ids);
                Obj.head_id = parseInt(headId);
                companiesAllocated.push(Obj);
              })
              var allData = await AccountCompany.createEach(companiesAllocated);
              callback(true);
        }else{
              callback(false);
        }
      }else{
           callback(false);
      }
  },

  allocatedCompanies:async function(req,userId,companyIds,mode,callback){
    // console.log("userId",userId);
    // console.log("companyIds",companyIds);
    // console.log("mode",mode);
    if(userId){
      if(companyIds){
          if(mode){
            await UserCompanies.destroy({user_id:userId});
          }
          var companiesAllocated = [];
            await companyIds.map(function(ids){
              var Obj = {};
              Obj.company_id = parseInt(ids);
              Obj.user_id = parseInt(userId);
              companiesAllocated.push(Obj);
            })
            var allData = await UserCompanies.createEach(companiesAllocated);
            callback(true);
      }else{
            callback(false);
      }
    }else{
         callback(false);
    }
  },

  headList: async function(req,callback){
      

      var wherQuery = "";
      //console.log(req);
      if(req.me.userRole == 65){
        wherQuery = `ah.isActive = 1 AND ${req.session.currentCompany.id} IN (SELECT company_id from account_head_companies WHERE head_id = ah.id)`;
      }else{
        wherQuery = `ah.isActive = 1 AND ah.id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id}) AND ${req.session.currentCompany.id} IN (SELECT company_id from account_head_companies WHERE head_id = ah.id)`;
      }
     
      wherQuery = `${wherQuery} AND ah.account_type not in (7,8,9,10,11,13)`;
        
         var query = `SELECT ah.id,ah.state_id,ah.account_name,ah.account_type,(SELECT type_name from account_types where id= ah.account_type) as account_type_name,asm.state_name,ah.account_work_type,ah.account_category,(SELECT getBalance(ah.id)) as balance FROM account_heads ah left join account_states asm on asm.id= ah.state_id  WHERE ${wherQuery} ORDER BY ah.account_name ASC`;

      //   console.log(query);
        var result = await sails.sendNativeQuery(query);
        // console.log(result);
      if(!result){ 
            // response.status='error';
            // response.message='Error In Fetching Form!';
            var searchData = [];
        } else {
          
          var searchData = [];
          result.rows.map(async(data, idx) => {
            var workType = [];
           // var obj = await req.session.allTypes.filter(function(item){
           //              return item.id == data.account_type;
           //            });

            var newData = {
              id : data.id,
              labelName : data.account_name,
              stateName:data.state_name,
              state_id:data.state_id,
              account_work_type:data.account_work_type,
              account_category:data.account_category,
              account_type:data.account_type_name
            };
            searchData.push(newData);
            newData = null;
            });
          
            searchData
        }
        callback(searchData);
    },

  allHeadCompanies:async function(headId,callback){
    if(headId){
       var query = `SELECT company_id FROM account_head_companies WHERE head_id = ${headId}`;
       var result = await sails.sendNativeQuery(query);  
       var sendObj = [];
       if(result.rows){
        await result.rows.map(function(data){
          sendObj.push(parseInt(data.company_id));
        })
        callback(sendObj);
       }else{
        callback([])
       }
    }else{
      callback([]);
    }
  },

  allCompanies:async function(req,mode,callback){
    if(mode){
          if(req.me.isSuperAdmin == 1){
             var query = `SELECT acm.id, acm.master_name,acmp.master_name as parent_company,acmp.id as parent_company_id,acm.master_mobile, acm.gst_number, acm.pan_number, acm.master_slug, acm.isActive,(SELECT COUNT(id) from account_transactions where transaction_status = 3 AND transaction_company = acm.id AND transaction_mode IN (4,5) AND transaction_head IS null) AS pending_tr,
            (SELECT state_name FROM account_states WHERE id= acm.state_id) as state_name
            FROM account_company_master acm LEFT JOIN 
            account_company_master acmp on acm.parent_id = acmp.id
            where acmp.billing_company = ${req.me.company_id}
                ORDER BY acm.parent_id`;
          }else{
            var query = `SELECT acm.id,acm.master_name,acm.parent_id,acm.master_slug, acmp.id as parent_company_id,acmp.master_name as parent_company,acm.master_mobile, acm.gst_number, (SELECT COUNT(id) from account_transactions where transaction_status = 3 AND transaction_company = acm.id AND transaction_mode IN (4,5) AND transaction_head IS null) AS pending_tr, acm.pan_number, acm.isActive,(SELECT state_name FROM account_states WHERE id= acm.state_id) as state_name FROM account_user_companies auc
                  INNER JOIN account_company_master acm ON acm.id = auc.company_id
                  INNER JOIN account_company_master acmp ON acmp.id = acm.parent_id
                  WHERE auc.user_id = ${req.me.id} and acmp.billing_company = ${req.me.company_id}
                  ORDER BY acm.parent_id`;  
          }
          
    }else{
           var query = `SELECT acm.id,acm.master_name,acm.parent_id,acm.master_slug,acmp.id as parent_company_id,acmp.master_name as parent_company,acm.master_mobile, acm.gst_number, (SELECT COUNT(id) from account_transactions where transaction_status = 3 AND transaction_company = acm.id AND transaction_mode IN (4,5) AND transaction_head IS null) AS pending_tr, acm.pan_number, acm.isActive,(SELECT state_name FROM account_states WHERE id= acm.state_id) as state_name FROM account_user_companies auc
                  INNER JOIN account_company_master acm ON acm.id = auc.company_id
                  INNER JOIN account_company_master acmp ON acmp.id = acm.parent_id
                  WHERE auc.user_id = ${req.me.id} and acmp.billing_company = ${req.me.company_id}
                  ORDER BY acm.parent_id`;  
    }
    var result = await sails.sendNativeQuery(query);  
    if(result.rows){
     //console.log(result.rows);
     //callback(result.rows);
      
      var mainChildObj = {}
      await result.rows.map(function(data,i){
        //console.log(data);
        if(data.id == data.parent_company_id){
          if(!mainChildObj.hasOwnProperty(data.id)){
            mainChildObj[data.id] = {};
            //mainChildObj = {}
            mainChildObj[data.id].id = data.id;
            mainChildObj[data.id].text = data.parent_company;
            mainChildObj[data.id].parent_company_id = data.parent_company_id;
            mainChildObj[data.id].children =[];
          }
          
        }else{
          
          if(!mainChildObj.hasOwnProperty(data.parent_company_id)){
            mainChildObj[data.parent_company_id] = {}; 
           // mainChildObj = {}
            mainChildObj[data.parent_company_id].id = data.parent_company_id;
            mainChildObj[data.parent_company_id].parent_company_id = data.parent_company_id;
            mainChildObj[data.parent_company_id].text = data.parent_company;
            mainChildObj[data.parent_company_id].children =[];         
          }
          
          
        }
          // var childObj = {};
          // childObj.id = data.id;
          // childObj.text = data.master_name;
          var childNode = {}
          childNode.id = data.id;
          childNode.text = data.master_name;
          childNode.gst_number = data.gst_number;
          childNode.pan_number = data.pan_number;
          childNode.state_name = data.state_name;
          childNode.pending_tr = data.pending_tr;
          childNode.master_slug = data.master_slug;

          //console.log(childNode);
          mainChildObj[data.parent_company_id].children.push(childNode);
      })
      var sendObj = [];
      Object.keys(mainChildObj).forEach(function(key) {
        sendObj.push(mainChildObj[key]);
      });
      //console.log(sendObj, 'sendObj');
      callback(sendObj);
    }else{
      callback(null);
    }    
  },

  getMySQLDateObj(getDate){
     // console.log("getDate",getDate);
        var dateParts = getDate.split("/");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return dateObject;
  },

  commonHeadList:async function(req,phrase,callback){
    var response = [];
        if(phrase == ""){
          response = [];
           res.json(response);
           return false;
        }
      var wherQuery = "";
      if(req.me.userRole == 65){
        wherQuery = `ah.isActive = 1 and ah.id in (select head_id FROM account_head_companies where company_id = ${req.session.currentCompany.id})`;
      }else{
        wherQuery = `ah.isActive = 1 AND ah.id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id}) and ah.id in (select head_id FROM account_head_companies where company_id = ${req.session.currentCompany.id})`;
      }

       var query = `SELECT ah.id,ah.state_id,ah.account_type,ah.account_name,asm.state_name,ah.account_work_type,ah.account_category,(SELECT getCompanyBalance(ah.id,${req.session.currentCompany.id})) as balance FROM account_heads ah left join account_states asm on asm.id= ah.state_id  WHERE ${wherQuery} AND ah.account_name LIKE '%${phrase}%' LIMIT 20`;
        var result = await sails.sendNativeQuery(query);
      if(!result){ 
            response = [];
        } else {          
          var searchData = [];
     
          result.rows.forEach(async(data, idx) => {
            let newName = data.account_name + "( "+ data.balance +" )";
            var workType = [];  
            var typeObj = req.session.allTypes.filter(function(item){
                return item.id == data.account_type
            });
            var acType = (typeObj.length == 1)?typeObj[0].type_name:"N/A";
            var newData = {
              id : data.id,
              labelName : data.account_name,
              balance : data.balance,
              stateName:data.state_name,
              state_id:data.state_id                       
            };
              searchData.push(newData);
              newData = "";
            });
          
            response=searchData
        }
        callback(response);
  },

  commonSiteList:async function(req,phrase,callBack){
    var response = [];
    var query = `SELECT id, site_name, site_reference FROM account_project_sites where site_name like '${phrase}%' OR project_id in (SELECT id FROM account_projects WHERE
      project_customer in (SELECT head_id  FROM account_head_companies WHERE company_id = ${req.session.currentCompany.id})) AND isActive = 1`;
      var result = await sails.sendNativeQuery(query);
      if(!result){ 
            response = [];
        } else {          
          var searchData = [];
          result.rows.forEach(async(data, idx) => {
            let newName = data.account_name + "( "+ data.balance +" )";
            var workType = [];  
            var typeObj = req.session.allTypes.filter(function(item){
                return item.id == data.account_type
            });
            var acType = (typeObj.length == 1)?typeObj[0].type_name:"N/A";
            var newData = {
              id : data.id,
              labelName : data.site_name,
              site_reference:(data.site_reference)?data.site_reference:null
            };
              searchData.push(newData);
              newData = "";
            });
            response=searchData;
        }
        callBack(response);
  },

  fetchgoodsName:async function(req, phrase, callBack){
    var response = [];
    var query = `SELECT agsm.id, agsm.goods_name from account_goods_service_master agsm
    where agsm.goods_name like '${phrase}%'`;
      var result = await sails.sendNativeQuery(query);
      if(!result){ 
            response = [];
        } else {          
            var searchData = [];
            result.rows.forEach(async(data, idx) => {
            var newData = {
              id : data.id,
              labelName : data.goods_name,
            };
              searchData.push(newData);
              newData = "";
            });
            response=searchData;
        }
        callBack(response);
  },
  currentProjects:async function(req,callBack){
    var query = `SELECT ap.id,concat(ap.project_name,'-',ah.account_name) as project_name,ap.project_customer,ah.account_name,ah.state_id,ah.account_category,ah.account_work_type,ass.state_name FROM account_projects ap inner join account_heads ah on ap.project_customer = ah.id left join account_states ass on ah.state_id= ass.id WHERE ap.project_customer in (SELECT head_id from account_head_companies where company_id = ${req.session.currentCompany.id})`;
    //console.log(query);
    var result = await sails.sendNativeQuery(query);

      if(!result){ 
            callBack([]);
        } else {          
             callBack(result.rows);
        }
        //callBack(response);

  },
  getTDS:async function(req,callBack){
    var query=`SELECT id,account_name FROM account_heads where system_defined=4 and id in(SELECT head_id from account_head_companies where company_id =${req.session.currentCompany.id})`;
      var result = await sails.sendNativeQuery(query);
      if(!result){ 
            callBack([]);
        } else {          
            callBack(result.rows);
        }
  },
  getFreightExpense:async function(req,callBack){
    var query = `SELECT ae.id,ae.expense_name,ae.billing_company_id,ae.expense_details,ae.head_expense,(select account_name from account_heads WHERE id=ae.head_expense) as account_name,ae.isActive FROM account_expenses ae where ae.billing_company_id = ${req.session.currentCompany.billing_company} and ae.isActive = 1  and head_expense IN (SELECT id FROM account_heads WHERE system_defined = 2) ORDER BY ae.expense_name ASC LIMIT 500`;
    //console.log(query, 'query');
     var result = await sails.sendNativeQuery(query);
      if(!result){ 
            callBack([]);
        } else {          
             callBack(result.rows);
        }
  },
  getAllExpenses:async function(req, callBack){
    var query = `SELECT ae.id,ae.expense_name,ae.billing_company_id,ae.expense_details,ae.head_expense,(select account_name from account_heads WHERE id=ae.head_expense) as account_name,ae.isActive FROM account_expenses ae where ae.billing_company_id = ${req.me.company_id} and ae.isActive = 1 and head_expense IS NOT NULL ORDER BY ae.expense_name ASC LIMIT 500`;
    console.log(query, 'query');
     var result = await sails.sendNativeQuery(query);
      if(!result){ 
            callBack([]);
        } else {          
             callBack(result.rows);
        }
  },
  getLedgerExpenses:async function(req,head_id, callBack){
    var response = {};
    var query = `SELECT ae.id,ae.expense_name,ae.head_expense,ae.isActive FROM account_expenses ae where ae.billing_company_id = ${req.me.company_id} and ae.isActive = 1 and ae.id in (SELECT expense_id from account_head_expenses where head_id = ${head_id}) ORDER BY ae.expense_name ASC`;    
    
    var result = await sails.sendNativeQuery(query);
      if(!result){ 
            response.status="error";
            response.expenses=[];
            callBack(response);
        }else {  
             response.status="success";
             response.expenses=result.rows;          
             callBack(response);
        }
  },

  /*getAllUsers: async function(req, callBack){

    var query = `SELECT * FROM account_users au WHERE au.company_id = ${req.me.company_id}`;

    if(req.me.isSuperAdmin != 1){
      var query = `${query} AND au.id IN (SELECT user_id FROM account_user_companies WHERE company_id = ${req.me.company_id})`;
    }
    var result = await sails.sendNativeQuery(query);
    if(result){
      callBack(result.rows);
    }else{
      callBack(null);
    }
  },*/
}