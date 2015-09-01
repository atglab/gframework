/**
 * [GFServer] badge.js
 * 
 * Module of collection model 'badge.js'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BadgeSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    category: String,
    description: String,
    icon: String,

    created_at: {
        type: Date,
        'default': Date.now
    },

    updated_at: {
        type: Date,
        'default': Date.now
    }
});

var Badge = mongoose.model('Badge', BadgeSchema);

module.exports = Badge;