/**
 * [GFServer] level_controller.js
 *
 * Module used to handle business logic of levels
 *
 * @author JungHyun
 * @version 0.4
 */
var logger = require(global.rootPath + '/helpers/logger');
var moment = require('moment');
var Level = require(global.rootPath + '/models/rewards/level.js');
var events_controllers = require(global.rootPath + '/controllers/common/events_controller.js');
var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js')
/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var levelMap = {};
var levelList = {};
exports.levelMap = levelMap;

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load level mechanics from database to memory
 * Init the member variable - levelMap
 *
 * @param next: callback
 */
exports.initReward = function(interRewards, generateInterReward, next){
    Level.find({})
        .exec(function(err, levels){
            if(err){
                next('4002');
            }else{
                levelMap = {};
                for(var i = 0; i< levels.length; i++){
                    levelMap[levels[i].id] = levels[i];
                }
                levelList = levels;
                generateInterReward(interRewards, levels, global.MECHANICS.LEVEL);

                next(null);
            }
        });
};

exports.getLevelFromMemory = function(id){
    return levelMap[id];
};

exports.getLevelListFromMemory = function(){
    return levelList;
}
/**
 * Function to do level reward by mission completion
 * Set user level to new reward value of mission
 *
 * @param user: user model
 * @param reward_object: level id
 * @param reward_parameter: new level value
 * @param next: callback
 *
 * @return 1) null: normal return, 2) 'unchangedReward': when the level is unchanged
 */
exports.doRewardByMissionCompleted = function(user, reward_object, reward_parameter){

    var userLevel, isNewLevel = true, previousLevel;

    // 1) search the level reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.LEVEL
            && user.rewards[i].reward_object === reward_object){
            userLevel = user.rewards[i];
            isNewLevel = false;
            break;
        }
    }

    // 2) When use doesn't have the reward level, generate new level reward
    if(isNewLevel){
        userLevel = {
            reward_type: global.MECHANICS.LEVEL,
            reward_object: reward_object,
            reward_status: 1
        }
    }

    // 3) set the level
    previousLevel = userLevel.reward_status;
    userLevel.reward_status = reward_parameter;
    userLevel.lastUpdated_at = Date.now();

    if(isNewLevel){
        user.rewards.push(userLevel);
    }

    if(previousLevel != userLevel.reward_status){

        logger.log('debug','level_controller.js', user.id + ' get '
            + level.name +' ' + reward_parameter + ' ' + userLevel.reward_status );

        events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
            user, global.MECHANICS.LEVEL, level.id, reward_parameter, userLevel.reward_status,
            function(err){
                if(err){
                    logger.log('error', 'level_controller.js', 'Failed to write the reward log of level');
                }
            }
        );

        var message = user.name + '님이 ' + level.name + ' ' + userLevel.reward_status + '을 달성하였습니다.';

        events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
            global.OTHER_CONSTANTS.REWARD, message, level.icon, moment().unix());

        return null;
    }else{
        return 'unchangedReward';
    }
};

/**
 * Function to up level by adding point
 *
 * @param user: user model
 * @param pointId: point id
 * @param levelId: level id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when level is changed.
 */
exports.levelUpByAddPoint = function(user, pointId, levelId){

    var level = levelMap[levelId];
    var userPoint, currentStatus, userLevel, currentLevel, isNewLevel = true, isChanged = false;
    var point = point_controller.getPointFromMemory(pointId);

    if(!level || level.relation_method != global.MECHANICS.POINT ||
        pointId != level.relation_object){
        logger.log('debug', 'level_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the level reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.LEVEL
            && user.rewards[i].reward_object === level.id){
            userLevel = user.rewards[i];
            isNewLevel = false;
            break;
        }
    }

    // 2) When use doesn't have the reward level, generate new level reward
    if(isNewLevel){
        userLevel = {
            reward_type: global.MECHANICS.LEVEL,
            reward_object: level.id,
            reward_status: 1
        }
    }

    currentLevel = userLevel.reward_status;

    // 3) check whether user level is max
    if(currentLevel === level.max){
        logger.log('debug', 'level_controller.js', 'User Level is max');

        return null;
    }

    // 4) find current status of the input point from user rewards
    for(var i = 0; i < user.rewards.length; i++) {
        if (user.rewards[i].reward_type === global.MECHANICS.POINT
            && user.rewards[i].reward_object === pointId) {
            userPoint = user.rewards[i];
            break;
        }
    }

    //5) Up level when the level up condition is satisfied
    if(userPoint){
        currentStatus = userPoint.reward_status;

        for(var j = 0; j < level.level_table.length; j++){
            if( level.level_table[j].level === currentLevel + 1){

                // 6) check whether level up condition is satisfied
                if( currentStatus >= level.level_table[j].condition){

                    userLevel.reward_status = level.level_table[j].level;
                    userLevel.lastUpdated_at = Date.now();
                    currentLevel++;
                    isChanged = true;

                    logger.log('debug', 'level_controller.js', user.id + " up " + level.name + ' ' + currentLevel);

                    events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                        user, global.MECHANICS.LEVEL, level.id, currentLevel, userLevel.reward_status,
                        function(err){
                            if(err){
                                logger.log('error', 'level_controller.js', 'Failed to write the reward log of level');
                            }
                        }
                    );

                    var message = user.name + '님이 ' + level.name + ' ' + userLevel.reward_status + '을 달성하였습니다.';

                    events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                        global.OTHER_CONSTANTS.REWARD, message, level.icon, moment().unix());
                }else{
                    break;
                }
            }
        }
    }

    if(isNewLevel){
        user.rewards.push(userLevel);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.UP_LEVEL,
            event_object: level.id
        };

        return reward;
    }else{

        return null;
    }
};

