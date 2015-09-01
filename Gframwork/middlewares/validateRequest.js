var jwt = require('jwt-simple');
var validateUser = require(global.rootPath + '/routes/auth.js').validateUser;

var logger = require(global.rootPath + '/helpers/logger');

module.exports = function(req, res, next) {

    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token || key) {
        try {
            var decoded = jwt.decode(token, require(global.rootPath + '/helpers/secret.js')());

            if (decoded.exp <= Date.now()) {
                logger.log('error', 'validateRequest.js', 'Token Expired');
                res.status(400);
                res.status(400).json({success: false,
                    error:{code: 400, message: 'Token Expired'}});
                return;
            }

        } catch (err) {
            logger.log('error', 'validateRequest.js', err);
            res.status(500);
            res.status(500).json({success: false,
                error:{code: 500, message: 'Something went wrong', error: err}});
            return;
        }

        // Authorize the user to see if s/he can access our resources
        // The key would be the logged in user's username

        validateUser(key, function(dbUser){
            if (dbUser) {
                if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
                    next(); // To move to next middleware
                } else {
                    logger.log('error', 'validateRequest.js', 'Not Authorized');
                    res.status(403);
                    res.status(403).json({success: false,
                        error:{code: 403, message: 'Not Authorized'}});
                }
            } else {
                // No user with this name exists, respond back with a 401
                logger.log('error', 'validateRequest.js', 'Invalid User');
                res.status(401);
                res.status(401).json({success: false,
                    error:{code: 401, message: 'Invalid User'}});
            }
        });
    } else {
        logger.log('error', 'validateRequest.js', 'Invalid Token or Key');
        res.status(401);
        res.status(401).json({success: false,
            error:{code: 401, message: 'Invalid Token or Key'}});
    }
};