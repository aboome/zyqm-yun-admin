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
		layer.msg("请求服务器异常！");
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
		layer.msg("请求服务器异常！");
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
    $('#modelType').val(-1);
    $('#direct').val(-1);
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
			var direct = $('#direct').val();
			var time = $('#time').val();

			openDeviceCon.controlDeviceId = deviceId;
			openDeviceCon.command = '1';
			openDeviceCon.direct = direct;
			openDeviceCon.type = type;
			openDeviceCon.taskTime = time;
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
	if(openType == '1'){
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
			layer.msg("设备开启成功！");

			queryDeviceListByDpId();
			return;
		} else {
			layer.msg("设备开启失败！");
			return;
		} 

	} else {
		layer.msg("请求服务器异常！");
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

	YhHttp.init(YhHttpServiceCode.CLOSE_DEVICE.CODE);
	YhHttp.send(closeDeviceCon, closeDeviceConCallBack);
};

var closeDeviceConCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
			layer.msg("关闭设备成功！");

			queryDeviceListByDpId();
			return;
		} else {
			layer.msg("关闭设备失败！");
			return;
		} 

	} else {
		layer.msg("请求服务器异常！");
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

	YhHttp.init(YhHttpServiceCode.RESTART_TASK.CODE);
	YhHttp.send(restartTaskCon, restartTaskConCallBack);
};

var restartTaskConCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
			layer.msg("重新开启成功！");
			queryDeviceListByDpId();
			return;
		} else {
			layer.msg("重新开启失败！");
			return;
		} 

	} else {
		layer.msg("请求服务器异常！");
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

	YhHttp.init(YhHttpServiceCode.CANCEL_TASK.CODE);
	YhHttp.send(cancelTaskCon, cancelTaskConCallBack);
};

var cancelTaskConCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
			layer.msg("取消成功！");
			queryDeviceListByDpId();
			return;
		} else {
			layer.msg("取消失败！");
			return;
		} 

	} else {
		layer.msg("请求服务器异常！");
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
		
	YhHttp.init(YhHttpServiceCode.REFRESH_DEIVCE_STATUS_DP.CODE);
	YhHttp.send(refreshDevice, refreshDeviceCallBack);
};

var refreshDeviceCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.status == '0000') {
			layer.msg("设备状态更新成功！");
			queryDeviceListByDpId();
			return;
		} else {
			layer.msg("设备状态更新失败！");
			return;
		} 

	} else {
		layer.msg("请求服务器异常！");
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
		
	YhHttp.init(YhHttpServiceCode.QUERY_DEVICE_LIST_IN_DP.CODE);
	YhHttp.send(queryDeviceList, queryDeviceListCallBack);
};

