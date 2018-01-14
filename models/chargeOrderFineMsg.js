var Sequelize =  require("sequelize");
var mysqlUtility =  require("../utility/mysqlUtility.js");

var chargeOrderFineMsg = mysqlUtility.define('chargeOrderFineMsg', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hphm: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    uid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    province: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    vin: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    jszh: {
        type: Sequelize.INTEGER,
        allowNull: true
    }

},{
    // tableName: 'chargeOrder', //自定义表名称
    // timestamps: false //不使用createAt,updateAt
});

module.exports = chargeOrderFineMsg;


