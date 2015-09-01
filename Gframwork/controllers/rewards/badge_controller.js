/**
 * [GFServer] badge_controller.js
 *
 * Module used to handle business logic of badges
 *
 * @author JungHyun
 * @version 0.4
 */
var logger = require(global.rootPath + '/helpers/logger');
var Badge = require(global.rootPath + '/models/rewards/badge.js');
var moment = require('moment');

var events_controllers = require(global.rootPath + '/controllers/common/events_controller.js');

/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var badgeMap = {};
var badgeList = [];

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load badge mechanics from database to memory
 * Init the member variable - badgeMap
 *
 * @param next: callback
 */
exports.initReward = function(next){
    Badge.find({})
        .exec(function(err, badges){
            if(err){
                next('4002');
            }else{
                badgeMap = {};
                for(var i = 0; i< badges.length; i++){
                    badgeMap[badges[i].id] = badges[i];
                }
                badgeList = badges;
                next(null);
            }
        });
};

exports.getNumOfBadges = function(){
    return badgeList.length;
};

exports.getBadgeFromMemory = function(id){
    return badgeMap[id];
};

exports.getBadgeListFromMemory = function(){
    return badgeList;
};

/**
 * Function to do badge reward by mission completion
 * give the new badge to user or remove the badge from user
 *
 * @param user: user model
 * @param reward_object: badge id
 * @param reward_parameter: 1-give badge, 2-remove badge
 * @param next: callback
 */
exports.doRewardByMissionCompleted = function(user, reward_object, reward_parameter){

    var userBadge, isNewBadge=true, previousBadge;

    // 1) search the badge from user rewards array
    for(var i = 0; i < user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.BADGE
            && user.rewards[i].reward_object === reward_object){
            userBadge = user.rewards[i];
            isNewBadge = false;
            break;
        }
    }

    // 2) When use doesn't have the badge, create new badge
    if(isNewBadge){
        userBadge = {
            reward_type: global.MECHANICS.BADGE,
            reward_object: reward_object,
            reward_status: 0
        };
    }

    // 3) change the badge status
    previousBadge = userBadge.reward_status;
    userBadge.reward_status = reward_parameter;
    userBadge.lastUpdated_at = Date.now();

    var badge = badgeMap[reward_object];

    if(isNewBadge){
        user.rewards.push(userBadge);
    }
    if(previousBadge != userBadge.reward_status){

        logger.log('debug','badge_controller.js', user.id + ' get '
        + badge.name +' ' + reward_parameter + ' ' + userBadge.reward_status == 1 ? 'Get' : 'Lost');

        events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
            user, global.MECHANICS.BADGE, badge.id, reward_parameter, userBadge.reward_status,
            function(err){
                if(err){
                    logger.log('error', 'badge_controller.js', 'Failed to write the reward log of badge');
                }
            }
        );
        var message;
        if(userBadge.reward_status === 1){
            message = user.name + '님이 ' + badge.name + '을 획득하였습니다.';
        }else{
            message = user.name + '님이 ' + badge.name + '을 잃어버렸습니다.';
        }

        events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
            global.OTHER_CONSTANTS.REWARD, message, badge.icon, moment().unix());

        return null;
    }else{
        return 'unchangedReward';
    }
};

exports.findAll = function(next){
    Badge.find({})
        .sort('name')
        .exec(function(err, badges){
            if(err){
                next('4002');
            }else{
                next(null, badges);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Badge.findOne(query)
        .exec(function(err, badge){
            if(err){
                next('4001');
            }else{
                next(null, badge);
            }
        });
};

exports.addBadge = function(data, next){
    var query = {id: data.id};
    Badge.findOne(query)
        .exec(function(err, badge){
            if(err){
                next('4001');
            }else if(badge){
                next('4005');
            }else{
                Badge.create(data, function(err){
                    if(err){
                        next('4003');
                    }else{
                        next(null);
                    }
                });
            }
        });
};

exports.updateBadgeByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Badge.update(query, data)
        .exec(function(err, raw){
            if(err){
                next('4006');
            }else if(raw === 0){
                next('4004');
            }else{
                next(null);
            }
        });
};

exports.deleteBadgeByID = function(id, next){
    var query = {id: id};

    Badge.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};