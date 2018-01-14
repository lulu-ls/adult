var globalPath = require('./globalPath.js');
var path = require('path');
var fs = require('fs');
var com=require('winner-common/common');

var logPath=globalPath.logPath;

var logger = {};
function Logger(name,time) {
    var me = this;
    this.path = path.join(logPath,name);
    this.time = time;
    globalPath.makePath(this.path);
    return function (text) {
        if(!logger[name] || !logger[name].writable || logger[name].path.indexOf(new Date().toFormat('YYYY-MM-DD'))==-1)
            logger[name] = fs.createWriteStream(me.path+'/'+ new Date().toFormat('YYYY-MM-DD')+'.log', {flags: 'a'});
        logger[name].write('\r\n'+(me.time?new Date().toFormat('YYYY-MM-DD HH24:MI:SS')+" | ":"")+text);
    }
}

module.exports = {
    access: new Logger("access",false),
    mysql:new Logger("mysql",true),
    file:new Logger("file",true),
    chargeApi:new Logger("chargeApi",true),
    frontBackUrl:new Logger("frontBackUrl",true)
};





