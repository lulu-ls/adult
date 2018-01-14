function JSONRet(code,msg,data){
    if(typeof code=="object"){
        this.respCode = code.code;
        this.respMsg = code.msg;
        if(msg)
            this.data = msg;
    }
    else{
        this.respCode = code;
        this.respMsg = msg;
        if(data)
            this.data = data;
    }
}


module.exports = JSONRet;