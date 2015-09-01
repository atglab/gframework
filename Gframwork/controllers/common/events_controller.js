/**
 * [GFServer] eventHandler.js
 * 
 * Module for internal event handlers
 * 
 * @author JungHyun
 * @version 0.4
 */

var EventEmitter = require('events').EventEmitter;

var widgets_controller = require('./widgets_controller');

var mission_controller = require(global.rootPath + '/controllers/missions/mission_controller.js');

var reward_controller = require(global.rootPath + '/controllers/rewards/reward_controller.js');
var interReward_controller = require(global.rootPath + '/controllers/rewards/interReward_controller.js');

var rewardLog_controller = require(global.rootPath + '/controllers/users/rewardLog_controller.js');
var activityLog_controller = require(global.rootPath + '/controllers/users/activityLog_controller.js');

var eventHandler = new EventEmitter();

/************************************* 
 * set event listeners
 *************************************/

eventHandler.on(global.EVENTS.OCCURRED_ACTIVITY, activityLog_controller.addActivityLog);
eventHandler.on(global.EVENTS.RECEIVED_REWARD, rewardLog_controller.addRewardLog);

eventHandler.on(global.EVENTS.MISSION_START, mission_controller.executeMission);

eventHandler.on(global.EVENTS.DO_REWARD, reward_controller.executeReward);

eventHandler.on(global.EVENTS.DO_INTER_REWARD, interReward_controller.doInterRewards);

/**
 * W1) Widget Event - Send a Message to leaderboard widgets
 */ 
eventHandler.on(global.EVENTS.SEND_TO_LEADERBOARD, widgets_controller.sendToLeaderBoard);
eventHandler.on(global.EVENTS.SEND_TO_RECENTBOARD, widgets_controller.sendToRecentBoard);

exports.handler = eventHandler;