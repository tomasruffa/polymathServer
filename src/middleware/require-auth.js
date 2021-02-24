const passport = require('passport');
const authCtrl = require('../controllers/auth.controller');
const _ = require('lodash');

const requireAuthenticationList = [
    'POST /api/task/create',
    'POST /api/task/delete',
    'PUT /api/task/update',
    'POST /api/task/search',
    'POST /api/task/get',
];

const requireAuthentication = function(request, response, next) {
    let route = `${request.method} ${request.baseUrl}${request._parsedUrl.pathname}`;
    if (_.indexOf(requireAuthenticationList, route) === -1) {
        next();
    } else {
        authCtrl.verifyToken(request, response, next);
        //passport.authenticate('jwt', { session: false })(request, response, next);
    }
}

module.exports = requireAuthentication;
