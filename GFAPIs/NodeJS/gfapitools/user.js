/**
 * [GF APITools for Node.js]
 *
 * User Class Definition
 *
 * @version: 1.0
 * @date: 2015.08.04
 * @author: ATG Lab
 */

/**
 * Constructor of User
 * @param params: array of initial data
 * [ id(String), name(String), nickname(String),
 * gender(1 or 2 or 3), birthday(second timestamp), profile(String)]
 * @constructor
 */
function User(params){
    this.id = params[0];
    this.name = params[1];
    this.nickname = params[2];
    this.gender = params[3];
    this.birthday = params[4];
    this.profile = params[5];

    this.rewards = [];
    this.missions = [];

    this.updated_at = "";
    this.created_at = "";

    User.prototype.getInfo = function(){
        return this.id + ' ' + this.name + ' ' + this.nickname + ' ' + this.gender
            + ' ' + this.birthday + ' ' + this.profile;
    }
}

exports.User = User;