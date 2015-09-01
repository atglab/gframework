
var async = require('async');
var moment = require('moment');

var logger = require(global.rootPath + '/helpers/logger');

var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');

var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js');
var level_controller = require(global.rootPath + '/controllers/rewards/level_controller.js');
var badge_controller = require(global.rootPath + '/controllers/rewards/badge_controller.js');
var status_controller = require(global.rootPath + '/controllers/rewards/status_controller.js');
var permission_controller = require(global.rootPath + '/controllers/rewards/permission_controller.js');
var activity_controller = require(global.rootPath + '/controllers/missions/activity_controller.js');

var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');
var activityLog_controller = require(global.rootPath + '/controllers/users/activityLog_controller.js');
var rewardLog_controller = require(global.rootPath + '/controllers/users/rewardLog_controller.js');

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.getLeaderboardData = function(req, res, next){

    var rewardType = req.query.type;
    var rewardId = req.query.id;
    var reward;

    switch(rewardType){
        case global.MECHANICS.BADGE:
            //reward = badge_controller.getBadgeFromMemory(rewardId);
            break;
        case global.MECHANICS.POINT:
            reward = point_controller.getPointFromMemory(rewardId);
            break;
        case global.MECHANICS.LEVEL:
            reward = level_controller.getLevelFromMemory(rewardId);
            break;
        case global.MECHANICS.STATUS:
            reward = status_controller.getStatusFromMemory(rewardId);
            break;
        case global.MECHANICS.PERMISSION:
            //reward = permission_controller.getPermissionFromMemory(rewardId);
            break;
    }

    if(!reward){
        logger.log('error', 'api_widgets.js', global.errorcode['4004']);
        res.status('4004').json({
            success: false,
            error: {code: 4004, message: global.errorcode['4004']}
        });
        next();
        return;
    }

    user_controller.getUserRewardRank(rewardType, rewardId, function(err, data) {
        if (err) {
            logger.log('error', 'api_widgets.js', global.errorcode[err]);
            res.status(500).json({
                success: false,
                error: {code: err, message: global.errorcode[err]}
            });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({success:true, data:data});
            res.end();
        }
        next();
    });
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.getRewardList = function(req, res, next){

    async.parallel([
        function(callback){
            var numBadges = badge_controller.getNumOfBadges();

            if(numBadges > 0){
                var result = [{'type': global.MECHANICS.BADGE, 'icon':null, 'name': '배지 획득 수', 'id': null}];
                callback(null, result);
            }else{
                callback(null, []);
            }
        },
        function(callback){
            var points = point_controller.getPointListFromMemory();

            var result = [];
            for(var i = 0; i<points.length; i++){
                var item = {
                    type: global.MECHANICS.POINT,
                    icon: points[i].icon,
                    name: points[i].name,
                    id: points[i].id
                };
                result.push(item);
            }
            callback(null, result);

        },
        function(callback){
            var levels = level_controller.getLevelListFromMemory();

            var result = [];
            for(var i = 0; i<levels.length; i++){
                var item = {
                    type: global.MECHANICS.LEVEL,
                    icon: levels[i].icon,
                    name: levels[i].name,
                    id: levels[i].id
                };
                result.push(item);
            }
            callback(null, result);

        },
        function(callback){
            var statuses = status_controller.getStatusListFromMemory();

            var result = [];
            for(var i = 0; i<statuses.length; i++){
                var item = {
                    type: global.MECHANICS.STATUS,
                    icon: null,
                    name: statuses[i].name,
                    id: statuses[i].id
                };
                result.push(item);
            }
            callback(null, result);

        }],
        function(err, results){

            if(err){
                logger.log('error', 'api_widgets.js', global.errorcode['500']);
                res.status(500).json({
                    success: false,
                    error: {code: 500, message: global.errorcode['500']}
                });
            } else{
                var rewardList = [];

                for(var i = 0; i < results.length; i++){
                    var list = results[i];

                    for(var j = 0; j< list.length; j++){
                        rewardList.push(list[j]);
                    }
                }
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({success:true, data: rewardList});
                res.end();
            }
            next();
        });

};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.getUserProfile = function(req, res, next){
    var userId = req.query.id;

    if(!userId){

    }
    async.waterfall([
        function(callback){
            user_controller.findByID(userId, function(err, user){
                if(err){
                    callback(err);
                }else if(!user){
                    callback('4004');
                }else{
                    var result = {};
                    result.user = {
                        name: user.name,
                        nickname: user.nickname,
                        gender: user.gender,
                        birthday: user.birthday,
                        profile: user.profile
                    };
                    callback(null, user, result);
                }
            });
        },
        function(user, result, callback){
            var missionResult = [];

            var missionList = mission_controller.getMissionsFromMemory();

            for(var id in missionList){
                var missionState = {
                    name: missionList[id].name,
                    description: missionList[id].description,

                    activityName: activity_controller.getActivityFromMemory(missionList[id].activityId).name,
                    state: 0,
                    exit_condition: missionList[id].exit_condition,

                    reward_type : missionList[id].reward_type,
                    reward_object : missionList[id].reward_object,

                    isRepeatable: missionList[id].isRepeatable,
                    max_repeat_count : missionList[id].max_repeat_count,
                    repeat_period : missionList[id].repeat_period,

                    useConstraint: missionList[id].useConstraint,
                    isContinuous : false,
                    constraint_period : missionList[id].constraint_period,

                    useExpiration: missionList[id].useExpiration,

                    start_date : missionList[id].start_date,
                    end_date : missionList[id].end_date
                };

                for(var i = 0; i< user.missions.length; i++){
                    if(user.missions[i].missionId === id){
                        missionState.state = user.missions[i].currentStatus;
                        break;
                    }
                }
                missionResult.push(missionState);
            }
            result.missions = missionResult;
            callback(null, user, result);
        },
        function(user, result, callback){
            var badgeList = badge_controller.getBadgeListFromMemory();
            var badgeResult = [];
            for(var i=0; i< badgeList.length; i++){
                var badgeState = {
                    name: badgeList[i].name,
                    description: badgeList[i].description,
                    icon: badgeList[i].icon,
                    state: 0,
                    date: null
                };
                for(var j = 0; j< user.rewards.length; j++){
                    if(user.rewards[j].reward_type === global.MECHANICS.BADGE
                        && user.rewards[j].reward_object === badgeList[i].id){
                        badgeState.state = user.rewards[j].reward_status;
                        badgeState.date = user.rewards[j].lastUpdated_at;
                        break;
                    }
                }
                badgeResult.push(badgeState);
            }
            result.badges = badgeResult;
            callback(null, user, result);
        },
        function(user, result, callback){
            var rewardResult = [];
            for(var i = 0; i<user.rewards.length; i++){
                var reward = user.rewards[i];

                var rewardState;

                switch(reward.reward_type){
                    case global.MECHANICS.BADGE:
                        break;
                    case global.MECHANICS.POINT:
                        var point = point_controller.getPointFromMemory(reward.reward_object);
                        rewardState = {
                            type: reward.reward_type,
                            name: point.name,
                            icon: point.icon,
                            max: point.max,
                            state: reward.reward_status,
                            rank: 0
                        };
                        rewardResult.push(rewardState);
                        break;
                    case global.MECHANICS.LEVEL:
                        var level = level_controller.getLevelFromMemory(reward.reward_object);
                        rewardState = {
                            type: reward.reward_type,
                            name: level.name,
                            icon: level.icon,
                            max: level.max,
                            state: reward.reward_status,
                            rank: 0
                        };
                        rewardResult.push(rewardState);
                        break;
                    case global.MECHANICS.STATUS:
                        var status = status_controller.getStatusFromMemory(reward.reward_object);

                        rewardState = {
                            type: reward.reward_type,
                            name: status.name,
                            classes: [],
                            rank: 0
                        };

                        for(var j = 0; j<status.classes.length; j++){
                            var statusClass = {
                                name: status.classes[j].name,
                                icon: status.classes[j].icon,
                                state : false
                            };
                            if( status.classes[j].rank == reward.reward_status){
                                statusClass.state = true;
                            }
                            rewardState.classes.push(statusClass);
                        }
                        rewardResult.push(rewardState);
                        break;
                    case global.MECHANICS.PERMISSION:
                        break;
                }
            }
            result.rewards = rewardResult;
            callback(null, user, result);
        },
        function(user, result, callback){
            var query = {user_id: userId};
            var activityLogs = [];

            activityLog_controller.getActivityLogs(query, function(err, logs){
                if(err)
                    callback(err);
                else{
                    for(var i = 0; i< logs.length; i++){
                        var activity = activity_controller.getActivityFromMemory(logs[i].activity_id);
                        var log = {
                            name: activity.name,
                            date: logs[i].created_at
                        };
                        activityLogs.push(log);
                    }
                    result.activities = activityLogs;
                    callback(null, result);
                }
            });
        }
    ], function(err, result){
        if(err){
            logger.log('error', 'api_widgets.js', global.errorcode[err]);
            res.status(500).json({
                success: false,
                error: {code: err, message: global.errorcode[err]}
            });
        } else{
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({success:true, data: result});
            res.end();
        }
        next();
    });


};