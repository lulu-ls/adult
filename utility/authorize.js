var Url = require('url');
var querystring = require('querystring');
var request = require('request');
var UUID = require("node-uuid");


// var redisStore = require('../utility/redisUtility.js').store;
// var weixin = require('winner-common/weixin.js');

var appToken = require('./../utility/appToken.js');

var errCode = require('./../models/errCode.js');
var mysqlUtility =  require("../utility/mysqlUtility.js");
var JSONRet = require('../models/JSONRet.js');
var thirdParty = require("./thirdParty.js");

function front(req, res, next){
    next();
    // if(req.session && !req.session.oriUrl){
    //     req.session.oriUrl = req.baseUrl;
    // }
    //
    // if(req.session && !req.session.params){
    //     req.session.params = querystring.parse(Url.parse(req.originalUrl).query);
    // }
    //
    // var baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // baseUrl = encodeURIComponent(baseUrl);
    //
    // if(req.session.uid){
    //     next();
    // }
    // else {
    //     var token = req.query.token;
    //     var uid = req.query.uid;
    //     var unique = req.query.unique;
    //     if(uid && token && unique){
    //         var tokenObj = appToken.getToken(token);
    //         if(tokenObj){
    //             var time = tokenObj[0];
    //             var name = tokenObj[1];
    //             redisStore.hget("bfmToken",name,function(err, obj) {
    //                 var bfmToken;
    //                 if(obj){
    //                     try{
    //                         bfmToken = JSON.parse(obj);
    //                     }
    //                     catch(e){
    //
    //                     }
    //                 }
    //
    //                 if(bfmToken && bfmToken.status==1 && bfmToken.unique==unique){
    //                     req.session.uid = uid;
    //                     req.session.phone = name;
    //                     req.session.token = token;
    //                     req.session.unique = unique;
    //                     next();
    //                 }
    //                 else {
    //                     res.redirect("http://" + req.get('host')+'/login');
    //                 }
    //             });
    //         }
    //         else{
    //             res.redirect("http://" + req.get('host')+'/login');
    //         }
    //     }
    //     else{
    //         var agent = req.headers['user-agent'];
    //         if(agent.indexOf("MicroMessenger") != -1){
    //             var code = req.query.code;
    //             if(!code){
    //                 req.session.openType = 2;
    //                 req.session.channel = 'wx';
    //                 req.session.thirdParty = thirdParty.getById(2);
    //                 var url = weixin.getCodeBase("http://wx.epaynfc.com/oauth2/getCode?url="+baseUrl);
    //                 res.redirect(url);
    //             }
    //             else {
    //                 weixin.getUserToken(code,function(err,data){
    //                     if(err){
    //                         return res.redirect("http://" + req.get('host')+'/login');
    //                     }
    //                     req.session.openId = data.openid;
    //                     getUserId(req.session.openId,req.session.openType,function(err,user){
    //                         if(!err){
    //                             var loginData = {
    //                                 err:err,
    //                                 uid:user.uid,
    //                                 token:user.token,
    //                                 openId:data.openId
    //                             };
    //                             loginRedirect(req,res,loginData);
    //                         }else{
    //                             res.redirect("http://" + req.get('host')+'/login');
    //                         }
    //                     });
    //                 });
    //             }
    //         }
    //         else{
    //             res.redirect("http://" + req.get('host')+'/login');
    //         }
    //     }
    // }
}

function back(req, res, next){

    var user = {};

    try{
        user = JSON.parse(req.headers.user);
    }
    catch (e){
        return res.json(new JSONRet(-1,"授权失败!"));
    }

    res.locals.user = user;
    next();

    // if(req.session.uid){
    //     next();
    // }
    // else{
    //     res.json(new JSONRet(errCode.unknown("未授权访问")))
    // }
}

function loginRedirect(req,res,loginData){
    if(loginData){
        req.session.uid = loginData.uid;
        req.session.phone = loginData.phone;
        req.session.token = loginData.token;
        req.session.openId = loginData.openId;
        res.redirect("http://" + req.get('host')+ req.session.oriUrl);
    }
    else{
        res.redirect("http://" + req.get('host')+'/login');
    }
}

function getUserId(openId,openType,callback){
    var params = [openType,openId];
    var strSql = " select customerId,phone from customers \n";
    strSql += " where phone = (select phone from thirdPartyBind \n";
    strSql += " where type=? and sysType=1 and uid=?); \n";
    mysqlUtility.query(strSql,
        { replacements: params, type: mysqlUtility.QueryTypes.SELECT }
    ).then(function(results) {
        if(results[0]){
            callback(null,{uid:results[0].customerId,token:appToken.createToken(results[0].phone.toString())});
        }
        else{
            callback(errCode.unknown("未注册"))
        }
    }).catch(function(err){
        return callback(errCode.sysErr());
    });
};

module.exports = {
    "front":front,
    "back":back
};

