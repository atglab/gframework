/**
 * [GFServer] statuses.js
 * 
 * Module used to handle statuses API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');
var logger = require(global.rootPath + '/helpers/logger');

var status_controller = require(global.rootPath + '/controllers/rewards/status_controller.js');
var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js');
var level_controller = require(global.rootPath + '/controllers/rewards/level_controller.js');
var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	status_controller.findAll(function(err, statuses){
		if(err){
			logger.log('error', 'statuses.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:statuses});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	status_controller.findByID(req.params.id, function(err, status){
		if(err){
			logger.log('error', 'statuses.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:status});
			res.end();
		}
		next();
	});
};

exports.addStatus = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	status_controller.addStatus(jsonObj, function(err){
		if(err){
			logger.log('error', 'statuses.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success:true});
			res.end();
		}
		next();
	});
};

exports.updateStatusByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	status_controller.updateStatusByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'statuses.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success:true});
			res.end();
		}
		next();
	});
};

exports.deleteStatusByID = function(req, res, next){
	status_controller.deleteStatusByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'statuses.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success:true});
			res.end();
		}
		next();
	});
};

/** ======================================================== *
 *  Other APIs
 *  ======================================================== */
/**
 * Function to give repository's status
 * @param req
 * @param res
 * @param next
 */
exports.findStatusClasses = function(req, res, next){
	status_controller.findStatusClasses(function(err, statuses){
		if(err){
			logger.log('error', 'statuses.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:statuses});
			res.end();
		}
		next();
	});
};

/**
 * API FUnction to generate a status classes with condition
 *
 * @param req: Request Query Parameters
 *          1) id: reposStatus id
 *          2) difficulty: 1, 2, 3, 4, 5
 *          3) rtype: related reward type (point, level, mission)
 *          4) rid: related reward id
 * @param res
 * @param next
 */
exports.generateConditions = function(req, res, next){
	var id = req.query.id;
	var difficulty = req.query.difficulty;
	var rtype = req.query.rtype;
	var rid = req.query.rid;

	if(!id || !difficulty || !rtype || !rid){
		logger.log('error', 'statuses.js', global.errorcode['400']);
		res.status(400).json({success: false,
			error:{code: '400', message: global.errorcode['400']}});
		next();
	}else{

        async.waterfall([
        function(callback){
            switch(rtype){
                case global.MECHANICS.POINT:
                    point_controller.findByID(rid, function(err, point){
                        if(err){
                            callback(err);
                        }else{
                            callback(null, point.max);
                        }
                    });
                    break;
                case global.MECHANICS.LEVEL:
                    level_controller.findByID(rid, function(err, level){
                        if(err){
                            callback(err);
                        }else{
                            callback(null, level.max);
                        }
                    });
                    break;
                case global.MECHANICS.MISSION:
                    // get counts of missions
                    mission_controller.findAll(function(err, missions){
                        if(err){
                            callback(err);
                        }else{
                            //TODO revise the max value of number of mission completion
                            var numMission = missions.length;
                            callback(null, numMission * 100);
                        }
                    });
                    break;
                default:
                    callback('invalid type');
            }
        },
        function(maxValue, callback){
            status_controller.generateConditions(id, maxValue, difficulty, function(err, status){
                if(err){
                    callback(err);
                }else{
                    callback(null, status);
                }
            })
        }
        ],function(err, statusClasses){
            if(err){
                logger.log('error', 'statuses.js', global.errorcode[err]);
                res.status(500).json({success: false,
                    error:{code: err, message: global.errorcode[err]}});
            }else{
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({success: true, data:statusClasses});
                res.end();
            }
            next();
        });
	}
}
