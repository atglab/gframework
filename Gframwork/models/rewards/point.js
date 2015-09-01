/**
 * [GFServer] point.js
 * 
 * Module of collection model 'point.js'
 * 
 * @author JungHyun
 * @version 0.2
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: String,
    min: Number,
    max: Number,
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

var Point = mongoose.model('Point', PointSchema);

module.exports = Point;