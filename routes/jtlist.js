var express = require('express');
var router = express.Router();
var errCode = require('../models/errCode.js');
var apiUtility = require('../utility/apiUtility');
var JSONRet = require('../models/JSONRet.js');
var ChargeOrder = require("../models/chargeOrder.js");
var chargeTypes = require("../models/chargeTypes.js");
var getPayUrl = require('../utility/getPayUrl.js');
var moment = require('moment');
var logger = require('../utility/logger.js').frontBackUrl;
var async = require('async');
var thirdPartLogin = require('../utility/thirdPartyLogin');

router.post('/getScenicList', getScenicList);//景区列表
router.post('/getScenicDetail', getScenicDetail);//景区详情
router.post('/sendCodeReq', sendCodeReq);//创建订单

router.post('/detail',detail);
router.post('/detailback',detailback);
router.post('/getPriceDetail',getPriceDetail);
router.post('/getOrderByUid',getOrderByUid);
router.post('/getPriceByDate',getPriceByDate);

function getPriceByDate(req,res){

    var sDate = req.body.sDate;
    var productId = req.body.productId;


    price(productId,sDate,function (err , data) {
        if(err){res.json('99','查询当前出行日期价格失败!');}
        res.json(new JSONRet('00','成功',data.data));
    });

}

function getOrderByUid(req,res) {
    var uid = res.locals.user.uid ;
    var page = req.body.page ;
    var size = 20 ;

    ChargeOrder.getOrderByUid(uid,page,size).then(function (val) {

        // if(val.length <= 0){
        //     return res.json(new JSONRet('999','暂无任何订单！'));
        // }

        res.json(new JSONRet('00','成功',val));

    }).catch(function (err) {
        return res.json(new JSONRet(errCode.failure()));
    });
}

function getPriceDetail(req,res) {
    var rest=req.body.data;

    apiUtility({path: '/scenic/getPriceDetail', data: [{ticket_id: rest.ticketId}]}, function (err, data) {
        if(err){res.json(errCode.unknown());}
        if(data.status == 1000){
            var data=data.data;
            res.json(new JSONRet(errCode.success(),{ID_card:data.ID_card == 'Y' ? 1:0,is_ocv:data.is_ocv == 'Y'?1:0}));
        }else{
            res.json(errCode.unknown());
        }
    })

}

function detail(req,res) {
    req.session.ids=req.body.id;
    req.session.tos=req.body.tos;
    if(req.session.ids!=""){
        res.json(new JSONRet(errCode.success(),{data:"ok"}));
    }
}

function detailback(req,res) {
        res.json(new JSONRet(errCode.success(),{tos:req.session.tos,id:req.session.ids}));
}


function getScenicList(req, res) {

    var oList = thirdPartLogin.sData.oList;//所要展示的景区信息对象的id '356', 海洋极地公园 129
    var nList = thirdPartLogin.sData.nList;//所要展示的景区信息对象的id '356', 海洋极地公园 129
    // var ticketList = thirdPartLogin.sData.ticketList; //门票id集合
    // var ticketList = ['2752','2754','2755','2756','2757','2758','2766','2761','2762','2763'];
    var allList = thirdPartLogin.sData.allList;
    apiUtility({path:'ticket/getPoi',data:{method:'multi',poiId:oList.concat(nList)}}, function (err, poiData) {

        if (err) {
            return res.json(new JSONRet(err));
        }

        if (poiData.status == 10000 && poiData.data.data.length>0) {

            for(var i =0;i<poiData.data.data.length;i++){
                var fundData = fundpId(poiData.data.data[i].poiId);
                poiData.data.data[i].productId = fundData.productId;
                // poiData.data.data[i].images = fundData.images;
                poiData.data.data[i].describe = fundData.describe;
                poiData.data.data[i].priceData = fundData.priceData ;
            }

            res.json(new JSONRet(errCode.success(),{poiData:poiData.data,oList:oList}));
        } else {
            return res.json(new JSONRet('999','景区系统维护中！'));
        }
    })
}

//根据poiId寻找productId
function fundpId(poiId) {
    var rsult ={
        productId:[],
        images:'',
        describe:'',
        priceData:{}
    };
    for(var i =0;i<thirdPartLogin.sData.allList.length;i++){
        if(poiId == thirdPartLogin.sData.allList[i].scenicId){
            rsult.productId.push(thirdPartLogin.sData.allList[i].ticketId) ;
            rsult.images = thirdPartLogin.sData.allList[i].simage;
            if(thirdPartLogin.sData.allList[i].introduction)
               rsult.describe = thirdPartLogin.sData.allList[i].introduction;
            if(rsult.priceData.salesPrice ){
                if(rsult.priceData.salesPrice > thirdPartLogin.sData.allList[i].priceData.salesPrice)
                      rsult.priceData = thirdPartLogin.sData.allList[i].priceData;
            }else{
                rsult.priceData = thirdPartLogin.sData.allList[i].priceData;
            }
        };
    }
    return rsult;
}

//调用价格
function price(productId,date,cb) { // tycketId typeof == 'array'

    var sDate = date || new Date().toLocaleDateString();
    apiUtility({path: 'ticket/getStock' , data: {productId:productId,startTime:sDate,endTime:sDate}}, function (err, data) {

        data.data.data[0].salesPrice = data.data.data[0].salesPrice/100;
        data.data.data[0].settlePrice =data.data.data[0].settlePrice/100;
        // var myId=['174','3536','1612','180','204','3636','3535','3097','3299','237','3412','3287','894','2949','3251','2583','4361','766','982'];//'766'‘4461’
        cb(err,data);
    })
}

