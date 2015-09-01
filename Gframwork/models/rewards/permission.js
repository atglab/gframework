/**
 * [GFServer] permission.js
 * 
 * Module of collection model 'permission'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PermissionSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, unique: true },
    description: String,
    relation_method: { type: String, 'default': 'basic' },
    relation_object: { type: String, 'default': null },
    get_parameter: { type: String, 'default': null },
    created_at: { type: Date, 'default': Date.now },
    updated_at: { type: Date, 'default': Date.now }
});

var Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;