/**
 * [GFServer] users.js
 * 
 * Module used to handle users API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var user_controller = require(global.rootPath + '/controllers/users/user_controller.js')
  , logger = require(global.rootPath + '/helpers/logger');

var moment = require('moment');
var Busboy = require('busboy');
var commonUtil = require(global.rootPath +'/helpers/common.js');
var fs = require('fs');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	user_controller.findAll(function(err, users){
		if(err){
			logger.log('error', 'users.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:users});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	user_controller.findByID(req.params.id, function(err, user){
		if(err){
			logger.log('error', 'users.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:user});
			res.end();
		}
		next();
	});
};

exports.addUser = function(req, res, next){
	
	//console.log(req.body.data);
	
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	user_controller.addUser(jsonObj, function(err){
		if(err){
			logger.log('error', 'users.js', global.errorcode[err]);
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

exports.updateUserByID = function(req, res, next){
	var jsonObj = JSON.parse(req.body.data);
	//var jsonObj = req.body.data;

	user_controller.updateUserByID(req.params.id, jsonObj, function(err){
		if(err){
			logger.log('error', 'users.js', global.errorcode[err]);
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

exports.deleteUserByID = function(req, res, next){
	user_controller.deleteUserByID(req.params.id, function(err){
		if(err){
			logger.log('error', 'users.js', global.errorcode[err]);
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

/**
 * Function to upload new user profile
 * @param req
 * @param res
 * @param next
 */
exports.uploadProfile = function(req, res, next){

	var uid = req.params.id;

	var fstream;
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		logger.log('debug','users.js', 'Uploading: ' + filename);

		var extStr = commonUtil.getExtFromFilename(filename);
		var rename = 'up_' + uid + '_' + moment().unix() + extStr;

		var savePath = global.rootPath + "/public/resources/images/user/" + rename;
		var returnPath = "/resources/images/user/" + rename;
		fstream = fs.createWriteStream(savePath);
		file.pipe(fstream);
		fstream.on('close', function (err) {
			if(err){
				logger.log('error', 'users.js', err);
				res.status(500).json({success: false,
					error:{code: 4010, message: global.errorcode['4010']}});
				next(null);
			}else{
				logger.log('info','users.js', 'Upload Finished of ' + savePath);

				res.status(200).json({success:true, data: returnPath});
				res.end();
				next(null);
			}
		});
	});
	req.pipe(busboy);
};

/**
 * Function to upload user data list (JSON)
 * @param req
 * @param res
 * @param next
 */
exports.uploadListJsonFile = function(req, res, next){

	var fstream;
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		logger.log('debug','users.js', 'Uploading: ' + filename);

		var extStr = commonUtil.getExtFromFilename(filename);
		//TODO check file ext string

		var rename = 'userList' + extStr;
		var savePath = global.rootPath + "/resources/uploads/" + rename;

		fstream = fs.createWriteStream(savePath);
		file.pipe(fstream);
		fstream.on('close', function (err) {
			if(err){
				logger.log('error', 'users.js', err);
				res.status(500).json({success: false,
					error:{code: 4010, message: global.errorcode['4010']}});
				next(null);
			}else{

				//var userList = require(global.rootPath + '/resources/uploads/' + rename);
				fs.readFile(global.rootPath + '/resources/uploads/' + rename, 'utf8',
				function(err, data){
					if(err){
						logger.log('error', 'users.js', global.errorcode['4013']);
						res.status(500).json({success: false,
							error:{code: 4013, message: global.errorcode['4013']}});
						next(null);
						return;
					}else{
						var userList = JSON.parse(data);

						if(!userList){
							logger.log('error', 'users.js', global.errorcode['4013']);
							res.status(500).json({success: false,
								error:{code: 4013, message: global.errorcode['4013']}});
							next(null);
							return;
						}

						user_controller.addUsers(userList,function(err){
							if(err){
								logger.log('error', 'users.js', global.errorcode[err]);
								res.status(500).json({success: false,
									error:{code: err, message: global.errorcode[err]}});
								next(null);
								return;
							}else{
								logger.log('info','users.js', 'Upload Finished of ' + savePath);
								res.status(200).json({success:true});
								res.end();
								next(null);
							}
						});
					}
				});
			}
		});
	});
	req.pipe(busboy);
};

/**
 * API Function to return the boolean status
 * to represent whether the user has the permission or not
 *
 * @param req query parameters
 * 			1) uid userId
 * 			2) pid permissionId
 * @param res true or false
 * @param next
 */
exports.hasPermission = function(req, res, next){

	if(!req.query.uid || !req.query.pid){
		logger.log('error', 'users.js', global.errorcode['400']);
		res.status(400).json({success: false,
			error:{code: 400, message: global.errorcode['400']}});
		return;
	}

	user_controller.findByID(req.query.uid, function(err, user){
		if(err){
			logger.log('error', 'users.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			if(user){
				var status = 0;
				for(var i = 0; i < user.rewards.length; i++){
					if( user.rewards[i].reward_type === global.MECHANICS.PERMISSION &&
						user.rewards[i].reward_object === req.query.pid){
						status = user.rewards[i].reward_status;
					}
				}
				res.setHeader('Content-Type', 'application/json');
				res.status(200).json({success: true, data: status === 0 ? false : true});
				res.end();
			}else{
				logger.log('error', 'users.js', global.errorcode['4004']);
				res.status(4004).json({success: false,
					error:{code: 4004, message: global.errorcode['4004']}});
			}
		}
		next();
	});

};