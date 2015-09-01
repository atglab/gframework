/**
 * [GFServer] activityLog.js
 * 
 * Module of collection model 'activityLog'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivityLogSchema = new Schema({
    activity_id: {
        type: String,
        required: true,
        index: true
    },
    user_id: {
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

var ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = ActivityLog;