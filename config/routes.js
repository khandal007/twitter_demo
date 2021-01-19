/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */
 var url = require('url');
module.exports.routes = {

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  //'GET /':      { view:   'pages/welcome', locals: { layout: 'layouts/welcome-layout',url:url} },
  //'GET /':      { view:   'pages/welcomeNew', locals: { layout: 'layouts/website-layout',url:url} },
   
  /******************Billing company settings***************/




  'GET /':  { view: 'pages/commonLoginNew', locals: { layout: 'layouts/admin-login-new'} },
  'GET /homepage':         { action: 'master/homepage'},
  'GET /makeTweet':        { action: 'master/makeTweet'},
  'GET /tweetLogs':        { action: 'master/tweetLogs'},
  'POST /deleteTweet':     { action: 'master/deleteTweet', csrf: false},
  'POST /updateTweet':     { action: 'master/updateTweet', csrf: false},
  'POST /updateDeleteRequest':     { action: 'master/updateDeleteRequest', csrf: false},
  'GET /master/createUser':                             { action: 'super-admin/master/createUser'},
  'POST /master/addUser':                               { action: 'super-admin/master/addUser',csrf:false},
  'POST /master/updateUser':                            { action: 'super-admin/master/updateUser'},
  'GET /viewProfile':                                   { action: 'login/viewProfile'},
  'GET /currentLogin':                             { action: 'super-admin/master/currentLogin'},
  'GET /currentLoginList':                         { action: 'super-admin/master/getCurrentLoginList'},
  'GET /master/companyAdminList':                       { action: 'super-admin/master/companyAdminList'},
  'PUT /admin-secure/logout':                            { action: 'apkApi/login/logout',csrf: false},
  'PUT /secure/login':                                   { action: 'apkApi/login/userAuthentication',csrf: false},
};
