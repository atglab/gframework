/**
 * [GFServer] mission_controller.js
 *
 * Module used to handle business logic of missions
 *
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');
var moment = require('moment');

var logger = require(global.rootPath + '/helpers/logger');

var Mission = require(global.rootPath + '/models/missions/mission.js');
var rule_mapper = require(global.rootPath + '/controllers/missions/rule_mapper.js');

/**
 * a map to manage mission information with respect to the activity
 *
 * Key: activity id
 * value: array of mission model
 */
var missionMap = {};
/**
 * key: mission id
 * value : mission model
 */
var missionList = {};

/**
 * Function to init missionMap and missionList variable
 *
 * @param next: callback
 */
exports.initMissionHandlers = function(next){
    Mission.find({})
        .sort('activityId')
        .exec(function(err, missions){
            if(err){
                next('4002');
            }else{
                missionMap = {};
                missionList ={};
                for(var i = 0; i< missions.length; i++){
                    if(!missionMap[missions[i].activityId]){
                        missionMap[missions[i].activityId] = [];
                    }
                    missionMap[missions[i].activityId].push(missions[i]);

                    missionList[missions[i].id] = missions[i];
                }

                next(null);
            }
        });
};

exports.getMissionFromMemory = function(id){
    return missionList[id];
};

exports.getMissionsFromMemory = function(id){
    return missionList;
}

/**
 * Function to process missions related the input activity
 *
 * @param user: user model
 * @param activityId: activity id
 * @param next: callback
 * @errors 1)expiredMission, 2)inValidActivity, 3)others
 */
