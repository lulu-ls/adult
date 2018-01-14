var path = require('path');
var fs = require('fs');

var appDir = path.dirname(__dirname);
var appDirPath = path.dirname(appDir);
var logPath = path.join(appDirPath ,'logs','jtapp');

var makePath = function(dest) {
    var stat = null;
    try {
        stat = fs.statSync(dest);
    } catch(err) {
        fs.mkdirSync(dest);
    }
    if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
};
makePath(logPath);

module.exports = {
    makePath:makePath,
    appDir:appDir,
    appDirPath:appDirPath,
    logPath:logPath
};
