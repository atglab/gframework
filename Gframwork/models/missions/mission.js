/**
 * [GFServer] mission.js
 * 
 * Module of collection model 'mission'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MissionSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: { type: String },
    activityId:{ type: String, require: true, index: true },

    reward_type:{ type: String, require: true },
    reward_object:{ type: String, require: true },
    reward_parameter:{ type: Number, require: true },

    exit_condition: { type: Number, require: true },

    ruleId: { type: String, require: true },

    isRepeatable: {type: Boolean, 'default': false},
    repeat_period: {type: Number, 'default': 0},
    max_repeat_count: {type: Number, 'default': 0},

    useConstraint: {type: Boolean, 'default': true},
    constraint_period: {type: Number, 'default': 0},
    isContinuous: {type: Boolean, 'default': false},

    useExpiration: {type: Boolean, 'default': false},
    start_date: { type: Date },
    end_date: { type: Date },

    created_at: { type: Date, 'default': Date.now },
    updated_at: { type: Date, 'default': Date.now }
});

var Mission = mongoose.model('Mission', MissionSchema);

module.exports = Mission;