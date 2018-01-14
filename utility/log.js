/**
 * Created by likai on 2017/4/26.
 */
var log4js = require('log4js');

log4js.configure({

    appenders: [
        {
            type: 'console',
            category: "console"

        }, //控制台输出
        {
            type: "file",
            filename: 'logs/log.log',
            pattern: "_yyyy-MM-dd",
            maxLogSize: 20480,
            backups: 3,
            category: 'console'

        }//日期文件格式
    ],
    replaceConsole: true,   //替换console.log
});


var dateFileLog = log4js.getLogger('dateFileLog');
var consoleLog = log4js.getLogger('console');
exports.logger = consoleLog;


exports.use = function(app) {
    app.use(log4js.connectLogger(consoleLog, {level:'INFO', format:':method :url'}));
}
