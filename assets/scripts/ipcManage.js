/**
 * Created by zhan on 2016/5/19.
 */
var queryIPCList = {
    userId: ''
};

$(function () {

    YHLayer.loading();
    queryIPCDataTable();

    /* 查看监控视频 */
    $('.videoView').live('click', function(){
        var subDomain = $(event.target).attr('data-subDomain');
        var wanPort = $(event.target).attr('data-wanPort');
        window.open('http://'+subDomain+'.dahuaddns.com:'+wanPort);
    });
});

var queryIPCDataTable = function () {
    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    queryIPCList.userId = $.cookie('userId');

    YhHttp.init(YhHttpServiceCode.QUERY_NETWORK_IPC_LIST.CODE);
    YhHttp.send(queryIPCList, queryIPCListCallBack);
};

var queryIPCListCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
            return;
        } else {
            YHLayer.closeAllLayer();
            var dataTableList = resultObj.parameter;
            var tpl = $('#ipcTbTpl').html();
            var tableHtml = juicer(tpl, dataTableList);
            $("#cameraTb").append(tableHtml);
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};