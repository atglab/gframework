/**
 * [GFServer] rewardLog.js
 * 
 * Module of collection model 'rewardLog'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RewardLogSchema = new Schema({
    reward_type: {
        type: String,
        required: true,
        index: true
    },
    reward_id: {
        type: String,
        required: true,
        index: true
    },
    reward_value: {
        type: Number,
        required: true
    },
    reward_status:{
        type: Number,
        require: true
    },
    user_id:{
        type: String,
        required: true,
        index: true
    },
    user_gender:{
        type: Number,
        index: true
    },
    user_birthday:{
        type: Number,
        index: true
    },
    created_at: {
        type: Date,
        'default': Date.now,
        index: true
    }
});

var RewardLog = mongoose.model('RewardLog', RewardLogSchema);

module.exports = RewardLog;