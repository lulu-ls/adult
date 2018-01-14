var express = require('express');
var router = express.Router();
var request = require('request');
var querystring = require("querystring");
var JSONRet = require('../models/JSONRet.js');
var host="http://api.epaynfc.com";
var mysqlHelper190 = require('../utility/mysqlHelper1901.js');

router.get('/main', main);
router.get('/couponadver', couponadver);

//获取优惠券列表广告
function couponadver(req,res) {

    var cityName=req.query.cityName;
    if(cityName && cityName.indexOf("市")!=-1){
        cityName=cityName.substr(0,cityName.indexOf("市"))
    }

    // var myUrl='uid=' + req.session.uid + '&token=' + req.session.token +'&unique='+ req.session.unique || '';
    var params=[24,res.locals.user.uid,cityName,cityName,res.locals.user.openType,'appModuleId desc'];
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

function main(req, res, next){
    var uid = res.locals.user.uid;
    var token = res.locals.user.token;
    var index = req.query.index || 1;
    var size = req.query.size || 20;
    var options = {
        url:host+"/coupon/main?" + querystring.stringify({uid:uid,token:token,index:index,size:size}),
    };
    request.get(options,function (error, response, body) {
        if(error){res.json(new JSONRet(0,"服务器连接错误"));return false;}

        try{
            body=JSON.parse(body);

            if(body.coupon)
            body.coupon.forEach(function(rec){
                if(rec.code) rec.intro = rec.code;
            });
            res.json(body);
        }
        catch (e){
            res.json(new JSONRet(0,"服务器连接失败"));
        }

    })
}

module.exports = router;
