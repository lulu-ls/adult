var encrypt = require('winner-common/encrypt.js');

exports.createToken = function(name){
    var tokenObj = [Math.floor(new Date().getTime() / 1000),name];
    var tokenStr = JSON.stringify(tokenObj);
    var token = encrypt.aes128en(tokenStr);
    return token;
};

exports.getToken = function(text){
    try {
        var tokenStr = encrypt.aes128de(text);
        var tokenObj = JSON.parse(tokenStr);
        return tokenObj;
    } catch (err) {
        return false;
    }
};

// console.log(exports.createToken('13002937208'));