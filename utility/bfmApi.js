var request = require("request");
var querystring = require("querystring");
var errCode = require('../models/errCode.js');
var host="http://api.epaynfc.com";

function bfmAPI(path,data,callback){
    var options = {
        url:host + path + "?" + querystring.stringify(data)
    };
    request.get(options,function (error, response, body) {
        if(error){callback(errCode.sysErr());return false;}

        try {
            body=JSON.parse(body);
        }catch (e){
            return callback(errCode.sysErr());
        }

        if(body.ret==1) {
            callback(null,body)
        }
        else{
            callback(errCode.unknown(body.tip));
        }
    });
}

module.exports = bfmAPI;