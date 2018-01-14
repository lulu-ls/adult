/**
 * Created by fever on 2017/5/5.
 */
var mysqlUtility = require('../utility/mysqlUtility.js');

var thirdParty = [];

thirdParty.getById = function(id){
    for(var i = 0; i< this.length; i++){
        if(this[i].id == id){
            return this[i];
        }
    }
    return null;
};

thirdParty.getByAppId = function(appid){
    for(var i = 0; i< this.length; i++){
        if(this[i].appid == appid){
            return this[i];
        }
    }
    return null;
};

thirdParty.getByCode = function(code){
    for(var i = 0; i< this.length; i++){
        if(this[i].code == code){
            return this[i];
        }
    }
    return null;
};

function initThirdParty(){
    var params = [];
    var strSql = " select id,name,appid,code,payTypes,loginType,loginRSAPEM from thirdParty; ";
    mysqlUtility.query(strSql,{ replacements: params, type: mysqlUtility.QueryTypes.SELECT })
        .then(function(results) {
            results.forEach(function(rec){
                thirdParty.push(rec);
            })
        })
        .catch(function(err){
            setTimeout(initThirdParty,1000)
        });
};

initThirdParty();

module.exports = thirdParty;