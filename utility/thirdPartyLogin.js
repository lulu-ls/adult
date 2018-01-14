var AES128 = require('winner-common/AES128.js');
var mysqlUtility = require('../utility/mysqlUtility.js');
var errCode = require('../models/errCode.js');
var bfmApi = require('./../utility/bfmApi.js');
// var redis = require('./redisUtility');
var logger = require('./logger');
var apiUtility = require('../utility/apiUtility');

// redis.sub.subscribe("qlyUpdateProduct");
// redis.sub.on("message", function (pattern, data) {
//
//     if (pattern == "qlyUpdateProduct") {
//         logger.frontBackUrl('旅游产品信息变更:'+data);
//         getList();
//     }
// });

var sData = {
    allList:[],
    oList:[],
    nList:[],
    ticketList:[]
}

function phoneBind(uid,type,phone){
    var params=[uid,type,phone];
    var strSql="update thirdPartyBind set uid=? where sysType=1 and type=? and phone=?;";
    mysqlUtility.query(strSql,{ replacements: params, type: mysqlUtility.QueryTypes.RAW })
        .then(function(results) {
            if(results[0].affectedRows==0){
                params=[type,phone,uid];
                strSql="insert into thirdPartyBind(sysType,type,phone,uid) values(1,?,?,?);";
                mysqlUtility.query(strSql,{ replacements: params, type: mysqlUtility.QueryTypes.RAW })
                    .then(function(results) {
                    })
                    .catch(function(err){
                    });
            }
        })
        .catch(function(err){
        });
}

function phoneLogin(channel,phone,openId,openType,callback) {
    bfmApi("/login/thirdPartPhone",{name:AES128.encrypt("winner" + phone),channel:channel},function(err,body){
        if(err) {
            return callback(err);
        }
        phoneBind(openId,openType,phone);
        callback(null);
    });
}
// getList();
function getList(){
    var params=[];
    var strSql="select scenicId,ticketId,isOpen,simage,introduction from juntuMiddle where isInvalid =0;";
    mysqlUtility.query(strSql,{type:mysqlUtility.QueryTypes.SELECT})
        .then(function(results) {
         if(results.length>0){
             sData.allList = [];
             sData.oList = [];
             sData.nList = [];
             sData.ticketList = [];

             for(var i =0; i<results.length; i++){
                 if(results[i].isOpen == 0){
                     sData.nList.push(results[i].scenicId);
                 }else if(results[i].isOpen == 1){
                     sData.oList.push(results[i].scenicId);
                 }
                 sData.ticketList.push(results[i].ticketId);
             }
             sData.allList = results;
             getAllPrice();
         }else{
             console.log("获取juntuMiddle列表失败，长度小于等于0");
         }
        })
        .catch(function(err){
            console.log("getListErr:"+err);
        });
}

function getAllPrice() {
   for(var i = 0;i<sData.allList.length;i++){
       var sDate = new Date().toLocaleDateString();
       apiUtility({path: 'ticket/getStock' , data: {productId:sData.allList[i].ticketId,startTime:sDate,endTime:sDate}}, function (err, data) {
           if(err){
               console.log('统一获取价格报错：'+err);
               return ;
           }
           if(data.data.data.length<=0){
               // console.log('统一获取价格返回为空：'+JSON.stringify(data));
               return;
           }
           data.data.data[0].salesPrice = data.data.data[0].salesPrice/100;
           data.data.data[0].settlePrice =data.data.data[0].settlePrice/100;
           // var myId=['174','3536','1612','180','204','3636','3535','3097','3299','237','3412','3287','894','2949','3251','2583','4361','766','982'];//'766'‘4461’
          for(var j=0;j<sData.allList.length;j++){
              if(sData.allList[j].ticketId == data.data.data[0].productId){
                  sData.allList[j].priceData = data.data.data[0];
              }
          }
       })
   }
}

module.exports = {
    phoneBind:phoneBind,
    phoneLogin:phoneLogin,
    sData:sData
};

