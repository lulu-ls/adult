
function getStatusMsg(status){
    var msg ='您的账户存在异常,已被暂时冻结!';
    if(status==0){
        msg = '您的账户已暂时使用!';
    }
    else if(status==2){
        msg = '您的账户已暂时冻结!';
    }
    else if(status==3){
        msg = '您的账户存在被盗风险,已暂时冻结!';
    }
    return msg;
}


module.exports = getStatusMsg;

