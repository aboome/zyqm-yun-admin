/**
 * Created by zhan on 2016/6/16.
 */
 var queryUserInfo = {
    userId: ''
};

var addOpeTable = {
    operatorName: '',
    password: '',
    phone: '',
    companyId: '',
    companyName: '',
    userId: ''
};

var delOpeTable = {
    operatorId: ''
};

var queryDpTable = {
    userId: ''
};

var dpInfoDataTable = {
    dpId: ''
};

var settingDpTable = {
    list: [],
    operatorId: ''
};

var queryOpeTable = {
    pageNum: '',
    pageSize: '',
    userId: '',
    companyId: '',
    operatorName: ''
};
var companyId = null;
var companyName = null;
var trId = '';

$(function(){

    function queryUser (){
        queryUserInfo.userId = $.cookie('userId');
		YhHttp.init(YhHttpServiceCode.QUERY_USER_INFO.CODE);
		YhHttp.send(queryUserInfo, queryUserInfoCallBack);
    };

    queryUser ();

    $('.addOpe').live('click', function(){
        addOpeLayer ();
    });

    function addOpeLayer (){

        $('#operatorName').val('');
        $('#operatorPsw').val('');
        $('#operatorPhone').val('');
        $('.help-block').remove();

        layer.open({
            type: 1,
            title: '新增',
            area: 'auto',
            maxWidth: '540px',
            shadeClose: false,
            content: $('#addOperator'),
            btn: ['确定', '关闭'],
            yes: function (index, layero) {

                if(!$('#addOperatorInfo').valid()){
                    return 0;
                }

                YHLayer.loading();
                addOperator ();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了新增', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    };

    function addOperator (){
        if ($.cookie('userId') == null || $.cookie('userId') == '') {
            return;
        }
        addOpeTable.operatorName = $('#operatorName').val();
        addOpeTable.password = $('#operatorPsw').val();
        addOpeTable.phone = $('#operatorPhone').val();
        addOpeTable.companyId = companyId;
        addOpeTable.companyName = companyName;
        addOpeTable.userId = $.cookie('userId');

        YhHttp.init(YhHttpServiceCode.ADD_OPERATOR.CODE);
        YhHttp.send(addOpeTable, addOpeTableCallBack);
    };

    $('.delete').live('click', function(){
        delLayer ();
    });

    function delLayer (){
        delOpeTable.operatorId = $(event.target).attr('data-operatorId');
        var content = juicer($('#delOperation').html(), 0);
        layer.open({
            type: 1,
            title: '删除',
            area: ['320px', '180px'],
            shadeClose: false,
            content: content,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                delOperation ();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了删除', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    }

    function delOperation (){
        YhHttp.init(YhHttpServiceCode.DELETE_OPERATOR.CODE);
        YhHttp.send(delOpeTable, delOpeTableCallBack);
    };


    $('.setting').live('click', function(e){
        settingLayer (e);
    });

    function settingLayer (e){

        trId = parseInt($(e.target).attr('data-id'))+1;
        settingDpTable.operatorId = $(e.target).attr('data-operatorId');
        var content = juicer($('#settingAuth').html(), '');
        layer.open({
            type: 1,
            title: '设置权限',
            area: ['350px', '500px'],
            /*maxWidth: '350px',*/
            fix: true,
            shadeClose: false,
            content: content,
            scrollbar: true,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                settingDp ();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了设置', {
                    time: 1000, //1s后自动关闭
                    btn: ['知道了']
                })
            }
        });

        queryDp();

    }

    function queryDp (){
        if ($.cookie('userId') == null || $.cookie('userId') == '') {
            return;
        }
        queryDpTable.userId = $.cookie('userId');

        YhHttp.init(YhHttpServiceCode.QUERY_DP_LIST_BY_USER_ID.CODE);
        YhHttp.send(queryDpTable, queryDpTableCallBack);
    };

    function settingDp (){

        settingDpTable.list = [];

        $('input[name="dp"]:checked').each(function(){
            dpInfoDataTable = {};
            dpInfoDataTable.dpId = $(this).val();
            settingDpTable.list.push(dpInfoDataTable);
        });

        YhHttp.init(YhHttpServiceCode.SETTING_OPERATOR.CODE);
        YhHttp.send(settingDpTable, settingDpTableCallBack);
    };

});

var queryUserInfoCallBack = function(result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj == null || resultObj == ''){
        } else {
            companyId = resultObj.parameter.companyId;
            companyName = resultObj.parameter.companyName;

            queryOpeTable.userId = queryUserInfo.userId;
            queryOpeTable.companyId = resultObj.parameter.companyId;
            queryOperator (10, 1);
        }
    } else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};

var queryOpeTableCallBack = function (result) {
    YHLayer.closeAllLayer();
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.list == null || resultObj.parameter.list == ''){
            $("#operatorTb").html("");
        } else {
            var operatorList = resultObj.parameter;
            var tpl = $('#operatorTbTpl').html();
            var htmlContent = juicer(tpl, operatorList);
            $("#operatorTb").html("<tr></tr>" + htmlContent);

            var totalCount = operatorList.itemCount;//总数据量
            var listCountArray = [];
            for (var i=0;i<totalCount;i++) {
                listCountArray.push(i);
            }

            YHPage.init(curPageSize, curPageNum, totalCount, listCountArray, pageEventHandler);
        }
    } else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};

var addOpeTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryOperator (10, 1);
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryOperator (10, 1);
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('新增失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryOperator (10, 1);
        });
    }
};

var delOpeTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryOperator (10, 1);
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryOperator (10, 1);
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('删除失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryOperator (10, 1);
        });
    }
};

var queryDpTableCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            return;
        } else {
            var dpList = resultObj.parameter;
            var dpInfoList = dpList.list;
            var tpl = $('#settingTpl').html();
            var htmlContent = juicer(tpl, dpList);
            $("#settingAuthInfo").html('<tr></tr>'+htmlContent);

            /* 已选中 */
            $("#operatorTb tr").eq(trId).children('td:nth-child(4)').children('p').each(function() {
                var dpId = this.getAttribute('data-id');
                $("input:checkbox[value="+dpId+"]").attr('checked','true');
            });

            /* 全选 */
            $('#checkAll').click(function() {
                $("input[name='dp']").attr('checked',this.checked);
            });
            var $subBox = $("input[name='dp']");
            $subBox.click(function(){
                $('#checkAll').attr("checked",$subBox.length == $("input[name='dp']:checked").length ? true : false);
            });
        };
    } else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};

var settingDpTableCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryOperator (10, 1);
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryOperator (10, 1);
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('设置失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryOperator (10, 1);
        });
    }
};

function queryOperator (pageSize, pageNum, manageNum){
    YHLayer.loading();
    queryOpeTable.pageNum = pageNum;
    queryOpeTable.pageSize = pageSize;
    queryOpeTable.operatorName = manageNum;

    setCurPage(pageSize, pageNum);

    YhHttp.init(YhHttpServiceCode.QUERY_OPERATOR.CODE);
    YhHttp.send(queryOpeTable, queryOpeTableCallBack);
};

function clearCon() {
    $("#manageNum").val("");
    queryOperator(10, 1);
};

function queryOperatorByCon() {
    queryOperator(10, 1, $("#manageNum").val());
};

var curPageSize = 10;
var curPageNum = 1;

function setCurPage(pageSize, pageNum){
    curPageSize = pageSize;
    curPageNum = pageNum;
};

var pageEventHandler = function (pageSizes, pageNum) {
    $("#manageNum").val("");

    if (pageSizes == null || pageSizes == "") {
        pageSizes = curPageSize;
    }

    if (pageNum == null || pageNum == "") {
        pageNum = curPageNum;
    }

    setCurPage(pageSizes, pageNum);
    queryOperator(pageSizes, pageNum);
};