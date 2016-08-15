/**
 * Created by zhan on 2016/5/16.
 */
var querySensorTable = {
    userId: '',
    dpId: '',
    pageNum: '',
    pageSize: ''
};

var modifySensorTable = {
    userId: '',
    dpId: '',
    sensorUuid: '',
    sensorName: '',
    sensorDesc: ''
};

var delSensorTable = {
    sensorUuid: ''
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
        querySensorDataTable();
    });

    /* 修改按钮 */
    $('.modify').live('click', function () {

        $('.help-block').remove();

        modifySensorTable.dpId = $(this).parents('tr').children('td:nth-child(1)').text();
        var sensorName = $(this).parents('tr').children('td:nth-child(2)').text();
        var fieldName = $(this).parents('tr').children('td:nth-child(3)').text();
        var IENum = $(this).parents('tr').children('td:nth-child(4)').text();
        var gwName = $(this).parents('tr').children('td:nth-child(5)').text();
        var sensorType = $(this).parents('tr').children('td:nth-child(6)').text();
        $('#sensorName').attr('value', sensorName);
        $('#fieldName').html(fieldName);
        $('#IENum').html(IENum);
        $('#gwName').html(gwName);
        $('#sensorType').html(sensorType);

        modifySensorTable.sensorUuid = IENum;
        modifySensorTable.sensorDesc = $(this).parents('tr').children('td:nth-child(8)').text();

        layer.open({
            type: 1,
            title: '修改传感器信息',
            area: 'auto',
            maxWidth: '450px',
            content: $('#modifySensor'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {

                if(!$('#modifySensorInfo').valid()){
                    return 0;
                }

                YHLayer.loading();
                modifySensorTable.sensorName = $('#sensorName').val();
                YhHttp.init(YhHttpServiceCode.MODIFY_SENSOR.CODE);
                YhHttp.send(modifySensorTable, modifySensorTableCallBack);
            }, btn2: function () {
                layer.msg('您已经取消了修改', {
                    time: 1000, //5s后自动关闭
                    btn: ['知道了']
                });
            }
        });

        /* 解绑删除 */
        $('.delete').live('click', function () {
            delSensorTable.sensorUuid = $(this).parents('tr').children('td:nth-child(4)').text();

            layer.open({
                type: 1,
                title: '解绑传感器设备',
                area: ['320px', '180px'],
                shadeClose: false,
                content: $('#unbindSensor'),
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    YHLayer.loading();
                    YhHttp.init(YhHttpServiceCode.DELETE_SENSOR.CODE);
                    YhHttp.send(delSensorTable, delSensorTableCallBack);
                }, btn2: function (index, layero) {
                    layer.msg('您已经取消了解绑', {
                        time: 2000, //2s后自动关闭
                        btn: ['知道了']
                    })
                }
            });
        });
    });
});

var querySensorDataTable = function () {
    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    var dpId = $("#changDpInfo").attr("value");

    if (dpId == null || dpId == '') {
        layer.msg("请选择大棚！");
        return;
    }

    $("#sensorTb").html("");

    if (dpId == '-1') {
        return;
    }

    $("#tableMessage").html("加载中...");

    querySensorTable.dpId = dpId;
    querySensorTable.userId = $.cookie('userId');
    querySensorTable.pageNum = 1;
    querySensorTable.pageSize = 100;

    YhHttp.init(YhHttpServiceCode.QUERY_SENSOR_LIST.CODE);
    YhHttp.send(querySensorTable, querySensorTableCallBack);
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
            querySensorDataTable();
        }

    } else {
        layer.msg("请求服务器异常！");
    }
};

var querySensorTableCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);

        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            $("#sensorTb").html("");
            $("#tableMessage").html("");
            $("#tableMessage").html("暂无数据");
            return;
        } else {
            dataTableList = resultObj.parameter;
            querySensorType();
            var tpl = $('#sensorTbTpl').html();
            var tableHtml = juicer(tpl, dataTableList);
            if (tableHtml == null || tableHtml == '') {
                $("#sensorTb").html("");
                $("#tableMessage").html("");
                $("#tableMessage").html("暂无数据");
            } else {
                $("#sensorTb").append(tableHtml);
                $("#tableMessage").html("");
            }

        }
    } else {
        $("#sensorTb").html("");
        $("#tableMessage").html("");
        $("#tableMessage").html("暂无数据");
    }
};

/* 获取传感器类型 */
var sensorList = new Array();
var sensorType = new Array();
var querySensorType = function () {
    sensorList = dataTableList.list;
    for (var i = 0; i < sensorList.length; i++) {
        var sensorEnum = sensorList[i].sensorEnum;
        var sensorModel = "";
        sensorType = sensorEnum.split("|");

        for (var j = 0; j < sensorType.length; j++) {

            if (sensorType[j] == '01') {
                sensorModel = sensorModel + ' 温度传感器 ';
            } else if (sensorType[j] == '02') {
                sensorModel = sensorModel + ' 湿度传感器 ';
            } else if (sensorType[j] == '03') {
                sensorModel = sensorModel + ' 二氧化碳传感器 ';
            } else if (sensorType[j] == '04') {
                sensorModel = sensorModel + ' 光照传感器 ';
            } else if (sensorType[j] == '05') {
                sensorModel = sensorModel + ' 土壤水分传感器 ';
            } else if (sensorType[j] == '06') {
                sensorModel = sensorModel + ' 土壤温度传感器 ';
            } else if (sensorType[j] == '07') {
                sensorModel = sensorModel + ' 土壤PH值传感器 ';
            } else if (sensorType[j] == '08') {
                sensorModel = sensorModel + ' 土壤盐分传感器 ';
            } else if (sensorType[j] == '09') {
                sensorModel = sensorModel + ' 氨气传感器 ';
            } else if (sensorType[j] == '10') {
                sensorModel = sensorModel + ' 耗氧量传感器 ';
            } else if (sensorType[j] == '11') {
                sensorModel = sensorModel + ' 湿度传感器 ';
            }
        }
        ;
        sensorList[i].sensorEnum = sensorModel;
    }
    ;
};

var modifySensorTableCallBack = function (result) {
    YHLayer.closeAllLayer();
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.status != null && resultObj.parameter.status == '0000') {
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                querySensorDataTable();
            });
        } else {
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                querySensorDataTable();
            });
        }
    } else {
        layer.msg('修改失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            querySensorDataTable();
        });
    }
};

var delSensorTableCallBack = function (result) {
    YHLayer.closeAllLayer();
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.status != null && resultObj.parameter.status == '0000') {
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                querySensorDataTable();
            });
        } else {
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                querySensorDataTable();
            });
        }
    } else {
        layer.msg('删除失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            querySensorDataTable();
        });
    }
};

