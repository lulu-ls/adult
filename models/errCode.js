function ErrCode(code,msg){
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.msg = msg;
    this.message = "<"+code+">"+msg;
}
// require('util').inherits(ErrCode, Error);

function ErrDefine(code,msg) {
    var me = this;
    this.code = code;
    this.msg = msg;
    return function (msg) {
        return new ErrCode(me.code,me.msg + (msg || ""));
    }
}
module.exports = {
    "success" : new ErrDefine("00","操作成功"),
    "faileName" : new ErrDefine("001","用户名不存在"),
    "unknown" : new ErrDefine("99","未知错误"),
    "transactionFailure":new ErrDefine("0","交易失败"),
    "successfulTrade":new ErrDefine("1","交易成功"),
    "inTransaction":new ErrDefine("3","交易中"),
    "missingParam":new ErrDefine("01","缺少参数"),
    "illegalParam" : new ErrDefine("05","参数无效"),
    "desEncryptFailed" : new ErrDefine("06","DES加密异常"),
    "sysErr":new ErrDefine("02","系统内部错误"),
    "failure":new ErrDefine("08","操作失败"),
    "orderFailure":new ErrDefine("09","身份证在当前出行日期不可重复出行")
};
