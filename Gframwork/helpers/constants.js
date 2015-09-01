/**
 * [GFServer] constants.js
 *
 * Module used to define global constants
 *
 * @author JungHyun
 * @version 0.4
 */

exports.MECHANICS = {
    "POINT":      "point_type",
    "BADGE":      "badge_type",
    "PERMISSION": "permission_type",
    "STATUS":     "status_type",
    "LEVEL":      "level_type",
    "MISSION":    "mission_type"
};

exports.EVENTS = {
    "SEND_TO_LEADERBOARD":  "SEND_TO_LEADERBOARD",
    "SEND_TO_RECENTBOARD":  "SEND_TO_RECENTBOARD",
    "MISSION_COMPLETED":    "MISSION_COMPLETED",
    "MISSION_START":        "MISSION_START",
    "DO_INTER_REWARD":      "DO_INTER_REWARD",
    "DO_REWARD":            "DO_REWARD",
    "RECEIVED_REWARD":      "RECEIVED_REWARD",
    "OCCURRED_ACTIVITY":    "OCCURRED_ACTIVITY"
};

exports.REWARD_EVENTS = {
    "ADD_POINT":        "addPoint",
    "UP_LEVEL":         "upLevel",
    "GET_LEVEL":        "getLevel",
    "GET_STATUS":       "getStatus",
    "COMPLETE_MISSION": "completeMission",
    "GET_BADGE":        "getBadge",
    "GET_PERMISSION":   "getPermission"
};

exports.OTHER_CONSTANTS = {
    "NUM_MISSION_COMPLETION": "NUM_MISSION_COMPLETION",
    "MISSION": "mission",
    "REWARD": "reward"
};
