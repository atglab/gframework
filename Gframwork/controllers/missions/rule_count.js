/**
 * Rule 1. count
 */
var logger = require(global.rootPath + '/helpers/logger');


/**
 * Function to add one to the status value of mission given as parameter
 *
 * @param userMission
 * @return 1) null, 2) error
 */
exports.countOne = function(userMission){	
	if(typeof(userMission.currentStatus) !== 'number'){
		return new Error('Status value of mission is not a number');
	}else{
		userMission.currentStatus = userMission.currentStatus + 1;
        return null;
	}
};