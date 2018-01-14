var assert = require('assert');
var crypto = require('crypto');

function encrypt(text,key) {
    try{
        if(key.length>8){
            key = key.substr(0,8);
        }
        var iv = new Buffer(8);
        iv.fill(0);
        //创建密码实例
        var cipher = crypto.createCipheriv('des-cbc', new Buffer(key), iv);
        var encrypt = cipher.update(text, 'utf8', 'base64');
        encrypt += cipher.final('base64');
        return (encrypt);
    }
    catch(e){
        return;
    }
}

function decrypt(text,key) {
    try{
        if(key.length>8){
            key = key.substr(0,8);
        }
        var iv = new Buffer(8);
        iv.fill(0);
        var cipher = crypto.createDecipheriv('des-cbc', new Buffer(key), iv);
        var decrypt = cipher.update(text, 'base64', 'utf8');
        decrypt += cipher.final('utf8');
        return (decrypt);
    }
    catch(e){
        return;
    }
}

module.exports = {
    encrypt:encrypt,
    decrypt:decrypt
};

// console.log(encrypt('13002937208'));
// console.log(decrypt(encrypt('13002937208')));
