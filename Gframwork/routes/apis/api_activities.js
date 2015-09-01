/**
 * [GFServer] api_activities.js
 *
 * Module used to handle activities API route
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');

var logger = require(global.rootPath + '/helpers/logger');

var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');
var activity_controller = require(global.rootPath + '/controllers/missions/activity_controller.js');

var events_controller = require(global.rootPath + '/controllers/common/events_controller');

/**
 * API Function to do tasks when the activity of the user is occurred
 * @param req
 * @param res
 * @param next
 */
exports.onActivity = function(req, res, next){

    var activityId = req.query.aid;
    var userId = req.query.uid;

    async.waterfall([
    //1) search user
    function(callback){

        if(!activityId || !userId){
            callback('4004');
            return;
        }
        var activity = activity_controller.getActivityFromMemory(activityId);

        if(!activity || activity == null || activity == undefined){
            callback('4004');
            return;
        }

        user_controller.findByID(userId, function(err, user){
            if(err){
                callback(err);
            }else if(!user){
                callback('4004');
            }else{
                callback(null, user);
            }
        });
    },
    //2) insert an activity of a user to 'activityLogs' collection in database
    function(user, callback){

        events_controller.handler.emit(global.EVENTS.OCCURRED_ACTIVITY,
            activityId, userId, user.gender, user.birthday,
            function(err){
                if(err){
                    logger.log('error','api_activities.js','Failed to write activity log');
                }
            });
        //TODO: revise codes to call event for widgets
        //eventHandler.emit(global.EVENTS.SEND_TO_LEADERBOARD, req.params.uid, req.params.aid);
        callback(null, user);

    },
    //3) execute missions related with the activity
    function(user, callback){
        events_controller.handler.emit(global.EVENTS.MISSION_START,
            user, activityId,
            function(err){
                if(err){
                    callback(err);
                }else{
                    callback(null);
                }
            });
    }
    ],
    // final callback to send a response
    function(err){
        if(err){
            logger.log('err','activity_controller.js', err);
            res.status(500).send(global.errorcode[err]);
            next();
        }else{
            logger.log('info','activity_controller.js','Succeed to do all tasks for activity ' + activityId);
            res.status(200).send(global.errorcode['200']);
            next();
        }
    });
};