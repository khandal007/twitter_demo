/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

	'*':   'is-login',
	'login':true,
	// Web Policies
  	'super-admin/*': 'is-super-admin',
	'super-admin/master/deleteUser':true,
  	'admin/*': 'is-admin',
	'moderator/*': 'is-moderator',
	'form/*' :'is-authorised-api',
	'master/*' :'is-authorised-api',
	'login/checkAdminCompany' : 'is-login',
	'login/jumpToDashboard' : 'is-login',
	

  	// APK Policies
  	'apkApi/login/userAuthentication': true,
  	'apkApi/login/logout': true,
  	'apkApi/*': 'isAuthorized',
  	'super-admin/superexcellog/getExcelLogsPage': true,
  	'super-admin/superexcellog/uploadExcel': true,
  	'super-admin/superexcellog/getAllExcelEntries': true,
  	'super-admin/superexcellog/startExcelEntries': true,
  	'apkApi/document/fetchS3images': true,
    'login/documentFileStreamData':true,
    'login/passwordRecovery':true,
    'login/updatePassword':true,
    'login/privacyPolicy':true,
    'login/contactUs':true,
    'apkApi/login/contactUs':true,
    'revenue/invoiceApk':true,
    'super-admin/master/addUser':true,
};
