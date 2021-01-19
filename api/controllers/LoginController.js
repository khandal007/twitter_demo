/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  /*  subscribeToFunRoom: function(req, res) {
      if (!req.isSocket) {
        return res.badRequest();
      }

      var roomName = req.param('roomName');
      sails.sockets.join(req, roomName, function(err) {
        if (err) {
          return res.serverError(err);
        }

        return res.json({
          message: 'Subscribed to a fun room called '+roomName+'!'
        });
      });
    }*/
    makeLogin: async function(req, res) {
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        const { emailAddress, password } = params;
        //console.log(params);
        var response = {};
        var userRecord = await User.findOne({
            emailAddress: emailAddress.toLowerCase(),
        });

        // If there was no matching user, respond thru the "badCombo" exit.
        if (userRecord) {
            if (userRecord.isSuperAdmin) {
                if (userRecord.userRole != 65) {
                    //throw 'UnauthorizedUser';
                    response.status = "error";
                    response.message = "UnauthorizedUser";
                    return res.json(response);
                }
            }
        } else {
            response.status = "error";
            response.message = "UnauthorizedUser";
            return res.json(response);
        }
         if(params.userAuth != userRecord.userRole){

              //throw 'UnauthorizedUser';

              response.status = "error";
              response.message = "Your are not authorized to access this login panel check your user role and access appropriate panel!";
              return res.json(response);
          }
        
        
        if (userRecord.isActive == 0) {
            //throw 'AccountBlock';
            response.status = "error";
            response.message = "AccountBlock";
            return res.json(response);
        }

        if (!userRecord) {
            //throw 'badCombo';
            response.status = "error";
            response.message = "badCombo";
            return res.json(response);
        }

        if(userRecord.userLogin.indexOf(10) == -1){
             if(params.type == 1){
                return res.json({ status: "error", message: "Your are not authorized to access this login panel check your user role and access appropriate panel!" });
             }
        }
        else{
            if(userRecord.userRole != 65){            
                var companyCount = await UserCompanies.count({user_id:userRecord.id});
                if(companyCount == 0){
                    return res.json({ status: "error", message: "You do not have any company to work with !" });
                }
            }
            
            await sails.helpers.passwords.checkPassword(password, userRecord.password)
                    .intercept('incorrect', () => {
                    return res.json({ status: "error", message: "Incorrect password" });
            });
            
           
        }

        // await sails.helpers.passwords.checkPassword(password, userRecord.password)
        //     .intercept('incorrect', () => {
        //     return res.json({ status: "error", message: "incorrect passowrd" });
        // });

        req.session.userId = userRecord.id;
        req.session.userRole = userRecord.userRole;
        response.status = "success";
        response.message = "Logged in successfully";
        response.userData = userRecord;
        await NotificationService.socketCustomMethodDataTransfer("1",{"login_user":userRecord.id,"login_time":"Mytime"},"newLoginListener",function function_name(ss){
        })

        return res.json(response);
    },
    viewProfile : async function (req,res) {
        req.setLocale(req.me.languagePreference);
        if(req.me.languagePreference == 'pt'){
            var page_title = "Perfil de usuário";
        }else{
            var page_title = "User Profile";
        }
        var breadcrumbData = { 
            pageTitle : page_title
        };
        res.view('pages/super-dashboard/master/profile',{ breadcrumb: breadcrumbData});
    },
    updateAdminCredientials:async function(req,res){
       // console.log(req.file('avatar'));
       // req.setLocale(req.me.languagePreference);
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        const { user_id,inputName,inputEmail,inputPassword,inputMailEmail,inputSmtpMailEmail,inputSmtpMailPassword } = params;
        var userData = {};
        var breadcrumbData = { 
            pageTitle : 'User Profile '
        };
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
                setTimeout(function(){
                    res.redirect('/viewProfile');
                },2000)
            }else{
                res.redirect('back');
            }
        });
    },

   /* dashboardCompany: async function(req, res){
      const params = _.extend(req.query || {}, req.params || {}, req.body || {});

        var breadcrumbData = { 
              pageTitle : "Choose the company you want to start with..."
          };
      res.view('pages/super-dashboard/dashboardCompany',{readcrumb: breadcrumbData});
    },
*/
    checkAdminCompany:async function(req,res){
      const params = _.extend(req.query || {}, req.params || {}, req.body || {});
      if(req.me.userRole != 65){
        var allow = false;
      }else{
        var allow = true;
      }
      await commonFetch.allCompanies(req,allow, async function function_name(result){
          var breadcrumbData = { 
              pageTitle : "Choose the company you want to start with..."
          };
          if(sails.config.project_type == "local"){
            var query = `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`;
            var rowsResult = await sails.sendNativeQuery(query);
          }
          //console.log(result);
          if(!req.xhr){
            res.view('partials/allCompanies', {layout: true, allotedCompanies:result, ajax: 1});
          }else{
            res.view('partials/allCompanies', {layout: false, allotedCompanies:result, ajax: 2});
          }
      })
    },

    jumpToDashboard:async function(req,res){
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        const { mode } = params;
        //console.log(params);
        //console.log('helloewrweeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        if(mode){            
             //res.redirect('/super/control-panel');
              if(req.me.userRole == 65){
                res.redirect('/super/control-panel?mode=' + mode);
              }else if(req.me.userRole == 55){
                    res.redirect('/company/control-panel?mode=' + mode);
              }else if(req.me.userRole == 45){
                    res.redirect('/control-panel?mode=' + mode);
              }else{
                    res.redirect('/module/dashboard');
              }
        }else{
            res.redirect('/module/dashboard');
        }
    },
    backPage:async function(req,res){
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        return res.redirect('back');
    },

    documentFileStreamData: async function (req, res) {
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var response = {};
        const {key,filename} = params;
        if(key){
            var s3 = new AWS.S3();
            var options = {
                Bucket : sails.config.s3.AWS_BUCKET_NAME,
                Key    : key
            };
            var documentReacord = await DocumentMedia.findOne({
                file_path: key,
             });
            res.set('Content-Type', documentReacord.file_type);
            //res.set({"Content-Disposition":"attachment; filename="+filename+""});
            return s3.getObject(options).createReadStream().on('error', function(err){
                  response.status = "error";
                  response.message = err;
                  return res.json(response);
                }).pipe(res);
         }
        else {
          response.status = "error";
          response.message = "Attachment Data not found";
          return res.json(response);
          }
    },

  // getSideBar:async function(req,res){
  //   var response = {};
  //   const params = _.extend(req.query || {}, req.params || {}, req.body || {});
  //       res.view('partials/sidebar',{layout: false});
  //   },
  
  renderimage: async function (req, res) {
    const params = _.extend(req.query || {}, req.params || {}, req.body || {});
    var response = {};
    const {key,filename,file_type} = params;
    //console.log(params);
    if(key){
            var s3 = new AWS.S3();
            var options = {
                Bucket : sails.config.s3.AWS_BUCKET_NAME,
                Key    : key
            };
            // var documentReacord = await DocumentMedia.findOne({
            //     file_path: key,
            //  });
             res.set('Content-Type', file_type);
            //res.set({"Content-Disposition":"attachment; filename="+filename+""});
            return s3.getObject(options).createReadStream().on('error', function(err){
                  response.status = "error";
                  response.message = err;
                  return res.json(response);
                }).pipe(res);
         }
        else {
          response.status = "error";
          response.message = "Attachment Data not found";
          return res.json(response);
          }
    // const {key,filename} = params;
  },

  passwordRecovery: async function(req, res){
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var response = {};
        
        console.log("in");
        var userRecord = await User.findOne({ emailAddress: params.emailAddress });
        if(!userRecord) {

            response.status = 'error';
            response.message = 'No such user exists!';
        } else {
            var token = await sails.helpers.strings.random('url-friendly');

            // Store the token on the user record
            // (This allows us to look up the user when the link from the email is clicked.)
            await User.update({ id: userRecord.id })
            .set({
              passwordResetToken: token,
              passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
            });


            var mailtouserObj = await User.findOne({userRole:65, isSuperAdmin: 1, company_id:1});
                    if(mailtouserObj){
                        var smtpMail = mailtouserObj.smtpMail;
                        var smtpPassword = mailtouserObj.smtpPassword;
                        
                             // Send recovery email
                    await sails.helpers.sendTemplateCustommail.with({
                              to: params.emailAddress,
                              subject: 'Password reset instructions',
                              template: 'email-reset-password',
                              smtpMail:sails.config.ses.smtp_username,
                              smtpPassword: sails.config.ses.smtp_password,
                              templateData: {
                                fullName: userRecord.fullName,
                                token: token
                              }
                          });   

                    }
            response.status = 'success';
            response.message = `Password recovery email send to ${params.emailAddress}!`;
        }

        return res.json(response);
    },

    updatePassword: async function(req, res){
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var response = {};

        if(!params.token){
            response.status = 'error';
            response.message = 'Token missing!';
        } else {
            // Look up the user with this reset token.
            var userRecord = await User.findOne({ passwordResetToken: params.token });

            // If no such user exists, or their token is expired, bail.
            if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
                response.status = 'error';
                response.message = 'Token may be expired or invalid!';
            } else {
                // Hash the new password.
                var hashed = await sails.helpers.passwords.hashPassword(params.password);

                // Store the user's new password and clear their reset token so it can't be used again.
                await User.updateOne({ id: userRecord.id })
                .set({
                  password: hashed,
                  passwordResetToken: '',
                  passwordResetTokenExpiresAt: 0
                });

                response.status = 'success';
                response.message = 'Password updated successfully!';
                response.userData = userRecord;
            }
        }
        return res.json(response);
    },

    privacyPolicy: async function(req, res){
      const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var response = {};
        var breadcrumbData = { 
            pageTitle : { pageTitle : "Privacy Policy" }
        };

        res.view("pages/privacyPolicy",{breadcrumb: breadcrumbData});
    }, 

    contactUs: async function(req, res){
      const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var response = {};
        var breadcrumbData = { 
            pageTitle : { pageTitle : "Contact Us" }
        };

        res.view("pages/contactus",{breadcrumb: breadcrumbData});
    },
};
