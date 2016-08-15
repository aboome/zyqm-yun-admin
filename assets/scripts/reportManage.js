/**
 * Created by CC on 2016/7/28.
 */
$(function () {
    queryUserDpListById();
});
var queryUserDpList = {
    userId : ''
};
var exportCon = {
    userId: '',
    dpId: ''
};
var formData = {
    startTime: '',
    endTime: '',
    dpId: '',
    dataEnum: '',
    pageNum: '',
    pageSize: ''
};

function queryUserDpListById() {
    var loginUserId = $.cookie('userId');

    if (null == loginUserId) {
        return;
    }

    queryUserDpList.userId = loginUserId;

    YhHttp.init(YhHttpServiceCode.QUERY_DP_LIST_BY_USER_ID.CODE);
    YhHttp.send(queryUserDpList, queryDpIdListCallBack);
}

var queryDpIdListCallBack = function (result) {
    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            return;
        } else {
            var param = resultObj.parameter;
            var dpListTpl = $('#dpListTpl').html();
            var dpListHtml = juicer(dpListTpl,param);
            $("#dpListInUserId").html(dpListHtml);

            queryFormsData(10, 1);
        }

    } else {
        layer.msg("请求服务器异常！");
    }
};

$("#exportStatics").click(function () {
    var loginUserId = $.cookie('userId');

    if (null == loginUserId) {
        return;
    }
    exportCon.userId = loginUserId;
    exportCon.dpId = $('#dp').val();

    var $form = $("#exportForm");
    $form.attr("action", YhHttp.DOWN_URL);
    $("#exportUserId").val(exportCon.userId);
    $("#exportDpId").val(exportCon.dpId);
    $("#serviceCode").val(YhHttpServiceCode.EXPORT_TEMP_DATA.CODE);
    $form.submit();
});

function queryFormsData(pageSize, pageNum){
    YHLayer.loading();
    formData.startTime = $('#d4311').val();
    formData.endTime = $('#d4312').val();
    formData.dpId = $('#dp').val();
    formData.dataEnum = $('#chuanGanQi').val();
    formData.pageNum = pageNum;
    formData.pageSize = pageSize;

    YhHttp.init(YhHttpServiceCode.QUERY_FORMS_DATA.CODE);
    YhHttp.send(formData, queryFormsDataCallBack);
};

var queryFormsDataCallBack = function (result) {
    YHLayer.closeAllLayer();
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.list == null || resultObj.parameter.list == ''){
            $("#formsData").html('');
            $('.m-pagination').css('display', 'none');
        } else {
            $('.m-pagination').css('display', 'block');
            var param = resultObj.parameter;
            var tpl = $('#formsDataTpl').html();
            var formsDataHtml = juicer(tpl, param);
            $("#formsData").html('<tr></tr>' + formsDataHtml);

            var paramLen = param.list.length;
            for(var i = 0; i < paramLen; i++){
                var time = param.list[i].collectTime;

                var y = time.substring(0, 4);
                var mo = time.substring(4, 6);
                var d = time.substring(6, 8);
                var h = time.substring(8, 10);
                var m = time.substring(10, 12);
                var s = time.substring(12, 14);

                var t = y + '-' + mo + '-' + d + ' ' + h + ':' + m + ':' + s;
                $('.collectTime_' + i).html(t);
            }


            var totalCount = param.itemCount;//总数据量
            var listCountArray = [];
            for (var i=0;i<totalCount;i++) {
                listCountArray.push(i);
            }

            YHPage.init(curPageSize, curPageNum, totalCount, listCountArray, pageEventHandler);
        }
    } else {
        layer.msg('请求服务器异常！');
    }
};

$('#search').on('click', function () {
    YHLayer.loading();
    var sTime = $('#d4311').val();
    var eTime = $('#d4312').val();

    var sy = sTime.substring(0, 4);
    var sm = sTime.substring(5, 7);
    var sd = sTime.substring(8, 10);

    var ey = eTime.substring(0, 4);
    var em = eTime.substring(5, 7);
    var ed = eTime.substring(8, 10);

    var beginTime = sy + sm + sd;
    var endTime = ey + em + ed;
    if(beginTime != ''){
        beginTime = beginTime + '000000';
    }
    if(endTime != ''){
        endTime = endTime + '000000';
    }

    formData.startTime = beginTime;
    formData.endTime = endTime;
    formData.dpId = $('#dp').val();
    formData.dataEnum = $('#chuanGanQi').val();
    formData.pageNum = 1;
    formData.pageSize = $('#pages').val();

    YhHttp.init(YhHttpServiceCode.QUERY_FORMS_DATA.CODE);
    YhHttp.send(formData, queryFormsDataCallBack);
});


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
    queryFormsData(pageSizes, pageNum);
};