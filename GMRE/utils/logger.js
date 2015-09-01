/**
 * [GMRE] logger.js
 * 
 * Module used to write log
 * 
 * @author JungHyun
 * @version 0.1
 */
var winston = require('winston');

var logger;

if(process.env.NODE_ENV == 'production'){
	logger = new (winston.Logger)({
		transports: [
	       new (winston.transports.Console)({ level: 'info' , timestamp: true, colorize: true}),
	       new (winston.transports.File)({ filename: 'logs/info.log' })
		],
		exceptionHandlers: [
	       new (winston.transports.Console)({ timestamp: true, colorize: true, json: false}),
	       new winston.transports.File({ filename: 'logs/exceptions.log' , timestamp: true})
	    ],
	    exitOnError: false
	});
	
	log('info', 'logger.js', 'Production Mode');
	
}else if(process.env.NODE_ENV == 'development'){
	logger = new (winston.Logger)({
	    transports: [
	       new (winston.transports.Console)({ level: 'debug' , timestamp: true, colorize: true}),
	  	   new (winston.transports.File)({ filename: 'logs/debug.log' })
	  	],
	  	exceptionHandlers: [
	       new (winston.transports.Console)({ timestamp: true, colorize: true, json: false}),
	       new winston.transports.File({ filename: 'logs/exceptions.log' , timestamp: true})
	    ],
	    exitOnError: false
	});
		
	log('info', 'logger.js', 'Development Mode');
}

function log(level, moduleName, msg){
	logger.log(level, '[%s] %s', moduleName, msg, {module: moduleName});
}

exports.log = log;

