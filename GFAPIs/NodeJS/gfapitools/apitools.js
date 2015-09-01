/**
 * [GF APITools for Node.js]
 *
 * @version: 1.0
 * @date: 2015.08.04
 * @author: ATG Lab
 */

var http = require('http');
var request = require('request');
var config = require('./config.json');

/**
 * [API 1. Activities] DO_ACTIVITY
 *
 * Call this method when a user's activity has occurred
 * @param activityId id of activity
 * @param userId id of user
 * @param next callback function. parameters: err, resultText
 */
exports.apiDoActivity = function(activityId, userId, next){

    var path = config.APIPATH_ACTIVITY_DO + "?aid=" + activityId + "&uid=" + userId;

    var str = '';
    var options = {
        host: config.SERVER_DOMAIN,
        port: config.SERVER_PORT,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var callback = function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if(response.statusCode == 200){
                next(null, str);
            }else{
                next({message: str});
            }

        });
    };
    var req = http.request(options, callback);

    req.on('error', function(e) {
        next(e);
    });
    req.end();
};

/**
 * [API 2. Users] ADD_USER
 *
 * Call this method when the new user is added
 *
 * @param user new user object
 * @param next
 */
exports.apiAddUser = function(user, next){

    var path = "http://" + config.SERVER_DOMAIN + ":" + config.SERVER_PORT + config.APIPATH_USER_ADD;

    request.post({url: path,
            form: {data: JSON.stringify(user)}},function (error, response, body) {
            if(error){
                next(error);
            }else if (response.statusCode == 200) {
                //console.log(body)
                next(null, body);
            }else {
                next({message: body});
            }
        }
    );
};