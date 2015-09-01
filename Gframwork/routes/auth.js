var jwt = require('jwt-simple');
var nodeRSA = require('node-rsa');

var admin_controller = require(global.rootPath + '/controllers/users/admin_controller.js');
var logger = require(global.rootPath + '/helpers/logger');

var key = null;

var auth = {

    getPubKey: function(req, res, next){

        if(key === null){
            var options = {
                encryptionScheme: {
                    scheme: 'pkcs1', //scheme
                    hash: 'md5' //hash using for scheme
                }
            };
            key = new nodeRSA({b: 1024}, options);
        }


        var pubkey = key.exportKey('pkcs8-public-pem');

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({success: true, data:pubkey});
        res.end();
        next();
    },

    login: function(req, res, next) {

        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            logger.log('error', 'auth.js', global.errorcode['401']);
            res.status(401).json({success: false,
                error:{code: 401, message: global.errorcode['401']}});
            next();
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(username, password, function(dbUserObj){
            if (!dbUserObj) { // If authentication fails, we send a 401 back
                logger.log('error', 'auth.js', global.errorcode['401']);
                res.status(401).json({success: false,
                    error:{code: 401, message: global.errorcode['401']}});
                next();
                return;
            }

            if (dbUserObj) {
                // If authentication is success, we will generate a token
                // and dispatch it to the client
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({success: true, data:genToken(dbUserObj)});
                res.end();
                next();
            }
        });
    },

    validate: function(username, password, next) {
        var decryptedUsername, decryptedPassword;

        try{
            decryptedUsername = key.decrypt(username, 'utf8');
            decryptedPassword = key.decrypt(password, 'utf8');
        }catch(err){
            next(null);
            return;
        }

        admin_controller.findByID(decryptedUsername, function(err, admin){
            if(err){
                next(null);
            }else if(!admin){
                next(null);
            }else{
                if(decryptedPassword === admin.password){
                    next(admin);
                }else{
                    next(null);
                }
            }
        });
    },

    validateUser: function(username, next) {
        admin_controller.findByID(username, function(err, admin){
            if(err){
                next(null);
            }else{
                if(admin){
                    next(admin);
                }else{
                    next(null);
                }
            }
        });
    },

    changePassword: function(req, res, next) {

        var username = req.body.username || '';
        var password = req.body.password || '';
        var newPassword = req.body.newPassword || '';

        if (username == '' || password == '' || newPassword == '') {
            logger.log('error', 'auth.js', global.errorcode['401']);
            res.status(401).json({success: false,
                error:{code: 401, message: global.errorcode['401']}});
            next();
            return;
        }

        var decryptedUsername, decryptedPassword, decryptedNewPassword;

        try{
            decryptedUsername = key.decrypt(username, 'utf8');
            decryptedPassword = key.decrypt(password, 'utf8');
            decryptedNewPassword = key.decrypt(newPassword, 'utf8');
        }catch(err){
            logger.log('error', 'auth.js', global.errorcode['401']);
            res.status(401).json({success: false,
                error:{code: 401, message: global.errorcode['401']}});
            next();
            return;
        }

        console.log(decryptedUsername + ":" + decryptedPassword + ":" + decryptedNewPassword);

        admin_controller.findByID(decryptedUsername, function(err, admin){
            if(err){

                logger.log('error', 'auth.js', global.errorcode[err]);
                res.status(401).json({success: false,
                    error:{code: 401, message: global.errorcode['401']}});
                next();
            }else if(!admin){

                logger.log('error', 'auth.js', global.errorcode['401']);
                res.status(401).json({success: false,
                    error:{code: 401, message: global.errorcode['401']}});
                next();
            }else if(decryptedPassword != admin.password){

                logger.log('error', 'auth.js', global.errorcode['401']);
                res.status(401).json({success: false,
                    error:{code: 401, message: global.errorcode['401']}});
                next();
            }else{

                admin.password = decryptedNewPassword;
                admin.updated_at = Date.now();
                admin.save(function(err){
                    if(err){
                        logger.log('error', 'auth.js', global.errorcode['4006']);
                        res.status(500).json({success: false,
                            error:{code: '4006', message: global.errorcode['4006']}});
                    }else{
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json({success: true});
                        res.end();
                    }
                    next();
                });
            }
        });
    }
};

// private method
function genToken(user) {
    var expires = expiresIn(1); // 1 days
    var token = jwt.encode({
        exp: expires
    }, require(global.rootPath + '/helpers/secret.js')());

    return {
        token: token,
        expires: expires,
        user: {
            username: user.username,
            role: user.role
        }
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
