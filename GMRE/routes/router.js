/**
 * [GMRE] router.js
 * 
 * Module for global routes
 * 
 * @author JungHyun
 * @version 0.1
 */
var gmre_controller = require(global.rootPath + '/controllers/gmre_controller.js');

exports.routes = function(app){
	
	/*************************************
	 * routes for [GMRE APIs]
	 *************************************/
	app.post('/api/doAnalyze', gmre_controller.doAnalyze);
	
	/*************************************
	 * routes for invalid requests
	 *************************************/
	//TODO: Add codes for invalid requests 
	/*
	app.all('*', function (req, res, next){
		res.status(400).send(global.errorcode['400']);
		next();
	});
	*/
};


