/**
 * Created by main on 2017/11/21.
 */
var api = require("./apiUtility");
var request = require("request");
var logger = require('./logger');
// var thirdPartLogin = require('../utility/thirdPartyLogin');
// var oList = thirdPartLogin.sData.oList;//所要展示的景区信息对象的id '356', 海洋极地公园 129
// var nList = thirdPartLogin.sData.nList;//所要展示的景区信息对象的id '356', 海洋极地公园 129
// var myId=['2752'];//'766'‘4461’'174','3536','1612','180','204','3636','3535','3097','3299','237','3412',

//退单申请
// api({path: 'ticket/refundApply' , data: {partnerOrderId:'20171204094926503120',orderId:'JQ-HC0452478543779',refundQuantity:1}},function (err,data) {
//     console.log(err);
//     console.log(JSON.stringify(data));
// });

//获取订单信息
// api({path: 'ticket/queryOrder' , data: {partnerOrderId:'20171204165310889698',orderId:'JQ-HC0477793150645'}},function (err,data) {
//     console.log(err);
//     console.log(JSON.stringify(data));
// });

//获取产品价格信息
// api({path: 'ticket/getStock' , data: {productId:'3033',startTime:new Date().toLocaleDateString(),endTime:new Date(new Date().getTime()+30*24*60*60*1000).toLocaleDateString()}},function (err,data) {
//     console.log(err);
//     console.log(JSON.stringify(data));
// });

//获取产品信息
// api({path: 'ticket/getProduct' , data: {method:'multi',productId:myId}},function (err,data) {
//     console.log(err);
//     console.log(JSON.stringify(data));
// });

//获取产品信息
// for(var k=1;k<100;k++){
//     api({path: 'ticket/getProduct' , data: {method:'page',page:k,pageSize:40}},function (err,data) {
//         if(err){
//             console.log(err);
//             return ;
//         }
//         var allPoiId = [ '232', '98', '277', '277', '96 ', '92', '168', '272', '238', '227', '101', '93', '155', '67', '571', '129', '116' ];
//
//         if(data.status == 10000){
//             for(var i =0 ; i< data.data.data.length;i++){
//                 if(JSON.stringify(data.data.data[i]).indexOf('寒窑')){
//                     console.log(JSON.stringify(data.data.data[i]));
//                 }
//                 if(allPoiId.indexOf(data.data.data[i].poiId) != -1){
//                     logger.file('ticketId:'+data.data.data[i].ticketId+',ticketName:'+data.data.data[i].ticketName+',poiId:'+data.data.data[i].poiId);
//                     // logger.file('产品信息：'+JSON.stringify(data.data.data[i]));
//                 }
//
//             }
//         }
//     });
// }

//获取景区信息
var juntuScenic = require('../models/juntuScenic');
var juntuTicket = require('../models/juntuTicket');

//插入景区信息
// var k =1;
//  function getInfo(k) {
//      api({path: 'ticket/getPoi' , data: {method:'page',page:k,pageSize:40}},function (err,data) {
//          if(err){
//              console.log(err);
//              return ;
//          }
//
//          if(data.status == 10000){
//              var all = [];
//              var data = data.data
//              for(var i=0;i<data.data.length;i++){
//                  all.push({
//                      scenicId:data.data[i].poiId,
//                      scenicTitle:data.data[i].poiName,
//                      address:data.data[i].address
//                      // introduction:data.data[i].introduction
//                      })
//              }
//              juntuScenic.bulkCreate(all).then(function (val) {
//                  console.log('第'+k+'次插入成功！')
//              }).catch(function (err) {
//                  console.log(err)
//              })
//
//              if(data.data.length<40){
//                  console.log('最后一页：'+k);
//              }else{
//                  getInfo(++k);
//              }
//          }else{
//              console.log(data)
//          }
//      });
//  }
//  getInfo(k);

