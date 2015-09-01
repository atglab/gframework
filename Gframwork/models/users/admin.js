/**
 * [GFServer] admin.js
 *
 * Module of collection model 'admin'
 *
 * @author JungHyun
 * @version 0.2
 */
var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var AdminSchema = new Schema({
    username: { type: String , unique: true},
    password: { type: String },
    role: { type: String },

    created_at: { type: Date, 'default': Date.now },
    updated_at: { type: Date, 'default': Date.now }
});

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
