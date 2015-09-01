/**
 * [GFServer] point_controller.js
 *
 * Module used to handle business logic of points
 *
 * @author JungHyun
 * @version 0.4
 */
var logger = require(global.rootPath + '/helpers/logger');
var Point = require(global.rootPath + '/models/rewards/point.js');
var events_controllers = require(global.rootPath + '/controllers/common/events_controller.js');

var moment = require('moment');
/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var pointMap = {};
var pointList = [];
exports.pointMap = pointMap;

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load point mechanics from database to memory
 * Init the member variable - pointMap
 *
 * @param next: callback
 */
exports.initReward = function(next){
    Point.find({})
        .exec(function(err, points){
            if(err){
                next('4002');
            }else{
                pointMap = {};
                for(var i = 0; i< points.length; i++){
                    pointMap[points[i].id] = points[i];
                }
                pointList = points;
                next(null);
            }
        });
};

exports.getPointFromMemory = function(id){
    return pointMap[id];
};

exports.getPointListFromMemory = function(){
    return pointList;
}
/**
 * Function to do point reward by mission completion
 * Add the reward value of mission to user point
 *
 * @param user: user model
 * @param reward_object: point id
 * @param reward_parameter: new point value
 *
 * @return 1) null: normal return, 2) 'unchangedReward': when the point is unchanged
 */
exports.doRewardByMissionCompleted = function(user, reward_object, reward_parameter){

    var userPoint, isNewPoint=true, previousPoint;

    // 1) search the point from user rewards array
    for(var i = 0; i < user.rewards.length; i++){
        if(user.rewards[i].reward_type === global.MECHANICS.POINT
            && user.rewards[i].reward_object === reward_object){
            userPoint = user.rewards[i];
            isNewPoint = false;
            break;
        }
    }

    // 2) When use doesn't have the point, create new point
    if(isNewPoint){
        userPoint = {
            reward_type: global.MECHANICS.POINT,
            reward_object: reward_object,
            reward_status: 0
        };
    }

    // 3) Add point
    previousPoint = userPoint.reward_status;
    userPoint.reward_status += reward_parameter;
    userPoint.lastUpdated_at = Date.now();

    // 4) Check max value of the point
    var point = pointMap[reward_object];
    if( point.max < userPoint.reward_status ){
        user.rewards[i].reward_status = point.max;
    }

    if(isNewPoint){
        user.rewards.push(userPoint);
    }

    if(previousPoint != userPoint.reward_status){

        logger.log('debug','point_controller.js', user.id + ' get '
            + point.name +' ' + reward_parameter + ' ' + userPoint.reward_status );

        events_controllers.handler.emit(global.EVENTS.RECEIVED_REWARD,
            user, global.MECHANICS.POINT, point.id, reward_parameter, userPoint.reward_status,
            function(err){
                if(err){
                    logger.log('error', 'point_controller.js', 'Failed to write the reward log of point');
                }
            }
        );

        var message = user.name + '님이 ' + point.name + ' ' + reward_parameter + '을 획득하였습니다.';

        events_controllers.handler.emit(global.EVENTS.SEND_TO_RECENTBOARD, user.profile,
            global.OTHER_CONSTANTS.REWARD, message, point.icon, moment().unix());

        return null;
    }else{
        return 'unchangedReward';
    }
};

exports.findAll = function(next){
    Point.find({})
        .sort('name')
        .exec(function(err, points){
            if(err){
                next('4002');
            }else{
                next(null, points);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Point.findOne(query)
        .exec(function(err, point){
            if(err){
                next('4001');
            }else{
                next(null, point);
            }
        });
};

exports.addPoint = function(data, next){
    var query = {id: data.id};
    Point.findOne(query)
        .exec(function(err, point){
            if(err){
                next('4001');
            }else if(point){
                next('4005');
            }else{
                Point.create(data, function(err){
                    if(err){
                        next('4003');
                    }else{
                        next(null);
                    }
                });
            }
        });
};

exports.updatePointByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Point.update(query, data)
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

exports.deletePointByID = function(id, next){
    var query = {id: id};

    Point.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};