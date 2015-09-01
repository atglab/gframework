/**
 * [GFServer] admin_controller.js
 *
 * Module used to handle business logic of admin
 *
 * @author JungHyun
 * @version 0.4
 */
var async = require('async');
var Admin = require(global.rootPath + '/models/users/admin.js');

exports.findByID = function(id, next){
    var query = {username: id};
    Admin.findOne(query)
        .exec(function(err, user){
            if(err){
                next('4001');
            }else{
                next(null, user);
            }
        });
};