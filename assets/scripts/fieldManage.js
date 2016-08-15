/**
 * Created by zhan on 2016/5/17.
 */

var queryDpTable = {
    userId: '',
    pageNum: '',
    pageSize: ''
};

var queryDpDetail = {
     dpId: ''
};

var modifyDpTable = {
    userId: '',
    dpId: '',
    dpName: '',
    dpAddr: '',
    dpAgName: '',
    dpLong: '',
    dpLat: '',
    solution: '',
    dpAddrDesc: '',
    remark: '',
    gatewayId: ''
};
var delDpTable = {
    userId: '',
    dpId: ''
};
var addDpTable = {
    userId: '',
    dpName: '',
    dpAddr: '',
    dpAgName: '',
    dpLong: '',
    dpLat: '',
    solution: '',
    dpAddrDesc: '',
    remark: '',
    gatewayId: ''
};
var queryGatewayTable = {
    userId: ''
};

var gatewayTableList = {
    gatewayList : null
};

$('.opClick').click(function(){
    alert($(this).val());
});

$(function () {

    queryDp(10, 1);

    queryGatewayDataTable();

    //增加
    $('.addDp').on('click', function(){
        addDpLayer();
    });

    /* 修改按钮 */
    $('.modify').live('click', function() {
        queryDpDetailInfo();
    });

    /* 解绑删除 */
    $('.delete').live('click', function(){
        delDpLayer();
    });

});

function addDpLayer() {

    var content = juicer($('#gatewayTpl').html(), gatewayTableList);
    $('#gatewayInfo').html(content);
    $('#addDpName').val('');
    $('#addDpAgName').val('');
    $('#addDpAddr').val('');
    $('#addSolution').val('');
    $('.help-block').remove();

    layer.open({
        type: 1,
        title: '增加场地',
        area: 'auto',
        maxWidth: '450px',
        shadeClose: false,
        content: $('#addField'),
        btn: ['确定','取消'],
        yes: function(index, layero){

            if(!$('#addDpInfo').valid()){
                return 0;
            }

            YHLayer.loading();
            addDp();
        },btn2: function(index, layero){
            layer.msg('您已经取消了新增', {
                time: 2000, //1s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function addDp(){
    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }
    addDpTable.userId = $.cookie('userId');
    addDpTable.dpName = $('#addDpName').val();
    addDpTable.dpAddr = $('#addDpAddr').val();
    addDpTable.dpAgName = $('#addDpAgName').val();
    addDpTable.solution = $('#addSolution').find('option:selected').val();
    addDpTable.gatewayId = $('#addGatewayName').find('option:selected').val();

    YhHttp.init(YhHttpServiceCode.ADD_USER_DP.CODE);
    YhHttp.send(addDpTable, addDpTableCallBack);

}

//新增场地信息回调函数
var addDpTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDp (10, 1);
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDp (10, 1);
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('新增失败，请稍后再试！', {icon: 0, time: 1000}, function () {
            queryDp (10, 1);
        });
    }
};

/* 查询场地信息 */
function queryDp(pageSize, pageNum) {
    YHLayer.loading();

    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    queryDpTable.userId = $.cookie('userId');
    queryDpTable.pageNum = pageNum;
    queryDpTable.pageSize = pageSize;

    setCurPage(pageSize, pageNum);

    YhHttp.init(YhHttpServiceCode.QUERY_USER_DP_LIST.CODE);
    YhHttp.send(queryDpTable, queryDpTableCallBack);

}

//查询场地信息回调函数
var queryDpTableCallBack = function (result) {
    YHLayer.closeAllLayer();
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.list == null || resultObj.parameter.list == ''){
            $("#fieldTb").html("");
        } else {
            var dpList = resultObj.parameter;
            var tpl = $('#fieldTbTpl').html();
            var tableHtml = juicer(tpl, dpList);
            $('#fieldTb').html("<tr></tr>" + tableHtml);

            var totalCount = dpList.itemCount;//总数据量
            var listCountArray = [];
            for (var i=0;i<totalCount;i++) {
                listCountArray.push(i);
            }

            YHPage.init(curPageSize, curPageNum, totalCount, listCountArray, pageEventHandler);
        }
    } else {
        layer.msg("请求服务器异常！");
    }
};

