/**
 * Created by hunao on 2017/6/14.
 */
$(function () {
    // 模态框弹出
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });
});
