var moment = require('moment');

module.exports = {

	makeUserLogin:async function(req, type, params, userRecord, callback){
      console.log("give up",params);
        var currentUtcTime = new Date();
        if(params.timeZoneValue){
          var tZV = params.timeZoneValue;
        } else {
          var tZV = 'Asia/Kolkata';
        }

        var today = new Date(currentUtcTime.toLocaleString('en-US', { timeZone: `${tZV}`}));
        var now_date_time = moment(today).format('YYYY-MM-DD HH:mm:ss');
        //console.log("killl",req.headers['user-agent']);
        params.user_agent = req.headers['user-agent'];
        var userAgent = await UserAgent.create({user_agent:params.user_agent, device_type:params.type, fcm_token: params.fcm_token}).fetch();

        userRecord.token = JwtService.issue({id: userRecord.id});
        if(userAgent){
            if(params.type > 1){

                    var checkLoginFromOtherDevice = await UserLoginSession.find({user_id: userRecord.id, logout_at: null});
                    /*if(checkLoginFromOtherDevice.length > 0){
                        console.log("mikeee");
                        callback({ status: false, message: "You are already login in other device for more details contact to administrator!" });
                        return false;
                    }else{*/
                        if(params.device_info){
                            var device_info = JSON.stringify(params.device_info);
                            await UserAgent.update({id: userAgent.id}).set({device_info: device_info});
                        }
                    //}
            }

        let ipv4 = req.headers['x-forwarded-for'] || req.ip;
            if (!ipv4 && req.isSocket) {
                let address = req.socket.handshake.address;
                ipv4 = address.address;
                if(!ipv4) {
                    ipv4 = "::ffff:127.0.0.1"
                }
            }

            ipv4 = ipv4.split(',')[0];
            ipv4 = ipv4.split(':').slice(-1);
            ipv4 = ipv4[0];

            var userlogin;

            var rawResult = await sails.sendNativeQuery(`INSERT INTO ${UserLoginSession.tableName} (ip_address, login_via, login_at, user_id, user_agent_id, createdAt, updatedAt, failed_attempts, isActive) VALUES (INET_ATON('${ipv4}'), ${type}, '${now_date_time}', ${userRecord.id}, ${userAgent.id}, ${new Date().getTime()}, ${new Date().getTime()}, 0, 1)`);

            userlogin = rawResult.insertId;

        }
        //console.log("userRecord",userRecord.token);
            callback({status:true, message:"User logged in successfully!", userData: userRecord, loginId: userlogin });
    },

    makeUserLogout:async function(params, loginId, callback){
        // Time Zone manipulation 
        var currentUtcTime = new Date();
        if(params.timeZoneValue){
          var tZV = params.timeZoneValue;
        } else {
          var tZV = 'Asia/Kolkata';
        }

        var today = new Date(currentUtcTime.toLocaleString('en-US', { timeZone: `${tZV}`}));
        var now_date_time = moment(today).format('YYYY-MM-DD HH:mm:ss');

        var qry = `UPDATE ${UserLoginSession.tableName} SET logout_at='${now_date_time}' WHERE id = ${loginId}`;
        var logoutUser = await sails.sendNativeQuery(qry);
        if(logoutUser){
            callback({ status: true, message: "User logged out successfully!"});            
        } else {
            callback({ status: false, message: "Something went wrong!"});
        }
    },

    updateProfileApk: async function(req,params,callback){
        const { user_id,inputName,inputEmail,inputPassword,inputMailEmail,inputSmtpMailEmail,inputSmtpMailPassword } = params;
        var userData = {};

        await commonUpload.uploadAvatar(req,user_id,async function function_name(result){
            let newAvatar='';
            if(result.length>0){
                let arrSplit = result[0].fd.split("/");
                newAvatar = arrSplit[arrSplit.length-1];
            }else{
                newAvatar = req.me.avatar;
            }
            if(inputPassword == ''){
                userData ={
                    fullName:inputName,
                    emailAddress:inputEmail,
                    avatar:newAvatar,
                    emailChangeCandidate:inputMailEmail,
                    smtpMail:inputSmtpMailEmail,
                    smtpPassword:inputSmtpMailPassword,
                }
            }else{
                userData ={
                    fullName:inputName,
                    emailAddress:inputEmail,
                    avatar:newAvatar,
                    emailChangeCandidate:inputMailEmail,
                    smtpMail:inputSmtpMailEmail,
                    smtpPassword:inputSmtpMailPassword,
                    password:await sails.helpers.passwords.hashPassword(inputPassword),
                };
            }
            var updatedUSer = await User.update({id:user_id}).set(userData).fetch();
            if(updatedUSer.length>0){
                callback({status: true, message:"User Updated Successfully", updateUser: updatedUSer});
            }else{
                callback({status: false, message:"User won't update", updateUser: []});
            }
        });    
    },

    getLedgerListApk: async function(req,params,type,callback){

        var response = {};
        var wherQuery = "";
          if(req.me.userRole == 65){
            wherQuery = `where ${params.company_id} IN (SELECT company_id from account_head_companies WHERE head_id = ah.id)`;
          }else if(req.me.userRole == 55){
            wherQuery = `where ah.id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id}) AND (${params.company_id} IN (SELECT company_id from account_head_companies WHERE head_id = ah.id)) `;
          }else {
            wherQuery = `where 1=0`;
          }

          if(type){
            wherQuery = `${wherQuery} AND account_type = ${type}`;  
          var sendType = "&type="+type;
          }else{
           var sendType = ""; 
        }

            var query = `SELECT ah.id,ah.account_name,asn.state_name
                FROM account_heads ah 
                LEFT JOIN account_states asn on ah.state_id = asn.id ${wherQuery} ORDER BY ah.account_name ASC`;
    

        var result = await sails.sendNativeQuery(query);
        if(!result){
            var sendObj = null;
        }else{
            var sendObj = result.rows;
        }
        callback(sendObj);

    },

    getDocumentsApk: async function(req,params,callback){
        var response = {};
        var whereQuery = "";
        var orderQuery = "";
        console.log("params",params);
        if(req.me.userRole == 65){
           whereQuery = `de.id > 0 AND de.company_id = ${params.company_id}`;
        }else if(req.me.userRole == 55){
             whereQuery = `de.company_id = ${params.company_id} AND de.account_id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id})`;
        }else{  
          whereQuery = `de.createdBy = ${req.me.id} AND de.company_id = ${params.company_id} AND de.account_id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id})`;
        }

        if(params.document_transaction){
            whereQuery = `${whereQuery} AND de.document_transaction = '${params.document_transaction}'`;
        }
        if(params.document_id){
            whereQuery = `${whereQuery} AND de.id = ${params.document_id}`;
        }

        if(params.search){
          let queryNameDetails = params.search;
          if(queryNameDetails != ""){
            whereQuery = `${whereQuery} AND (de.document_name1 LIKE '%${queryNameDetails}%' || de.document_name2 LIKE '%${queryNameDetails}%' || de.document_name3 LIKE '%${queryNameDetails}%' || de.document_name4 LIKE '%${queryNameDetails}%' || ah.account_name LIKE '%${queryNameDetails}%' || dt.document_name LIKE '%${queryNameDetails}%' || dn.document_name LIKE '%${queryNameDetails}%' || de.id IN (SELECT document_id FROM document_media WHERE file_name LIKE '%${queryNameDetails}%'))`;
          }
        }
            orderQuery = `ORDER BY de.updatedAt DESC`;

        if(isNaN(params.start) && isNaN(params.length)){
        var limitQry = ``;
          }else if(isNaN(params.length)){
            var limitQry = ``;
          }else if(isNaN(params.start)){
             var limitQry = `LIMIT 0,${params.length}`;
          }
          else{
            var limitQry = `LIMIT ${params.start},${params.length}`;
          }

           var query = `SELECT de.id as id,ah.id as head_id,ah.account_name,dt.document_name as entry_type,dn.document_name as entry_name,de.valid_from,de.valid_to, de.document_status, de.document_name1,de.document_name2,de.document_name3,de.document_name4,us.fullName,de.createdAt, (SELECT count(id) FROM document_media WHERE document_id = de.id) AS total
            FROM document_entries de 
            LEFT JOIN account_heads ah on de.account_id = ah.id
            LEFT JOIN document_types dt on de.document_type_id = dt.id
            LEFT JOIN document_names dn on de.document_name_id = dn.id
            LEFT JOIN account_users us on de.createdBy = us.id
            WHERE ${whereQuery} ${orderQuery} ${limitQry}`;
            //console.log(query);
      var result = await sails.sendNativeQuery(query);

      if(!result){
        callback({status:false, message:"Records Not Found", docList:[]});
      }else{
        callback({status:true, message:"Records Fetched", docList:result.rows});
      } 
    },
    getDocumentNo: async function(req,params,callback){
        var response = {};
        var whereQuery = "";

        if(req.me.userRole == 65){
           whereQuery = `de.id > 0 AND de.company_id = ${params.company_id}`;
        }else if(req.me.userRole == 55){
             whereQuery = `de.company_id = ${params.company_id} AND de.account_id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id})`;
        }else{  
          whereQuery = `de.createdBy = ${req.me.id} AND de.company_id = ${params.company_id} AND de.account_id NOT IN(select head_id FROM account_unavailable_heads where user_id = ${req.me.id})`;
        }

        var query = `SELECT COUNT(de.id) as total
            FROM document_entries de 
            LEFT JOIN account_heads ah on de.account_id = ah.id
            LEFT JOIN document_types dt on de.document_type_id = dt.id
            LEFT JOIN document_names dn on de.document_name_id = dn.id
            LEFT JOIN account_users us on de.createdBy = us.id
            WHERE ${whereQuery}`;
      var result = await sails.sendNativeQuery(query);
      if(!result){
        callback({status:false, message:"Records Not Found", totalDocs:[]});
      }else{
        callback({status:true, message:"Records Fetched", totalDocs:result.rows[0]});
      } 
    },
}