//插入门票信息
var k =1;
function getInfo(k) {
    api({path: 'ticket/getProduct' , data: {method:'page',page:k,pageSize:40}},function (err,data) {
        if(err){
            console.log(err);
            return ;
        }

        if(data.status == 10000){
            var all = [];
            var data = data.data
            for(var i=0;i<data.data.length;i++){
                all.push({
                    scenicId:data.data[i].poiId,
                    ticketId:data.data[i].productId,
                    ticketName:data.data[i].productName
                })
            }
            juntuTicket.bulkCreate(all).then(function (val) {
                console.log('第'+k+'次插入成功！')
            }).catch(function (err) {
                console.log(err)
            })

            if(data.data.length<40){
                console.log('最后一页：'+k);
            }else{
                getInfo(++k);
            }
        }else{
            console.log(data)
        }
    });
}
getInfo(k);

//向juntuScenic添加门票id
// juntuTicket.findAll().then(function (val) {
//
//     if(val.length>0){
//         for(var i=0;i<val.length;i++){
//             // juntuScenic.findOne({where:{scenicId:val[i].scenicId}}).then(function (val) {
//             //     if(){}
//             // }).catch(function (err) {
//             //     console.log(err)
//             // })
//             juntuScenic.update({ticketsId:val[i].ticketId}, {where: {scenicId:val[i].scenicId}}).then(function (val) {
//                 console.log(val);
//             }).catch(function (err) {
//                 console.log(err)
//             });
//
//             // juntuScenic.update({ticketsId:val.ticketId},{where:{scenicId:val.scenicId}}).then(function (val) {
//             //     console.log(val);
//             // }).catch(function (err) {
//             //     console.log(err)
//             // });
//         }
//     }
//
//
// }).catch(function (err) {
//     console.log(err);
// })


// request({
//     url:url+option.path,
//     method: "POST",
//     form: reqData
// },function (error, response, body) {
//     console.log("error:"+JSON.stringify(error));
//     console.log("response:"+JSON.stringify(response));
//     console.log("body:"+JSON.stringify(body));
//     logger(
//         "time"+new Date()+"type:" + option.type + " path:" + option.path+"\r\n"
//         +"请求:" + JSON.stringify(reqData)+"\r\n"
//         +"应答:" +JSON.stringify(body)  +"\r\n"
//     );
//
//     if (error) {
//         return callback(errCode.unknown(error.message));
//     }
//     try{
//         callback(null,JSON.parse(body));
//     }
//     catch(e){
//         callback(errCode.unknown(body));
//     }
// });

// /**
//  * 业务数据加密方法
//  * 加密模式：AES128/CBC/PKCS7Padding
//  * @param $aData //需要加密的数据数组
//  * @param $sKey  //合作商户的Key
//  * @return string 加密后的数据（base64编码）
//  */
// function sEncryptData($aData, $sKey)
// {
//     if (empty($aData) || empty($sKey)) {
//         return '';
//     }
//
//     $sData = json_encode($aData);
//     $iPadLength = 32 - (strlen($sData) % 32);
//     $cPadChar = chr($iPadLength);
//     $sData .= str_repeat($cPadChar, $iPadLength);
//
//     $sIv = substr($sKey, 0, 16);
//     $sEncrypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $sKey, $sData, MCRYPT_MODE_CBC, $sIv);
//     $sEncrypt = base64_encode($sEncrypt);
//
//     return $sEncrypt;
// }
//
// /**
//  * 业务数据解密方法
//  * @param $sEncrypt base64编码的加密数据字符串
//  * @param $sKey  合作商户的Key
//  * @return array
//  */
// function aDecryptData($sEncrypt, $sKey)
// {
//     $aData = array();
//
//     if (empty($sEncrypt) || empty($sKey)) {
//         return $aData;
//     }
//
//     $sIv = substr($sKey, 0, 16);
//     $sEncrypt = base64_decode($sEncrypt);
//     $sEncrypt = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $sKey, $sEncrypt, MCRYPT_MODE_CBC, $sIv);
//     $iEncryptLength = strlen($sEncrypt);
//
//     $iPadLength = ord($sEncrypt[$iEncryptLength - 1]);
//     $sEncrypt = substr($sEncrypt, 0, $iEncryptLength - $iPadLength);
//
//     $aData = json_decode($sEncrypt, true);
//     return $aData;
// }

