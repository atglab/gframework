/**
 * [GFServer] missionStatistics.js
 *
 * Module used to handle user's mission Statistics API route
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');
var moment = require('moment');

var logger = require(global.rootPath + '/helpers/logger');

var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');
var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');

var rewardLog_controller = require(global.rootPath + '/controllers/users/rewardLog_controller.js');

/**
 * Analyzer API Function for statics of all missions
 *
 * @params req: request
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsAllMissions = function(req, res, next){
    async.waterfall([
        function(callback){
            user_controller.getUserNumber(function(err, numUser){
                if(err){
                    callback(err);
                }else{
                    callback(null, numUser);
                }
            });
        },
        function(numUser, callback){
            mission_controller.findAll(function(err, missions){
                if(err){
                    callback(err);
                }else{
                    callback(null, numUser, missions);
                }
            });
        },function(numUser, missions, callback){
            var query = {
                'missions.completeCount': {'$gte': 1}
            };
            var group = {
                '_id': '$missions.missionId',
                'countUser': { $sum: 1 },
                'sumCompletion': { $sum: '$missions.completeCount'}
            };
            user_controller.getMissionStatistics(query, group, function (err, results){
                if(err){
                    callback(err);
                }else{
                    if(results && missions){
                        var revisedResult = [];

                        for(var i=0; i<missions.length; i++){

                            var tmp = {
                                name: missions[i].name,
                                cRatio: 0,
                                cUser: 0,
                                ncUser: numUser,
                                avgCNum: 0,
                                avgStatusRatio: 0,
                                exitCondition: missions[i].exit_condition
                            };

                            for(var j = 0; j< results.length; j++){
                                if(results[j]._id === missions[i].id){
                                    tmp.cRatio = results[j].countUser / numUser;
                                    tmp.cUser = results[j].countUser;
                                    tmp.ncUser = numUser - results[j].countUser;
                                    tmp.avgCNum = results[j].sumCompletion / results[j].countUser;
                                    break;
                                }
                            }
                            revisedResult.push(tmp);
                        }
                        callback(null, revisedResult, missions)
                    }else{
                        callback(null, null, null);
                    }
                }
            });
        },
        function(totalResults, missions, callback){
            var query = {
                'missions.completeCount': 0
            };
            var group = {
                '_id': '$missions.missionId',
                'countUser': { $sum: 1 },
                'sumStatus': { $sum: '$missions.currentStatus'}
            };
            user_controller.getMissionStatistics(query, group, function (err, results){
                if(err){
                    callback(err);
                }else{
                    if(results && totalResults){

                        for(var i=0; i<totalResults.length; i++){

                            for(var j = 0; j< results.length; j++){
                                if(results[j]._id === totalResults[i].id){
                                    totalResults[i].avgStatusRatio = (results[j].sumStatus / totalResults[i].ncUser) / totalResults[i].exitCondition;
                                    break;
                                }
                            }
                        }
                        callback(null, totalResults)
                    }else{
                        callback(null, null);
                    }
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'permissionStatistics.js', global.errorcode[err]);
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

/**
 * Analyzer API Function for statics of the mission completion
 *
 * @param req URL params id: mission id
 * @param res
 * @param next
 */
