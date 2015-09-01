/**
 * [GFServer] status.js
 * 
 * Module of collection model 'status.js'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    rank: Number,
    name: String,
    condition: String,
    icon: String
});

var StatusSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: String,
    relation_method: String,
    relation_object: String,
    classes:[ClassSchema],
    created_at: {
        type: Date,
        'default': Date.now,
    },
    updated_at: {
        type: Date,
        'default': Date.now,
    }
});

var Status = mongoose.model('Status', StatusSchema);

module.exports = Status;