var queryWarningList = {
    deviceId : "",
    dpId : "",
    userId : "",
    pageNum : "",
    pageSize : ""
};

$(function() {

    YHLayer.loading();
    queryWarningListByDpId(10,1);

});

function queryWarningListByDpId(pageSize, pageNum) {

    var userId = $.cookie('userId');

	if (null == userId) {
		return;
	}
		
	queryWarningList.userId = userId;
	queryWarningList.pageSize = pageSize;
	queryWarningList.pageNum = pageNum;

    setCurPage(pageSize, pageNum);
		
	YhHttp.init(YhHttpServiceCode.QUERY_WARNING_LIST.CODE);
	YhHttp.send(queryWarningList, queryWarningListCallBack);
};

var queryWarningListCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
		    return;
		} else {
            YHLayer.closeAllLayer();
		    var param = resultObj.parameter;

            for (var i = 0 ; i<param.list.length; i++){
                param.list[i].warnDate = formatDateString(param.list[i].warnDate);
            }

			var tpl = $('#warningListTbTpl').html();
			var htmlContent = juicer(tpl, param);
			$("#warnningTab").html(htmlContent);

            var totalCount = resultObj.parameter.itemCount;//总数据量
            var listCountArray = [];
            for (var i=0;i<totalCount;i++) {
                listCountArray.push(i);
            }

            YHPage.init(curPageSize, curPageNum, totalCount, listCountArray, pageEventHandler);
		}

	} else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
	}
};

var curPageSize = 10;
var curPageNum = 1;

function setCurPage(pageSize, pageNum){
    curPageSize = pageSize;
    curPageNum = pageNum;
};

var pageEventHandler = function (pageSizes, pageNum) {

    if (pageSizes == null || pageSizes == "") {
        pageSizes = curPageSize;
    }

    if (pageNum == null || pageNum == "") {
        pageNum = curPageNum;
    }

    setCurPage(pageSizes, pageNum);

    queryWarningListByDpId(pageSizes, pageNum);
};