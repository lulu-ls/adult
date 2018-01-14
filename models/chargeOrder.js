var Sequelize =  require("sequelize");
var mysqlUtility =  require("../utility/mysqlUtility.js");

var ChargeOrder = mysqlUtility.define('juntuInfo', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    uid: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    orderNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    scenicId:{
        type: Sequelize.STRING
    },
    ticketId:{
        type: Sequelize.STRING
    },
    account:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tel:{
        type: Sequelize.STRING
    },

    ttime:{
        type: Sequelize.DATE,
        allowNull: false,
        validate:{
            isDate : true,
            isAfter: "2017-01-01"
        }
    },
    ptime:{
        type:Sequelize.DATE,
        validate:{
            isDate : true,
            isAfter: "2017-01-01"
        }
    },
    quantity  :{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    amt:{
        type:Sequelize.DECIMAL(12, 2),
        allowNull: false
    },
    settlePrice:{
        type:Sequelize.DECIMAL(12, 2),
        allowNull: false
    },
    status:{
        type:Sequelize.INTEGER,
        allowNull: false
    },

    resMsg: {
        type:Sequelize.STRING
    },
    verificationTime: {
        type:Sequelize.STRING
    },
    IDname:{
        type:Sequelize.STRING
    },
    IDnumber:{
        type:Sequelize.STRING
    },
    pinyin: {
        type:Sequelize.STRING
    },
    email: {
        type:Sequelize.STRING
    },
    ID_card:{
        type: Sequelize.INTEGER
    },
    is_ocv:{
        type: Sequelize.INTEGER
    },
    orderId:{
        type: Sequelize.INTEGER
    },
    jtOrderId: {
        type:Sequelize.STRING
    },
    jtCode: {
        type:Sequelize.STRING
    },
    vouchers : {
        type:Sequelize.STRING
    },
    codeStatus: {
        type:Sequelize.STRING
    },
    refundId: {
        type:Sequelize.STRING
    },
    refundFee: {
        type:Sequelize.STRING
    },
    requestTime: {
        type:Sequelize.STRING
    },
    responseTime: {
        type:Sequelize.STRING
    }
},{
    // tableName: 'chargeOrder', //自定义表名称
    // timestamps: false //不使用createAt,updateAt
});
module.exports = ChargeOrder;

//自定义查询Promise封装
ChargeOrder.getOrderByUid = function(uid,page,size){
    page = page || 1;
    size = size || 20;
    return new Promise(function(resolve, reject) {
        mysqlUtility.query("SELECT ji.`account`,ji.`tel`,ji.`ttime`,ji.`ptime`,ji.`amt`,CASE ji.`status` WHEN 2 OR 3 THEN '成功' WHEN 4 THEN '退款中' WHEN 5 THEN '退款成功' ELSE '失败' END as status,ji.`orderId`,ji.`jtOrderId`,jm.`scenicTitle`,jm.`ticketName`,ji.`quantity` FROM juntuInfo ji LEFT JOIN juntuMiddle jm ON ji.scenicId = jm.scenicId and ji.ticketId=jm.ticketId WHERE ji.uid = :uid AND ji.status NOT IN(0,1) LIMIT :s,:e",
            { replacements: { uid: uid , s: size*(page - 1), e: size}, type: mysqlUtility.QueryTypes.SELECT }
        ).then(function(val) {
            resolve(val)
        }).catch(function(err){
            reject(err)
        });
    });
};

ChargeOrder.getByOrderNo = function(orderNo){
    return new Promise(function(resolve, reject) {
        mysqlUtility.query('SELECT * FROM juntuInfo WHERE orderNo = :orderNo ',
            { replacements: { orderNo: orderNo }, type: mysqlUtility.QueryTypes.SELECT }
        ).then(function(val) {
            resolve(val)
        }).catch(function(err){
            reject(err)
        });
    });
};

ChargeOrder.getByUid = function(uid){
    return new Promise(function(resolve, reject) {
        mysqlUtility.query('SELECT * FROM customers WHERE uid = :uid ',
            { replacements: { uid: uid }, type: mysqlUtility.QueryTypes.SELECT }
        ).then(function(val) {
            resolve(val)
        }).catch(function(err){
            reject(err)
        });
    });
};

