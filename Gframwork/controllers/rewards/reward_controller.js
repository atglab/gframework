/**
 * [GFServer] reward_master.js
 *
 * Module of manager for all reward mechanics
 *
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');
var logger = require(global.rootPath + '/helpers/logger');

var point_controller = require('./point_controller.js');
var level_controller = require('./level_controller.js');
var badge_controller = require('./badge_controller.js');
var status_controller = require('./status_controller.js');
var permission_controller = require('./permission_controller.js');

var eventHandler = require(global.rootPath + '/controllers/common/events_controller');

var interReward_controller = require('./interReward_controller.js');

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to init all reward mechanics
 *
 * @param next: callback
 */
exports.initRewards = function(next){
    var interRewards = [];

    async.waterfall([
        function(callback){
            point_controller.initReward(callback);
        },
        function(callback){
            badge_controller.initReward(callback);
        },
        function(callback){
            level_controller.initReward(interRewards, interReward_controller.generateInterReward, callback);
        },
        function(callback){
            status_controller.initReward(interRewards, interReward_controller.generateInterReward, callback);
        },
        function(callback){
            permission_controller.initReward(interRewards, interReward_controller.generateInterReward, callback);
        },
        function(callback){
            interReward_controller.initInterEventMap(interRewards, callback);
        }
    ],function(err){
        if(err){
            next(err);
        }else{
            next(null);
        }
    });
};

/**
 * Function to execute the reward of mission when the mission is completed
 *
 * @param user: user model
 * @param missionId: mission id
 * @param reward_type: string of reward type
 * @param reward_object: reward id
 * @param reward_parameter: specific value by reward
 * @param next: callback
 */
exports.executeReward = function(user, missionId, reward_type, reward_object, reward_parameter, next){

    switch(reward_type){
        //Point Reward
        case global.MECHANICS.POINT:
            doRewardByMissionCompleted(user, missionId, reward_object, reward_parameter, point_controller,
                global.REWARD_EVENTS.ADD_POINT, next);
            break;

        //Badge Reward
        case global.MECHANICS.BADGE:
            doRewardByMissionCompleted(user, missionId, reward_object, reward_parameter, badge_controller,
                global.REWARD_EVENTS.GET_BADGE, next);
            break;

        //Level Reward
        case global.MECHANICS.LEVEL:
            doRewardByMissionCompleted(user, missionId, reward_object, reward_parameter, level_controller,
                global.REWARD_EVENTS.GET_LEVEL, next);
            break;

        //Status Reward
        case global.MECHANICS.STATUS:
            doRewardByMissionCompleted(user, missionId, reward_object, reward_parameter, status_controller,
                global.REWARD_EVENTS.GET_STATUS, next);
            break;

        //Permission Reward
        case global.MECHANICS.PERMISSION:
            doRewardByMissionCompleted(user, missionId, reward_object, reward_parameter, permission_controller,
                global.REWARD_EVENTS.GET_PERMISSION, next);
            break;
    }
};

/** ======================================================== *
 *  Private Member Functions
 *  ======================================================== */

/**
 * Function to execute the specific reward and to emit the reward event
 *
 * @param user: user model
 * @param missionId: mission id
 * @param reward_object: reward id
 * @param reward_parameter: specific value by reward
 * @param reward_module: module to manage the reward
 * @param event_name: event name of the received reward
 * @param next: callback
 */
function doRewardByMissionCompleted(user, missionId, reward_object, reward_parameter, reward_module,
              event_name, next){

    var userMission, isNew = true;

    async.waterfall([
        function(callback){

            // 1) search the mission reward from user rewards array
            for(var i = 0; i<user.rewards.length; i++){
                if(user.rewards[i].reward_type === global.MECHANICS.MISSION
                    && user.rewards[i].reward_object === global.OTHER_CONSTANTS.NUM_MISSION_COMPLETION){
                    userMission = user.rewards[i];
                    isNew = false;
                    break;
                }
            }

            if(isNew){
                userMission = {
                    reward_type: global.MECHANICS.MISSION,
                    reward_object: global.OTHER_CONSTANTS.NUM_MISSION_COMPLETION,
                    reward_status: 1
                };
                user.rewards.push(userMission);
            }else{
                userMission.reward_status = userMission.reward_status + 1;
            }

            logger.log('debug', 'reward_controller.js', user.id + " complete " + missionId + ' ' + userMission.reward_status);

            eventHandler.handler.emit(global.EVENTS.RECEIVED_REWARD,
                user, global.MECHANICS.MISSION, missionId, 1, userMission.reward_status,
                function(err){
                    if(err){
                        logger.log('error', 'reward_controller.js', 'Failed to write the reward log of mission');
                    }
                }
            );

            eventHandler.handler.emit(global.EVENTS.DO_INTER_REWARD,
                global.REWARD_EVENTS.COMPLETE_MISSION, global.OTHER_CONSTANTS.NUM_MISSION_COMPLETION, user,
                function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(null);
                    }
                });
        },
        function(callback){
            var err = reward_module.doRewardByMissionCompleted(user, reward_object, reward_parameter);

            if(err){
                callback(err);
            }else{

                //--> remove TODO 1) insert codes to save logs of the received rewards
                //TODO 2) insert codes to send messages to widgets of clients
                //var message = 'get ' + mission.reward_type + ' ' + mission.reward_object;
                //eventHandler.emit(global.EVENTS.SEND_TO_LEADERBOARD, req.params.uid, message);

                eventHandler.handler.emit(global.EVENTS.DO_INTER_REWARD,
                    event_name, reward_object, user,
                    function(err){
                        if(err){
                            callback(err);
                        }else{
                            callback(null);
                        }
                    });
            }
        }
    ],function(err){
        if(err){
            next(err);
        }else{
            next(null);
        }
    });

}