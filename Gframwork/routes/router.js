/**
 * [GFServer] router.js
 * 
 * Module for global routes
 * 
 * @author JungHyun
 * @version 0.2
 */

// Routes for Manager APIs
var activities = require(global.rootPath + '/routes/manager/missions/activities.js');
var missions = require(global.rootPath + '/routes/manager/missions/missions.js');
var rules = require(global.rootPath + '/routes/manager/missions/rules.js');

var badges = require(global.rootPath + '/routes/manager/rewards/badges.js');
var points = require(global.rootPath + '/routes/manager/rewards/points.js');
var statuses = require(global.rootPath + '/routes/manager/rewards/statuses.js');
var levels = require(global.rootPath + '/routes/manager/rewards/levels.js');
var permissions = require(global.rootPath + '/routes/manager/rewards/permissions.js');

var users = require(global.rootPath + '/routes/manager/users/users.js');

var init = require(global.rootPath + '/routes/manager/init.js');

// Routes for Analyzer APIs
var activityStatistics = require(global.rootPath + '/routes/analyzer/missions/activityStatistics.js');
var badgeStatistics = require(global.rootPath + '/routes/analyzer/rewards/badgeStatistics.js');
var pointStatistics = require(global.rootPath + '/routes/analyzer/rewards/pointStatistics.js');
var levelStatistics = require(global.rootPath + '/routes/analyzer/rewards/levelStatistics.js');
var statusStatistics = require(global.rootPath + '/routes/analyzer/rewards/statusStatistics.js');
var permissionStatistics = require(global.rootPath + '/routes/analyzer/rewards/permissionStatistics.js');
var missionStatistics = require(global.rootPath + '/routes/analyzer/missions/missionStatistics.js');
var userStatistics = require(global.rootPath + '/routes/analyzer/users/userStatistics.js');

// Routes for API Tools
var api_activities = require(global.rootPath + '/routes/apis/api_activities.js');
var api_widgets = require(global.rootPath + '/routes/apis/api_widgets.js');

var auth = require(global.rootPath + '/routes/auth.js');

var express = require('express');
var router = express.Router();

/*************************************
 * Login API
 *************************************/
router.post('/login', auth.login);
router.get('/getpubkey', auth.getPubKey);
router.post('/api/v1/changeadmin', auth.changePassword);

/*************************************
 * Manager-1) routes for [Activity APIs]
 *************************************/

// REST API
router.get('/api/v1/manager/missions/activities', activities.findAll);
router.get('/api/v1/manager/missions/activities/:id', activities.findByID);
router.post('/api/v1/manager/missions/activities', activities.addActivity);
router.put('/api/v1/manager/missions/activities/:id', activities.updateActivityByID);
router.delete('/api/v1/manager/missions/activities/:id', activities.deleteActivityByID);

/*************************************
 * Manager-2) routes for [Mission APIs]
 *************************************/

router.get('/api/v1/manager/missions/missions', missions.findAll);
router.get('/api/v1/manager/missions/missions/:id', missions.findByID);
router.post('/api/v1/manager/missions/missions', missions.addMission);
router.put('/api/v1/manager/missions/missions/:id', missions.updateMissionByID);
router.delete('/api/v1/manager/missions/missions/:id', missions.deleteMissionByID);

/*************************************
 * Manager-3) routes for [Rule APIs]
 *************************************/
router.get('/api/v1/manager/missions/rules', rules.findAll);
router.get('/api/v1/manager/missions/rules/:id', rules.findByID);

/*************************************
 * Manager-4) routes for [Badge APIs]
 *************************************/
// REST API

router.get('/api/v1/manager/rewards/badges', badges.findAll);
router.get('/api/v1/manager/rewards/badges/:id', badges.findByID);
router.post('/api/v1/manager/rewards/badges', badges.addBadge);
router.put('/api/v1/manager/rewards/badges/:id', badges.updateBadgeByID);
router.delete('/api/v1/manager/rewards/badges/:id', badges.deleteBadgeByID);

/*************************************
 * Manager-5) routes for [Point APIs]
 *************************************/
// REST API

router.get('/api/v1/manager/rewards/points', points.findAll);
router.get('/api/v1/manager/rewards/points/:id', points.findByID);
router.post('/api/v1/manager/rewards/points', points.addPoint);
router.put('/api/v1/manager/rewards/points/:id', points.updatePointByID);
router.delete('/api/v1/manager/rewards/points/:id', points.deletePointByID);

/*************************************
 * Manager-6) routes for [Status APIs]
 *************************************/
// API for StatusClasses
router.get('/api/v1/manager/rewards/statusclasses', statuses.findStatusClasses);
router.get('/api/v1/manager/rewards/statusconditions', statuses.generateConditions);

// REST API
router.get('/api/v1/manager/rewards/statuses', statuses.findAll);
router.get('/api/v1/manager/rewards/statuses/:id', statuses.findByID);
router.post('/api/v1/manager/rewards/statuses', statuses.addStatus);
router.put('/api/v1/manager/rewards/statuses/:id', statuses.updateStatusByID);
router.delete('/api/v1/manager/rewards/statuses/:id', statuses.deleteStatusByID);

/*************************************
 * Manager-7) routes for [Level APIs]
 *************************************/
router.get('/api/v1/manager/rewards/leveltable', levels.generateConditions);

// REST API
router.get('/api/v1/manager/rewards/levels', levels.findAll);
router.get('/api/v1/manager/rewards/levels/:id', levels.findByID);
router.post('/api/v1/manager/rewards/levels', levels.addLevel);
router.put('/api/v1/manager/rewards/levels/:id', levels.updateLevelByID);
router.delete('/api/v1/manager/rewards/levels/:id', levels.deleteLevelByID);

/*************************************
 * Manager-8) routes for [Permission APIs]
 *************************************/