function queryDpDetailInfo() {
    queryDpDetail.dpId = $(event.target).attr('data-dpId');
    YhHttp.init(YhHttpServiceCode.QUERY_USER_DP_DETAIL.CODE);
    YhHttp.send(queryDpDetail, queryDpDetailTableCallBack);
}

var queryDpDetailTableCallBack = function (result) {

    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter != null && resultObj.parameter != ''){
            $('#modifyDpName').val(resultObj.parameter.dpName);
            $('#modifySolution').val(resultObj.parameter.solution);
            $('#modifyDpAgName').val(resultObj.parameter.dpAgName);
            $('#modifyDpAddr').val(resultObj.parameter.dpAddr);
            $('#modifyGatewayOption').text(resultObj.parameter.gatewayName);
            modifyDpLayer();
        } else {
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    } else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }

};

function modifyDpLayer() {

    $('.help-block').remove();

    layer.open({
        type: 1,
        title: '修改场地',
        area: 'auto',
        maxWidth: '550px',
        shadeClose: false,
        content: $('#modifyField'),
        btn: ['确定','取消'],
        yes: function(index, layero){

            if(!$('#modifyDpInfo').valid()){
                return 0;
            }

            YHLayer.loading();
            modifyDp();
        },btn2: function(index, layero){
            layer.msg('您已经取消了修改', {
                time: 2000, //1s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function modifyDp() {

    modifyDpTable.userId = $.cookie('userId');
    modifyDpTable.dpId = queryDpDetail.dpId;
    modifyDpTable.dpName = $('#modifyDpName').val();
    modifyDpTable.dpAddr = $('#modifyDpAddr').val();
    modifyDpTable.dpAgName = $('#modifyDpAgName').val();
    modifyDpTable.solution = $('#modifySolution').val();

    YhHttp.init(YhHttpServiceCode.MODIFY_USER_DP.CODE);
    YhHttp.send(modifyDpTable, modifyDpTableCallBack);
}

var modifyDpTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDp (10, 1);
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDp (10, 1);
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('修改失败，请稍后再试！', {icon: 0, time: 1000}, function () {
            queryDp (10, 1);
        });
    }
};

function delDpLayer() {
    var content = juicer($('#delOperation').html(), 0);
    delDpTable.userId = $.cookie('userId');
    delDpTable.dpId = $(event.target).attr('data-dpId');
    layer.open({
        type: 1,
        title: '删除',
        area: ['320px', '180px'],
        shadeClose: false,
        content: content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            YHLayer.loading();
            delDp();
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了删除', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function delDp(){
    YhHttp.init(YhHttpServiceCode.DELETE_USER_DP.CODE);
    YhHttp.send(delDpTable, delDpTableCallBack);
}

var delDpTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDp (10, 1);
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDp (10, 1);
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('删除失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDp (10, 1);
        });
    }
};

/* 查询用户网关信息 */
function queryGatewayDataTable(){

    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    queryGatewayTable.userId = $.cookie('userId');

    YhHttp.init(YhHttpServiceCode.QUERY_USER_GATEWAY_LIST.CODE);
    YhHttp.send(queryGatewayTable, queryGatewayTableCallBack);

}
//查询网关信息回调函数
var queryGatewayTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter != null && resultObj.parameter != ''){
            gatewayTableList.gatewayList = resultObj.parameter.list;

            for (var i = 0 ; i < gatewayTableList.gatewayList.length;i++){
                if (gatewayTableList.gatewayList[i].gatewayUuid.indexOf('1') < 0 ){
                    gatewayTableList.gatewayList.splice(i,1);
                }
            }

        } else {
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    } else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};

var curPageSize = 10;
var curPageNum = 1;
function setCurPage(pageSize, pageNum){
    curPageSize = pageSize;
    curPageNum = pageNum;
}

var pageEventHandler = function (pageSizes, pageNum) {
    $("#manageNum").val("");

    if (pageSizes == null || pageSizes == "") {
        pageSizes = curPageSize;
    }

    if (pageNum == null || pageNum == "") {
        pageNum = curPageNum;
    }

    setCurPage(pageSizes, pageNum);
    queryDp(pageSizes, pageNum);
};