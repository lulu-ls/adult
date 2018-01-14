var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

var globalPath = require('./globalPath.js');
var logger= require('./logger.js');
var mysqlErrorLogger = logger.mysqlErrorLogger;
var fileErrorLogger = logger.fileErrorLogger;

var mysqlHelper = require('winner-common/mysqlHelper.js');
var mysqlServers = require('winner-common/mysqlServers.js');

var pool = mysql.createPool(mysqlServers.winner190);
module.exports = new mysqlHelper(pool,globalPath,mysqlErrorLogger,fileErrorLogger);