/**
 * Function to up level by number of mission completion
 *
 * @param user: user model
 * @param mc: "NUM_MISSION_COMPLETION"
 * @param levelId: level id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when level is changed.
 */
exports.levelUpByNumMC = function(user, mc, levelId){

    var level = levelMap[levelId];
    var userMission, currentStatus, userLevel, currentLevel, isNewLevel = true, isChanged = false;

    if(!level || level.relation_method != global.MECHANICS.MISSION ||
        mc != level.relation_object){
        logger.log('debug', 'level_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the level reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.LEVEL
            && user.rewards[i].reward_object === level.id){
            userLevel = user.rewards[i];
            isNewLevel = false;
            break;
        }
    }

    // 2) When use doesn't have the reward level, generate new level reward
    if(isNewLevel){
        userLevel = {
            reward_type: global.MECHANICS.LEVEL,
            reward_object: level.id,
            reward_status: 1
        }
    }

    currentLevel = userLevel.reward_status;

    // 3) check whether user level is max
    if(currentLevel === level.max){
        logger.log('debug', 'level_controller.js', 'User Level is max');

        return null;
    }

    // 4) find current status of mission completion from user rewards
    for(var i = 0; i < user.rewards.length; i++) {
        if (user.rewards[i].reward_type === global.MECHANICS.MISSION
            && user.rewards[i].reward_object === mc) {
            userMission = user.rewards[i];
            break;
        }
    }

    //5) Up level when the level up condition is satisfied
    if(userMission){
        currentStatus = userMission.reward_status;

        for(var j = 0; j < level.level_table.length; j++){
            if( level.level_table[j].level === currentLevel + 1){

                // 6) check whether level up condition is satisfied
                if( currentStatus >= level.level_table[j].condition){

                    userLevel.reward_status = level.level_table[j].level;
                    userLevel.lastUpdated_at = Date.now();
                    currentLevel++;
                    isChanged = true;

                    logger.log('debug', 'level_controller.js', user.id + " up " + level.name + ' ' + currentLevel);

                    events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                        user, global.MECHANICS.LEVEL, level.id, currentLevel, userLevel.reward_status,
                        function(err){
                            if(err){
                                logger.log('error', 'level_controller.js', 'Failed to write the reward log of level');
                            }
                        }
                    );

                    var message = user.name + '님이 ' + level.name + ' ' + userLevel.reward_status + '을 달성하였습니다.';

                    events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                        global.OTHER_CONSTANTS.REWARD, message, level.icon, moment().unix());
                }else{
                    break;
                }
            }
        }
    }

    if(isNewLevel){
        user.rewards.push(userLevel);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.UP_LEVEL,
            event_object: level.id
        };

        return reward;
    }else{

        return null;
    }
};

exports.findAll = function(next){
    Level.find({})
        .sort('name')
        .exec(function(err, levels){
            if(err){
                next('4002');
            }else{
                next(null, levels);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Level.findOne(query)
        .exec(function(err, level){
            if(err){
                next('4001');
            }else{
                next(null, level);
            }
        });
};

exports.addLevel = function(data, next){
    var query = {id: data.id};
    Level.findOne(query)
        .exec(function(err, level){
            if(err){
                next('4001');
            }else if(level){
                next('4005');
            }else{
                Level.create(data, function(err, newLevel){
                    if(err){
                        next('4003');
                    }else{
                        if(newLevel.relation_method === global.MECHANICS.POINT){
                            var max = newLevel.level_table.length >= 2 ? newLevel.level_table[1].condition : 0
                            var updatePoint = {
                                relation_method: global.MECHANICS.LEVEL,
                                relation_method: newLevel.id,
                                max: max
                            };/*
                            point_controller.updatePointByID(newLevel.relation_object, updatePoint, function(err){
                                if(err){
                                    next(err);
                                }else{
                                    next(null);
                                }
                            });*/
                            next(null);
                        }else{
                            next(null);
                        }
                    }
                });
            }
        });
};

exports.updateLevelByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Level.update(query, data)
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

exports.deleteLevelByID = function(id, next){
    var query = {id: id};

    Level.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};

/**
 *
 * @param maxLevel
 * @param maxValue
 * @param difficulty
 * @param next
 */
exports.generateConditions = function(maxLevel, maxValue, difficulty, next){
    var level_table = [];
    for(var i = 0; i < maxLevel; i++){
        //TODO insert codes for generating conditions according to difficulty
        var condition =
            Math.round((maxValue / (maxLevel-1)) * i);
        var level_entity = {
            level: i+1,
            condition: condition
        };
        level_table.push(level_entity);
    }
    next(null, level_table);
}