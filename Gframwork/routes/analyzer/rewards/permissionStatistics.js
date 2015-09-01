/**
 * [GFServer] permissionStatistics.js
 *
 * Module used to handle user's permission Statistics API route
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');
var moment = require('moment');

var logger = require(global.rootPath + '/helpers/logger');

var permission_controller = require(global.rootPath + '/controllers/rewards/permission_controller.js');
var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');

var rewardLog_controller = require(global.rootPath + '/controllers/users/rewardLog_controller.js');

/**
 * Analyzer API Function for statics of all permissions
 *
 * @params req: request
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsAllPermissions = function(req, res, next){
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
            permission_controller.findAll(function(err, permissions){
                if(err){
                    callback(err);
                }else{
                    callback(null, numUser, permissions);
                }
            });
        },function(numUser, permissions, callback){
            user_controller.getRewardStatistics(global.MECHANICS.PERMISSION, function (err, results){
                if(err){
                    callback(err);
                }else{
                    if(results && permissions){
                        var revisedResult = [];

                        for(var i=0; i<permissions.length; i++){

                            var tmp = {
                                name: permissions[i].name,
                                ratio: 0,
                                count: 0,
                                countNone: 0
                            };

                            for(var j = 0; j< results.length; j++){
                                if(results[j]._id === permissions[i].id){
                                    tmp.ratio = results[j].count / numUser;
                                    tmp.count = results[j].count;
                                    tmp.countNone = numUser - results[j].count;
                                    break;
                                }
                            }
                            revisedResult.push(tmp);
                        }
                        callback(null, revisedResult)
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
 * Analyzer API Function for statics of the permission
 *
 * @param req URL params id: permission id
 * @param res
 * @param next
 */
exports.getStatisticsPermission = function(req, res, next){
    var permissionId = req.params.id;

    async.waterfall([
        function(callback){
            var query = {
                reward_type: global.MECHANICS.PERMISSION,
                reward_id: permissionId,
                reward_status: 1
            };

            var group = {
                gender : '$user_gender',
                age : {$subtract: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] }
                    , {$mod: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] } , 10]}]}
            };

            rewardLog_controller.getStatisticsReward(query, group, function(err, permissionLogs){
                if(err) {
                    callback(err);
                }else{
                    var results = {
                        total: 0,
                        man: 0, woman: 0, other: 0,
                        age10: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0
                    };
                    for(var i = 0; i < permissionLogs.length; i++){
                        results.total += permissionLogs[i].count;

                        switch(permissionLogs[i]._id.gender){
                            case 0: results.other += permissionLogs[i].count; break;
                            case 1: results.man += permissionLogs[i].count; break;
                            case 2: results.woman += permissionLogs[i].count; break;
                        }

                        switch(permissionLogs[i]._id.age){
                            case 0: results.age10 += permissionLogs[i].count; break;
                            case 10: results.age10 += permissionLogs[i].count; break;
                            case 20: results.age20 += permissionLogs[i].count; break;
                            case 30: results.age30 += permissionLogs[i].count; break;
                            case 40: results.age40 += permissionLogs[i].count; break;
                            case 50: results.age50 += permissionLogs[i].count; break;
                            case 60: results.age60 += permissionLogs[i].count; break;
                            case 70: results.age60 += permissionLogs[i].count; break;
                            case 80: results.age60 += permissionLogs[i].count; break;
                            case 90: results.age60 += permissionLogs[i].count; break;
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
 * Analyzer API Function for the Permission Statics on the input period
 *
 * @param Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 *          2) id: badge id or null
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsPermissionByPeriod = function(req, res, next){
    var endday, startday, group, query, length;

    var period = req.query.period;
    var permissionId = req.query.id;

    switch(period){
        case "1": // one day
            endday = moment().format();
            startday = moment().subtract(1,'days').format();
            group = {
                'year' : { '$year':'$rewards.lastUpdated_at' },
                'month': { '$month':'$rewards.lastUpdated_at' },
                'day': { '$dayOfMonth':'$rewards.lastUpdated_at'},
                'hour': { '$hour':'$rewards.lastUpdated_at'}
            };
            length = 24;
            break;
        case "2": // one week
            endday = moment().format();
            startday = moment().subtract(7,'days').format();
            group = {
                'year' : { '$year':'$rewards.lastUpdated_at' },
                'month': { '$month':'$rewards.lastUpdated_at' },
                'day': { '$dayOfMonth':'$rewards.lastUpdated_at'}
            };
            length = 7;
            break;
        case "3": // one month
            endday = moment().format();
            startday = moment().subtract(1,'months').format();
            group = {
                'year' : { '$year':'$rewards.lastUpdated_at' },
                'month': { '$month':'$rewards.lastUpdated_at' },
                'day': { '$dayOfMonth':'$rewards.lastUpdated_at'}
            };
            length = 31;
            break;
        case "4": // 1 year
            endday = moment().format();
            startday = moment().subtract(1,'years').format();
            group = {
                'year' : { '$year':'$rewards.lastUpdated_at' },
                'month': { '$month':'$rewards.lastUpdated_at' }
            };
            length = 12;
            break;
    }

    if(permissionId){
        query = {
            'rewards.reward_type': global.MECHANICS.PERMISSION,
            'rewards.reward_object': permissionId,
            'rewards.reward_status': 1,
            'rewards.lastUpdated_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};
    }else{
        query = {
            'rewards.reward_type': global.MECHANICS.PERMISSION,
            'rewards.reward_status': 1,
            'rewards.lastUpdated_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};
    }

    user_controller.getRewardStatisticsByPeriod(query, group, function (err, result){
        if(err){
            logger.log('error', 'permissionStatistics.js', global.errorcode[err]);
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