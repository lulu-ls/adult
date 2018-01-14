/**
 * Created by ZhangChi on 2017/11/21.
 */
var crypto = require('crypto');

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
var key = "1789e68e4f7c0985";
// var iv = new Buffer(16);
// iv.fill(0);
var encrypt = function (data) {
    data = JSON.stringify(data)
    var cipher = crypto.createCipheriv('aes-128-cbc', key, key);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
var decrypt = function (crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};

module.exports = {
    encrypt:encrypt,
    decrypt:decrypt
}
// console.log(decrypt('Yt1EDt1w4lso6wB2eECSMLvYmRW4Vn7gazELDGBx+XLC88IdbAyeuU6CnUTRLBi4'));
// var key = '751f621ea5c8f930';
// console.log('加密的key:', key.toString('hex'));
// var iv = '2624750004598718';
// console.log('加密的iv:', iv);
// var data = "Hello, nodejs. 演示aes-128-cbc加密和解密";
// console.log("需要加密的数据:", data);
// var crypted = encrypt( data);
// console.log("数据加密后:", crypted);
// var dec = decrypt( crypted);
// console.log("数据解密后:", dec);