/**
 * [GFServer] activities.js
 * 
 * Module used to handle activities Manager route
 * 
 * @author JungHyun
 * @version 0.4
 */

var async = require('async');

var logger = require(global.rootPath + '/helpers/logger');

var activity_controller = require(global.rootPath + '/controllers/missions/activity_controller.js');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	activity_controller.findAll(function(err, activities){
		if(err){
			logger.log('error', 'activities.js', global.errorcode[err]);
			res.status(500).json({success: false, 
				error:{code: err, message: global.errorcode[err]}});
		}else{				
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:activities});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	activity_controller.findByID(req.params.id, function(err, activity){
		if(err){
			logger.log('error', 'activities.js', global.errorcode[err]);
			res.status(500).json({success: false, 
				error:{code: err, message: global.errorcode[err]}});
		}else{			
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:activity});
			res.end();
		}
		next();
	});
};

exports.addActivity = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	activity_controller.addActivity(jsonObj, function(err){
		if(err){
			logger.log('error', 'activities.js', global.errorcode[err]);
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

exports.updateActivityByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	activity_controller.updateActivityByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'activities.js', global.errorcode[err]);
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

exports.deleteActivityByID = function(req, res, next){
	activity_controller.deleteActivityByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'activities.js', global.errorcode[err]);
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