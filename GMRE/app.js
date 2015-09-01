/**
 * [GMRE] app.js
 * 
 * Module used to launch GMRE Server. 
 * It is based on the express module.
 * 
 * @author JungHyun
 * @version 0.1
 */
var express = require('express')
  , http = require('http')
  , bodyParser = require('body-parser')
  , util = require('util');

//set global variables
global.rootPath = process.cwd();
global.config = require(global.rootPath + '/config/config');
global.errorcode = require(global.rootPath + '/config/errorcode');

//set development mode
process.env.NODE_ENV = 
	( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) 
	? 'production' : 'development';

var logger = require(global.rootPath + '/utils/logger');

// all environments
var app = express();
app.set('port', process.env.PORT || global.config.app.port);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
	logger.log('info', 'app.js', 'Request: ' + req.method + ' ' + req.url + ' ');
	next();
});

//set routes
require(global.rootPath + '/routes/router.js').routes(app);

/*
app.use(function(req, res, next){
	logger.log('info', "app.js", 'Request is completed');
	next();
});*/

//create connection pool for mongoDB, just do it once when server has created
//require(global.rootPath + '/database/db.js').connect();

//create http server
var httpServer = http.createServer(app).listen(app.get('port'), function(){
	logger.log('info','app.js','Express server listening on port ' + app.get('port'));
});
