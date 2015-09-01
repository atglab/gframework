/**
 * [GFServer] logger.js
 * 
 * Module used to write log
 * 
 * @author JungHyun
 * @version 0.2
 */
var winston = require('winston');
var moment = require('moment');
var logger;

if(process.env.NODE_ENV == 'production'){
	logger = new (winston.Logger)({
		transports: [
	       new (winston.transports.Console)({ level: 'info' , timestamp: myTimeStamp, colorize: true}),
	       new (winston.transports.File)({ filename: 'resources/logs/info.log' })
		],
		exceptionHandlers: [
	       new (winston.transports.Console)({ timestamp: myTimeStamp, colorize: true, json: false}),
	       new winston.transports.File({ filename: 'resources/logs/exceptions.log' , timestamp: myTimeStamp})
	    ],
	    exitOnError: false
	});
	
	log('info', 'logger.js', 'Production Mode');
	
}else if(process.env.NODE_ENV == 'development'){
	logger = new (winston.Logger)({
	    transports: [
	       new (winston.transports.Console)({ level: 'debug' , timestamp: myTimeStamp, colorize: true}),
	  	   new (winston.transports.File)({ filename: 'resources/logs/debug.log' })
	  	],
	  	exceptionHandlers: [
	       new (winston.transports.Console)({ timestamp: myTimeStamp, colorize: true, json: false}),
	       new winston.transports.File({ filename: 'resources/logs/exceptions.log' , timestamp: myTimeStamp})
	    ],
	    exitOnError: false
	});
		
	log('info', 'logger.js', 'Development Mode');
}

function log(level, moduleName, msg){
	logger.log(level, '%s', msg, {module: moduleName});
}

function myTimeStamp(){
	return moment().format();
}

exports.log = log;

