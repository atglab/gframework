/**
 * [GFServer] db.js
 * 
 * Module used to connect database
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose')
  , async = require('async')
  , logger = require(global.rootPath + '/helpers/logger');

exports.connect = function(next){

    var dbURI = global.config.database.uri;
    mongoose.connect(dbURI);

    mongoose.connection.on('connected', function(){
        logger.log('info', 'db.js',"Succeed to get connection pool in mongoose, dbURI is '" + dbURI +  "'");
        next(null);
    });

    mongoose.connection.on('error', function(err){
        logger.log('error', 'db.js',"Failed to get connection pool in mongoose, err is '" + err +  "'");
        process.exit(1);
    });
    mongoose.connection.on('disconnected', function(){
        logger.log('info', 'db.js','Database connection has disconnected.');
        process.exit(1);
    });
    // If the node.js process is going down, close database connection pool
    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            logger.log('info', 'db.js','Application process is going down, disconnect database connection...');
            process.exit(1);
        });
    });
};
exports.initRepositoryDB = function(next){
	var Rule = require(global.rootPath + '/models/missions/rule.js');
	var rules = require(global.rootPath + '/resources/samples/rules.json');

	var RepoStatus = require(global.rootPath + '/models/rewards/repostatus.js');
	var repostatuses = require(global.rootPath + '/resources/samples/repostatuses.json');

	var Admin = require(global.rootPath + '/models/users/admin.js');
	var admin = require(global.rootPath + '/resources/samples/admin.json');

	async.waterfall([
			function(callback){ saveSampleData(Rule, rules, callback); },
			function(callback){ saveSampleData(RepoStatus, repostatuses, callback); },
			function(callback){
				var query = {username: admin.username};
				Admin.findOne(query)
					.exec(function(err, user){
						if(err){
							callback(err);
						}else if(user){
							callback(null);
						}else{
							admin.created_at = Date.now();
							admin.updated_at = Date.now();

							Admin.create(admin, function(err){
								if(err){
									callback(err);
								}else{
									callback(null);
								}
							});
						}
					});
			}
		],
		function(err){
			if(err){
				logger.log('error','db.js','Failed to save sample data');
				next(err);
			}else{
				logger.log('info','db.js','Succeed to save sample data');
				next(null);
			}
		});
};

function saveSampleData(CollectionModel, data, callback){
	CollectionModel.remove({},function(err){
		if(err){ callback(err); }					
		CollectionModel.create(data,function(err){ if(err){ callback(err); } callback(null); });
	});
}

/**
 * load repository data of the input setId
 * @param setId
 * @param next
 */
exports.loadRepositorySet = function(setId, next){

	//TODO insert validation code for setId value

	var Activity = require(global.rootPath + '/models/missions/activity.js');
	var activities = require(global.rootPath + '/resources/repository/Set' + setId+ '/activities.json');

	var Mission = require(global.rootPath + '/models/missions/mission.js');
	var missions = require(global.rootPath + '/resources/repository/Set' + setId+ '/missions.json');

	var Badge = require(global.rootPath + '/models/rewards/badge.js');
	var badges = require(global.rootPath + '/resources/repository/Set' + setId+ '/badges.json');

	var Point = require(global.rootPath + '/models/rewards/point.js');
	var points = require(global.rootPath + '/resources/repository/Set' + setId+ '/points.json');

	var Status = require(global.rootPath + '/models/rewards/status.js');
	var statuses = require(global.rootPath + '/resources/repository/Set' + setId+ '/statuses.json');

	var Level = require(global.rootPath + '/models/rewards/level.js');
	var levels = require(global.rootPath + '/resources/repository/Set' + setId+ '/levels.json');

	var Permission = require(global.rootPath + '/models/rewards/permission.js');
	var permissions = require(global.rootPath + '/resources/repository/Set' + setId+ '/permissions.json');

	var RewardLog = require(global.rootPath + '/models/users/rewardLog.js');
	var rewardLogs = [];

	var ActivityLog = require(global.rootPath + '/models/users/activityLog.js');
	var activityLogs = [];

	async.waterfall([
			function(callback){ saveSampleData(Activity, activities, callback); },
			function(callback){ saveSampleData(Mission, missions, callback); },
			function(callback){ saveSampleData(Badge, badges, callback); },
			function(callback){ saveSampleData(Point, points, callback); },
			function(callback){ saveSampleData(Status, statuses, callback); },
			function(callback){ saveSampleData(Level, levels, callback); },
			function(callback){ saveSampleData(Permission, permissions, callback); },
			function(callback){ saveSampleData(RewardLog, rewardLogs, callback); },
			function(callback){ saveSampleData(ActivityLog, activityLogs, callback); }
		],
		function(err){
			if(err){
				logger.log('error','db.js','Failed to load sample data');
				next(err);
			}else{
				logger.log('info','db.js','Succeed to load sample data');
				next(null);
			}
		});

};