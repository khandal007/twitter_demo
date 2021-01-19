/**
 * MasterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	addFieldTypes :async function (req,res) {
		if(req.me.languagePreference == 'pt'){
			var page_title = "Todos os tipos de campos";
		}else{
			var page_title = "All Field Types List";
		}
		var breadcrumbData = {
            pageTitle : page_title
        };
		await commonFetch.getAll('fromfieldtype',{isActive : 1},1,'',function function_name(result){
			res.view('pages/super-dashboard/master/fieldType', { fromFieldType:result, breadcrumb: breadcrumbData });
		})
	},

	addData : async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { fieldName,details } = params;
		var createdField = await FromFieldType.create({name:fieldName,details:details}).fetch();
		res.json({status:"success",message:"inserted successfully",createdField:createdField});
	},
	createHead:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { account_id } = params;
		var breadcrumbData = {};
		if(account_id){
			if(req.me.languagePreference == 'pt'){
				var page_title = "Editar Empresa";
			}else{
				var page_title = "Edit Account Head";
			}
			breadcrumbData = {
	            pageTitle : page_title
	        };
        	await commonFetch.getAll('accountheads',{id:account_id},1,'',function function_name(result){
        		res.view('pages/super-dashboard/master/createHead',{ breadcrumb: breadcrumbData,headEditData:result });
			});

		} else {
			if(req.me.languagePreference == 'pt'){
				var page_title = "Criar Nova Empresa";
			}else{
				var page_title = "Create New Account Head";
			}
			breadcrumbData = {
	            pageTitle : page_title
	        };
			res.view('pages/super-dashboard/master/createHead',{ breadcrumb: breadcrumbData,headEditData:[] });
		}
	},
	createCompany : async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { company_id } = params;
		var breadcrumbData = {};
		if(company_id){
			if(req.me.languagePreference == 'pt'){
				var page_title = "Editar Empresa";
			}else{
				var page_title = "Edit company";
			}
			breadcrumbData = {
	            pageTitle : page_title
	        };
        	await commonFetch.getAll('company',{id:company_id},2,'membershipPlan_id',function function_name(result){
        		res.view('pages/super-dashboard/master/createCompany',{ breadcrumb: breadcrumbData,companyEditData:result });
			});

		}else{
			if(req.me.languagePreference == 'pt'){
				var page_title = "Criar Nova Empresa";
			}else{
				var page_title = "Create New Company";
			}
			breadcrumbData = {
	            pageTitle : page_title
	        };
			res.view('pages/super-dashboard/master/createCompany',{ breadcrumb: breadcrumbData,companyEditData:[] });
		}
	},

	companyList : async function (req,res) {
		await commonFetch.getAll('company',{},2,'membershipPlan_id',function function_name(result){
			res.view('pages/super-dashboard/master/companyList',{companyList:result});
		})
	},
	headList : async function (req,res) {
		var query = `SELECT ah.id,ah.account_name,ah.account_details,ah.isActive,(SELECT getBalance(ah.id)) as balance FROM account_heads ah LIMIT 500`;
        var result = await sails.sendNativeQuery(query);
        if(!result){
        	var sendObj = [];
        }else{
        	var sendObj = result.rows;
        }
        res.view('pages/super-dashboard/master/headList',{companyList:sendObj});
		/*await commonFetch.getAll('accountheads',{},1,'',function function_name(result){
			res.view('pages/super-dashboard/master/headList',{companyList:result});
		})*/
	},
	showTransaction:async function(req,res){

	},
	addHead: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { accountName, accountDetails } = params;
		var headData = {
			account_name:accountName,
			account_details:accountDetails,
			createdBy:req.me.id
		};
		try {
			var createdHead = await AccountHeads.create(headData).fetch();
			if(createdHead){
				res.json({status:"success",message:"Head created successfully",createdHead:createdHead});
			}else{
				res.json({status:"error",message:"something went wrong",createdHead:[] });
			}
		} catch (e) {

			if(e.code === 'E_UNIQUE'){
				res.json({status:"error",message:"Head name already exists",createdHead:[] });
			}else{
				res.json({status:"error",message:"something went wrong",createdHead:[] });
			}
		}


	},
	updateHead: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { account_id,accountName, accountDetails } = params;
		var headData = {
			account_details:accountDetails
		};
		var updatedHead = await AccountHeads.update({id:account_id}).set(headData).fetch();
		if(updatedHead){
			res.json({status:"success",message:"Head updated successfully",updatedHead:updatedHead});
		}else{
			res.json({status:"error",message:"something went wrong",updatedHead:[] });
		}
	},
	addCompany : async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { companyName,companyDetails,companyMobile,companyTelephone,companyEmail,companyWebsite,companyPunchline,companyLogo,membershipplan } = params;
		var companyData ={
			company_name:(companyName)?companyName:'',
			company_punchline:(companyPunchline)?companyPunchline:'',
			company_mobile:(companyMobile)?companyMobile:'',
			company_telephone:(companyTelephone)?companyTelephone:'',
			company_email:(companyEmail)?companyEmail:'',
			company_website:(companyWebsite)?companyWebsite:'',
			company_logo:(companyLogo)?companyLogo:'',
			company_details:(companyDetails)?companyDetails:'',
			membershipPlan_id:(membershipplan)?membershipplan:''
		}
		var createdCompany = await Company.create(companyData).fetch();
		res.json({status:"success",message:"Company created successfully",createdCompany:createdCompany});
	},

	updateCompany : async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { company_id,companyName,companyDetails,companyMobile,companyTelephone,companyEmail,companyWebsite,companyPunchline,companyLogo,membershipplan,companyStatus } = params;
		// console.log("params",params)
		var companyData ={
			company_name:(companyName)?companyName:'',
			company_punchline:(companyPunchline)?companyPunchline:'',
			company_mobile:(companyMobile)?companyMobile:'',
			company_telephone:(companyTelephone)?companyTelephone:'',
			company_email:(companyEmail)?companyEmail:'',
			company_website:(companyWebsite)?companyWebsite:'',
			company_logo:(companyLogo)?companyLogo:'',
			company_details:(companyDetails)?companyDetails:'',
			membershipPlan_id:(membershipplan)?membershipplan:'',
			isactive:companyStatus
		}
		var updatedCompany = await Company.update({id:company_id}).set(companyData).fetch();
		// if(updatedCompany){
		// 	await commonFetch.getAll('company',{},2,'membershipPlan_id',function function_name(result){
		// 		res.view('pages/super-dashboard/master/companyList',{companyList:result});
		// 	})
		// }
		 res.json({status:"success",message:"Company details updated successfully",updatedCompany:updatedCompany});
	},

	createUser : async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { id } = params;
		var breadcrumbData = {};
		await commonFetch.allCompanies(req,true,function function_name(companyRes){
			if(companyRes){
				//console.log(companyRes);
				// allCompanies = JSON.stringify(companyRes);
				allCompanies = companyRes;
			}
		});
		if(id){
			if(req.me.languagePreference == 'pt'){
				var page_title = "Editar usuário";
			}else{
				var page_title = "Edit User";
			}
			breadcrumbData = {
	            pageTitle : page_title
	        };
	        var allUserCompanies = await UserCompanies.find({user_id:id});
	        var allUserAllocatedCompanies = [];
	        await allUserCompanies.map(function(d){
	        	allUserAllocatedCompanies.push(d.company_id);
	        });
	        console.log(allUserAllocatedCompanies);
	        await commonFetch.getAll('user',{id:id},1,'',async function function_name(userResult){
	        	console.log("userResult",userResult);
	        	res.view('pages/super-dashboard/master/createUser',{companyLists:[] , breadcrumb: breadcrumbData, userResult:userResult,allCompanies:allCompanies,allUserCompanies:allUserAllocatedCompanies,user_id:id});
			});
		}else{
			if(req.me.languagePreference == 'pt'){
				var page_title = "Criar Usuário";
			}else{
				var page_title = "Create User";
			}
			breadcrumbData = {
	            pageTitle : page_title
	        };
	        res.view('pages/super-dashboard/master/createUser',{companyLists:[] , breadcrumb: breadcrumbData,userResult:[],allCompanies:allCompanies,allUserCompanies:[],user_id:-1 });

		}
	},

	addUser :async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { fullName,userEmail,userPassword,userType,userLogin,companyIds,mobile_no,companyParentIds} = params;
		 // console.log("params",params)
		//  return false;
			var companiesAllocated = [];
			var userData ={
					fullName:fullName,
					emailAddress:userEmail,
					password:await sails.helpers.passwords.hashPassword(userPassword),
					userRole:userType,
					//company_id:req.session.currentCompany.billing_company,
					isSuperAdmin: (userType == 65)?2:0,
					mobile:mobile_no
				}
				if(userLogin){
					userData.userLogin = userLogin.join();
				}

				try {

					//console.log(userData, 'userData');
					//return false;

				var userData = await User.create(userData).fetch();
				var urlTosend = "/";
				// if(userType == 55){
				// 	urlTosend = '/upanel';
				// }else if(userType == 45){
				// 	urlTosend = '/panel';
				// }

				if(userData){

					// if(companyIds){
					// 	await companyIds.map(function(ids){
					// 		var Obj = {};
					// 		Obj.company_id = parseInt(ids);
					// 		Obj.user_id = parseInt(userData.id);
					// 		companiesAllocated.push(Obj);
					// 	})
					// }
					// var allData = await UserCompanies.createEach(companiesAllocated).fetch();
					commonFetch.allocatedCompanies(req,userData.id,companyIds,false,function function_name(rs){
							console.log("add",rs);
						})
					//return false;
					if(sails.config.custom.devMode == "live"){
							await sails.helpers.sendTemplateCustommail.with({
					        to: userData.emailAddress,
					        subject: 'Please Login your account',
					        template: 'email-welcome-user',
					        smtpMail:sails.config.ses.smtp_username,
                			smtpPassword:sails.config.ses.smtp_password,
                			mail_type: 2,
					        templateData: {
					          fullName: userData.fullName,
					          password:userPassword,
					          loginUrl:urlTosend,
					          emailAddress:userData.emailAddress
					        }
				      	});
					}	
					res.json({status:"success",message:"inserted successfully",userData:userData});
				}else{
					res.json({status:"error",message:"something wrong happened",userData:[]});
				}
			} catch (e) {
				console.log(e);
				if(e.code === 'E_UNIQUE'){
					res.json({status:"error",message:"User email already exists"});
				} else {
					res.json({status:"error",message:"Update something went wrong"});
				}
			}

	},
	updateUser :async function (req,res) {
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { user_id,fullName,userEmail,userPassword,userType,company_id,mobile_no,userLogin,companyIds,companyParentIds} = params;
		 // console.log("params",params)
		 // return false;
		var userData = {};
		if(userPassword == ''){
			userData ={
				company_id:company_id,
				fullName:fullName,
				emailAddress:userEmail,
				userRole:userType,
				mobile:mobile_no
			}
		}else{
			// console.log("password",userPassword);
			userData ={
				company_id:company_id,
				fullName:fullName,
				emailAddress:userEmail,
				password:await sails.helpers.passwords.hashPassword(userPassword),
				userRole:userType,
				mobile:mobile_no
			};
		}
		if(userLogin){
			userData.userLogin = userLogin.join();
		}
		try {
			var updatedUSer = await User.update({id:user_id}).set(userData).fetch();
			await commonFetch.allocatedCompanies(req,user_id,companyIds,true,function function_name(rs){
				console.log("edit",rs);
			});
			// if(companyIds){
			// 	await UserCompanies.destroy({user_id:user_id});
			// 	if(companyIds){
			// 			await companyIds.map(function(ids){
			// 				var Obj = {};
			// 				Obj.company_id = parseInt(ids);
			// 				Obj.user_id = parseInt(userData.id);
			// 				companiesAllocated.push(Obj);
			// 			})
			// 	}
			// 	var allData = await UserCompanies.createEach(companiesAllocated).fetch();
			// }
			
			res.json({status:"success",message:"updated successfully",userResult:updatedUSer});
		} catch (e) {
			console.log(e);
			if(e.code === 'E_UNIQUE'){
				res.json({status:"error",message:"User email already exists"});
			} else {
				res.json({status:"error",message:"Update something went wrong"});
			}
		}


	},

	companyAdminList:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { company_id,moderator } = params;
		var whereCond = {};
		if(company_id){
			whereCond = {
				userRole:55,
			}
		}else if(moderator == 1){
			whereCond = {
				userRole: 45,
			}
		}else if(moderator == 2){
			whereCond = {
				userRole: 65,
			}
		}else{
			whereCond = {
				userRole: 55,
			}
		}
		await commonFetch.getAll('user',whereCond,1,'',function function_name(result){
			res.view('pages/super-dashboard/master/companyAdminList',{companyAdminList:result});
		})
	},
	deleteUser:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { user_id } = params;
		var destroyedRecords = await User.destroy({id:user_id});
		res.json({status:"success",message:"deleted successfully",destroyedRecords:destroyedRecords});
	},
	deleteCompany:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { company_id } = params;
		var destroyedRecords = await Company.destroy({id:company_id});
		res.json({status:"success",message:"deleted successfully"});
	},

	// bankList : async function(){
	// 	const params = _.extend(req.query || {}, req.params || {}, req.body || {});
	// 	const { account_id } = params;
	// 	var breadcrumbData = {};
 //        await commonFetch.getAll('user',{:account_id},1,'',async function function_name(result){
 //        	breadcrumbData = { pageTitle : "Bank List"};
 //        	res.view('pages/super-dashboard/master/bankList', { bankList:result, breadcrumb: breadcrumbData });
	// 	});
	// },

	saveTransaction:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		//console.log(params);
		if(params.headId){
			var dateString = params.txn_date; // Oct 23
			var dateParts = dateString.split("/");
			// month is 0-based, that's why we need dataParts[1] - 1
			var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
			if(params.paymentMode == 1){
			//For cash payment
				var sendData = {
					transaction_head:parseInt(params.headId),
					transaction_type:parseInt(params.type),
					transaction_mode:parseInt(params.paymentMode),
					transaction_amount:parseFloat(params.amount),
					transaction_remark:params.remark,
					transaction_date:dateObject,
					//transaction_head_bank:null,
					//transaction_cheque_bank:null,
					createdBy:req.me.id
				};
			}
			else if(params.paymentMode == 2){
			//For cheque payment
				if(params.cheque_date){

					var chdateString = params.cheque_date; // Oct 23
					var chdateParts = chdateString.split("/");
					// month is 0-based, that's why we need dataParts[1] - 1
					var chdateObject = new Date(chdateParts[2], chdateParts[1] - 1, chdateParts[0]);
					//console.log("yes it is",chdateObject);
				}else{
					//console.log("no it is");
					var chdateObject = null;
				}
			var sendData = {
					transaction_head:parseInt(params.headId),
					transaction_type:parseInt(params.type),
					transaction_mode:parseInt(params.paymentMode),
					transaction_amount:parseFloat(params.amount),
					transaction_remark:params.remark,
					transaction_date:chdateObject,
					//transaction_head_bank:null,
					transaction_cheque_number:params.cheque_no,
					transaction_cheque_bank:(params.chequeBankId)?parseInt(params.chequeBankId):null,
					createdBy:req.me.id
				};
			}else if(params.paymentMode == 3){
			//For bank payment
			 	var sendData ={
					transaction_head:parseInt(params.headId),
					transaction_type:parseInt(params.type),
					transaction_mode:parseInt(params.paymentMode),
					transaction_amount:parseFloat(params.amount),
					transaction_remark:params.remark,
					transaction_head:parseInt(params.headId),
					transaction_head_bank:(params.bankTransfer)?parseInt(params.bankTransfer):null,
					transaction_number:params.transaction_number,
					createdBy:req.me.id
					};
			}else{
				var sendData = {};
			}
			try{

			var accountData = await AccountTransaction.create(sendData).fetch();
			if(accountData){
					res.json({status:"success",message:"Transaction added successfully"});
				}else{
					res.json({status:"error",message:"Error occurred"});
				}
			}catch(e){
				console.log(e);
				res.json({status:"error",message:"Something bad happened"});
			}

		}else{
			res.json({status:"error",message:"Account head not selected"});
		}
	},

	currentLogin: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		const { company_id } = params;
	    var breadcrumbData = {};       
	    breadcrumbData = { pageTitle : `List Of Current Login Users` };

	    res.view('pages/super-dashboard/master/currentLogin', { breadcrumb: breadcrumbData, company_id:company_id});
	},

	getCurrentLoginList: async function(req,res){
	    const params = _.extend(req.query || {}, req.params || {}, req.body || {});
	    var response = {};
	    var whereQuery = ``;
	    var orderQuery = "";

	    if(params.search['value'] != ""){
	        let queryNameDetails = params.search['value'];
	        if(queryNameDetails != ""){
	          whereQuery = `${whereQuery} AND(als.login_at LIKE '%${queryNameDetails}%' || au.fullName LIKE '%${queryNameDetails}%')`;
	        }
    	}

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

	    var query = `SELECT als.id, INET_NTOA(als.ip_address) AS ip_address, als.login_at, aua.device_info, aua.user_agent, aua.device_type, au.fullName
	    	FROM account_login_session AS als
	    	LEFT JOIN account_users AS au on als.user_id = au.id
	    	LEFT JOIN account_user_agent AS aua ON aua.id = als.user_agent_id
	    	 ${whereQuery} ${limitQry}`;
      var result = await sails.sendNativeQuery(query);

      var countQuery = `SELECT count(als.id) as totalFilterUser
          FROM account_login_session AS als
	    	LEFT JOIN account_users AS au on als.user_id = au.id
	    	LEFT JOIN account_user_agent AS aua ON aua.id = als.user_agent_id
	    	 ${whereQuery}
          ORDER BY als.updatedAt DESC`;

    var countAllQuery = `SELECT count(als.id) as totalRecords
          FROM account_login_session AS als
	    	LEFT JOIN account_users AS au on als.user_id = au.id
	    	LEFT JOIN account_user_agent AS aua ON aua.id = als.user_agent_id
          WHERE 1=1`;

    		var countResult = await sails.sendNativeQuery(countQuery); 
    		var countAllResult = await sails.sendNativeQuery(countAllQuery);
      if(!result){ 
             response.draw = params.draw;
             response.recordsTotal = 0;
             response.recordsFiltered = 0;
             response.data = [];
             callback(response); 
          } else { 
            response.data = [];      
            result.rows.map(async function(dataRow, idx){
            	if(dataRow.device_info){
            		var device = JSON.parse(dataRow.device_info);
            	}
            	var icon;
            	if(dataRow.device_type==1){
            		icon = "<i class='fa fa-television' aria-hidden='true'></i>";
            	}else if(dataRow.device_type==2){
            		icon = "<i class='fa fa-android' aria-hidden='true'></i>";
            	}else{
            		icon = "<i class='fa fa-apple' aria-hidden='true'></i>";
            	}
              var newDataRow = {
                id : dataRow.id,
                ip_address : dataRow.ip_address,
                user_agent : (dataRow.device_type==1)?dataRow.user_agent:"-",
                device_model : device?device.device_model:'-',
                device_id : device?(dataRow.device_type==2)?device.device_id:device.version:'-',
                device_imei : device?device.device_imei:'-',
                device_type : icon,
                login_at : (dataRow.login_at)?dataRow.login_at:null,
                fullName : dataRow.fullName,
                };
               response.data.push(newDataRow);
               newDataRow = {};
            });
            let totalRecords = (countAllResult)?countAllResult.rows[0].totalRecords:0;
            let totalFilterRecords = (countResult)?countResult.rows[0].totalFilterUser:0;
            response.draw = params.draw;
            response.recordsTotal = totalRecords;
            response.recordsFiltered = totalFilterRecords;
            res.json(response);
          }
	},

};