exports.executeMission = function(user, activityId, next){

    var eventHandler = require(global.rootPath + '/controllers/common/events_controller.js');
    var relatedMissions = missionMap[activityId];
    if(!relatedMissions){
        logger.log('debug','mission_controller.js','Related Mission does not exist.');
        next(null);
        return;
    }
    async.concatSeries(relatedMissions,
    function(mission, callback){

        async.waterfall([
        function(innerCb){
            var isNewMission = true;

            // 1) check expiration of mission
            if(mission.useExpiration){
                if( moment().isBefore(mission.start_date)
                    || moment().isAfter(mission.end_date)){
                    innerCb('expiredMission');
                    return;
                }
            }

            // 2) find userMission from user
            var userMission;
            for(var i in user.missions){
                if(mission.id === user.missions[i].missionId){
                    userMission = user.missions[i];
                    isNewMission = false;
                    break;
                }
            }
            if(isNewMission){
                userMission = {
                    missionId : mission.id,
                    currentStatus : 0,
                    completeCount : 0,
                    lastCompleted_at : null,
                    lastUpdated_at : null
                };
            }

            // 3) check activity constraint of mission
            var isValidActivity = true;
            var isInit = false;
            if(mission.useConstraint){
                if(userMission.lastUpdated_at === null){
                    isValidActivity = true;
                }else{
                    switch(mission.constraint_period){
                        case 1:	// today
                            if(moment().isSame(userMission.lastUpdated_at,'day')){
                                isValidActivity = false;
                            }
                            if(mission.isContinuous &&
                                !moment().subtract(1,'days').isBefore(userMission.lastUpdated_at,'day')){
                                isInit = true;
                            }
                            break;
                        case 2: // this week
                            if(moment().isSame(userMission.lastUpdated_at,'week')){
                                isValidActivity = false;
                            }
                            if(mission.isContinuous &&
                                !moment().subtract(1,'weeks').isBefore(userMission.lastUpdated_at,'week')){
                                isInit = true;
                            }
                            break;
                        case 3: // this month
                            if(moment().isSame(userMission.lastUpdated_at,'month')){
                                isValidActivity = false;
                            }
                            if(mission.isContinuous &&
                                !moment().subtract(1,'months').isBefore(userMission.lastUpdated_at,'month')){
                                isInit = true;
                            }
                            break;
                        case 4: // this year
                            if(moment().isSame(userMission.lastUpdated_at,'year')){
                                isValidActivity = false;
                            }
                            if(mission.isContinuous &&
                                !moment().subtract(1,'years').isBefore(userMission.lastUpdated_at,'year')){
                                isInit = true;
                            }
                            break;
                    }
                }
            }

            // 4) check repeat condition of mission completion
            if(mission.isRepeatable){
                switch(mission.repeat_period){
                    case 0: // none
                        break;
                    case 1:	// today
                        if(moment().isSame(userMission.lastCompleted_at,'day')){
                            isValidActivity = false;
                        }
                        break;
                    case 2: // this week
                        if(moment().isSame(userMission.lastCompleted_at,'week')){
                            isValidActivity = false;
                        }
                        break;
                    case 3: // this month
                        if(moment().isSame(userMission.lastCompleted_at,'month')){
                            isValidActivity = false;
                        }
                        break;
                    case 4: // this year
                        if(moment().isSame(userMission.lastCompleted_at,'year')){
                            isValidActivity = false;
                        }
                        break;
                }
            }

            // Initialize currentStatus of userMission
            if(isInit){
                userMission.currentStatus = 0;
            }

            if(!isValidActivity){
                innerCb('inValidActivity');
                return;
            }else{
                // 5) excute rule of mission
                if(userMission.currentStatus < mission.exit_condition){
                    var errValue= rule_mapper.map[mission.ruleId](userMission);
                    if(errValue){
                        next(errValue);
                        return;
                    }
                    userMission.lastUpdated_at = Date.now();
                }

                var doReward = false;
                if(userMission.currentStatus >= mission.exit_condition){
                    if(mission.isRepeatable){
                        if(mission.max_repeat_count === 0
                            || userMission.completeCount < mission.max_repeat_count){
                            userMission.completeCount++;
                            userMission.currentStatus = 0;
                            userMission.lastCompleted_at = Date.now();
                            doReward = true;
                        }
                    }else{
                        if(userMission.completeCount === 0){
                            userMission.completeCount++;
                            userMission.lastCompleted_at = Date.now();
                            doReward = true;
                        }
                    }
                }
                if(isNewMission){
                    user.missions.push(userMission);
                }

                innerCb(null, user, doReward);
                return;
            }
        },
        function(user, doReward, innerCb){
            if(doReward){
                var message = user.name + '님이 ' + mission.name + '을 완료하였습니다.';

                eventHandler.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
                    global.OTHER_CONSTANTS.MISSION, message, null, moment().unix());

                eventHandler.handler.emit(global.EVENTS.DO_REWARD,
                    user, mission.id, mission.reward_type, mission.reward_object, mission.reward_parameter,
                    function(err){
                        if(err){
                            innerCb(err, user);
                        }else{
                            innerCb(null, user);
                        }
                    });
            }else{
                innerCb(null, user);
            }
        }],
        function(err, user){
            if(err){
                if(err === 'expiredMission'){
                    logger.log('debug','mission_controller.js','Mission is Expired.');
                    callback(null); return;
                }else if(err === 'inValidActivity'){
                    logger.log('debug','mission_controller.js','Activity is invalid to update mission status.');
                    callback(null); return;
                }else if(err === 'unchangedReward'){
                    logger.log('debug','mission_controller.js','User reward is unchanged.');
                    //callback(null);
                }else{
                    logger.log('err','mission_controller.js', err);
                    callback(err); return;
                }
            }
            user.save(function(err2){
                if(err2){
                    logger.log('err','mission_controller.js', err2);
                    callback(err2);
                }else{
                    logger.log('info','mission_controller.js','Succeed to execute mission ' + mission.id + ". User data is saved.");
                    callback(null);
                }
            });
        });
    },
    function(err){
        if(err){
            next(err);
        }else{
            next(null);
        }
    });
};

exports.findAll = function(next){
    Mission.find({})
        .sort('name')
        .exec(function(err, missions){
            if(err){
                next('4002');
            }else{
                next(null, missions);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Mission.findOne(query)
        .exec(function(err, mission){
            if(err){
                next('4001');
            }else{
                next(null, mission);
            }
        });
};

exports.addMission = function(data, next){
    var query = {id: data.id};
    Mission.findOne(query)
        .exec(function(err, mission){
            if(err){
                next('4001');
            }else if(mission){
                next('4005');
            }else{
                Mission.create(data, function(err){
                    if(err){
                        next('4003');
                    }else{
                        next(null);
                    }
                });
            }
        });
};

exports.updateMissionByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Mission.update(query, data)
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

exports.deleteMissionByID = function(id, next){
    var query = {id: id};

    Mission.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};