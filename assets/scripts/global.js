/**
 * Created by zhan on 2016/5/16.
 */
var changePswTable = {
    type: '',
    phone: '',
    userId: '',
    oldPassword: '',
    newPassword: ''
};

$(function () {

    //显示用户名
    var username = $.cookie('username');
    if (typeof(username) != "undefined" && username != null && username != '') {
        $('#userName').text(username);
    } else {
        $('#userName').text('管理员');
    }

    //点击修改密码弹出对话框
    $('#changePsw').on('click', function () {

        $('#oldPsw').val('');
        $('#newPsw').val('');
        $('#conformPsw').val('');
        $('.help-block').remove();

        layer.open({
            type: 1,
            title: '修改密码',
            area: 'auto',
            maxWidth: '450px',
            shadeClose: false,
            content: $('#changePassword'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if (!$('#modifyPasswordInfo').valid()) {
                    return 0;
                }
                YHLayer.loading();
                changePsw();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了设置', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });

    function changePsw() {

        if ($.cookie('userId') == null || $.cookie('userId') == '') {
            return;
        }

        changePswTable.type = '00';
        changePswTable.userId = $.cookie('userId');
        changePswTable.newPassword = hex_md5($('#newPsw').val());
        changePswTable.oldPassword = hex_md5($('#oldPsw').val());

        YhHttp.init(YhHttpServiceCode.MODIFY_USER_PASSWORD.CODE);
        YhHttp.send(changePswTable, changePswCallBack);
    }

    var changePswCallBack = function (result) {
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter.status != null && resultObj.parameter.status == '0000') {
                YHLayer.closeAllLayer();
                var password = $.cookie('password');
                if (typeof(password) != 'undefined' && password != null && password != '') {
                    $.cookie('password', $('.password').val(), {expires: 7, path: '/'});
                }
                layer.msg('密码修改成功！', {icon: 1, time: 1000}, function () {
                });
            } else {
                YHLayer.closeAllLayer();
                layer.msg('密码修改失败，请稍候重试！', {icon: 2, time: 1000}, function () {
                });
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常，请稍候重试！', {icon: 0, time: 1000}, function () {
            });
        }

    };

    //点击按钮table增加一行
    $('.add').on('click', function () {
        layer.open({
            type: 1,
            title: '温馨提示',
            area: ['360px', '240px'],
            shadeClose: true,
            content: '\<\div >请通过手机APP新增，如未安装，<br/>请扫描如下二维码下载：\<\/div>' +
            '\<\img src="assets/img/zyqm_apk.png" alt="">\<\/img>'
        });
    });

    $('.delete').on('click', function () {
        $(this).parent('td').parent('tr').remove();
    });

    function delCookie(name) {
        var date = new Date();
        date.setTime(0);
        var str = name + "=" + encodeURIComponent('') + "; expires=" + date.toGMTString() + "; path=/";
        document.cookie = str;
    }

});

function formatDateString(value) {
    if (value.length == 14) {
        return value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8) + " " + value.substring(8, 10) + ":" + value.substring(10, 12) + ":" + value.substring(12, 14);
    } else {
        return null;
    }
}