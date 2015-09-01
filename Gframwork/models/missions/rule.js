/**
 * [GFServer] rule.js
 * 
 * Module of collection model 'rule'
 * 
 * @author JungHyun
 * @version 0.4
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RuleSchema = new Schema({
    id:{ type: String, unique: true},
    name: { type: String, unique: true },
    description: { type: String }
});


var Rule = mongoose.model('Rule', RuleSchema);

module.exports = Rule;