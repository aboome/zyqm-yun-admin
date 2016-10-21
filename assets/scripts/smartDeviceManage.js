var queryUserDpList = {
    userId : ""
};

$(function() {

	queryUserDpListById();

	$("#changDpInfo").live("change", function() {
		queryDeviceListByDpId();
	});

});

window.setInterval("refreshTable()",5000);
function refreshTable() {
	$.each($("td[class='taskStatusMonitor']"),function(i,val){
		var taskStatus = $(this).attr("taskStatus");
		if (taskStatus == '00') {
			queryDeviceListByDpId();
			return;
		};
	});
};

function queryUserDpListById() {

    var loginUserId = $.cookie('userId');

    if (null == loginUserId) {
        return;
    }

    queryUserDpList.userId = loginUserId;

    YhHttp.init(YhHttpServiceCode.QUERY_DP_LIST_BY_USER_ID.CODE);
    YhHttp.send(queryUserDpList, queryDpListCallBack);

}

var queryDeviceListCallBack = function(result) {
	YHLayer.closeAllLayer();
    if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            $("#deviceListTb").html('');
		} else {
			var param = resultObj.parameter;

            for (var i = 0 ; i<param.list.length; i++){
				if(param.list[i].deviceReportTime != undefined){
					param.list[i].deviceReportTime = formatDateString(param.list[i].deviceReportTime);
				}
            }

			var tpl = $('#deviceListTbTpl').html();
			var htmlContent = juicer(tpl, param);
			$("#deviceListTb").html('<tr></tr>' + htmlContent);
		}

	} else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
	}
};

var queryDpListCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
			return;
		} else {
			var param = resultObj.parameter;
			var tpl = $('#dpListTpl').html();
			var htmlContent = juicer(tpl, param);
			$("#dpListInUserId").html(htmlContent);

			$("select option:nth-child(2)").attr("selected" , "selected");
			queryDeviceListByDpId();
		}

	} else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
	}
};

function modelSwitch(eNum){
	if (eNum == '55' || eNum == '57'){
		$('.director').css('display', 'block');
	} else {
		$('.director').css('display', 'none');
	}
};

var openDeviceCon = {
	controlDeviceId: "",
	type: "",
	taskTime: "",
	command: "",
	direct: ""
};

function openDevice(deviceId) {
	var num = $(event.srcElement).attr('data-num');
	modelSwitch(num);

	var loginUserId = $.cookie('userId');

	if (null == loginUserId) {
		return;
	}

	var content = $('#openDevice');

    $('.help-block').remove();
    $('#modelType').val('');
    $('#direct').val('');
    $('#time').val('');
    $('.time').css('display', 'none');

	layer.open({
		type: 1,
		title: '设备开启',
		area: 'auto',
		maxWidth: '450px',
		shadeClose: false,
		content: content,
		btn: ['确定', '取消'],
		yes: function (index, layero) {

		    if(!$('#openDeviceInfo').valid()){
		        return;
            }

		    var type = $('#modelType').val();

            if('' == $('#direct').val()||null ==$('#direct').val()){
                var direct = '0';
            }else {
                var direct = $('#direct').val();
            }
			var time = $('#time').val();

			openDeviceCon.controlDeviceId = deviceId;
			openDeviceCon.command = '1';
			openDeviceCon.direct = direct;
			openDeviceCon.type = type;
			openDeviceCon.taskTime = time * 60;
			YHLayer.loading();
			YhHttp.init(YhHttpServiceCode.OPEN_DEVICE.CODE);
			YhHttp.send(openDeviceCon, openDeviceConCallBack);
		}, btn2: function (index, layero) {
			layer.msg('您已经取消了设备开启操作', {
				time: 2000,
				btn: ['知道了']
			})
		}
	});
};
$('#modelType').change(function(){
	var openType = $('#modelType').val();
	if(openType == '20'){
		$('.time').css('display', 'block');
	}else{
		$('.time').css('display', 'none');
	}
});

