/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

module.exports = {
  /*ssl: {
    ca: require('fs').readFileSync('/home/admin/conf/web/ssl.cl.ekkalam.com.ca'),
    key: require('fs').readFileSync('/home/admin/conf/web/ssl.cl.ekkalam.com.key'),
    cert: require('fs').readFileSync('/home/admin/conf/web/ssl.cl.ekkalam.com.pem')
  },*/

  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)

  /***************************************************************************
   * The `port` setting determines which TCP port your app will be           *
   * deployed on.                                                            *
   *                                                                         *
   * Ports are a transport-layer concept designed to allow many different    *
   * networking applications run at the same time on a single computer.      *
   * More about ports:                                                       *
   * http://en.wikipedia.org/wiki/Port_(computer_networking)                 *
   *                                                                         *
   * By default, if it's set, Sails uses the `PORT` environment variable.    *
   * Otherwise it falls back to port 1337.                                   *
   *                                                                         *
   * In env/production.js, you'll probably want to change this setting       *
   * to 80 (http://) or 443 (https://) if you have an SSL certificate        *
   ***************************************************************************/

  debug: true,
  project_type:"local",

  port: process.env.PORT || 1353,
  public_url: process.env.PUBLIC_URL || 'https://cl.ekkalam.com',
  base_url: 'https://cl.ekkalam.com',

  jwtSecret: process.env.JWTSECRET || 'gEGO1ZGxdAvwwPN7Ce6NstfHUEwBtVEbXPW',

  /***************************************************************************
   * The runtime "environment" of your Sails app is either typically         *
   * 'development' or 'production'.                                          *
   *                                                                         *
   * In development, your Sails app will go out of its way to help you       *
   * (for instance you will receive more descriptive error and               *
   * debugging output)                                                       *
   *                                                                         *
   * In production, Sails configures itself (and its dependencies) to        *
   * optimize performance. You should always put your app in production mode *
   * before you deploy it to a server.  This helps ensure that your Sails    *
   * app remains stable, performant, and scalable.                           *
   *                                                                         *
   * By default, Sails sets its environment using the `NODE_ENV` environment *
   * variable.  If NODE_ENV is not set, Sails will run in the                *
   * 'development' environment.                                              *
   ***************************************************************************/

  environment: process.env.NODE_ENV || 'development',
  docAppPath: "documents",
  

};
