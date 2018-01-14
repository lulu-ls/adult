var Sequelize =  require("sequelize");
var mysqlUtility =  require("../utility/mysqlUtility.js");

var chargeOrderCreditMsg = mysqlUtility.define('chargeOrderCreditMsg', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cardName: {
        type: Sequelize.INTEGER
    },
    paynumber: {
        type: Sequelize.INTEGER
    }
},{
    // tableName: 'chargeOrder', //自定义表名称
    // timestamps: false //不使用createAt,updateAt
});

module.exports = chargeOrderCreditMsg;


