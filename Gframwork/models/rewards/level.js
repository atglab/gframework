/**
 * [GFServer] level.js
 * 
 * Module of collection model 'level.js'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelEntitySchema = new Schema({
    level: Number,
    condition: String
});

var LevelSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: String,
    relation_method: String,
    relation_object: String,
    icon: String,
    max: Number,
    level_table: [LevelEntitySchema],
    created_at: {
        type: Date,
        'default': Date.now,
    },
    updated_at: {
        type: Date,
        'default': Date.now,
    }
});

var Level = mongoose.model('Level', LevelSchema);

module.exports = Level;