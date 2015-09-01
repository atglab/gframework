/**
 * [GFServer] missions.js
 * 
 * Module used to handle missions API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js')
  , logger = require(global.rootPath + '/helpers/logger');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	mission_controller.findAll(function(err, missions){
		if(err){
			logger.log('error', 'missions.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:missions});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	mission_controller.findByID(req.params.id, function(err, mission){
		if(err){
			logger.log('error', 'missions.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:mission});
			res.end();
		}
		next();
	});
};

exports.addMission = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	mission_controller.addMission(jsonObj, function(err){
		if(err){
			logger.log('error', 'missions.js', global.errorcode[err]);
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

exports.updateMissionByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	mission_controller.updateMissionByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'missions.js', global.errorcode[err]);
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

exports.deleteMissionByID = function(req, res, next){
	mission_controller.deleteMissionByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'missions.js', global.errorcode[err]);
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