var openDeviceConCallBack = function(result) {
	YHLayer.closeAllLayer();
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
            YHLayer.closeAllLayer();
		    layer.msg('打开设备操作成功!', {icon: 1, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryOperator (10, 1);
            });
		} 

	} else {
        YHLayer.closeAllLayer();
	    layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
	}
};
	
var closeDeviceCon = {
	controlDeviceId: ""
};
	
function closeDevice(index) {
	var loginUserId = $.cookie('userId');

	if (null == loginUserId) {
		return;
	}

	closeDeviceCon.controlDeviceId = index;
    YHLayer.loading();
	YhHttp.init(YhHttpServiceCode.CLOSE_DEVICE.CODE);
	YhHttp.send(closeDeviceCon, closeDeviceConCallBack);
}

var closeDeviceConCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
            YHLayer.closeAllLayer();
            layer.msg('关闭设备操作成功!', {icon: 1, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} 

	} else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            queryDeviceListByDpId();
        });
	}
};

var restartTaskCon = {
	controlDeviceId: ""
};

function restartTask(index) {
	var loginUserId = $.cookie('userId');

	if (null == loginUserId) {
		return;
	}

	restartTaskCon.controlDeviceId = index;
    YHLayer.loading();
	YhHttp.init(YhHttpServiceCode.RESTART_TASK.CODE);
	YhHttp.send(restartTaskCon, restartTaskConCallBack);
}

var restartTaskConCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
            YHLayer.closeAllLayer();
            layer.msg('重新执行操作成功!', {icon: 1, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} 

	} else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            queryDeviceListByDpId();
        });
	}
};

var cancelTaskCon = {
	controlDeviceId: ""
};

function cancelTask(index) {
	var loginUserId = $.cookie('userId');

	if (null == loginUserId) {
		return;
	}

	cancelTaskCon.controlDeviceId = index;
    YHLayer.loading();
	YhHttp.init(YhHttpServiceCode.CANCEL_TASK.CODE);
	YhHttp.send(cancelTaskCon, cancelTaskConCallBack);
}

var cancelTaskConCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
            YHLayer.closeAllLayer();
            layer.msg('取消任务成功!', {icon: 1, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} 

	} else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            queryDeviceListByDpId();
        });
	}
};

var refreshDevice = {
		dpId : ""
	};
	
function refreshDeviceStatus() {
	
	var loginUserId = $.cookie('userId');

	if (null == loginUserId) {
		return;
	}
		
	var dpId = $("#changDpInfo").attr("value");
	
	if (dpId == null || dpId == '') {
		layer.msg("请选择大棚！");
		return;
	}
		
	refreshDevice.dpId = dpId;
    YHLayer.loading();
	YhHttp.init(YhHttpServiceCode.REFRESH_DEIVCE_STATUS_DP.CODE);
	YhHttp.send(refreshDevice, refreshDeviceCallBack);
}

var refreshDeviceCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
            YHLayer.closeAllLayer();
            layer.msg('更新设备状态成功!', {icon: 1, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDeviceListByDpId();
            });
		} 

	} else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            queryDeviceListByDpId();
        });
	}
};

var queryDeviceList = {
		dpId : ""	
	};
	
	
function queryDeviceListByDpId() {

    var loginUserId = $.cookie('userId');

	if (null == loginUserId) {
		return;
	}
		
	var dpId = $("#changDpInfo").attr("value");
		
	if (dpId == null || dpId == '') {
		layer.msg("请选择大棚！");
		return;
	}
		
    if (dpId == '-1') {
		$("#deviceListTb").html("");
		return;
	}
	
	queryDeviceList.dpId = dpId;

    YHLayer.loading();

	YhHttp.init(YhHttpServiceCode.QUERY_DEVICE_LIST_IN_DP.CODE);
	YhHttp.send(queryDeviceList, queryDeviceListCallBack);
}

