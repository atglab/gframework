/**
 * [GFServer] rule_controller.js
 *
 * Module used to handle business logic of rules
 *
 * @author JungHyun
 * @version 0.4
 */

var Rule = require(global.rootPath + '/models/missions/rule.js');

exports.findAll = function(next){
    Rule.find({})
        .sort('name')
        .exec(function(err, rules){
            if(err){
                next('4002');
            }else{
                next(null, rules);
            }
        });
};

exports.findByID = function(id, next){
    var query = {id: id};
    Rule.findOne(query)
        .exec(function(err, rule){
            if(err){
                next('4001');
            }else{
                next(null, rule);
            }
        });
};
