/**
 * New node file
 */
var socketio = require('socket.io');
var logger = require(global.rootPath + '/helpers/logger');

// create socket server
var socketServer;

var widgetSockets = [];
widgetSockets.leaderboard = [];
widgetSockets.recentboard = [];

exports.init_sockets = function(httpServer){
	socketServer = socketio.listen(httpServer);
	socketServer.sockets.on('connection', function(socket){
		logger.log('info', 'widgets_controller.js', 'a socket client is connected');
		
		// join client sockets to the server socket 
		socket.on('widget_join', function(data){
			
			widgetSockets[data.widgetType].push(socket);
			
			socket.emit('setSocketId', socket.id);
		});
	});
};

exports.sendToLeaderBoard = function(userName, message, next){
	for(var i = 0 ; i < widgetSockets.leaderboard.length; i++){
		logger.log('info', 'widgets_controller.js', 
				'send message to leaderboard widgets: socket ['+ i +']:' + userName + " " + message);
		widgetSockets.leaderboard[i].emit('added', {
			userName: userName,
			message: message
		});
	}
};

exports.sendToRecentBoard = function(userIcon, type, message, rewardIcon, strTime){
	for(var i = 0 ; i < widgetSockets.recentboard.length; i++){
		logger.log('info', 'widgets_controller.js',
			'send message to recentboard widgets: socket ['+ i +']:' + userIcon + " " + type + " " + message);
		widgetSockets.recentboard[i].emit('added', {
			userIcon: userIcon,
			type: type,
			message: message,
			rewardIcon: rewardIcon,
			time: strTime
		});
	}
};