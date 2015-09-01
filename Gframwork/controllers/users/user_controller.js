/**
 * [GFServer] user_controller.js
 *
 * Module used to handle business logic of users
 *
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');
var User = require(global.rootPath + '/models/users/user.js');

exports.getUserNumber = function(next){
    User.find({}).count().exec(function(err, users){
        if(err){
            next('4009');
        }else{
            next(null, users);
        }
    });
};

exports.findAll = function(next){
    User.find({})
        .sort('name')
        .exec(function(err, users){
            if(err){
                next('4002');
            }else{
                next(null, users);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    User.findOne(query)
        .exec(function(err, user){
            if(err){
                next('4001');
            }else{
                next(null, user);
            }
        });
};

exports.addUser = function(data, next){
    var query = {id: data.id};
    User.findOne(query)
        .exec(function(err, user){
            if(err){
                next('4001');
            }else if(user){
                next('4005');
            }else{
                data.created_at = Date.now();
                data.updated_at = Date.now();

                User.create(data, function(err){
                    if(err){
                        next('4003');
                    }else{
                        next(null);
                    }
                });
            }
        });
};

exports.addUsers = function(data, next){
    User.remove({}, function(err){
        if(err){
            next('4011');
        }else{
            User.create(data, function(err){
                if(err){
                    next('4012');
                }else{
                    next(null);
                }
            });
        }
    });
};

exports.updateUserByID = function(id, data, next){
    var query = {id: id};
    data.updated_at = Date.now();

    User.update(query, data)
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

exports.deleteUserByID = function(id, next){
    var query = {id: id};

    User.remove(query)
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};

exports.deleteAllUser = function(next){
    User.remove({})
        .exec(function(err){
            if(err){
                next('4007');
            }else{
                next(null);
            }
        });
};

exports.initAllUser = function(next){
    User.find({})
        .exec(function(err, users){
            if(err){
                next('4002');
            }else{
                async.each(users, function(user, callback){
                    user.rewards = [];
                    user.missions = [];
                    user.updated_at = Date.now();
                    user.save(function(err){
                        if(err){
                            callback('4006');
                        }else{
                            callback(null);
                        }
                    });
                }, function(err){
                    if(err){
                        next(err);
                    }else{
                        next(null);
                    }
                });
            }
        });
};

/**
 * Function to return aggregate results for input reward_type
 *
 * @param reward_type
 * @param next
 */
exports.getRewardStatistics = function(reward_type, next){

    User.aggregate([
        { $unwind: '$rewards'},
        { $match: {'rewards.reward_type': reward_type}},
        { $group:{
            '_id': '$rewards.reward_object',
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

/**
 * Function to return aggregate results for sum of input reward_type
 *
 * @param reward_type
 * @param next
 */
exports.getRewardStatisticsSum = function(reward_type, next){

    User.aggregate([
        { $unwind: '$rewards'},
        { $match: {'rewards.reward_type': reward_type}},
        { $group:{
            '_id': '$rewards.reward_object',
            'sum': { $sum: '$rewards.reward_status' }}
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

/**
 *
 * @param query
 * @param group
 * @param next
 */
exports.getRewardStatisticsByRange = function(query, group, next){
    User.aggregate([
        { $unwind: '$rewards'},
        { $match: query},
        { $group:{
            '_id': group ,
            'count': { $sum: 1 }}
        },
        { $sort: { _id: 1}}
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
    User.aggregate([
        { $unwind: '$rewards'},
        { $match: query},
        { $group:{
            '_id': group,
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

/**
 * Function to return aggregate results for missions
 *
 * @param query
 * @param group
 * @param next
 */
exports.getMissionStatistics = function(query, group, next){

    User.aggregate([
        { $unwind: '$missions'},
        { $match: query},
        { $group: group },
        { $sort: {_id : 1}}
    ],function (err, result){
        if(err){
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
exports.getMissionStatisticsByPeriod = function(query, group, next){
    User.aggregate([
        { $unwind: '$missions'},
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
 * @param project
 * @param next
 */
exports.getMissions = function(query, project, next){
    User.aggregate([
        { $unwind: '$missions'},
        { $match: query},
        { $project: project }
    ],function (err, result){
        if(err){
            next('4008');
        }else{
            //console.log(result);
            next(null, result);
        }
    });
}

/**
 *
 * @param query
 * @param group
 * @param next
 */
exports.getAllUserStatistics = function(query, group, next){
    User.aggregate([
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
 * Function to get rank data for leaderboard
 * @param reward_type
 * @param reward_object
 * @param next
 */
exports.getUserRewardRank = function(reward_type, reward_object, next){
    var query = {
        'rewards.reward_type' : reward_type,
        'rewards.reward_object' : reward_object};
    User.aggregate([
        { $unwind: '$rewards'},
        { $match: query},
        { $project: {_id:0, name:1, profile:1, 'rewards.reward_status':1 }},
        { $sort: {'rewards.reward_status' : -1}}
    ],function (err, result){
        if(err){
            next('4008');
        }else{
            //console.log(result);
            next(null, result);
        }
    });
};