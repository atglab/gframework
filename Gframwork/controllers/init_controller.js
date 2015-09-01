/**
 * [GFServer] init_controller.js
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

exports.init = function(next){
    async.waterfall([
        function(callback){
            db.connect(callback);
        },
        function(callback){
            db.initRepositoryDB(callback);
        },
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
            logger.log('err','init_controller.js', err);
            next(err);
        }else{
            logger.log('info','init_controller.js','Succeed to init application.');
            next(null);
        }
    });
};

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



