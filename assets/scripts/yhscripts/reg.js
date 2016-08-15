/**
 * Created by zhan on 2016/7/19.
 */

var register = {
    userName: '',
    password: '',
    validateCode: '',
    phone: ''
};

$(function () {
    $('.btnReg  ').on('click', function () {
        if(!$('#bmh-reg-form').valid()){
            return 0;
        }

        register.userName = $('.username').val();
        register.password = hex_md5($('.password').val());
        register.phone = $('.phone').val();
        register.validateCode = '';

        YhHttp.init(YhHttpServiceCode.REGISTER.CODE);
        YhHttp.send(register, registerCallBack);
    });
});

var registerCallBack = function(result){
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.status == '0000') {
            $.cookie('username', $('.username').val(), {expires: 7, path: '/'});
            $.cookie('password', $('.password').val(), {expires: 7, path: '/'});
            $.cookie('userId', resultObj.parameter.userId, {expires: 7, path: '/'});
            window.location.href = 'index.html';
        } else {
            layer.msg(resultObj.parameter.message);
        }
    } else {
        layer.msg("注册请求服务器异常！");
    }
};