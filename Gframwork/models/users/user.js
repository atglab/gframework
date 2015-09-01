/**
 * [GFServer] user.js
 * 
 * Module of collection model 'user'
 * 
 * @author JungHyun
 * @version 0.2
 */
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var UserMissionSchema = new Schema({
    missionId : { type: String },
    currentStatus: { type: Number, 'default': 0 },

    completeCount: { type: Number, 'default' : 0},
    lastCompleted_at: { type: Date, 'default' : null},

    lastUpdated_at: { type: Date, 'default' : null }
});

var UserRewardSchema = new Schema({
    reward_type: { type: String },
    reward_object: { type: String },
    reward_status: { type: Number },

    lastUpdated_at:{ type: Date, 'default': Date.now }
});

var UserSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String },
    nickname: { type: String, unique: true },
    gender: { type: Number },
    birthday: { type: Number },
    profile: {type: String , 'default': ""},

    missions: [UserMissionSchema],
    rewards: [UserRewardSchema],

    created_at: { type: Date, 'default': Date.now },
    updated_at: { type: Date, 'default': Date.now }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;