// REST API
router.get('/api/v1/manager/rewards/permissions', permissions.findAll);
router.get('/api/v1/manager/rewards/permissions/:id', permissions.findByID);
router.post('/api/v1/manager/rewards/permissions', permissions.addPermission);
router.put('/api/v1/manager/rewards/permissions/:id', permissions.updatePermissionByID);
router.delete('/api/v1/manager/rewards/permissions/:id', permissions.deletePermissionByID);

/*************************************
 * Manager-9) routes for [User APIs]
 *************************************/
// REST API
router.get('/api/v1/manager/users/users', users.findAll);
router.get('/api/v1/manager/users/users/:id', users.findByID);
router.post('/api/v1/manager/users/users', users.addUser);
router.put('/api/v1/manager/users/users/:id', users.updateUserByID);
router.delete('/api/v1/manager/users/users/:id', users.deleteUserByID);
// Upload profile API
router.post('/api/v1/manager/users/userprofile/:id', users.uploadProfile);
// Upload user data file API
router.post('/api/v1/manager/users/list', users.uploadListJsonFile);

/*************************************
 * Manager-10) routes for [Init APIs]
 *************************************/
router.get('/api/v1/manager/init/restart', init.restart);
router.get('/api/v1/manager/init/reset', init.resetUserData);
router.get('/api/v1/manager/init/load/:id', init.loadRepositorySet);

/*************************************
 * Analyzer-1) routes for [Activities APIs]
 *************************************/
router.get('/api/v1/analyzer/activities', activityStatistics.getStatisticsAllActivity);
router.get('/api/v1/analyzer/activities/:id', activityStatistics.getStaticsActivity);
router.get('/api/v1/analyzer/activitiesbyperiod', activityStatistics.getStatisticsByPeriod);

/*************************************
 * Analyzer-2) routes for [Badges APIs]
 *************************************/
router.get('/api/v1/analyzer/badges', badgeStatistics.getStatisticsAllBadges);
router.get('/api/v1/analyzer/badges/:id', badgeStatistics.getStatisticsBadge);
router.get('/api/v1/analyzer/badgesbyperiod', badgeStatistics.getStatisticsBadgesByPeriod);

/*************************************
 * Analyzer-3) routes for [Points APIs]
 *************************************/
router.get('/api/v1/analyzer/points', pointStatistics.getStatisticsAllPoints);
router.get('/api/v1/analyzer/points/:id', pointStatistics.getStatisticsPoint);
router.get('/api/v1/analyzer/pointsbyperiod', pointStatistics.getStatisticsPointsByPeriod);

/*************************************
 * Analyzer-4) routes for [Levels APIs]
 *************************************/
router.get('/api/v1/analyzer/levels', levelStatistics.getStatisticsAllLevels);
router.get('/api/v1/analyzer/levels/:id', levelStatistics.getStatisticsLevel);
router.get('/api/v1/analyzer/levelsbyperiod', levelStatistics.getStatisticsLevelsByPeriod);

/*************************************
 * Analyzer-5) routes for [Statuses APIs]
 *************************************/
router.get('/api/v1/analyzer/statuses', statusStatistics.getStatisticsAllStatuses);
router.get('/api/v1/analyzer/statuses/:id', statusStatistics.getStatisticsStatus);
router.get('/api/v1/analyzer/statusesbyperiod', statusStatistics.getStatisticsStatusesByPeriod);

/*************************************
 * Analyzer-6) routes for [Permissions APIs]
 *************************************/
router.get('/api/v1/analyzer/permissions', permissionStatistics.getStatisticsAllPermissions);
router.get('/api/v1/analyzer/permissions/:id', permissionStatistics.getStatisticsPermission);
router.get('/api/v1/analyzer/permissionsbyperiod', permissionStatistics.getStatisticsPermissionByPeriod);

/*************************************
 * Analyzer-7) routes for [Missions APIs]
 *************************************/
router.get('/api/v1/analyzer/missions', missionStatistics.getStatisticsAllMissions);
router.get('/api/v1/analyzer/missionscompletion/:id', missionStatistics.getStatisticsMissionCompletion);
router.get('/api/v1/analyzer/missionsstatus/:id', missionStatistics.getStatisticsMissionStatus);
router.get('/api/v1/analyzer/missionsbyperiod', missionStatistics.getStatisticsMissionByPeriod);

/*************************************
 * Analyzer-8) routes for [Users APIs]
 *************************************/
router.get('/api/v1/analyzer/users', userStatistics.getStatisticsAllUsers);
router.get('/api/v1/analyzer/users/:id', userStatistics.getStatisticsUser);
router.get('/api/v1/analyzer/usersbyperiod', userStatistics.getStatisticsAllUsersByPeriod);

/*************************************
 * API-1) routes for [API Tools Activities APIs]
 *************************************/
router.get('/api/activities/do', api_activities.onActivity);

/*************************************
 * API-2) routes for [API Tools Users APIs]
 *************************************/
router.post('/api/users', users.addUser);
router.put('/api/users/:id', users.updateUserByID);
router.get('/api/users/:id', users.findByID);
router.delete('/api/users/:id', users.deleteUserByID);
router.get('/api/userpermission', users.hasPermission);


/*************************************
 * API-3) routes for [Widget APIs]
 *************************************/
router.get('/api/rewardrank', api_widgets.getLeaderboardData);
router.get('/api/rewardlist', api_widgets.getRewardList);
router.get('/api/userprofile', api_widgets.getUserProfile);

// If no route is matched by now, it must be a 404
/*
router.use(function(req, res, next) {
    logger.log('error', 'app.js', err);
    res.status(404).json({success: false,
        error:{code: '404', message: global.errorcode['404']}});
    next(null);
});
*/

module.exports = router;
