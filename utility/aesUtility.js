var crypto = require("crypto");

var dataBuffer=crypto.publicEncrypt({key:publicFile,padding:constants.RSA_PKCS7_PADDING},new Buffer(data));
var msg= dataBuffer.toString("base64");