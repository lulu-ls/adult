var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

var globalPath = require('./globalPath.js');
var logger= require('./logger.js');
var mysqlErrorLogger = logger.mysql;
var fileErrorLogger = logger.file;

var mysqlHelper = require('winner-common/mysqlHelper.js');
var mysqlServers = require('winner-common/mysqlServers1.js');

var pool = mysql.createPool(mysqlServers.winner190);
module.exports = new mysqlHelper(pool,globalPath,mysqlErrorLogger,fileErrorLogger);