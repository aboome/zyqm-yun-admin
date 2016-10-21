/**
 * Created by zhan on 2016/5/19.
 */

var queryControlDeviceDetail = {
    deviceUUid: ''
};
var modifyControlDevice = {
    userId: '',
    dpId: '',
    deviceId: '',
    deviceName: '',
    deviceProtocol: '',
    deviceAddr: '',
    deviceDesc: ''
};
var deleteControlDevice = {
    deviceId: ''
};
var queryControlDeviceTable = {
    userId: '',
    pageNum: '',
    pageSize: ''
};

var queryUserDpList = {
    userId: ""
};

var dataTableList = null;

$(function () {

    function queryUserDpListById() {

        var loginUserId = $.cookie('userId');

        if (null == loginUserId) {
            return;
        }

        queryUserDpList.userId = loginUserId;

        YhHttp.init(YhHttpServiceCode.QUERY_DP_LIST_BY_USER_ID.CODE);
        YhHttp.send(queryUserDpList, queryDpListCallBack);

    }

    queryUserDpListById();

    $("#changDpInfo").live("change", function () {
        queryControlDeviceListTable();

    });

    /* 修改按钮 */
    $('.modify').live('click', function () {

        $('.help-block').remove();

        var controlName = $(this).parents('tr').children('td:nth-child(2)').text();
        var fieldName = $(this).parents('tr').children('td:nth-child(3)').text();
        var IENum = $(this).parents('tr').children('td:nth-child(4)').text();
        var gwName = $(this).parents('tr').children('td:nth-child(5)').text();
        var controlType = $(this).parents('tr').children('td:nth-child(6)').text();
        var deviceProtocol = $(this).parents('tr').children('td:nth-child(9)').text();

        $('#controlName').attr('value', controlName);
        $('#fieldName').html(fieldName);
        $('#IENum').html(IENum);
        $('#gwName').html(gwName);
        $('#controlType').html(controlType);

        modifyControlDevice.userId = $.cookie('userId');
        modifyControlDevice.dpId = $(this).parents('tr').children('td:nth-child(8)').text();
        modifyControlDevice.deviceId = $(this).parents('tr').children('td:nth-child(1)').text();
        modifyControlDevice.deviceName = $(this).parents('tr').children('td:nth-child(2)').text();
        modifyControlDevice.deviceDesc = $(this).parents('tr').children('td:nth-child(11)').text();
        modifyControlDevice.deviceProtocol = $(this).parents('tr').children('td:nth-child(9)').text();
        modifyControlDevice.deviceAddr = $(this).parents('tr').children('td:nth-child(10)').text();

        layer.open({
            type: 1,
            title: '修改控制设备信息',
            area: 'auto',
            maxWidth: '550px',
            content: $('#modifyControl'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {

                var modifiedControlName = $(layero).find('#controlName').val();

                if (switchModel == 'SWITCH-101') {
                    modifyControlDevice.deviceProtocol = '1000';
                } else if (switchModel == 'SWITCH-102') {
                    modifyControlDevice.deviceProtocol = '1100';
                } else if (switchModel == 'SWITCH-103') {
                    modifyControlDevice.deviceProtocol = '1000';
                }

                modifyControlDevice.deviceName = modifiedControlName;

                if(!$('#modifyControlInfo').valid()){
                    return 0;
                }

                YHLayer.loading();

                YhHttp.init(YhHttpServiceCode.MODIFY_CONTROL_DEVICE.CODE);
                YhHttp.send(modifyControlDevice, modifyControlDeviceCallBack);

            }, btn2: function () {
                layer.msg('您已经取消了修改', {
                    time: 1000, //5s后自动关闭
                    btn: ['知道了']
                });
            }
        });

        queryControlDeviceDetail.deviceUUid = IENum;

        YhHttp.init(YhHttpServiceCode.QUERY_CONTROL_DEVICE_DETAIL.CODE);
        YhHttp.send(queryControlDeviceDetail, queryControlDeviceDetailCallBack);
    });


    /* 解绑删除 */
    $('.delete').live('click', function () {
        deleteControlDevice.deviceId = $(this).parents('tr').children('td:nth-child(1)').text();

        layer.open({
            type: 1,
            title: '解绑控制设备',
            area: ['320px', '180px'],
            shadeClose: false,
            content: $('#unbindDevice'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                YhHttp.init(YhHttpServiceCode.DELETE_CONTROL_DEVICE.CODE);
                YhHttp.send(deleteControlDevice, deleteControlDeviceCallBack);
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了解绑', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });
});

var queryControlDeviceTableCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            $("#tableMessage").html("");
            $("#tableMessage").html("暂无数据");
            return;
        } else {
            dataTableList = resultObj.parameter;
            var tpl = $('#controlTbTpl').html();
            var tableHtml = juicer(tpl, dataTableList);
            $("#controlTb").append(tableHtml);
            $("#tableMessage").html("");
        }
    } else {
        $("#tableMessage").html("");
        $("#tableMessage").html("暂无数据");
    }
};

var modifyControlDeviceCallBack = function (result) {
    YHLayer.closeAllLayer();
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.status != null && resultObj.parameter.status == '0000') {
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryControlDeviceListTable();
            });
        } else {
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryControlDeviceListTable();
            });
        }
    } else {
        layer.msg('请求服务器异常，请稍后再试！', {icon: 0, time: 1000}, function () {
            queryControlDeviceListTable();
        });
    }
};

