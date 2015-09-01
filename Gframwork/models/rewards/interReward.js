/**
 * [GFServer] interReward.js
 * 
 * Module of collection model 'interReward'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InterRewardSchema = new Schema({
    id: { type: String, unique: true },

    event_name:{ type: String, require: true, index: true },
    event_type:{ type: String, require: true, index: true },
    event_object:{ type: String, require: true, index: true },

    reward_type:{ type: String, require: true },
    reward_object:{ type: String, require: true },
    reward_parameter:{ type: Number, require: true },

    created_at: { type: Date, 'default': Date.now },
    updated_at: { type: Date, 'default': Date.now }
});

var InterReward = mongoose.model('InterReward', InterRewardSchema);

module.exports = InterReward;