/**
 * [GFServer] activity_controller.js
 *
 * Module used to handle business logic of activities
 *
 * @author JungHyun
 * @version 0.4
 */

var Activity = require(global.rootPath + '/models/missions/activity.js');

/** ======================================================== *
 *  Public Member Variables
 *  ======================================================== */
var activityMap = {};

/** ======================================================== *
 *  Public Member Functions
 *  ======================================================== */

/**
 * Function to load activities from database to memory
 * Init the member variable - activityMap
 *
 * @param next: callback
 */
exports.initActivities = function(next){
    Activity.find({})
        .exec(function(err, activities){
            if(err){
                next('4002');
            }else{
                activityMap = {};
                for(var i = 0; i< activities.length; i++){
                    activityMap[activities[i].id] = activities[i];
                }
                next(null);
            }
        });
};

exports.getActivityFromMemory = function(id){
    return activityMap[id];
};

exports.findAll = function(next){
    Activity.find({})
        .sort('name')
        .exec(function(err, activities){
            if(err){
                next('4002');
            }else{
                next(null, activities);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Activity.findOne(query)
        .exec(function(err, activity){
            if(err){
                next('4001');
            }else{
                next(null, activity);
            }
        });
};

exports.addActivity = function(data, next){
    var query = {id: data.id};
    Activity.findOne(query)
        .exec(function(err, activity){
            if(err){
                next('4001');
            }else if(activity){
                next('4005');
            }else{
                Activity.create(data, function(err){
                    if(err){
                        next('4003');
                    }else{
                        next(null);
                    }
                });
            }
        });
};

exports.updateActivityByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    Activity.update(query, data)
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

exports.deleteActivityByID = function(id, next){
    var query = {id: id};

    Activity.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};