var switchModel = "";

var queryControlDeviceDetailCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter == null || resultObj.parameter == '') {
            return;
        } else {
            dataTableList = resultObj.parameter;
            var tpl = $('#controlTbTpl').html();
            var tableHtml = juicer(tpl, dataTableList);
            $("#controlTb").append(tableHtml);

            switchFunc();

        }
    } else {
        layer.msg("请求服务器异常！");
    }

    var existProtocol = resultObj.parameter.existProtocol;
    switchModel = resultObj.parameter.switchModel;
    var existProtocolArray = new Array();
    var deviceProtocolArray = new Array();
    deviceProtocolArray = modifyControlDevice.deviceProtocol.split("");
    if (undefined !== existProtocol && null != existProtocol && "" != existProtocol) {
        existProtocolArray = existProtocol.split("");
    }

    var rdo = $('input[name = "rdo"]');

    $.each(rdo, function (i, item) {
        var protocol = deviceProtocolArray[i] + existProtocolArray[i];
        selRdo($(item), protocol);
    });

    function selRdo(rdo_btn, protocol) {
        switch (protocol) {
            case '01':
            case '10':
                rdo_btn.prop({disabled: true});
                break;
            case '11':
                rdo_btn.prop({checked: true});
                break;
            case '00':
                break;
        }
    }

    function switchFunc() {
        var switchModel = resultObj.parameter.switchModel;
        if (switchModel == 'SWITCH-100') {
            $(function () {
                $('<p>', {
                    class: 'rdoP',
                    text: '设备控制协议：'
                }).appendTo('.switchModel');
                $('<input />', {
                    id: 'rdo-1',
                    class: 'rdo',
                    type: 'radio',
                    name: 'rdo',
                    val: '1号端口'
                }).appendTo('.switchModel');
                $('<label>', {
                    text: '1号端口',
                }).appendTo('.switchModel');
                $('<input />', {
                    id: 'rdo-2',
                    class: 'rdo',
                    type: 'radio',
                    name: 'rdo',
                    val: '2号端口'
                }).appendTo('.switchModel');
                $('<label>', {
                    text: '2号端口'
                }).appendTo('.switchModel');
                $('<input />', {
                    id: 'rdo-3',
                    class: 'rdo',
                    type: 'radio',
                    name: 'rdo',
                    val: '3号端口'
                }).appendTo('.switchModel');
                $('<label>', {
                    text: '3号端口',
                }).appendTo('.switchModel');
            });
        }
    }
};

var deleteControlDeviceCallBack = function (result) {
    YHLayer.closeAllLayer();
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.status != null && resultObj.parameter.status == '0000') {
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryControlDeviceListTable();
            });
        } else {
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryControlDeviceListTable();
            });
        }
    } else {
        layer.msg('请求服务器异常，请稍后再试！', {icon: 0, time: 1000}, function () {
            queryControlDeviceListTable();
        });
    }
};

/* 查询分页 */
var queryControlDeviceListTable = function () {
    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    var dpId = $("#changDpInfo").attr("value");

    if (dpId == null || dpId == '') {
        layer.msg("请选择大棚！");
        return;
    }

    $("#controlTb").html("");

    if (dpId == '-1') {
        return;
    }

    $("#tableMessage").html("加载中...");

    queryControlDeviceTable.userId = $.cookie('userId');
    queryControlDeviceTable.dpId = dpId;
    queryControlDeviceTable.pageNum = 1;
    queryControlDeviceTable.pageSize = 100;

    YhHttp.init(YhHttpServiceCode.PAGE_QUERY_CONTROL_DEVICE_LIST.CODE);
    YhHttp.send(queryControlDeviceTable, queryControlDeviceTableCallBack);
};

var queryDpListCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            return;
        } else {
            var param = resultObj.parameter;
            var tpl = $('#dpListTpl').html();
            var htmlContent = juicer(tpl, param);
            $("#dpListInUserId").html(htmlContent);

            $("select option:nth-child(2)").attr("selected", "selected");
            queryControlDeviceListTable();
        }

    } else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};