/**
 * [GFServer] userStatistics.js
 *
 * Module used to handle user statistics API route
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');
var moment = require('moment');

var logger = require(global.rootPath + '/helpers/logger');

var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');

var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js');
var level_controller = require(global.rootPath + '/controllers/rewards/level_controller.js');
var badge_controller = require(global.rootPath + '/controllers/rewards/badge_controller.js');
var status_controller = require(global.rootPath + '/controllers/rewards/status_controller.js');
var permission_controller = require(global.rootPath + '/controllers/rewards/permission_controller.js');

var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');

var activity_controller = require(global.rootPath + '/controllers/missions/activity_controller.js');
var activityLog_controller = require(global.rootPath + '/controllers/users/activityLog_controller.js');
var rewardLog_controller = require(global.rootPath + '/controllers/users/rewardLog_controller.js');


/**
 * Analyzer API Function for the all user statics (by gender and ages)
 * @param req
 * @param res
 * @param next
 */
exports.getStatisticsAllUsers = function(req, res, next){
    async.waterfall([
        function(callback){
            var query = {};
            var group = {
                gender : '$gender',
                age : {$subtract: [ {$divide : [ { $subtract: [ moment().unix(), '$birthday']}, 31536000 ] }
                    , {$mod: [ {$divide : [ { $subtract: [ moment().unix(), '$birthday']}, 31536000 ] } , 10]}]}
            };

            user_controller.getAllUserStatistics(query, group, function(err, users){
                if(err){
                    callback(err);
                }else{
                    var results = {
                        total: 0,
                        man: 0, woman: 0, other: 0,
                        age10: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0
                    };
                    for(var i = 0; i < users.length; i++){

                        results.total += users[i].count;

                        switch(users[i]._id.gender){
                            case 0: results.other += users[i].count; break;
                            case 1: results.man += users[i].count; break;
                            case 2: results.woman += users[i].count; break;
                        }

                        switch(users[i]._id.age){
                            case 0: results.age10 += users[i].count; break;
                            case 10: results.age10 += users[i].count; break;
                            case 20: results.age20 += users[i].count; break;
                            case 30: results.age30 += users[i].count; break;
                            case 40: results.age40 += users[i].count; break;
                            case 50: results.age50 += users[i].count; break;
                            case 60: results.age60 += users[i].count; break;
                            case 70: results.age60 += users[i].count; break;
                            case 80: results.age60 += users[i].count; break;
                            case 90: results.age60 += users[i].count; break;
                        }
                    }
                    callback(null, results);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'userStatistics.js', global.errorcode[err]);
            res.status(500).json({success: false,
                error:{code: err, message: global.errorcode[err]}});
        }else{
            var revisedResults = {};

            revisedResults.gender = [
                {x: '남성', y: results.man},
                {x: '여성', y: results.woman},
                {x: '기타', y: results.other}
            ];
            revisedResults.age = [
                {x: "10대 이하", y: results.age10},
                {x: "20대", y: results.age20},
                {x: "30대", y: results.age30},
                {x: "40대", y: results.age40},
                {x: "50대", y: results.age50},
                {x: "60대 이상", y: results.age60}
            ];

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({success:true, data:revisedResults});
            res.end();
        }
        next();
    });
};

/**
 * Analyzer API Function for the user statics of sign by period
 *
 * @param Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsAllUsersByPeriod = function(req, res, next){
    var endday, startday, group, query, length;

    var period = req.query.period;

    switch(period){
        case "1": // one day
            endday = moment().format();
            startday = moment().subtract(1,'days').format();
            group = {
                'year' : { '$year':'$created_at' },
                'month': { '$month':'$created_at' },
                'day': { '$dayOfMonth':'$created_at'},
                'hour': { '$hour':'$created_at'}
            };
            length = 24;
            break;
        case "2": // one week
            endday = moment().format();
            startday = moment().subtract(7,'days').format();
            group = {
                'year' : { '$year':'$created_at' },
                'month': { '$month':'$created_at' },
                'day': { '$dayOfMonth':'$created_at'}
            };
            length = 7;
            break;
        case "3": // one month
            endday = moment().format();
            startday = moment().subtract(1,'months').format();
            group = {
                'year' : { '$year':'$created_at' },
                'month': { '$month':'$created_at' },
                'day': { '$dayOfMonth':'$created_at'}
            };
            length = 31;
            break;
        case "4": // 1 year
            endday = moment().format();
            startday = moment().subtract(1,'years').format();
            group = {
                'year' : { '$year':'$created_at' },
                'month': { '$month':'$created_at' }
            };
            length = 12;
            break;
    }

    query = {'created_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};

    user_controller.getAllUserStatistics(query, group, function (err, result){
        if(err){
            logger.log('error', 'userStatistics.js', global.errorcode[err]);
            res.status(500).json({success: false,
                error:{code: err, message: global.errorcode[err]}});
        }else{
            var revisedResult = [];

            for(var i = 0; i < length ; i++){
                var entity = { 'x': '', 'y':0};

                switch(period){
                    case '1': entity.x = moment(startday).add(i+1,'hours').format("DD일HH시"); break;
                    case '2': entity.x = moment(startday).add(i+1,'days').format("MM월DD일"); break;
                    case '3': entity.x = moment(startday).add(i+1,'days').format("MM월DD일"); break;
                    case '4': entity.x = moment(startday).add(i+1,'months').format("YY년MM월"); break;
                }
                revisedResult[i] = entity;
            }

            for(var j = 0; j < result.length; j++){

                var xValue = "";
                var yValue = result[j].count;
                var dateStr = result[j]._id.year +"-" + result[j]._id.month;

                switch(period){
                    case '1': dateStr += "-" + result[j]._id.day + " " + result[j]._id.hour;
                        xValue = moment.utc(dateStr, "YYYY-M-D H").local().format("DD일HH시");
                        break;
                    case '2': dateStr += "-" + result[j]._id.day;
                        xValue = moment.utc(dateStr, "YYYY-M-D").local().format("MM월DD일");
                        break;
                    case '3': dateStr += "-" + result[j]._id.day;
                        xValue = moment.utc(dateStr, "YYYY-M-D").local().format("MM월DD일");
                        break;
                    case '4':
                        xValue = moment.utc(dateStr, "YYYY-M").local().format("YY년MM월");
                        break;
                }
                for(var k = 0; k <length; k++){
                    if(revisedResult[k].x === xValue){
                        revisedResult[k].y = yValue;
                        break;
                    }
                }
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({success:true, data:revisedResult});
            res.end();
        }
        next();
    });
};

/**
 * Analyzer API Function for statics of the input user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getStatisticsUser = function(req, res, next){

    var userId = req.params.id;

    async.waterfall([
        function(callback){
            user_controller.findByID(userId, function(err, user){
                if(err){
                    callback(err);
                }else{
                    var results = {};
                    results.basic = {
                        id: user.id,
                        name: user.name,
                        nickname: user.nickname,
                        gender: user.gender == 1 ? '남성' :
                            (user.gender == 2 ? '여성' : '기타'),
                        age: Math.floor((moment().unix() - user.birthday)/ 31536000),
                        profile: user.profile
                    };
                    callback(null, user, results);
                }
            });
        },
        function(user, results, callback) {

            results.badges = [];
            results.points = [];
            results.levels = [];
            results.statuses = [];
            results.permissions = [];
            results.missions = [];

            var data;

            for(var i = 0; i< user.rewards.length; i++){

                switch(user.rewards[i].reward_type){
                    //1) badges
                    case global.MECHANICS.BADGE:
                        var badge = badge_controller.getBadgeFromMemory(user.rewards[i].reward_object);
                        data = { name: badge.name, icon: badge.icon, status: user.rewards[i].reward_status === 1? '획득' : '비획득'};
                        results.badges.push(data);
                        break;
                    //2) points
                    case global.MECHANICS.POINT:
                        var point = point_controller.getPointFromMemory(user.rewards[i].reward_object);
                        data = { name: point.name, icon: point.icon, ratio: user.rewards[i].reward_status / point.max,
                                    status: user.rewards[i].reward_status + '/' + point.max };
                        results.points.push(data);
                        break;
                    //3) levels
                    case global.MECHANICS.LEVEL:
                        var level = level_controller.getLevelFromMemory(user.rewards[i].reward_object);
                        data = { name: level.name, icon: level.icon, ratio: user.rewards[i].reward_status / level.max,
                            status: user.rewards[i].reward_status + '/' + level.max };
                        results.levels.push(data);
                        break;
                    //4) statuses
                    case global.MECHANICS.STATUS:
                        var status = status_controller.getStatusFromMemory(user.rewards[i].reward_object);
                        data = { name: status.name, icon: status.classes[user.rewards[i].reward_status - 1].icon,
                            status: status.classes[user.rewards[i].reward_status - 1].name };
                        results.statuses.push(data);
                        break;
                    //5) permissions
                    case global.MECHANICS.PERMISSION:
                        var permission = permission_controller.getPermissionFromMemory(user.rewards[i].reward_object);
                        data = { name: permission.name, status: user.rewards[i].reward_status === 1? '획득' : '비획득'};
                        results.permissions.push(data);
                        break;
                        break;
                }
            }
            //6) missions
            for(var i = 0; i< user.missions.length; i++){
                var mission = mission_controller.getMissionFromMemory(user.missions[i].missionId);

                if(mission.isRepeatable
                    && user.missions[i].currentStatus === 0 && user.missions[i].completeCount > 0){
                    data = { name: mission.name, ratio: 1,
                        status: mission.exit_condition + '/' + mission.exit_condition,
                        completeCount: user.missions[i].completeCount};
                }else{
                    data = { name: mission.name, ratio: user.missions[i].currentStatus / mission.exit_condition,
                        status: user.missions[i].currentStatus + '/' + mission.exit_condition,
                        completeCount: user.missions[i].completeCount};
                }
                results.missions.push(data);
            }

            callback(null, results);
        },
        function(results, callback){
            var endday = moment().format();
            var startday = moment().subtract(3,'months').format();
            var query = {
                'user_id': userId,
                'created_at': {'$gte': new Date(startday), '$lte': new Date(endday)}
            };
            var maxNum = 20;

            activityLog_controller.getActivityLogs(query, function(err, logs){
                if(err){
                    logger.log('err', 'userStatistics.js', global.errorcode[err]);
                    callback(null, results);
                }else{
                    results.activityLogs = [];
                    for(var i = 0; i< logs.length; i++){
                        var activity = activity_controller.getActivityFromMemory(logs[i].activity_id);
                        var data = {
                            activity: activity.name,
                            time: moment(logs[i].created_at).fromNow()
                        }
                        results.activityLogs.push(data);
                        if( i >= maxNum){
                            break;
                        }
                    }
                    callback(null, results);
                }
            });
        },
        function(results, callback){
            var endday = moment().format();
            var startday = moment().subtract(3,'months').format();
            var query = {
                'user_id': userId,
                'created_at': {'$gte': new Date(startday), '$lte': new Date(endday)}
            };
            var maxNum = 20;

            rewardLog_controller.getRewardLogs(query, function(err, logs){
                if(err){
                    logger.log('err', 'userStatistics.js', global.errorcode[err]);
                    callback(null, results);
                }else{
                    results.rewardLogs = [];

                    for(var i = 0; i< logs.length; i++){
                        var reward;
                        switch(logs[i].reward_type){
                            case global.MECHANICS.BADGE:
                                reward = badge_controller.getBadgeFromMemory(logs[i].reward_id);
                                break;
                            case global.MECHANICS.POINT:
                                reward = point_controller.getPointFromMemory(logs[i].reward_id);
                                break;
                            case global.MECHANICS.LEVEL:
                                reward = level_controller.getLevelFromMemory(logs[i].reward_id);
                                break;
                            case global.MECHANICS.STATUS:
                                reward = status_controller.getStatusFromMemory(logs[i].reward_id);
                                break;
                            case global.MECHANICS.PERMISSION:
                                reward = permission_controller.getPermissionFromMemory(logs[i].reward_id);
                                break;
                            case global.MECHANICS.MISSION:
                                reward = mission_controller.getMissionFromMemory(logs[i].reward_id);
                                break;
                        }

                        var data = {
                            reward: reward.name,
                            time: moment(logs[i].created_at).fromNow()
                        };
                        results.rewardLogs.push(data);
                        if( i >= maxNum){
                            break;
                        }
                    }
                    callback(null, results);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'userStatistics.js', global.errorcode[err]);
            res.status(500).json({success: false,
                error:{code: err, message: global.errorcode[err]}});
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({success:true, data:results});
            res.end();
        }
        next();
    });
};