// {"status":10000,"message":"成功","data":{"total":14,"data":[{"ticketId":2752,"ticketName":"华清宫","poiId":"116","status":1,"validityType":2,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":2,"name":true,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":true},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":1,"partRefund":1,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":400,"refundTimeType":2,"refundTime":0}]}},{"ticketId":2754,"ticketName":"M花罗花了2222","poiId":"3,4","status":1,"validityType":1,"validityDays":2,"validityStart":"1510070400","validityEnd":1512057600,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":"包含项目","exclusiveProjects":"不包含项目","userTypeNote":"补充说明","voucherWay":"兑换方式","voucherTime":"取票时间","importantNote":"重要条款"},"refundRule":{"refundType":2,"partRefund":1,"refundNote":"退款单说的呢","refundStairsRules":[{"refundFeeMode":2,"refundFee":1500,"refundTimeType":3,"refundTime":600}]}},{"ticketId":2755,"ticketName":"灵岩山","poiId":"7,4","status":1,"validityType":1,"validityDays":1,"validityStart":"1510070400","validityEnd":1511971200,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":2,"partRefund":1,"refundNote":"请问","refundStairsRules":[{"refundFeeMode":4,"refundFee":10,"refundTimeType":3,"refundTime":240}]}},{"ticketId":2756,"ticketName":"长白山","poiId":"3,4","status":1,"validityType":2,"validityDays":1,"validityStart":"-28800","validityEnd":57600,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2757,"ticketName":"庐山","poiId":"3,4","status":1,"validityType":2,"validityDays":1,"validityStart":"-28800","validityEnd":57600,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2758,"ticketName":"昆仑山","poiId":"3,4","status":1,"validityType":0,"validityDays":1,"validityStart":"-28800","validityEnd":57600,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2759,"ticketName":"【骊山】<芷阳湖>-(孔雀)·芦苞温泉（三水温泉）“青山绿水之间享受自然空调“翠华山1日自驾游","poiId":"3,4","status":1,"validityType":1,"validityDays":1,"validityStart":"1510156800","validityEnd":1510243200,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":2,"name":true,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":true},"buyNote":{"containProjects":"包含项目哦","exclusiveProjects":"不包含项目哦","userTypeNote":"补充说明啊","voucherWay":"兑换方式啊","voucherTime":"取票时间哪","importantNote":"重要条款哈"},"refundRule":{"refundType":1,"partRefund":1,"refundNote":"yg","refundStairsRules":[{"refundFeeMode":4,"refundFee":11.11,"refundTimeType":3,"refundTime":2520}]}},{"ticketId":2760,"ticketName":"【迪士尼】总集+勿动","poiId":"4,3","status":1,"validityType":2,"validityDays":100,"validityStart":"1510070400","validityEnd":1510156800,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":1,"partRefund":1,"refundNote":"接口连接","refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":3,"refundTime":600}]}},{"ticketId":2761,"ticketName":"太白山","poiId":"4,3","status":1,"validityType":0,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2762,"ticketName":"峨眉山","poiId":"4,3","status":1,"validityType":0,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2763,"ticketName":"衡山","poiId":"4,3","status":1,"validityType":0,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2764,"ticketName":"泰山","poiId":"7","status":1,"validityType":0,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2765,"ticketName":"华山","poiId":"3,4","status":0,"validityType":0,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}},{"ticketId":2766,"ticketName":"翠华山","poiId":"7,3","status":0,"validityType":0,"validityDays":1,"validityStart":null,"validityEnd":86400,"bookEarly":"0","activeMinutes":0,"minNum":1,"maxNum":9,"ticketType":1,"visitorInfoRule":{"visitorMode":0,"name":false,"pinyin":false,"mobile":false,"gender":false,"email":false,"idType":false},"buyNote":{"containProjects":null,"exclusiveProjects":null,"userTypeNote":null,"voucherWay":null,"voucherTime":null,"importantNote":null},"refundRule":{"refundType":0,"partRefund":0,"refundNote":null,"refundStairsRules":[{"refundFeeMode":1,"refundFee":0,"refundTimeType":0,"refundTime":0}]}}]}}
//
// console.log(new Date().toLocaleDateString());
// console.log(new Date(new Date().getTime()+30*24*60*60*1000).toLocaleDateString());

// console.log(45111/10000);

// var aa= ',bb'
// console.log(aa.split(','))
