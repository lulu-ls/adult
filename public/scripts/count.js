/**
 * Created by hunao on 2017/6/15.
 */
//    订单计数器
$(function () {
    var t = $("#text_box");
        $("#add").click(function(){
            //设置最大值为10
            if(parseInt(t.val())==10||parseInt(t.val())>10){
                return
            };
            t.val(parseInt(t.val())+1);
        });
        $("#min").click(function(){
            //设置最小值为1
            if(parseInt(t.val())==1){
                return
            };
        t.val(parseInt(t.val())-1)
        });
});