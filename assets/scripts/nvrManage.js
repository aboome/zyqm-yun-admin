/**
 * Created by wunder on 16/8/2.
 */
var queryNVRList = {
    userId: ''
};

$(function () {

    YHLayer.loading();
    queryNVRDataTable();

    /* 查看监控视频 */
    $('.videoView').live('click', function(){
        var subDomain = $(event.target).attr('data-subDomain');
        var wanPort = $(event.target).attr('data-wanPort');
        window.open('http://'+subDomain+'.dahuaddns.com:'+wanPort);
    });
});

var queryNVRDataTable = function () {
    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    queryNVRList.userId = $.cookie('userId');

    YhHttp.init(YhHttpServiceCode.QUERY_HARD_NVR_LIST.CODE);
    YhHttp.send(queryNVRList, queryNVRListCallBack);
};

var queryNVRListCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
            return;
        } else {
            YHLayer.closeAllLayer();
            var dataTableList = resultObj.parameter;
            var tpl = $('#nvrTbTpl').html();
            var tableHtml = juicer(tpl, dataTableList);
            $("#cameraTb").append(tableHtml);
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};