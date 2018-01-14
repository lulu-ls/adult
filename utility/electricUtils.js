/**
 * Created by main on 2017/4/27.
 */
var randoms=function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var formatDate=function timeFormatter(value) {
    var da = new Date(value.replace("/Date(", "").replace(")/" , "").split( "+")[0]);
    return da.getFullYear() + "-" + (da.getMonth() + 1) + "-" + da.getDate() + " " + da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
}
Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))
        format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

function chGMT(gmtDate){
    var mydate = new Date(gmtDate);
    mydate.setHours(mydate.getHours());
    return mydate.format("yyyy-MM-dd hh:mm:ss");
}

module.exports={
    randoms:randoms,
    formatDate:formatDate,
    chGMT:chGMT
};