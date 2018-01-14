var express = require('express');
var router = express.Router();

var errCode = require('../models/errCode.js');
var JSONRet = require('../models/JSONRet.js');
var AES128 = require('winner-common/AES128.js');
var request = require('request');
var appToken = require('./../utility/appToken.js');
var thirdPartyLogin = require('./../utility/thirdPartyLogin.js');
var bfmApi = require('./../utility/bfmApi.js');
var log = require('../utility/logger').frontBackUrl;

router.get('/confirm', confirm);
router.get('/voiceCode', voiceCode);
router.get('/smsCode', smsCode);
router.get('/thirdParty', thirdParty);

function thirdParty(req,res){
    var uid = req.query.uid;
    req.session.openId = uid;

    bfmApi("/login/thirdPart",{type:req.session.openType,openId:uid},function(err,body){
        if(err) {
            return res.json(new JSONRet(err));
        }

        req.session.uid = body.uid;
        req.session.token = body.token;

        var jsonRet = new JSONRet(errCode.success(body.tip));
        jsonRet.oriUrl = req.session.oriUrl;
        req.session.oriUrl = "";

        res.json(jsonRet);
    });
}

function confirm(req, res) {

    var phone = req.query.phone;
    var code = req.query.code;
    var unique = req.session.unique;
    var channel ="";

    if(req.session.channel){
        channel = req.session.channel;
    }

    bfmApi("/login/confirm",{name:phone,code:code,channel:channel},function(err,body){
        if(err) {
            return res.json(new JSONRet(err));
        }
        req.session.uid = body.uid;
        req.session.token = body.token;

        var jsonRet = new JSONRet(errCode.success(body.tip));
        jsonRet.oriUrl = req.session.oriUrl;
        req.session.oriUrl = "";
        res.json(jsonRet);

        if(req.session.openId && req.session.openType){
            thirdPartyLogin.phoneBind(req.session.openId,req.session.openType,phone)
        }
    });
}

function voiceCode(req, res) {
    var phone = req.query.name;
    var name = AES128.encrypt(phone);

    bfmApi("/login/voiceCode",{name:name},function(err,body){
        if(err) {
            return res.json(new JSONRet(err));
        }
        var jsonRet = new JSONRet(errCode.success(body.tip));
        res.json(jsonRet);
    });
}

function smsCode(req, res) {
    var phone = req.query.name;
    var name = AES128.encrypt(phone);

    bfmApi("/login/smsCode",{name:name},function(err,body){

        if(err) {
            return res.json(new JSONRet(err));
        }

        var jsonRet = new JSONRet(errCode.success(body.tip));
        res.json(jsonRet);
    });
}

module.exports = router;
