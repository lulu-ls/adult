/**
 * Created by fever on 2017-05-08.
 */
var querystring= require("querystring");


function getPayCode(uid,token,unique,chargeType,chargeId,chargeAmt){

    if(arguments.length<6){
        return;
    }

    var code = {
        t:Math.floor(new Date().getTime() / 1000),
        d:'113159',
        a:'{"'+chargeType+'":'+chargeAmt+'}',
        e:JSON.stringify({type:3,chargeType:chargeType,chargeId:chargeId})
    };

    var qrcode = new Buffer(JSON.stringify(code)).toString('base64');

    var data = {
        uid:uid,
        token:token,
        qrcode:qrcode,
        unique:unique,
        payTypes:'2'
    };
    return "http://wx.epaynfc.com/sanPay?"+querystring.stringify(data);
}

module.exports = getPayCode;

var chargeTypes =  require("../models/chargeTypes.js");

