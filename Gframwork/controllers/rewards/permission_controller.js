/**
 * [GFServer] permission_controller.js
 *
 * Module used to handle business logic of permissions
 *
 * @author JungHyun
 * @version 0.4
 */
var logger = require(global.rootPath + '/helpers/logger');
var Permission = require(global.rootPath + '/models/rewards/permission.js');
var events_controllers = require(global.rootPath + '/controllers/common/events_controller.js');
var moment = require('moment');
/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var permissionMap = {};
exports.permissionMap = permissionMap;

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load permission mechanics from database to memory
 * Init the member variable - permissionMap
 *
 * @param next: callback
 */
exports.initReward = function(interRewards, generateInterReward, next){

    Permission.find({})
        .exec(function(err, permissions){
            if(err){
                next('4002');
            }else{
                permissionMap = {};
                for(var i = 0; i< permissions.length; i++){
                    permissionMap[permissions[i].id] = permissions[i];
                }
                generateInterReward(interRewards, permissions, global.MECHANICS.PERMISSION);
                next(null);
            }
        });
};

exports.getPermissionFromMemory = function(id){
    return permissionMap[id];
};

/**
 * Function to do permission reward by mission completion
 * give the new permission to user or remove the permission from user
 *
 * @param user: user model
 * @param reward_object: permission id
 * @param reward_parameter: 1-give permission, 2-remove permission
 * @param next: callback
 */
exports.doRewardByMissionCompleted = function(user, reward_object, reward_parameter){

    var userPermission, isNewPermission=true, previousPermission;

    // 1) search the permission from user rewards array
    for(var i = 0; i < user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.PERMISSION
            && user.rewards[i].reward_object === reward_object){
            userPermission = user.rewards[i];
            isNewPermission = false;
            break;
        }
    }

    // 2) When use doesn't have the permission, create new permission
    if(isNewPermission){
        userPermission = {
            reward_type: global.MECHANICS.PERMISSION,
            reward_object: reward_object,
            reward_status: 0
        };
    }

    // 3) change the permission status
    previousPermission = userPermission.reward_status;
    userPermission.reward_status = reward_parameter;
    userPermission.lastUpdated_at = Date.now();

    var permission = permissionMap[reward_object];

    if(isNewPermission){
        user.rewards.push(userPermission);
    }

    if(previousPermission != userPermission.reward_status){

        logger.log('debug','permission_controller.js', user.id + ' get '
            + permission.name +' ' + reward_parameter + ' ' + userPermission.reward_status == 1 ? 'Get' : 'Lost');

        events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
            user, global.MECHANICS.PERMISSION, permission.id, reward_parameter, userPermission.reward_status,
            function(err){
                if(err){
                    logger.log('error', 'permission_controller.js', 'Failed to write the reward log of permission');
                }
            }
        );

        var message = user.name + '님이 ' + permission.name + '을 획득하였습니다.';

        events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
            global.OTHER_CONSTANTS.REWARD, message, null, moment().unix());

        return null;
    }else{
        return 'unchangedReward';
    }
};

/**
 * Function to get permission by adding point
 *
 * @param user: user model
 * @param pointId: point id
 * @param permissionId: permission id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when permission is received.
 */
exports.permissionGetByAddPoint = function(user, pointId, permissionId){
    var getParameter = 1;
    var permission = permissionMap[permissionId];
    var userPoint, pointStatus, userStatus, currentStatus, isNew = true, isChanged = false;

    if(!permission || permission.relation_method != global.MECHANICS.POINT ||
        pointId != permission.relation_object){
        logger.log('debug', 'permission_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the permission reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.PERMISSION
            && user.rewards[i].reward_object === permission.id){
            userStatus = user.rewards[i];
            isNew = false;
            break;
        }
    }

    // 2) When use doesn't have the reward permission, generate new permission reward
    if(isNew){
        userStatus = {
            reward_type: global.MECHANICS.PERMISSION,
            reward_object: permission.id,
            reward_status: 0,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user already has the permission
    if(currentStatus === getParameter){
        logger.log('debug', 'permission_controller.js', 'User already has the permission. ' + permission.id);

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

        // 6) check whether status up condition is satisfied
        if( pointStatus >= permission.get_parameter){

            userStatus.reward_status = getParameter;
            userStatus.lastUpdated_at = Date.now();
            isChanged = true;

            logger.log('debug', 'permission_controller.js', user.id + " get " + permission.name );

            events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                user, global.MECHANICS.PERMISSION, permission.id, getParameter, userStatus.reward_status,
                function(err){
                    if(err){
                        logger.log('error', 'permission_controller.js', 'Failed to write the reward log of permission');
                    }
                }
            );

            var message = user.name + '님이 ' + permission.name + '을 획득하였습니다.';

            events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                global.OTHER_CONSTANTS.REWARD, message, null, moment().unix());
        }
    }

    if(isNew){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_PERMISSION,
            event_object: permission.id
        };

        return reward;
    }else{

        return null;
    }
};

