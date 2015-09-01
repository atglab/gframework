/**
 * [GFServer] status_controller.js
 *
 * Module used to handle business logic of statuses
 *
 * @author JungHyun
 * @version 0.4
 */
var logger = require(global.rootPath + '/helpers/logger');
var Status = require(global.rootPath + '/models/rewards/status.js');
var RepoStatus = require(global.rootPath + '/models/rewards/repostatus.js');
var moment = require('moment');
var events_controllers = require(global.rootPath + '/controllers/common/events_controller.js');
var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js')
/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var statusMap = {};
var statusList = {};
exports.statusMap = statusMap;

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load status mechanics from database to memory
 * Init the member variable - statusMap
 *
 * @param next: callback
 */
exports.initReward = function(interRewards, generateInterReward, next){
    Status.find({})
        .exec(function(err, statuses){
            if(err){
                next('4002');
            }else{
                statusMap = {};
                for(var i = 0; i< statuses.length; i++){
                    statusMap[statuses[i].id] = statuses[i];
                }
                statusList = statuses;
                generateInterReward(interRewards, statuses, global.MECHANICS.STATUS);

                next(null);
            }
        });
};

exports.getStatusFromMemory = function(id){
    return statusMap[id];
};

exports.getStatusListFromMemory = function(){
    return statusList;
}
/**
 * Function to do status reward by mission completion
 * Set user status to new reward value of mission
 *
 * @param user: user model
 * @param reward_object: status id
 * @param reward_parameter: new status value
 * @param next: callback
 *
 * @return 1) null: normal return, 2) 'unchangedReward': when the status is unchanged
 */
exports.doRewardByMissionCompleted = function(user, reward_object, reward_parameter){
    var userStatus, isNewStatus = true, previousStatus;

    // 1) search the status from user rewards array
    for(var i = 0; i < user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.STATUS
            && user.rewards[i].reward_object === reward_object){
            userStatus = user.rewards[i];
            isNewStatus = false;
            break;
        }
    }

    // 2) When use doesn't have the status, create new status
    if(isNewStatus){
        userStatus = {
            reward_type: global.MECHANICS.STATUS,
            reward_object: reward_object,
            reward_status: 1
        };
    }

    var status = statusMap[reward_object];

    // 3) Set status
    previousStatus = userStatus.reward_status;
    userStatus.reward_status = reward_parameter;
    userStatus.lastUpdated_at = Date.now();

    if(isNewStatus){
        user.rewards.push(isNewStatus);
    }

    if(previousStatus != userStatus.reward_status){
        logger.log('debug','status_controller.js', user.id + ' get '
            + status.name + ' rank ' + reward_parameter + ' ' + userStatus.reward_status );

        events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
            user, global.MECHANICS.STATUS, status.id, reward_parameter, userStatus.reward_status,
            function(err){
                if(err){
                    logger.log('error', 'status_controller.js', 'Failed to write the reward log of status');
                }
            }
        );
        for(var i=0; i< status.classes.length; i++){
            if(status.classes[i].rank === userStatus.reward_status){
                var message = user.name + '님이 ' + status.name + ' ' + status.classes[i].name + '을 달성하였습니다.';

                events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                    global.OTHER_CONSTANTS.REWARD, message, status.classes[i].icon, moment().unix());

                break;
            }
        }
        return null;
    }else{
        return 'unchangedReward';
    }
};


/**
 * Function to up status by level up
 *
 * @param user: user model
 * @param levelId: level id
 * @param statusId: status id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when status is changed.
 */
