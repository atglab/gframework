/**
 * [GFServer] activity.js
 * 
 * Module of collection model 'activity.js'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: { type: String },

    created_at: { type: Date, 'default': Date.now },
    updated_at: { type: Date, 'default': Date.now }
});

var Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;