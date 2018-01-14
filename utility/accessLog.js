
var accessLogger = require('./logger.js').access;
var dateUtils = require('date-utils');

var accessLog = function(req,res,next){
    var uid = req.query.uid || req.body.uid;
    var time = new Date();
    var ip = req.ip
        || req._remoteAddress
        || (req.connection && req.connection.remoteAddress)
        || undefined ;

    var method = req.method;
    var host = req.get('host');
    var url =  req.originalUrl || req.url;
    var Interface =  req._parsedUrl.pathname ||  req._parsedOriginalUrl.pathname;
    var httpVersion = req.httpVersionMajor + '.' + req.httpVersionMinor;
    var userAgent =req.headers['user-agent'];
    var reqBody = JSON.stringify(req.body);

    var line = uid+ "|" + time.toFormat('YYYY-MM-DD HH24:MI:SS') + "|" + ip + "|" + method + "|" + host + "|" + url  + "|" + reqBody + "|" + httpVersion + "|" + userAgent;
    accessLogger(line);
    next();
};

module.exports = accessLog;