/**
 * unauthorized.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • log out the current user and redirect them to the login page
 *  • or send back 401 (Unauthorized) with no response body.
 *
 * Example usage:
 * ```
 *     return res.unauthorized();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       badCombo: {
 *         description: 'That email address and password combination is not recognized.',
 *         responseType: 'unauthorized'
 *       }
 *     }
 * ```
 */
module.exports = function unauthorized() {

    var req = this.req;
    var res = this.res;

    sails.log.verbose('Ran custom response: res.unauthorized()');

    if (req.wantsJSON) {
        return res.sendStatus(401);
    }
    // Or log them out (if necessary) and then redirect to the login page.
    else {

       // console.log(req.session);
        if (req.session.userId) {
            delete req.session.userId;
        }

        //console.log(req.me);
        //return false;
        return res.redirect('/');
        // if(req.session.userRole == 65){
        //     return res.redirect('/spanel');
        // } else if(req.session.userRole == 55) {
        //     return res.redirect('/upanel');
        // } else {
        //     return res.redirect('/panel');
        // }
    }
};
