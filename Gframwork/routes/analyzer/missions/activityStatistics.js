/**
 * [GFServer] activityStatistics.js
 *
 * Module used to handle user's activity logs API route
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');
var moment = require('moment');

var activityLog_controller = require(global.rootPath + '/controllers/users/activityLog_controller.js');
var logger = require(global.rootPath + '/helpers/logger');
var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');
var activity_controller = require(global.rootPath + '/controllers/missions/activity_controller.js');

/**
 * API Function for statistics summary of all activities by period
 *
 * @params Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsAllActivity = function(req, res, next){

    var endday, startday, group, query, numDays;
    var period = req.query.period;

    if(!period){
        logger.log('error', 'activityStatistics.js', global.errorcode['400']);
        res.status(400).json({success: false,
            error:{code: '400', message: global.errorcode['400']}});
        next();
        return;
    }

    switch(period){
        case "1": // one day
            endday = moment().format();
            startday = moment().subtract(1,'days').format();
            numDays = 1;
            break;
        case "2": // one week
            endday = moment().format();
            startday = moment().subtract(7,'days').format();
            numDays = 7;
            break;
        case "3": // one month
            endday = moment().format();
            startday = moment().subtract(1,'months').format();
            numDays = 31;
            break;
        case "4": // 1 year
            endday = moment().format();
            startday = moment().subtract(1,'years').format();
            numDays = 365;
            break;
    }
    query = { 'created_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};

    async.waterfall([
        function(callback){
            group = '$activity_id';
            activityLog_controller.getStatistics(query, group, function(err, results){
                if(err){
                    callback(err);
                }else{
                    for(var i = 0; i<results.length; i++){
                        results[i].avgDay = results[i].count / numDays ;
                    }
                    callback(null, results);
                }
            });
        },
        function(activities, callback){
            user_controller.getUserNumber(function(err, numUser){
                if(err){
                    callback(err);
                }else{
                    callback(null, activities, numUser);
                }
            });
        },
        function(activities, numUser, callback){
            group = { activity_id: '$activity_id', user_id: '$user_id'};
            activityLog_controller.getStatisticsByUserGroup(query, group, function(err, results){
                if(err){
                    callback(err);
                }else{
                    for(var i = 0; i<activities.length; i++){
                        for(var j = 0; j<results.length; j++){
                            if( activities[i]._id === results[j]._id ){
                                activities[i].userRatio = (results[j].count) / numUser;
                                break;
                            }
                        }
                    }
                    callback(null, activities);
                }
            });
        },
        function(activities, callback){
            activity_controller.findAll(function(err, results){
                if(err){
                    callback(err);
                }else{
                    var revisedResult = [];
                    for(var i = 0; i< results.length; i++){
                        var data = {
                            name: results[i].name,
                            userRatio: 0,
                            avgDay: 0,
                            count: 0
                        }
                        for(var j = 0; j < activities.length; j++){
                            if( activities[j]._id === results[i].id ){
                                data.userRatio = activities[j].userRatio;
                                data.avgDay = activities[j].avgDay;
                                data.count = activities[j].count;
                                break;
                            }
                        }
                        revisedResult.push(data);
                    }
                    callback(null, revisedResult);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'activityStatistics.js', global.errorcode[err]);
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
 * API Function for statistics summary of the activity by period
 *
 * @params Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 *         Request URL Params:
 *          1) id: activity id
 * @params res: response
 * @params next: callback
 */
exports.getStaticsActivity = function(req, res, next){

    var endday, startday, group, query, numDays;
    var activity_id = req.params.id;
    var period = req.query.period;

    if(!period){
        logger.log('error', 'activityStatistics.js', global.errorcode['400']);
        res.status(400).json({success: false,
            error:{code: '400', message: global.errorcode['400']}});
        next();
        return;
    }

    switch(period){
        case "1": // one day
            endday = moment().format();
            startday = moment().subtract(1,'days').format();
            numDays = 1;
            break;
        case "2": // one week
            endday = moment().format();
            startday = moment().subtract(7,'days').format();
            numDays = 7;
            break;
        case "3": // one month
            endday = moment().format();
            startday = moment().subtract(1,'months').format();
            numDays = 31;
            break;
        case "4": // 1 year
            endday = moment().format();
            startday = moment().subtract(1,'years').format();
            numDays = 365;
            break;
    }
    query = { 'activity_id': activity_id,
        'created_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};

    async.waterfall([
        function(callback){
            var group = {
                gender : '$user_gender',
                age : {$subtract: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] }
                    , {$mod: [ {$divide : [ { $subtract: [ moment().unix(), '$user_birthday']}, 31536000 ] } , 10]}]}
            };
            activityLog_controller.getStatisticsActivity(query, group, function(err, activityLogs){
                if(err){
                    callback(err);
                }else{
                    var results = {
                        total: 0,
                        man: 0, woman: 0, other: 0,
                        age10: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0
                    };
                    for(var i = 0; i < activityLogs.length; i++){

                        results.total += activityLogs[i].count;

                        switch(activityLogs[i]._id.gender){
                            case 0: results.other += activityLogs[i].count; break;
                            case 1: results.man += activityLogs[i].count; break;
                            case 2: results.woman += activityLogs[i].count; break;
                        }

                        switch(activityLogs[i]._id.age){
                            case 0: results.age10 += activityLogs[i].count; break;
                            case 10: results.age10 += activityLogs[i].count; break;
                            case 20: results.age20 += activityLogs[i].count; break;
                            case 30: results.age30 += activityLogs[i].count; break;
                            case 40: results.age40 += activityLogs[i].count; break;
                            case 50: results.age50 += activityLogs[i].count; break;
                            case 60: results.age60 += activityLogs[i].count; break;
                            case 70: results.age60 += activityLogs[i].count; break;
                            case 80: results.age60 += activityLogs[i].count; break;
                            case 90: results.age60 += activityLogs[i].count; break;
                        }
                    }
                    var revisedResults = [
                        {x: "전체", y: results.total},
                        {x: "남성", y: results.man},
                        {x: "여성", y: results.woman},
                        {x: "기타", y: results.other},
                        {x: "10대 이하", y: results.age10},
                        {x: "20대", y: results.age20},
                        {x: "30대", y: results.age30},
                        {x: "40대", y: results.age40},
                        {x: "50대", y: results.age50},
                        {x: "60대 이상", y: results.age60}
                    ];
                    callback(null, revisedResults);
                }
            });
        }
    ],function(err, results){
        if(err){
            logger.log('error', 'activityStatistics.js', global.errorcode[err]);
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
 * API Function for statistics of activities by period
 *
 * @params Request Query Parameters:
 *          1) period: 1-one day, 2-one week, 3-one month, 4-one year
 *          2) aid: activity id or null( when it is null, return the total statistics )
 *          3) uid: user id or null( when it is null, return the total statistics )
 * @params res: response
 * @params next: callback
 */
exports.getStatisticsByPeriod = function(req, res, next){

    var endday, startday, group, query, length;
    var period = req.query.period;

    if(!period){
        logger.log('error', 'activityStatistics.js', global.errorcode['400']);
        res.status(400).json({success: false,
            error:{code: '400', message: global.errorcode['400']}});
        next();
        return;
    }

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
    query = { 'created_at': {'$gte': new Date(startday), '$lt': new Date(endday)}};

    if(req.query.aid){
        query.activity_id = req.query.aid;
    }
    if(req.query.uid){
        query.user_id = req.query.uid;
    }

    activityLog_controller.getStatistics(query, group, function(err, result){
        if(err){
            logger.log('error', 'activityStatistics.js', global.errorcode[err]);
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