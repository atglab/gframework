/**
 * [GFServer] levels.js
 * 
 * Module used to handle levels API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');
var logger = require(global.rootPath + '/helpers/logger');

var level_controller = require(global.rootPath + '/controllers/rewards/level_controller.js');
var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js');
var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	level_controller.findAll(function(err, levels){
		if(err){
			logger.log('error', 'levels.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:levels});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	level_controller.findByID(req.params.id, function(err, level){
		if(err){
			logger.log('error', 'levels.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:level});
			res.end();
		}
		next();
	});
};

exports.addLevel = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	level_controller.addLevel(jsonObj, function(err){
		if(err){
			logger.log('error', 'levels.js', global.errorcode[err]);
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

exports.updateLevelByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	level_controller.updateLevelByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'levels.js', global.errorcode[err]);
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

exports.deleteLevelByID = function(req, res, next){
	level_controller.deleteLevelByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'levels.js', global.errorcode[err]);
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
 * API Function to generate a level table with condition
 *
 * @param req: Request Query Parameters
 *          1) maxLevel: max level
 *          2) difficulty: 1, 2, 3, 4, 5
 *          3) rtype: related reward type (point, mission)
 *          4) rid: related reward id
 * @param res
 * @param next
 */
exports.generateConditions = function(req, res, next){
	var maxLevel = req.query.maxLevel;
	var difficulty = req.query.difficulty;
	var rtype = req.query.rtype;
	var rid = req.query.rid;

	if(!maxLevel || !difficulty || !rtype || !rid){
		logger.log('error', 'levels.js', global.errorcode['400']);
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
				level_controller.generateConditions(maxLevel, maxValue, difficulty, function(err, level_table){
					if(err){
						callback(err);
					}else{
						callback(null, level_table);
					}
				})
			}
		],function(err, level_table){
			if(err){
				logger.log('error', 'levels.js', global.errorcode[err]);
				res.status(500).json({success: false,
					error:{code: err, message: global.errorcode[err]}});
			}else{
				res.setHeader('Content-Type', 'application/json');
				res.status(200).json({success: true, data:level_table});
				res.end();
			}
			next();
		});
	}
}