exports.statusUpByUpLevel = function(user, levelId, statusId){

    var status = statusMap[statusId];
    var userLevel, levelStatus, userStatus, currentStatus, isNewStatus = true, isChanged = false;

    if(!status || status.relation_method != global.MECHANICS.LEVEL ||
        levelId != status.relation_object){
        logger.log('debug', 'status_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the status reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.STATUS
            && user.rewards[i].reward_object === status.id){
            userStatus = user.rewards[i];
            isNewStatus = false;
            break;
        }
    }

    // 2) When use doesn't have the reward status, generate new status reward
    if(isNewStatus){
        userStatus = {
            reward_type: global.MECHANICS.STATUS,
            reward_object: status.id,
            reward_status: 1,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user status is max
    if(currentStatus === status.classes.length){
        logger.log('debug', 'status_controller.js', 'User status is max');

        return null;
    }

    // 4) find current level value of the input level from user rewards
    for(var i = 0; i < user.rewards.length; i++) {
        if (user.rewards[i].reward_type === global.MECHANICS.LEVEL
            && user.rewards[i].reward_object === levelId) {
            userLevel = user.rewards[i];
            break;
        }
    }

    //5) Up status when the status up condition is satisfied
    if(userLevel){
        levelStatus = userLevel.reward_status;

        for(var j = 0; j < status.classes.length; j++){
            if( status.classes[j].rank === currentStatus + 1){

                // 6) check whether status up condition is satisfied
                if( levelStatus >= status.classes[j].condition){

                    userStatus.reward_status = status.classes[j].rank;
                    userStatus.lastUpdated_at = Date.now();
                    currentStatus++;
                    isChanged = true;

                    logger.log('debug', 'status_controller.js', user.id + " up " + status.name + ' ' + status.classes[j].name + ' ' );

                    events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                        user, global.MECHANICS.STATUS, status.id, currentStatus, userStatus.reward_status,
                        function(err){
                            if(err){
                                logger.log('error', 'status_controller.js', 'Failed to write the reward log of status');
                            }
                        }
                    );

                    var message = user.name + '님이 ' + status.name + ' ' + status.classes[j].name + '을 달성하였습니다.';

                    events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                        global.OTHER_CONSTANTS.REWARD, message, status.classes[j].icon, moment().unix());

                }else{
                    break;
                }
            }
        }
    }

    if(isNewStatus){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_STATUS,
            event_object: status.id
        };

        return reward;
    }else{

        return null;
    }
};

/**
 * Function to up status by adding point
 *
 * @param user: user model
 * @param pointId: point id
 * @param statusId: status id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when status is changed.
 */
exports.statusUpByAddPoint = function(user, pointId, statusId){

    var status = statusMap[statusId];
    var userPoint, pointStatus, userStatus, currentStatus, isNewStatus = true, isChanged = false;

    if(!status || status.relation_method != global.MECHANICS.POINT ||
        pointId != status.relation_object){
        logger.log('debug', 'status_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the status reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.STATUS
            && user.rewards[i].reward_object === status.id){
            userStatus = user.rewards[i];
            isNewStatus = false;
            break;
        }
    }

    // 2) When use doesn't have the reward status, generate new status reward
    if(isNewStatus){
        userStatus = {
            reward_type: global.MECHANICS.STATUS,
            reward_object: status.id,
            reward_status: 1,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user status is max
    if(currentStatus === status.classes.length){
        logger.log('debug', 'status_controller.js', 'User status is max');

        return null;
    }

    // 4) find current point value of the input point from user rewards
    for(var i = 0; i < user.rewards.length; i++) {
        if (user.rewards[i].reward_type === global.MECHANICS.POINT
            && user.rewards[i].reward_object === pointId) {
            userPoint = user.rewards[i];
            break;
        }
    }

    //5) Up status when the status up condition is satisfied
    if(userPoint){
        pointStatus = userPoint.reward_status;

        for(var j = 0; j < status.classes.length; j++){
            if( status.classes[j].rank === currentStatus + 1){

                // 6) check whether status up condition is satisfied
                if( pointStatus >= status.classes[j].condition){

                    userStatus.reward_status = status.classes[j].rank;
                    userStatus.lastUpdated_at = Date.now();
                    currentStatus++;
                    isChanged = true;

                    logger.log('debug', 'status_controller.js', user.id + " up " + status.name + ' ' + status.classes[j].name + ' ' );

                    events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                        user, global.MECHANICS.STATUS, status.id, currentStatus, userStatus.reward_status,
                        function(err){
                            if(err){
                                logger.log('error', 'status_controller.js', 'Failed to write the reward log of status');
                            }
                        }
                    );

                    var message = user.name + '님이 ' + status.name + ' ' + status.classes[j].name + '을 달성하였습니다.';

                    events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                        global.OTHER_CONSTANTS.REWARD, message, status.classes[j].icon, moment().unix());

                }else{
                    break;
                }
            }
        }
    }

    if(isNewStatus){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_STATUS,
            event_object: status.id
        };

        return reward;
    }else{

        return null;
    }
};

/**
 * Function to up status by number of mission completion
 *
 * @param user: user model
 * @param mc: "NUM_MISSION_COMPLETION"
 * @param statusId: status id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when status is changed.
 */
