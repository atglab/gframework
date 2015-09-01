
var moment = require('moment');

/**
 * common.js
 * Common functions
 */
exports.getExtFromFilename = function(file){
	
	while (file.indexOf("\\") !== -1){
		file = file.slice(file.indexOf("\\") + 1);
	}
	var ext = file.substring(file.lastIndexOf('.'),file.length).toLowerCase();
		
	return ext;
};

/**
 * Function to return the user reward object with input type and id from user model
 *
 * @param user: user model
 * @param reward_type: reward type
 * @param reward_id: reward id
 * @return 1) user_reward, 2) null
 */
exports.getUserReward = function(user, reward_type, reward_id){

	for(var i = 0; i < user.rewards.length; i++){
		if(user.rewards[i].reward_type === reward_type
			&& user.rewards[i].reward_object === reward_id){
			var reward = user.rewards[i];
			return reward;
		}
	}
	return null;
};