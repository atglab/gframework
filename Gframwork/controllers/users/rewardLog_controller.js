/**
 * [GFServer] rewardLog_controller.js
 *
 * Module used to handle business logic of user's reward logs
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');
var common = require(global.rootPath + '/helpers/common.js');
var RewardLog = require(global.rootPath + '/models/users/rewardLog.js');

var moment = require('moment');
var events_controllers = require(global.rootPath + '/controllers/common/events_controller.js');

/**
 * Function to write the reward log to database
 *
 * @param user: user model
 * @param reward_type
 * @param reward_id
 * @param reward_value
 * @param reward_status
 * @param next
 */
exports.addRewardLog = function(user, reward_type, reward_id, reward_value, reward_status, next){

    RewardLog.create({
        reward_type: reward_type,
        reward_id: reward_id,
        reward_value: reward_value,
        reward_status: reward_status,
        user_id: user.id,
        user_gender: user.gender,
        user_birthday: user.birthday
    },
    function(err){
        if(err){
            next('4003');
        }else{
            next(null);
        }
    });
};

/**
 *
 * @param query
 * @param next
 */
exports.getRewardLogs = function(query, next){

    RewardLog.find(query)
        .sort({'created_at' : -1})
        .exec(function(err, results){
            if(err){
                next(err);
            }else{
                next(null, results);
            }
        });
};

/**
 *
 * @param query
 * @param group
 * @param next
 */
exports.getStatisticsReward = function(query, group, next){
    RewardLog.aggregate([
        { $match: query},
        { $group:{
            '_id': group,
            'count': { $sum: 1 }}
        },
        { $sort: {_id : 1}}
    ],function (err, result){
        if(err){
            console.log(err);
            next('4008');
        }else{
            next(null, result);
        }
    });
};


/**
 *
 * @param query
 * @param group
 * @param next
 */
exports.getRewardStatisticsByPeriod = function(query, group, next){
    RewardLog.aggregate([
        { $match: query},
        { $group:{
            '_id': group,
            'sum': { $sum: '$reward_value' },
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