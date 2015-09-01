/**
 * Map of (key:rule name, value: rule function)
 */
var rule_count = require('./rule_count.js');

var map = [];
map['countOne'] = rule_count.countOne;

exports.map = map;