exports.getStatisticsMissionCompletion = function(req, res, next){
    var missionId = req.params.id;

    async.waterfall([
        function(callback){
            var query = {
                reward_type: global.MECHANICS.MISSION,
                reward_id: missionId,
                reward_value: 1
            };
            var group = {
                gender : '$user_gender',
                age : {$subtract: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] }
                    , {$mod: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] } , 10]}]}
            };
            rewardLog_controller.getStatisticsReward(query, group, function(err, missionLogs){
                if(err) {
                    callback(err);
                }else{
                    var results = {
                        total: 0,
                        man: 0, woman: 0, other: 0,
                        age10: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0
                    };
                    for(var i = 0; i < missionLogs.length; i++){
                        results.total += missionLogs[i].count;

                        switch(missionLogs[i].user_gender){
                            case 0: results.other += missionLogs[i].count; break;
                            case 1: results.man += missionLogs[i].count; break;
                            case 2: results.woman += missionLogs[i].count; break;
                        }

                        switch(missionLogs[i]._id.age){
                            case 0: results.age10 += missionLogs[i].count; break;
                            case 10: results.age10 += missionLogs[i].count; break;
                            case 20: results.age20 += missionLogs[i].count; break;
                            case 30: results.age30 += missionLogs[i].count; break;
                            case 40: results.age40 += missionLogs[i].count; break;
                            case 50: results.age50 += missionLogs[i].count; break;
                            case 60: results.age60 += missionLogs[i].count; break;
                            case 70: results.age60 += missionLogs[i].count; break;
                            case 80: results.age60 += missionLogs[i].count; break;
                            case 90: results.age60 += missionLogs[i].count; break;
                        }
                    }
                    var revisedResults = [
                        {x: "전체", y: results.total},
                        {x: "남성", y: results.man},
                        {x: "여성", y: results.woman},
                        {x: "기타", y: results.other},
                        {x: "10대이하", y: results.age10},
                        {x: "20대", y: results.age20},
                        {x: "30대", y: results.age30},
                        {x: "40대", y: results.age40},
                        {x: "50대", y: results.age50},
                        {x: "60대이상", y: results.age60}
                    ];
                    callback(null, revisedResults);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'missionStatistics.js', global.errorcode[err]);
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

/**
 * Analyzer API Function for statics of the mission status
 *
 * @param req URL params id: mission id
 * @param res
 * @param next
 */
exports.getStatisticsMissionStatus = function(req, res, next){
    var missionId = req.params.id;

    async.waterfall([
        function(callback){
            mission_controller.findByID(missionId, function(err, mission){
                if(err){
                    callback(err);
                }else{
                    callback(null, mission);
                }
            });
        },
        function(mission, callback){
            user_controller.getUserNumber(function(err, numUser){
                if(err){
                    callback(err);
                }else{
                    callback(null, mission, numUser);
                }
            });
        },
        function(mission, numUser, callback){
            var query = {
                'missions.missionId': missionId,
                'missions.completeCount': {'$gte': 1}
            };
            var group = {
                '_id': '$missions.missionId',
                'countUser': { $sum: 1 }
            };
            user_controller.getMissionStatistics(query, group, function (err, result) {
                if(err){
                    callback(err);
                }else{
                    if(result && result.length >= 1){
                        var numNCUser = numUser - result[0].countUser;
                        callback(null, mission, numNCUser);
                    }else{
                        callback(null, mission, numUser);
                    }
                }
            });
        },
        function(mission, numNCUser, callback){
            var query = {
                'missions.missionId': missionId,
                'missions.completeCount': 0
            };
            //var project = {gender: 1 , birthday: 1, status : '$missions.currentStatus' };

            var group = {
                _id: {
                    gender : '$user_gender',
                    age : {$subtract: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] }
                        , {$mod: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] } , 10]}]}
                },
                status: {$sum: '$missions.currentStatus'}
            };

            var exitCondition = mission.exit_condition;

            user_controller.getMissionStatistics(query, group, function (err, missionStatus){

                if(err) {
                    callback(err);
                }else{

                    var results = {
                        total: 0,
                        man: 0, woman: 0, other: 0,
                        age10: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0
                    };
                    for(var i = 0; i < missionStatus.length; i++){

                        results.total += missionStatus[i].status;

                        switch(missionStatus[i]._id.gender){
                            case 0: results.other += missionStatus[i].count; break;
                            case 1: results.man += missionStatus[i].count; break;
                            case 2: results.woman += missionStatus[i].count; break;
                        }

                        switch(missionStatus[i]._id.age){
                            case 0: results.age10 += missionStatus[i].count; break;
                            case 10: results.age10 += missionStatus[i].count; break;
                            case 20: results.age20 += missionStatus[i].count; break;
                            case 30: results.age30 += missionStatus[i].count; break;
                            case 40: results.age40 += missionStatus[i].count; break;
                            case 50: results.age50 += missionStatus[i].count; break;
                            case 60: results.age60 += missionStatus[i].count; break;
                            case 70: results.age60 += missionStatus[i].count; break;
                            case 80: results.age60 += missionStatus[i].count; break;
                            case 90: results.age60 += missionStatus[i].count; break;
                        }
                    }

                    var revisedResults = [
                        {x: "전체", y: results.total / numNCUser / exitCondition},
                        {x: "남성", y: results.man / numNCUser / exitCondition},
                        {x: "여성", y: results.woman / numNCUser / exitCondition},
                        {x: "기타", y: results.other / numNCUser / exitCondition},
                        {x: "10대이하", y: results.age10 / numNCUser / exitCondition},
                        {x: "20대", y: results.age20 / numNCUser / exitCondition},
                        {x: "30대", y: results.age30 / numNCUser / exitCondition},
                        {x: "40대", y: results.age40 / numNCUser / exitCondition},
                        {x: "50대", y: results.age50 / numNCUser / exitCondition},
                        {x: "60대이상", y: results.age60 / numNCUser / exitCondition}
                    ];

                    callback(null, revisedResults);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'missionStatistics.js', global.errorcode[err]);
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

/**
 * Analyzer API Function for the mission Statics on the input period
 *
 * @param Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 *          2) id: mission id or null
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsMissionByPeriod = function(req, res, next){
    var endday, startday, group, query, length;

    var period = req.query.period;
    var missionId = req.query.id;

    switch(period){
        case "1": // one day
            endday = moment().format();
            startday = moment().subtract(1,'days').format();
            group = {
                'year' : { '$year':'$missions.lastCompleted_at' },
                'month': { '$month':'$missions.lastCompleted_at' },
                'day': { '$dayOfMonth':'$missions.lastCompleted_at'},
                'hour': { '$hour':'$missions.lastCompleted_at'}
            };
            length = 24;
            break;
        case "2": // one week
            endday = moment().format();
            startday = moment().subtract(7,'days').format();
            group = {
                'year' : { '$year':'$missions.lastCompleted_at' },
                'month': { '$month':'$missions.lastCompleted_at' },
                'day': { '$dayOfMonth':'$missions.lastCompleted_at'}
            };
            length = 7;
            break;
        case "3": // one month
            endday = moment().format();
            startday = moment().subtract(1,'months').format();
            group = {
                'year' : { '$year':'$missions.lastCompleted_at' },
                'month': { '$month':'$missions.lastCompleted_at' },
                'day': { '$dayOfMonth':'$missions.lastCompleted_at'}
            };
            length = 31;
            break;
        case "4": // 1 year
            endday = moment().format();
            startday = moment().subtract(1,'years').format();
            group = {
                'year' : { '$year':'$missions.lastCompleted_at' },
                'month': { '$month':'$missions.lastCompleted_at' }
            };
            length = 12;
            break;
    }

    if(missionId){
        query = {
            'missions.missionId': missionId,
            'missions.completeCount': {$gte: 1},
            'missions.lastCompleted_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};
    }else{
        query = {
            'missions.completeCount': {$gte: 1},
            'missions.lastCompleted_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};
    }

    user_controller.getMissionStatisticsByPeriod(query, group, function (err, result){
        if(err){
            logger.log('error', 'missionStatistics.js', global.errorcode[err]);
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