/**
 * [GFServer] rules.js
 * 
 * Module used to handle rules API route
 * 
 * @author JungHyun
 * @version 0.4
 */
var rule_controller = require(global.rootPath + '/controllers/missions/rule_controller.js')
  , logger = require(global.rootPath + '/helpers/logger');

/** ======================================================== *
 *  REST APIs
 *  ======================================================== */
exports.findAll = function(req, res, next){
	rule_controller.findAll(function(err, rules){
		if(err){
			logger.log('error', 'rules.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:rules});
			res.end();
		}
		next();
	});
};

exports.findByID = function(req, res, next){
	rule_controller.findByID(req.params.id, function(err, rule){
		if(err){
			logger.log('error', 'rules.js', global.errorcode[err]);
			res.status(500).json({success: false,
				error:{code: err, message: global.errorcode[err]}});
		}else{
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({success: true, data:rule});
			res.end();
		}
		next();
	});
};