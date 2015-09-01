/**
 * [GFServer] init.js
 *
 * Module used to initialize controllers
 *
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');

var logger = require(global.rootPath + '/helpers/logger');

// create connection pool for mongoDB, just do it once when server has created
var db = require(global.rootPath + '/controllers/common/db.js');

var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');
var reward_controller = require(global.rootPath + '/controllers/rewards/reward_controller.js');
var activity_controller = require(global.rootPath + '/controllers/missions/activity_controller.js');

var user_controller = require(global.rootPath + '/controllers/users/user_controller.js');

/**
 * API to restart game mechanic engine
 *
 * @param req
 * @param res
 * @param next
 */
exports.restart = function(req, res, next){
    async.waterfall([
            function(callback){
                activity_controller.initActivities(function(err){
                    if(err){
                        logger.log('err','init_controller.js', 'Failed to init activity_controller');
                        callback(err);
                    }else{
                        logger.log('info','init_controller.js', 'Succeed to init activity_controller');
                        callback(null);
                    }
                });
            },
            function(callback){
                mission_controller.initMissionHandlers(function(err){
                    if(err){
                        logger.log('err','init_controller.js', 'Failed to init mission_controller');
                        callback(err);
                    }else{
                        logger.log('info','init_controller.js', 'Succeed to init mission_controller');
                        callback(null);
                    }
                });
            },
            function(callback){
                reward_controller.initRewards(function(err){
                    if(err){
                        logger.log('err','init_controller.js', 'Failed to init reward_controller');
                        callback(err);
                    }else{
                        logger.log('info','init_controller.js', 'Succeed to init reward_controller');
                        callback(null);
                    }
                });
            }],
        function(err){
            if(err){
                logger.log('err','init_controller.js','Failed to init application.');
                res.status(500).json({
                    success: false,
                    error: {code: '500', message: global.errorcode['500']}
                });
            }else{
                logger.log('info','init_controller.js','Succeed to init application.');
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({success:true});
                res.end();

            }
            next();
        });
};

/**
 * API to init user data
 *
 * @param req query type(boolean): delete = delete all, init = init all
 * @param res
 * @param next
 */
exports.resetUserData = function(req, res, next){

    var type = req.query.type;

    if(type === 'all'){
        user_controller.deleteAllUser(function(err){
            if(err){
                logger.log('err','init.js','Failed to remove all user data.');
                res.status(500).json({
                    success: false,
                    error: {code: err, message: global.errorcode[err]}
                });
            }else{
                logger.log('info','init.js','Succeed to remove all user data.');
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({success:true});
                res.end();

            }
            next();
        });
    }else if(type === 'init'){
        user_controller.initAllUser(function(err){
            if(err){
                logger.log('err','init.js','Failed to init all user data.');
                res.status(500).json({
                    success: false,
                    error: {code: err, message: global.errorcode[err]}
                });
            }else{
                logger.log('info','init.js','Succeed to init all user data');
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({success:true});
                res.end();
            }
            next();
        });
    }
};

/**
 * API to load repository data of the input set id
 *
 * @param req
 * @param res
 * @param next
 */
exports.loadRepositorySet = function(req, res, next){
    var setId = req.params.id;

    db.loadRepositorySet(setId, function(err){
        if(err){
            logger.log('err','init.js','Failed to load repository data.');
            res.status(500).json({
                success: false,
                error: {code: err, message: global.errorcode[err]}
            });
        }else{
            logger.log('info','init.js','Succeed to load repository data');
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({success:true});
            res.end();
        }
        next();
    });
};



