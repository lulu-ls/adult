var express = require('express');
var router = express.Router();
var request = require('request');
var querystring = require("querystring");
var JSONRet = require('../models/JSONRet.js');
var AES128 = require('winner-common/AES128.js');
var mysqlHelper190 = require('../utility/mysqlHelper1901.js');

var host="http://api.epaynfc.com";

router.get('/list', list);
router.get('/setDefault', setDefault);
router.get('/remove', remove);
router.get('/bind', bind);
router.get('/cardadver', cardadver);

//获取cardadver广告
function cardadver(req,res) {
    var cityName=req.query.cityName;
    if(cityName && cityName.indexOf("市")!=-1){
        cityName=cityName.substr(0,cityName.indexOf("市"))
    }

    //var myUrl='uid=' + res.locals.user.uid + '&token=' + res.locals.user.token +'&unique='+ res.locals.user.unique || '';
    var params=[23,res.locals.user.uid,cityName,cityName,res.locals.user.openType,'appModuleId desc'];
    var strSql = " SELECT type,name,title,sub,img,rl,eType,appId,url,onMain as isOpen  \n";
    strSql += " FROM appModule \n";
    strSql += " where status=1 \n";
    strSql += " and (IFNULL(startTime,'')='' OR IFNULL(startTime,'')<=NOW()) \n";
    strSql += " and (IFNULL(endTime,'')='' OR IFNULL(endTime,'')>=NOW()) \n";
    strSql += " and type = ? \n";
    strSql += " and (ifnull(inUid,'')='' or find_in_set(?,inUid)) \n";
    strSql += " and (ifnull(inCities,'')='' or find_in_set(?,inCities)) \n";
    strSql += " and (ifnull(exCities,'')='' or !find_in_set(?,exCities))  \n";
    strSql += " and (ifnull(inAppId,'')='' or find_in_set(?,inAppId))  \n";
    strSql += " order by "+params[5]+"\n";
    mysqlHelper190.execWP(strSql,params,function (err,results) {
        if(err) { res.json(new JSONRet(0,"Load failed!"),{openType:res.locals.user.openType}); return false;}
        res.json(new JSONRet(true, "Load Succeed!", {results:results,openType:res.locals.user.openType}));
    });
}

function list(req, res, next){
    var uid = res.locals.user.uid;
    var token = res.locals.user.token;

    var options = {
        url:host+"/card/list1?" + querystring.stringify({uid:uid,token:token})
    };
    request.get(options,function (error, response, body) {
        if(error){res.json(new JSONRet(0,"服务器连接错误"));return false;}

        try{
            body=JSON.parse(body);

            if(body.cards)
            body.cards.forEach(function(rec){
                if(rec.bankLogo) rec.bankLogo = host + "/" +rec.bankLogo;
                if(rec.picBg) rec.picBg = host + "/" + rec.picBg;
            });
            res.json(body);
        }
        catch (e){
            res.json(new JSONRet(0,"服务器连接错误"))
        }
    })
}

function setDefault(req, res, next){
    var uid = res.locals.user.uid;
    var token = res.locals.user.token;

    var cid = req.query.cid;

    var options = {
        url:host+"/card/setDefault?" + querystring.stringify({uid:uid,token:token,cid:cid})
    };
    request.get(options,function (error, response, body) {
        if(error){res.json(new JSONRet(0,"服务器连接错误"));return false;}

        try{
            body=JSON.parse(body);
            res.json(body);
        }
        catch (e){
            res.json(new JSONRet(0,"服务器连接失败"));
        }

    })
}

function remove(req, res, next){
    var uid = res.locals.user.uid;
    var token = res.locals.user.token;

    var cid = req.query.cid;

    var options = {
        url:host+"/card/remove?" + querystring.stringify({uid:uid,token:token,cid:cid})
    };
    request.get(options,function (error, response, body) {
        if(error){res.json(new JSONRet(0,"服务器连接错误"));return false;}

        try{
            body=JSON.parse(body);
            res.json(body);
        }
        catch (e){
            res.json(new JSONRet(0,"服务器连接失败"));
        }

    })
}

function bind(req, res, next){
    var uid = res.locals.user.uid;
    var token = res.locals.user.token;
    var openType = res.locals.user.openType || 0;

    var cardNo = req.query.cardNo;

    var cnoe = AES128.encrypt(cardNo);
    var options = {
        url:host+"/card/bindToken?" + querystring.stringify({uid:uid,token:token,cnoe:cnoe,payType:2,thirdPartyId:openType})
    };
    request.get(options,function (error, response, body) {
        if(error){res.json(new JSONRet(0,"服务器连接错误"));return false;}

        try{
            body=JSON.parse(body);
            res.json(body);
        }
        catch (e){
            res.json(new JSONRet(0,"服务器连接失败"));
        }
    })
}


module.exports = router;

