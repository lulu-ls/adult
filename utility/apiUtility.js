var crypto=require('crypto');
var request = require('request');
var errCode = require('../models/errCode.js');
var logger = require('../utility/logger.js').access;
var aes = require('./aes-128-cbc.js');

var url = "http://api.eticket.juntu.com/";
// var url = "http://121.40.172.190:5050/";
// var url = "http://127.0.0.1:5050/";
var version = "V2.3";
var partnerId = "10048";
var partnerKey = "1789e68e4f7c0985";
//统一请求和返回方法
function apiUtility(option,callback){
    if(!callback || typeof callback !='function'){
        return errCode.missingParam("[callback]");
    };
    if(!option || typeof option !='object'){
        return callback(errCode.missingParam("[option]"));
    }
    else{
        if(!option.path || typeof option.path !='string'){
            return callback(errCode.missingParam("[path]"));
        };
        if(option.path!="/scenic/getScenicList"){
            if(!option.data || typeof option.data !='object'){
                return callback(errCode.missingParam("[data]"));
            };
        }
    }

    var timestamp = new Date().getTime();
    var signStr = partnerId+timestamp+partnerKey;
    var aesData = "";
    if(option.data){
       aesData= aes.encrypt(option.data);
        signStr = signStr+aesData;
    }

    var sign = crypto.createHash('md5').update(signStr).digest('hex');

    var reqData = {
        version:version,
        partnerId:partnerId,
        timestamp:timestamp,
        data:aesData,
        sign:sign
    }

    request({
        url:url+option.path,
        method: "POST",
        form: reqData
    },function (error, response, body) {

        // logger(
        //     "time"+new Date()+"type:" + option.type + " path:" + option.path+"\r\n"
        //     +"请求:" + JSON.stringify(reqData)+"\r\n"
        //     +"应答:" +JSON.stringify(body)  +"\r\n"
        // );

        if (error) {
            return callback(errCode.unknown(error.message));
        }
        try{
            return callback(null,JSON.parse(body));
        }
        catch(e){
            console.log(e);
            callback(errCode.unknown(body));
        }
    });

    // var pathArr=['/scenic/getScenicList','/scenic/getScenicDetail','/scenic/getPriceList',
    //  '/scenic/getPriceDetail','/scenic/getGroupTicketLists','/scenic/getGroupTicketDetail']
    //
    // var pathArr2=['/xiyou/sendSmsReq','/xiyou/sendCodeCancelReq','/xiyou/sendCodeDetailReq','/xiyou/sendCodeCancelResultReq']
    //
    // if(pathArr.indexOf(option.path)!=-1) {
    //     signStr = supplierIdentity+"+"+encryptKey;
    // }
    // if(option.path=="/xiyou/sendCodeReq"){
    //     logger("所传的数据："+JSON.stringify(option.data.toString()));
    //     signStr = supplierIdentity+"+"+encryptKey+"+"+option.data[6].orderNo+"+"+option.data[0].checkTime
    //         +"+"+option.data[2].scenicId+"+"+option.data[3].ticketId+"+"+option.data[4].quantity+"+"+option.data[5].toDate
    //         +"+"+option.data[7].contactName+"+"+option.data[8].contactMobile;
    // }
    //
    // if(pathArr2.indexOf(option.path)!=-1){
    //     signStr = supplierIdentity+"+"+encryptKey+"+"+option.data.orderNo;
    // }

    // var signkey = crypto.createHash('md5').update(signStr).digest('hex');
    // var reqBody;//请求接口所需的数据
    // if(option.path=="/scenic/getScenicList"){
    //     reqBody={
    //             supplierIdentity:supplierIdentity,
    //             signkey:signkey
    //     }
    //
    //     request({
    //         url:url+option.path,
    //         method: "POST",
    //         form: reqBody
    //     },function (error, response, body) {
    //         if (error) {
    //             return callback(errCode.unknown(error.message));
    //         }
    //         try{
    //             callback(null,JSON.parse(body));
    //         }
    //         catch(e){
    //             callback(errCode.unknown(body));
    //         }
    //     });
    // }else {
    //     var ss={};
    //    for(var i=0;i<=option.data.length;i++){
    //        var obj1=Object.assign(ss,option.data[i]);
    //    }
    //     reqBody = {
    //         supplierIdentity:supplierIdentity,
    //         signkey:signkey,
    //     };
    //     var obj = Object.assign(reqBody,obj1);
    //     request({
    //         url:url+option.path,
    //         method: "POST",
    //         form: obj
    //     },function (error, response, body) {
    //         logger(
    //             "time"+new Date()+"type:" + option.type + " path:" + option.path+"\r\n"
    //             +"请求:" + JSON.stringify(obj)+"\r\n"
    //             +"应答:" +JSON.stringify(body)  +"\r\n"
    //         );
    //
    //
    //         if (error) {
    //             return callback(errCode.unknown(error.message));
    //         }
    //         // try{
    //             callback(null,JSON.parse(body.toString()));
    //         // }
    //         // catch(e){
    //         //     callback(errCode.unknown(body));
    //         // }
    //     });
    // }
}

module.exports = apiUtility;






