/**
 * [GMRE] db.js
 * 
 * Module used to connect database
 * 
 * @author JungHyun
 * @version 0.1
 */
var mongoose = require('mongoose')
  , util = require('util')
  , async = require('async')
  , logger = require(global.rootPath + '/utils/logger');

var dbURI = global.config.database.uri;

exports.connect = function(){
	
	mongoose.connect(dbURI);
	
	mongoose.connection.on('connected', function(){
		logger.log('info', 'db.js',"Succeed to get connection pool in mongoose, dbURI is '" + dbURI +  "'");
	});
	
	mongoose.connection.on('error', function(err){
		logger.log('error', 'db.js',"Failed to get connection pool in mongoose, err is '" + err +  "'");
	});
	
	mongoose.connection.on('disconnected', function(){
		logger.log('info', 'db.js','Database connection has disconnected.');
	});
	
	// If the node.js process is going down, close database connection pool
	process.on('SIGINT', function(){
		mongoose.connection.close(function(){
			logger.log('info', 'db.js','Application process is going down, disconnect database connection...');
			process.exit(0);
		});
	});
};