/**
 * Function to get permission by level up
 *
 * @param user: user model
 * @param levelId: level id
 * @param permissionId: permission id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when permission is received.
 */
exports.permissionGetByUpLevel = function(user, levelId, permissionId){
    var getParameter = 1;
    var permission = permissionMap[permissionId];
    var userLevel, levelStatus, userStatus, currentStatus, isNew = true, isChanged = false;

    if(!permission || permission.relation_method != global.MECHANICS.LEVEL ||
        permissionId != permission.relation_object){
        logger.log('debug', 'permission_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the permission reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.PERMISSION
            && user.rewards[i].reward_object === permission.id){
            userStatus = user.rewards[i];
            isNew = false;
            break;
        }
    }

    // 2) When use doesn't have the reward permission, generate new permission reward
    if(isNew){
        userStatus = {
            reward_type: global.MECHANICS.PERMISSION,
            reward_object: permission.id,
            reward_status: 0,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user already has the permission
    if(currentStatus === getParameter){
        logger.log('debug', 'permission_controller.js', 'User already has the permission. ' + permission.id);

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

        // 6) check whether status up condition is satisfied
        if( levelStatus >= permission.get_parameter){

            userStatus.reward_status = getParameter;
            userStatus.lastUpdated_at = Date.now();
            isChanged = true;

            logger.log('debug', 'permission_controller.js', user.id + " get " + permission.name );

            events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                user, global.MECHANICS.PERMISSION, permission.id, getParameter, userStatus.reward_status,
                function(err){
                    if(err){
                        logger.log('error', 'permission_controller.js', 'Failed to write the reward log of permission');
                    }
                }
            );

            var message = user.name + '님이 ' + permission.name + '을 획득하였습니다.';

            events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                global.OTHER_CONSTANTS.REWARD, message, null, moment().unix());
        }
    }

    if(isNew){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_PERMISSION,
            event_object: permission.id
        };

        return reward;
    }else{

        return null;
    }
};

/**
 * Function to get permission by status up
 *
 * @param user: user model
 * @param statusId: status id
 * @param permissionId: permission id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when permission is received.
 */
exports.permissionGetByUpStatus = function(user, statusId, permissionId){
    var getParameter = 1;
    var permission = permissionMap[permissionId];
    var statusReward, rewardStatus, userStatus, currentStatus, isNew = true, isChanged = false;

    if(!permission || permission.relation_method != global.MECHANICS.STATUS ||
        permissionId != permission.relation_object){
        logger.log('debug', 'permission_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the permission reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.PERMISSION
            && user.rewards[i].reward_object === permission.id){
            userStatus = user.rewards[i];
            isNew = false;
            break;
        }
    }

    // 2) When use doesn't have the reward permission, generate new permission reward
    if(isNew){
        userStatus = {
            reward_type: global.MECHANICS.PERMISSION,
            reward_object: permission.id,
            reward_status: 0,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user already has the permission
    if(currentStatus === getParameter){
        logger.log('debug', 'permission_controller.js', 'User already has the permission. ' + permission.id);

        return null;
    }

    // 4) find current status value of the input status from user rewards
    for(var i = 0; i < user.rewards.length; i++) {
        if (user.rewards[i].reward_type === global.MECHANICS.STATUS
            && user.rewards[i].reward_object === statusId) {
            statusReward = user.rewards[i];
            break;
        }
    }

    //5) Up status when the status up condition is satisfied
    if(statusReward){
        rewardStatus = statusReward.reward_status;

        // 6) check whether status up condition is satisfied
        if( rewardStatus >= permission.get_parameter){

            userStatus.reward_status = getParameter;
            userStatus.lastUpdated_at = Date.now();
            isChanged = true;

            logger.log('debug', 'permission_controller.js', user.id + " get " + permission.name );

            events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                user, global.MECHANICS.PERMISSION, permission.id, getParameter, userStatus.reward_status,
                function(err){
                    if(err){
                        logger.log('error', 'permission_controller.js', 'Failed to write the reward log of permission');
                    }
                }
            );

            var message = user.name + '님이 ' + permission.name + '을 획득하였습니다.';

            events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                global.OTHER_CONSTANTS.REWARD, message, null, moment().unix());
        }
    }

    if(isNew){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_PERMISSION,
            event_object: permission.id
        };

        return reward;
    }else{

        return null;
    }
};

