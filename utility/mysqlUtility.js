var Sequelize = require('sequelize');
var process = require("process");
var mysqlLogger = require("./logger.js").mysql;
var mysqlServers = require("winner-common/mysqlServers1.js");
var winnerDBConf = mysqlServers.winnerDB;

var winnerDB = new Sequelize(winnerDBConf.database, winnerDBConf.user, winnerDBConf.password,{
    host:winnerDBConf.host,
    port:winnerDBConf.port,
    pool:{
        max:winnerDBConf.maxConnections
    },
    logging:winnerDBConf.logging?console.log:false,
    define:{
        timestamps:false,
        freezeTableName:true,
        underscored:false
    },
    query:{
        raw:true
    },
    timezone: '+08:00', //here you can pass timezone
});

var originalQuery = winnerDB.query;
Sequelize.prototype.query = function (sql,option) {
    return originalQuery.apply(this, arguments).catch(function (err) {
        mysqlLogger(err.original+"\r\n"+err.sql);
        throw err;
    });
};

module.exports = winnerDB;

