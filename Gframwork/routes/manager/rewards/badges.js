/**
 * [GFServer] badges.js
 * 
 * Module used to handle badges API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var badge_controller = require(global.rootPath + '/controllers/rewards/badge_controller.js')
  , logger = require(global.rootPath + '/helpers/logger');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	badge_controller.findAll(function(err, badges){
		if(err){
			logger.log('error', 'badges.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:badges});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	badge_controller.findByID(req.params.id, function(err, badge){
		if(err){
			logger.log('error', 'badges.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:badge});
			res.end();
		}
		next();
	});
};

exports.addBadge = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	badge_controller.addBadge(jsonObj, function(err){
		if(err){
			logger.log('error', 'badges.js', global.errorcode[err]);
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

exports.updateBadgeByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	badge_controller.updateBadgeByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'badges.js', global.errorcode[err]);
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

exports.deleteBadgeByID = function(req, res, next){
	badge_controller.deleteBadgeByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'badges.js', global.errorcode[err]);
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