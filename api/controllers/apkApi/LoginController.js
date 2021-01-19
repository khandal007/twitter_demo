/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    userAuthentication: async function(req, res) {
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        const { emailAddress, password, type,mobile } = params;
        ////console.log(params);
        var response = {};
        if(!mobile){
             var userRecord = await User.findOne({
            emailAddress: emailAddress.toLowerCase(),
            });

        }else{
             var userRecord = await User.findOne({
                  mobile: mobile,
                 });

        }
       
        // If there was no matching user, respond thru the "badCombo" exit.
        if (userRecord) {
            if (userRecord.isSuperAdmin) {
                if (userRecord.userRole != 65) {
                    //throw 'UnauthorizedUser';
                    response.status = "error";
                    response.message = "Unauthorized User";
                    return res.json(response);
                }
            }
        } else {
            response.status = "error";
            response.message = "Unauthorized User";
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

        // if(userRecord.userLogin.indexOf(10) == -1 && type == 1){
        //     return res.json({ status: "error", message: "Your are not authorized to access this login panel check your user role and access appropriate panel!" });
        // }
        // else{
            if(userRecord.userRole != 65){            
                //var companyCount = await UserCompanies.count({user_id:userRecord.id});
               /* if(companyCount == 0){
                    return res.json({ status: "error", message: "You do not have any company to work with !" });
                }*/
            }
            if(!mobile){
                await sails.helpers.passwords.checkPassword(password, userRecord.password)
                        .intercept('incorrect', () => {
                        return res.json({ status: "error", message: "Incorrect password" });
                });                
            }
            
           
       // }
            await UserService.makeUserLogin(req, type, params, userRecord, async function(result){
            });

        // await sails.helpers.passwords.checkPassword(password, userRecord.password)
        //     .intercept('incorrect', () => {
        //     return res.json({ status: "error", message: "incorrect passowrd" });
        // });

        req.session.userId = userRecord.id;
        req.session.userRole = userRecord.userRole;

        response.status = "success";
        response.message = "Logged in successfully";
        response.userData = userRecord;

        return res.json(response);
    },

    contactUs: async function(req,res){
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});

        var createDetails = await ContactUs.create(params).fetch();
            /*if(createDetails){
                var smtpMail = createDetails.smtpMail;
                var smtpPassword = createDetails.smtpPassword;
                
                     // Send recovery email
            await sails.helpers.sendTemplateEmail.with({
                      to: params.emailAddress,
                      subject: 'Password reset instructions',
                      template: 'email-reset-password',
                      smtpMail:smtpMail,
                      smtpPassword: smtpPassword,
                      templateData: {
                        fullName: userRecord.fullName,
                        token: token
                      }
                  });   

            }*/

        if(createDetails){
            res.json({status:true, message: "Thank You for contacting us", data: createDetails});
        }else{
            res.json({status:false, message: "Something went wrong", data: []});
        }
    },

    logout: async function (req, res) {
    const params = _.extend(req.query || {}, req.params || {}, req.body || {});

    await UserService.makeUserLogout(params, req.me.id, async function(result){
                //console.log("result",result);

        if(result.status == true){
            req.session.destroy();
            res.json({ status: true, message: "User logged out successfully!"});
        }else{
            res.json({ status: false, message: "Something went wrong!"});
        }
    });
  },

  userDetailsApk: async function (req, res) {
    const params = _.extend(req.query || {}, req.params || {}, req.body || {});
    console.log("params",req.me.id);
    var detail = await User.find({id: req.me.id});

    res.json({status: true, message:"Details Fetched", data: detail});
  },

  updateUserImg: async function(req,res){
    const params = _.extend(req.query || {}, req.params || {}, req.body || {});

    await commonUpload.uploadAvatar(req,req.me.id,async function function_name(result){
            var newAvatar='';
            if(result.length>0){
                let arrSplit = result[0].fd.split("/");
                newAvatar = arrSplit[arrSplit.length-1];
            }else{
                newAvatar = req.me.avatar;
            }

        var updatedUSer = await User.update({id:req.me.id}).set({avatar: newAvatar}).fetch();
            if(updatedUSer.length>0){
                res.json({status: true, message: "Profile successfully updated", img: newAvatar});
            }else{
                res.json({status: false, message: "Something went wrong"});
            }
    });           
  },
  updateCredApk:async function(req,res){
       // console.log(req.file('avatar'));
       // req.setLocale(req.me.languagePreference);
        const params = _.extend(req.query || {}, req.params || {}, req.body || {});
        console.log("params",params);
        const { inputName,inputEmail,inputPassword,inputMailEmail,inputSmtpMailEmail,inputSmtpMailPassword } = params;
        var userData = {};
        await commonUpload.uploadAvatar(req,req.me.id,async function function_name(result){
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
            var updatedUSer = await User.update({id:req.me.id}).set(userData).fetch();
            if(updatedUSer.length>0){
                res.json({status: true, message: "Profile successfully updated", data: updatedUSer});
            }else{
                res.json({status: false, message: "Something went wrong", data: []});
            }
        });
    },
};