exports.statusUpByNumMC = function(user, mc, statusId){

    var status = statusMap[statusId];
    var userMission, missionStatus, userStatus, currentStatus, isNewStatus = true, isChanged = false;

    if(!status || status.relation_method != global.MECHANICS.MISSION ||
        mc != status.relation_object){
        logger.log('debug', 'status_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the status reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.STATUS
            && user.rewards[i].reward_object === status.id){
            userStatus = user.rewards[i];
            isNewStatus = false;
            break;
        }
    }

    // 2) When use doesn't have the reward status, generate new status reward
    if(isNewStatus){
        userStatus = {
            reward_type: global.MECHANICS.STATUS,
            reward_object: status.id,
            reward_status: 1,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user status is max
    if(currentStatus === status.classes.length){
        logger.log('debug', 'status_controller.js', 'User status is max');

        return null;
    }

    // 4) find current point value of the input point from user rewards
    for(var i = 0; i < user.rewards.length; i++) {
        if (user.rewards[i].reward_type === global.MECHANICS.MISSION
            && user.rewards[i].reward_object === mc) {
            userMission = user.rewards[i];
            break;
        }
    }

    //5) Up status when the status up condition is satisfied
    if(userMission){
        missionStatus = userMission.reward_status;

        for(var j = 0; j < status.classes.length; j++){
            if( status.classes[j].rank === currentStatus + 1){

                // 6) check whether status up condition is satisfied
                if( missionStatus >= status.classes[j].condition){

                    userStatus.reward_status = status.classes[j].rank;
                    userStatus.lastUpdated_at = Date.now();
                    currentStatus++;
                    isChanged = true;

                    logger.log('debug', 'status_controller.js', user.id + " up " + status.name + ' ' + status.classes[j].name + ' ' );

                    events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                        user, global.MECHANICS.STATUS, status.id, currentStatus, userStatus.reward_status,
                        function(err){
                            if(err){
                                logger.log('error', 'status_controller.js', 'Failed to write the reward log of status');
                            }
                        }
                    );

                    var message = user.name + '님이 ' + status.name + ' ' + status.classes[j].name + '을 달성하였습니다.';

                    events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                        global.OTHER_CONSTANTS.REWARD, message, status.classes[j].icon, moment().unix());

                }else{
                    break;
                }
            }
        }
    }

    if(isNewStatus){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_STATUS,
            event_object: status.id
        };

        return reward;
    }else{

        return null;
    }
};

exports.findAll = function(next){
    Status.find({})
        .sort('name')
        .exec(function(err, statuses){
            if(err){
                next('4002');
            }else{
                next(null, statuses);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Status.findOne(query)
        .exec(function(err, status){
            if(err){
                next('4001');
            }else{
                next(null, status);
            }
        });
};

exports.addStatus = function(data, next){
    var query = {id: data.id};
    Status.findOne(query)
        .exec(function(err, status){
            if(err){
                next('4001');
            }else if(status){
                next('4005');
            }else{
                Status.create(data, function(err, newStatus){
                    if(err){
                        next('4003');
                    }else{
                        if(newStatus.relation_method === global.MECHANICS.POINT){

                            var updatePoint = {
                                relation_method: global.MECHANICS.STATUS,
                                relation_method: newStatus.id
                            };
                            /*
                            point_controller.updatePointByID(newStatus.relation_object, updatePoint, function(err){
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

exports.updateStatusByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Status.update(query, data)
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

exports.deleteStatusByID = function(id, next){
    var query = {id: id};

    Status.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};

exports.findStatusClasses = function(next){
    RepoStatus.find({})
        .sort('name')
        .exec(function(err, statuses){
            if(err){
                next('4002');
            }else{
                next(null, statuses);
            }
        });
}

exports.findRepoStatusByID = function(id, next){
    var query = {id: id};
    RepoStatus.findOne(query)
        .exec(function(err, status){
            if(err){
                next('4001');
            }else{
                next(null, status);
            }
        });
}

/**
 *
 * @param id
 * @param maxValue
 * @param difficulty
 * @param next
 */
exports.generateConditions = function(id, maxValue, difficulty, next){
    this.findRepoStatusByID(id, function(err, status){
        if(err){
            next(err);
        }else if(!status){
            next('4004');
        }else{
            var numClasses = status.classes.length;

            for(var i = 0; i < numClasses; i++){
                //TODO insert codes for generating conditions according to difficulty
                status.classes[i].condition =
                    Math.round((maxValue / (numClasses-1)) * i);
            }

            next(null, status.classes);
        }
    });
}