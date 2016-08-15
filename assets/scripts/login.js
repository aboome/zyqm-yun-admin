/**
 * Created by zhan on 2016/7/19.
 */
$(function () {
    $('#btnLogin').on('click', function () {
        if(!$('#bmh-form').valid()){
            return 0;
        }

        login.userName = $('.username').val();
        login.password = hex_md5($('.password').val());

        YHLayer.loading();

        YhHttp.init(YhHttpServiceCode.LOGIN.CODE);
        YhHttp.send(login, loginCallBack);

    });
});

var login = {
    userName: '',
    password: ''
};

var loginCallBack = function(result){
    YHLayer.closeAllLayer();
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.status == '0000') {
            isCookie();
            $.cookie('userId', resultObj.parameter.userId, {expires: 7, path: '/'});
            $.cookie('username', $('.username').val(), {expires: 7, path: '/'});
            window.location.href = 'index.html';
        } else {
            layer.msg(resultObj.parameter.message);
        }
    } else {
        layer.msg("登录请求服务器异常！");
    }
};

var isCookie = function () {
    var isRemember = $("#remember:checked");
    if (isRemember.size()>0) {
        $.cookie('password', $('.password').val(), {expires: 7, path: '/'});
    } else {
        $.cookie('password', '', {expires: -1, path: '/'});
    }
};

var Login = function () {
    return {
        init: function () {
            var username = $.cookie('username');
            var password = $.cookie('password');
            if (username != null && username != '' && password != null && password != '') {
                $('.username').val(username);
                $('.password').val(password);
                $('#remember').prop('checked', true);
            } else {
                $('.username').val('');
                $('.password').val('');
            }
        }

    };
}();

var forgetPassword = function () {
    var msg = juicer($('#forgetPass').html(), 0);
    layer.open({
        type: 1,
        title: '忘记密码？',
        area: ['330px', '240px'],
        shadeClose: true,
        content: msg,
        scrollbar: false,
        btn: ['确定'],
    });
};