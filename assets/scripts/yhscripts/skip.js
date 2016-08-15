/**
 * Created by zhan on 2016/7/15.
 */
$(function () {
    skipLogin();
    
    /*注销删除cookie*/
    $('#logOut').on('click', function(){
        $.cookie('userId', '', {expires: -1, path: '/'});
        skipLogin();
    });
});

var skipLogin = function () {
    var loginUserId = $.cookie('userId');
    if (loginUserId == undefined || loginUserId == '' || loginUserId == null) {
        window.location.href = 'login.html';
    }
};