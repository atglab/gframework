var async = require('async');

var logger = require(global.rootPath + '/helpers/logger');

var InterReward = require(global.rootPath + '/models/rewards/interReward');

var point_controller = require('./point_controller.js');
var level_controller = require('./level_controller.js');
var badge_controller = require('./badge_controller.js');
var status_controller = require('./status_controller.js');
var permission_controller = require('./permission_controller.js');

var eventHandler = require(global.rootPath + '/controllers/common/events_controller');

/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var eventMap = {};

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load inter reward mechanics from database to memory
 * Init the member variable - eventMap
 *
 * @param next
 */
exports.initInterEventMap = function(interRewards, next){

    InterReward.remove({},function(err){
        if(err){
            next(err);
        }else{
            InterReward.create(interRewards, function(err, results){
                if(err){
                    next('4003');
                }else{

                    if(results === undefined){
                        next(null);

                    }else{
                        eventMap = {};
                        for(var i = 0; i< results.length; i++){
                            if(!eventMap.hasOwnProperty(results[i].event_name)){
                                eventMap[results[i].event_name] = [];
                            }
                            eventMap[results[i].event_name].push(results[i]);
                        }
                        next(null);
                    }
                }
            });
        }
    });
};

/**
 *
 * @param results
 * @param dataArray
 * @param reward_type
 */
exports.generateInterReward = function(results, dataArray, reward_type){

    for(var i = 0; i < dataArray.length; i++){
        var event_name;

        if(dataArray[i].relation_method === global.MECHANICS.MISSION
            && dataArray[i].relation_object != global.OTHER_CONSTANTS.NUM_MISSION_COMPLETION){
            continue;
        }

        switch(dataArray[i].relation_method){
            case global.MECHANICS.BADGE:
                event_name = global.REWARD_EVENTS.GET_BADGE; break;
            case global.MECHANICS.POINT:
                event_name = global.REWARD_EVENTS.ADD_POINT; break;
            case global.MECHANICS.LEVEL:
                event_name = global.REWARD_EVENTS.UP_LEVEL; break;
            case global.MECHANICS.STATUS:
                event_name = global.REWARD_EVENTS.GET_STATUS; break;
            case global.MECHANICS.PERMISSION:
                event_name = global.REWARD_EVENTS.GET_PERMISSION; break;
            case global.MECHANICS.MISSION:
                event_name = global.REWARD_EVENTS.COMPLETE_MISSION; break;
        }

        var interReward = {
            id: dataArray[i].relation_object + '_' + dataArray[i].id,

            event_type: dataArray[i].relation_method,
            event_object: dataArray[i].relation_object,
            event_name: event_name,

            reward_type:reward_type,
            reward_object: dataArray[i].id
        };
        results.push(interReward);
    }
};

/**
 * Function to execute associated reward mechanics
 *
 * @param event_name: occurred reward event name
 * @param event_object: occurred reward id
 * @param user: user model
 * @param next: callback
 */
exports.doInterRewards = function (event_name, event_object, user, next){

	// 1) search intermission with respect to the input reward event
	var intermissions = eventMap[event_name];
	var relatedIntermissions = [];
	if(!intermissions){
		logger.log('debug','interReward_controller.js','Does not exist: ' + event_name);
		next(null);
        return;
	}else{
		for(var i = 0; i<intermissions.length; i++){
			if(intermissions[i].event_object === event_object){
				relatedIntermissions.push(intermissions[i]);
			}
		}
		if(relatedIntermissions.length === 0){
			logger.log('debug', 'interReward_controller.js', 'Does not exist: ' + event_object);
			next(null);
            return;
		}
	}

    async.concatSeries(relatedIntermissions,
        function(intermission, callback){
            var reward;
            switch(event_name){
                case global.REWARD_EVENTS.ADD_POINT:
                    switch(intermission.reward_type){
                        case global.MECHANICS.BADGE: break;
                        case global.MECHANICS.LEVEL:
                            reward = level_controller.levelUpByAddPoint(user, event_object, intermission.reward_object);
                            break;
                        case global.MECHANICS.STATUS:
                            reward = status_controller.statusUpByAddPoint(user, event_object, intermission.reward_object);
                            break;
                        case global.MECHANICS.PERMISSION:
                            reward = permission_controller.permissionGetByAddPoint(user, event_object, intermission.reward_object);
                            break;
                    }
                    break;
                case global.REWARD_EVENTS.GET_BADGE:
                    switch(intermission.reward_type){
                        case global.MECHANICS.POINT: break;
                        case global.MECHANICS.LEVEL: break;
                        case global.MECHANICS.STATUS: break;
                        case global.MECHANICS.PERMISSION: break;
                    }
                    break;
                case global.REWARD_EVENTS.UP_LEVEL:
                    switch(intermission.reward_type){
                        case global.MECHANICS.POINT: break;
                        case global.MECHANICS.BADGE: break;
                        case global.MECHANICS.STATUS:
                            reward = status_controller.statusUpByUpLevel(user, event_object, intermission.reward_object);
                            break;
                        case global.MECHANICS.PERMISSION:
                            reward = permission_controller.permissionGetByUpLevel(user, event_object, intermission.reward_object);
                            break;
                    }
                    break;
                case global.REWARD_EVENTS.GET_STATUS:
                    switch(intermission.reward_type){
                        case global.MECHANICS.POINT: break;
                        case global.MECHANICS.BADGE: break;
                        case global.MECHANICS.LEVEL: break;
                        case global.MECHANICS.PERMISSION:
                            reward = permission_controller.permissionGetByUpStatus(user, event_object, intermission.reward_object);
                            break;
                    }
                    break;
                case global.REWARD_EVENTS.GET_PERMISSION:
                    switch(intermission.reward_type){
                        case global.MECHANICS.POINT: break;
                        case global.MECHANICS.BADGE: break;
                        case global.MECHANICS.LEVEL: break;
                        case global.MECHANICS.STATUS: break;
                    }
                    break;
                case global.REWARD_EVENTS.COMPLETE_MISSION:
                    switch(intermission.reward_type){
                        case global.MECHANICS.POINT: break;
                        case global.MECHANICS.BADGE: break;
                        case global.MECHANICS.LEVEL:
                            reward = level_controller.levelUpByNumMC(user, event_object, intermission.reward_object);
                            break;
                        case global.MECHANICS.STATUS:
                            reward = status_controller.statusUpByNumMC(user, event_object, intermission.reward_object);
                            break;
                        case global.MECHANICS.PERMISSION:
                            reward = permission_controller.permissionGetByNumMC(user, event_object, intermission.reward_object);
                            break;
                    }
                    break;
            }

            if(reward){

                //--> remove TODO 1) insert codes to save logs of the received rewards
                //TODO 2) insert codes to send messages to widgets of clients

                eventHandler.handler.emit(global.EVENTS.DO_INTER_REWARD,
                    reward.event_name, reward.event_object, user,
                    function(err){
                        callback(null);
                    });
            }else{
                callback(null);
            }
        },
        function(err){
            next(null);
        });
};
