/**
 * [GFServer] permissions.js
 * 
 * Module used to handle permissions API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var permission_controller = require(global.rootPath + '/controllers/rewards/permission_controller.js')
  , logger = require(global.rootPath + '/helpers/logger');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	permission_controller.findAll(function(err, permissions){
		if(err){
			logger.log('error', 'permissions.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:permissions});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	permission_controller.findByID(req.params.id, function(err, permission){
		if(err){
			logger.log('error', 'permissions.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:permission});
			res.end();
		}
		next();
	});
};

exports.addPermission = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	permission_controller.addPermission(jsonObj, function(err){
		if(err){
			logger.log('error', 'permissions.js', global.errorcode[err]);
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

exports.updatePermissionByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	permission_controller.updatePermissionByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'permissions.js', global.errorcode[err]);
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

exports.deletePermissionByID = function(req, res, next){
	permission_controller.deletePermissionByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'permissions.js', global.errorcode[err]);
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