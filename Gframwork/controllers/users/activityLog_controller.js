/**
 * [GFServer] activityLog_controller.js
 *
 * Module used to handle business logic of user's activity logs
 *
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');

var ActivityLog = require(global.rootPath + '/models/users/activityLog.js');
/**
 *
 * @param query
 * @param group
 * @param next
 */
exports.getStatistics = function(query, group, next){

    ActivityLog.aggregate([
        { $match: query},
        { $group:{
            '_id': group,
            'count': { $sum: 1 }}
        },
        { $sort: {_id : 1}}
    ],function (err, result){
        if(err){
            next('4008');
        }else{
            next(null, result);
        }
    });
};

/**
 *
 * @param query
 * @param groupUser
 * @param next
 */
exports.getStatisticsByUserGroup = function(query, groupUser, next){

    ActivityLog.aggregate([
        { $match: query},
        { $group:{ '_id': groupUser } },
        { $group:{
            '_id': '$_id.activity_id',
            'count': { $sum: 1 }}
        },
        { $sort: {_id : 1}}
    ],function (err, result){
        if(err){
            next('4008');
        }else{
            next(null, result);
        }
    });
}

/**
 *
 * @param query
 * @param next
 */
exports.getActivityLogs = function(query, next){

    ActivityLog.find(query)
        .sort({'created_at' : -1})
        .exec(function (err, results){
        if(err){
            next('4008');
        }else{
            next(null, results);
        }
    });
};

exports.getStatisticsActivity = function(query, group, next){
    ActivityLog.aggregate([
        { $match: query},
        { $group:{
            '_id': group,
            'count': { $sum: 1 }}
        },
        { $sort: {_id : 1}}
    ],function (err, result){
        if(err){
            next('4008');
        }else{
            next(null, result);
        }
    });
};

/**
 * Function to write the activity log to database
 *
 * @param activityId
 * @param userId
 * @param userOId
 * @param gender
 * @param birthday
 * @param next
 */
exports.addActivityLog = function(activityId, userId, gender, birthday, next){

    ActivityLog.create(
        {
            activity_id: activityId,
            user_id: userId,
            user_gender: gender,
            user_birthday: birthday
        },
        function(err){
            if(err){
                next('4003');
            }else{
                next(null);
            }
        });
};