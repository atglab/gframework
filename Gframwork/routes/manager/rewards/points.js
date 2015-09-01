/**
 * [GFServer] points.js
 * 
 * Module used to handle points API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var point_controller = require(global.rootPath + '/controllers/rewards/point_controller.js')
  , logger = require(global.rootPath + '/helpers/logger');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	point_controller.findAll(function(err, points){
		if(err){
			logger.log('error', 'points.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:points});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	point_controller.findByID(req.params.id, function(err, point){
		if(err){
			logger.log('error', 'points.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:point});
			res.end();
		}
		next();
	});
};

exports.addPoint = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	point_controller.addPoint(jsonObj, function(err){
		if(err){
			logger.log('error', 'points.js', global.errorcode[err]);
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

exports.updatePointByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	point_controller.updatePointByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'points.js', global.errorcode[err]);
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

exports.deletePointByID = function(req, res, next){
	point_controller.deletePointByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'points.js', global.errorcode[err]);
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