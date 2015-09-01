/**
 * [GFServer] statusStatistics.js
 *
 * Module used to handle user's status statistics API route
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');
var moment = require('moment');

var logger = require(global.rootPath + '/helpers/logger');

var status_controller = require(global.rootPath + '/controllers/rewards/status_controller.js');
var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');

var rewardLog_controller = require(global.rootPath + '/controllers/users/rewardLog_controller.js');

/**
 * Analyzer API Function for statics of all statuses
 *
 * @params req: request
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsAllStatuses = function(req, res, next){
    async.waterfall([
        function(callback){
            user_controller.getUserNumber(function(err, numUser){
                if(err){
                    callback(err);
                }else{
                    callback(null, numUser);
                }
            });
        },function(numUser, callback){
            status_controller.findAll(function(err, statuses){
                if(err){
                    callback(err);
                }else{
                    callback(null, numUser, statuses);
                }
            });
        },function(numUser, statuses, callback){
            user_controller.getRewardStatisticsSum(global.MECHANICS.STATUS, function (err, results){
                if(err){
                    callback(err);
                }else{
                    if(results && statuses){
                        var revisedResult = [];

                        for(var i=0; i<statuses.length; i++){

                            var tmp = {
                                name: statuses[i].name,
                                ratio: 0,
                                avg: 0,
                                max: statuses[i].classes.length,
                                icon: statuses[i].classes[0].icon
                            };

                            for(var j = 0; j< results.length; j++){
                                if(results[j]._id === statuses[i].id){
                                    tmp.ratio = results[j].sum / numUser / tmp.max;
                                    tmp.avg = results[j].sum / numUser;
                                    var rank = Math.ceil(tmp.avg);
                                    tmp.icon = statuses[i].classes[rank-1].icon;
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
            logger.log('error', 'statusStatistics.js', global.errorcode[err]);
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
 * Analyzer API Function for statics of the status
 *
 * @param req URL params id: status id
 * @param res
 * @param next
 */
exports.getStatisticsStatus = function(req, res, next){
    var statusId = req.params.id;
    var rangeCount = 10;

    async.waterfall([
        function(callback){
            status_controller.findByID(statusId, function(err, status){
                if(err){
                    callback(err);
                }else{
                    if(status.classes.length < rangeCount){
                        rangeCount = status.classes.length;
                    }
                    var rangeNum = status.classes.length / rangeCount;
                    var temp = rangeNum;
                    var digit = 0;
                    while(temp > 0) {
                        temp = Math.floor( temp / 10 );
                        digit++;
                    }
                    if(temp === 0) temp = 1;
                    rangeNum = temp * Math.pow(10, (digit-1));

                    callback(null, rangeNum);
                }
            });
        },
        function(rangeNum, callback){
            var query = {
                'rewards.reward_type': global.MECHANICS.STATUS,
                'rewards.reward_object': statusId
            };
            var group = {
                'gender': '$gender',
                'range' :  { $subtract: [ '$rewards.reward_status',
                    {$mod : ['$rewards.reward_status', rangeNum]}]}
            };
            user_controller.getRewardStatisticsByRange(query, group, function(err, results){
                if(err){
                    callback(err);
                }else{

                    var totalResults = [];

                    for(var i = 0; i<=rangeCount; i++){

                        var range = rangeNum * i;

                        var data = {
                            range: range, total: 0,
                            man: 0, woman: 0, other: 0,
                            age10: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0
                        };

                        totalResults.push(data);

                        for(var j = 0; j<results.length; j++){
                            if(range === results[j]._id.range) {
                                data.total += results[j].count;

                                switch(results[j]._id.gender){
                                    case 0: data.other = results[j].count; break;
                                    case 1: data.man = results[j].count; break;
                                    case 2: data.woman = results[j].count; break;
                                }
                            }
                        }
                    }

                    callback(null, rangeNum, totalResults);
                }
            });
        },
        function(rangeNum, totalResults, callback) {
            var query = {
                'rewards.reward_type': global.MECHANICS.STATUS,
                'rewards.reward_object': statusId
            };
            var group = {
                age: {
                    $subtract: [{$divide: [{$subtract: [moment().unix(), '$birthday']}, 31536000]}
                        , {$mod: [{$divide: [{$subtract: [moment().unix(), '$birthday']}, 31536000]}, 10]}]
                },
                range: {
                    $subtract: ['$rewards.reward_status',
                        {$mod: ['$rewards.reward_status', rangeNum]}]
                }
            };
            user_controller.getRewardStatisticsByRange(query, group, function (err, results) {
                if (err) {
                    callback(err);
                } else {

                    for (var i = 0; i <= rangeCount; i++) {

                        var range = rangeNum * i;

                        for (var j = 0; j < results.length; j++) {
                            if (range === results[j]._id.range) {

                                switch (results[j]._id.age) {
                                    case 0: totalResults[i].age10 = results[j].count; break;
                                    case 10: totalResults[i].age10 = results[j].count; break;
                                    case 20: totalResults[i].age20 = results[j].count; break;
                                    case 30: totalResults[i].age30 = results[j].count; break;
                                    case 40: totalResults[i].age40 = results[j].count; break;
                                    case 50: totalResults[i].age50 = results[j].count; break;
                                    case 60: totalResults[i].age60 = results[j].count; break;
                                    case 70: totalResults[i].age60 = results[j].count; break;
                                    case 80: totalResults[i].age60 = results[j].count; break;
                                    case 90: totalResults[i].age60 = results[j].count; break;
                                }
                            }
                        }
                    }
                    callback(null, totalResults);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'statusStatistics.js', global.errorcode[err]);
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
 * Analyzer API Function for the status Statics on the input status
 *
 * @param Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 *          2) id: status id or null
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsStatusesByPeriod = function(req, res, next){
    var endday, startday, group, query, length;

    var period = req.query.period;
    var statusId = req.query.id;

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

    if(statusId){
        query = {
            'reward_type': global.MECHANICS.STATUS,
            'reward_id': statusId,
            'created_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};
    }else{
        query = {
            'reward_type': global.MECHANICS.STATUS,
            'created_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};
    }

    rewardLog_controller.getRewardStatisticsByPeriod(query, group, function (err, result){
        if(err){
            logger.log('error', 'statusStatistics.js', global.errorcode[err]);
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