function getScenicDetail(req, res) {

    var productId = req.body.productId;

    if(!productId){
        return res.json(new JSONRet(errCode.missingParam()));
    }

    apiUtility({path: 'ticket/getProduct' , data: {method:'multi',productId:productId}}, function (err, productData) {
        if (err) {
            return res.json(new JSONRet(err));
        }
        else {
            if (productData.status == '10000' && productData.data.data.length >0) {
                var productData = productData.data.data;
                var count =0;
                for(var i=0;i<productData.length;i++){

                    // price(productData[i].ticketId,function (err, priceData) {
                    price(productId[i],'',function (err, priceData) {
                        count++;
                        if (err) {
                            // return res.json(new JSONRet(err));
                        }
                        else {
                            if(priceData.status == '10000'){
                                for(var j =0;j<productData.length;j++){
                                   for(var k=0;k<priceData.data.data.length;k++){
                                       if(productData[j].ticketId == priceData.data.data[k].productId){
                                           productData[j].priceData = priceData.data.data[k];
                                       }
                                   }
                                }
                                // res.json(new JSONRet(errCode.success(),{productData:productData.data,priceData:priceData.data}));
                            }else{
                                // res.json(new JSONRet('99','景区名额已售罄！'));
                            }

                        }

                        if(count == productData.length){
                            res.json(new JSONRet(errCode.success(),productData));
                        }

                    })
                }
            } else {
                res.json(new JSONRet('99','景区名额已售罄！'));
                return;
            }
        }
    })
}

function sendCodeReq(req, res) {

    var checkTime=req.session.checkTime;
    if(checkTime){
        if((new Date().getTime()-checkTime)<=60000){
            return res.json(new JSONRet({code:'10',msg:'操作频繁！请'+Math.round((60000-(new Date().getTime()-checkTime))/1000)+'秒后重试！' , message:"<10>"+'操作频繁！请'+Math.round((60000-(new Date().getTime()-checkTime))/1000)+'秒后重试！'}));
        }else{
            req.session.checkTime=new Date().getTime();
        }
    }else{
        req.session.checkTime=new Date().getTime();
    }


    // var tos =  req.body.tos;
    //
    var type = 1;
    // if(tos=="scenic"){
    //     type=1;
    // }else {
    //     type=2;
    // }

    var orderno1 = moment(new Date()).format('YYYYMMDDHHmmssSSS') + Math.round(Math.random() * 900 + 100);
    var scenicId = req.body.product.poiId;
    // var scenicTitle = req.body.product.poiName;
    var ticketId = req.body.ticketId;
    // var ticketName = req.body.ticketName;
    var quantity = req.body.quantity;
    var toDate = req.body.toDate;
    var contactName = req.body.name;
    var contactMobile = req.body.tel;
    var ptime=new Date().getTime();
    var moneys =req.body.totalprice;
    var IDname=req.body.IDname;
    var IDnumber=req.body.IDnumber;
    var ID_card=req.body.ID_card;
    var is_ocv=req.body.is_ocv;
    var settlePrice= req.body.settlePrice;
    var email=req.body.email;
    var pinyin=req.body.pinyin;

    ChargeOrder.findOne({
        attributes: ['orderNo','uid', 'account', 'ttime', 'amt', 'scenicId', 'ticketId', 'tel', 'quantity', 'type', 'ptime','IDname','IDnumber'],//查询数据的列
        where: {
            ID_card: 1,
            IDnumber:IDnumber,
            status:{
                '$ne': 0,
            },
            ttime:{
                '$gte': toDate+' 00:00:00',//大于等于
                '$lte': toDate+' 23:59:59',//小于等于
            }
        }
    }).then(function (val) {
        if(val){
            return res.json(new JSONRet(errCode.orderFailure()));
        }

        ChargeOrder.create({
            type: type,
            uid: res.locals.user.uid,
            orderNo: orderno1,//订单号
            scenicId:scenicId,//景点id
            // scenicTitle:scenicTitle,//景点名称
            ticketId:ticketId,//门票id
            // ticketName:ticketName,//门票名称
            account: contactName,//出行人姓名
            tel:contactMobile,//接受短信电话
            ttime: toDate,//出行时间
            ptime:ptime,//订票时间
            quantity: quantity,//门票数量
            amt: moneys,//金额
            settlePrice: settlePrice,//结算
            status: 0,
            resMsg: "",
            IDname:IDname,
            IDnumber:IDnumber,
            ID_card:ID_card,
            is_ocv:is_ocv,
            email:email,
            pinyin:pinyin
        }).then(function (val) {
            var url = getPayUrl(res.locals.user.uid, res.locals.user.token, res.locals.user.unique, chargeTypes[scenicId], val.dataValues.id, moneys);
            res.json(new JSONRet(errCode.success(), url));
        }).catch(function (err) {
            return res.json(new JSONRet(errCode.failure()));
        })

    }).catch(function (err) {
        return res.json(new JSONRet(errCode.failure()));
    })

}

module.exports = router;