/**
 * Function to get permission by adding point
 *
 * @param user: user model
 * @param mc: "NUM_MISSION_COMPLETION"
 * @param permissionId: permission id
 * @param next: callback
 *
 * @return 1) null: when reward is none, 2) reward = {event_name, event_object}: when permission is received.
 */
exports.permissionGetByNumMC = function(user, mc, permissionId){
    var getParameter = 1;
    var permission = permissionMap[permissionId];
    var userMission, missionStatus, userStatus, currentStatus, isNew = true, isChanged = false;

    if(!permission || permission.relation_method != global.MECHANICS.MISSION ||
        mc != permission.relation_object){
        logger.log('debug', 'permission_controller.js', 'Reward configuration is wrong.');

        return null;
    }

    // 1) search the permission reward from user rewards array
    for(var i = 0; i<user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.PERMISSION
            && user.rewards[i].reward_object === permission.id){
            userStatus = user.rewards[i];
            isNew = false;
            break;
        }
    }

    // 2) When use doesn't have the reward permission, generate new permission reward
    if(isNew){
        userStatus = {
            reward_type: global.MECHANICS.PERMISSION,
            reward_object: permission.id,
            reward_status: 0,
            lastUpdated_at: Date.now()
        }
    }

    currentStatus = userStatus.reward_status;

    // 3) check whether user already has the permission
    if(currentStatus === getParameter){
        logger.log('debug', 'permission_controller.js', 'User already has the permission. ' + permission.id);

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

        // 6) check whether status up condition is satisfied
        if( missionStatus >= permission.get_parameter){

            userStatus.reward_status = getParameter;
            userStatus.lastUpdated_at = Date.now();
            isChanged = true;

            logger.log('debug', 'permission_controller.js', user.id + " get " + permission.name );

            events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
                user, global.MECHANICS.PERMISSION, permission.id, getParameter, userStatus.reward_status,
                function(err){
                    if(err){
                        logger.log('error', 'permission_controller.js', 'Failed to write the reward log of permission');
                    }
                }
            );

            var message = user.name + '님이 ' + permission.name + '을 획득하였습니다.';

            events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                global.OTHER_CONSTANTS.REWARD, message, null, moment().unix());
        }
    }

    if(isNew){
        user.rewards.push(userStatus);
    }

    if(isChanged){
        var reward = {
            event_name: global.REWARD_EVENTS.GET_PERMISSION,
            event_object: permission.id
        };

        return reward;
    }else{

        return null;
    }
};

exports.findAll = function(next){
    Permission.find({})
        .sort('name')
        .exec(function(err, permissions){
            if(err){
                next('4002');
            }else{
                next(null, permissions);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Permission.findOne(query)
        .exec(function(err, permission){
            if(err){
                next('4001');
            }else{
                next(null, permission);
            }
        });
};

exports.addPermission = function(data, next){
    var query = {id: data.id};
    Permission.findOne(query)
        .exec(function(err, permission){
            if(err){
                next('4001');
            }else if(permission){
                next('4005');
            }else{
                Permission.create(data, function(err){
                    if(err){
                        next('4003');
                    }else{
                        next(null);
                    }
                });
            }
        });
};

exports.updatePermissionByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Permission.update(query, data)
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

exports.deletePermissionByID = function(id, next){
    var query = {id: id};

    Permission.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};