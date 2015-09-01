/**
 * [GFServer] repopoint.js
 * 
 * Module of collection model 'repostatus.js'
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

var RepoStatusSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: String,
    classes:[ClassSchema],
    created_at: {
        type: Date,
        'default': Date.now
    },
    updated_at: {
        type: Date,
        'default': Date.now
    }
});

var RepoStatus = mongoose.model('RepoStatus', RepoStatusSchema);

module.exports = RepoStatus;