/**
 * Created by zhan on 2016/5/26.
 */
$(function () {

    queryUserDpListById();

});

var queryUserDpList = {
	userId : ''
};

var querySensorInfo = {
	dpId: ''
};

var queryGroupList = {
	dpId: '',
	systemType: ''
};

var settingWarning = {
	dpId: '',
	systemEnum: '',
	top: '',
	bottom: '',
	topGroupId: '',
	bottomGroupId: '',
	beginDate: '',
	endDate: '',
	topProcess: '',
	bottomProcess: '',
	topCommand: '',
	bottomCommand: '',
	topCondition: '',
	bottomCondition: ''
};

var queryWarningInfo = {
	list: [],
	systemEnum: ''
};
var queryWarningDpId = {
	dpId: ''
};
var auto_00 = {
	topGroupId: '',
	bottomGroupId: '',
	topCommand: '',
	bottomCommand: '',
	topCondition: '',
	bottomCondition: ''
};
var auto_01 = {
	topGroupId: '',
	bottomGroupId: '',
	topCommand: '',
	bottomCommand: '',
	topCondition: '',
	bottomCondition: ''
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

var dpId_arr = [];
var sensorDataId_arr = [];

function querySensorDataIdList(dpId) {
	querySensorInfo.dpId = dpId;
	YhHttp.init(YhHttpServiceCode.QUERY_SENSOR_INFO.CODE);
	YhHttp.send(querySensorInfo, querySensorInfoCallBack);
}


function querySensorDataIdListAll(){
	for(var i = 0; i < dpId_arr.length; i++){
		querySensorDataIdList(dpId_arr[i]);
	}
	for(var j = 0; j < dpId_arr.length; j++){
		queryWarningDpId = {};
		queryWarningDpId.dpId = dpId_arr[j];
		queryWarningInfo.list.push(queryWarningDpId);
	}
	queryWarningSettingInfo('00');
	queryWarningSettingInfo('01');
}

var queryDpIdListCallBack = function (result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            $("#collectInfo").html('');
            $("#dpListInUserId").html('');
		} else {
			var param = resultObj.parameter;
			var tpl = $('#dpTpl').html();
			var htmlContent = juicer(tpl, param);
			$("#collectInfo").html(htmlContent);

            var dpListTpl = $('#dpListTpl').html();
            var dpListHtml = juicer(dpListTpl,param);
            $("#dpListInUserId").html(dpListHtml);

			var paramLen = param.list.length;
			for(var i = 0; i < paramLen; i++){
				dpId_arr.push(param.list[i].dpId);
			}
			querySensorDataIdListAll();
		}

	} else {
		layer.msg("请求服务器异常！");
	}
};


var querySensorInfoCallBack = function (result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter == null || resultObj.parameter == '') {

		} else {
			var param = resultObj.parameter;

			var dpId = param.dpId;

			var tempTpl = $('#tempTpl').html();
			var tempContent = juicer(tempTpl, param);
			$("#temp_" + dpId).html(tempContent);

			var humidityTpl = $('#humidityTpl').html();
			var humidityContent = juicer(humidityTpl, param);
			$("#humidity_" + dpId).html(humidityContent);

			var co2Tpl = $('#co2Tpl').html();
			var co2Content = juicer(co2Tpl, param);
			$("#co2_" + dpId).html(co2Content);

			var illuminationTpl = $('#illuminationTpl').html();
			var illuminationContent = juicer(illuminationTpl, param);
			$("#illumination_" + dpId).html(illuminationContent);

		}
	} else {
		layer.msg("请求服务器异常！");
	}
};

$('.settingBtn').live('click', function () {
	queryGroupList.dpId = $(this).attr('data-id');
	queryGroupList.systemType = $(this).attr('data-typeVal');

	settingWarning.dpId = $(this).attr('data-id');
	settingWarning.systemEnum = $(this).attr('data-typeVal');

	var content = juicer($('#settingTpl').html(), '');
	layer.open({
		type: 1,
		title: '设置',
		area: 'auto',
		maxWidth: '550px',
		shadeClose: false,
		content: content,
		btn: ['确定', '取消'],
		yes: function (index, layero) {
			setWarning();
			layer.close(index);
		}, btn2: function (index, layero) {
			
			window.location.reload();
		}
	});

	autoCom(this);
});

var setWarning = function (){

	var topProcess = $('#topWay option:selected').val();
	var bottomProcess = $('#bottomWay option:selected').val();
	var topGroupId = $('#topGroup option:selected').val();
	var bottomGroupId = $('#botGroup option:selected').val();
	var topCommand = $('#topIo option:selected').val();
	var bottomCommand = $('#botIo option:selected').val();
	var top = $('#top').val();
	var bottom = $('#bottom').val();
	var topCondition = $('#topStop').val();
	var bottomCondition = $('#botStop').val();

	if (top !== undefined && top != '' && bottom != undefined && bottom != '') {
		if (top <= bottom) {
			layer.msg("预警上限不能低于预警下限值！", {
				time: 2000,
				btn: ['知道了']});
			return;
		}
	}

	settingWarning.top = top;
	settingWarning.bottom = bottom;
	settingWarning.topCondition = topCondition;
	settingWarning.bottomCondition = bottomCondition;
	settingWarning.topProcess = topProcess;
	settingWarning.bottomProcess = bottomProcess;
	settingWarning.topGroupId = topGroupId;
	settingWarning.bottomGroupId = bottomGroupId;
	settingWarning.topCommand = topCommand;
	settingWarning.bottomCommand = bottomCommand;

	YhHttp.init(YhHttpServiceCode.SETTING_WARNING.CODE);
	YhHttp.send(settingWarning, setWarningCallback);
};

var setWarningCallback = function (result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter == null || resultObj.parameter == '') {
		} else {
			if(resultObj.parameter.status == '0000'){
				layer.msg(resultObj.parameter.message, {icon: 1, time: 500}, function () {
					window.location.reload();
				});
			} else {
				layer.msg(resultObj.parameter.message, {icon: 2, time: 500}, function () {
					window.location.reload();
				});
			}
		}
	} else {
		layer.msg("请求服务器异常！");
	}
};

var queryGroupListFunTop = function(){
	YhHttp.init(YhHttpServiceCode.QUERY_DEVICE_GROUP_LIST.CODE);
	YhHttp.send(queryGroupList, queryGroupListTopCallback);
};
var queryGroupListFunBot = function(){
	YhHttp.init(YhHttpServiceCode.QUERY_DEVICE_GROUP_LIST.CODE);
	YhHttp.send(queryGroupList, queryGroupListBotCallback);
};

var queryGroupListTopCallback = function(result){
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
			return;
		} else {
			var dataTableList = resultObj.parameter;
			var tpl = $('#groupTopTpl').html();
			var tableHtml = juicer(tpl, dataTableList);
			$("#selectGroupTop").append(tableHtml);

			autoTop_00();
			autoTop_01();
		}
	} else {
		layer.msg("请求服务器异常！");
	}
};
var queryGroupListBotCallback = function(result){
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
			return;
		} else {
			var dataTableList = resultObj.parameter;
			var tpl = $('#groupBotTpl').html();
			var tableHtml = juicer(tpl, dataTableList);
			$("#selectGroupBot").append(tableHtml);

			autoBot_00();
			autoTop_01();
		}
	} else {
		layer.msg("请求服务器异常！");
	}
};


$('#topWay').live('change', function () {
	var selected = $(this).children('option:selected').val();

	if(selected == '1'){
		queryGroupListFunTop();
	 } else {
	 	$('#selectGroupTop').html('');
	 }
});

$('#bottomWay').live('change', function () {
	var selected = $(this).children('option:selected').val();
	if(selected == '1'){
		queryGroupListFunBot();
	} else {
		$('#selectGroupBot').html('');
	}
});

var queryWarningSettingInfo = function (num) {

	queryWarningInfo.systemEnum = num;

	YhHttp.init(YhHttpServiceCode.QUERY_WARNING_SETTING_INFO.CODE);
	YhHttp.send(queryWarningInfo, queryWarningSettingInfoCallback);
};

var queryWarningSettingInfoCallback = function (result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
			return;
		} else {
			var dataTableList = resultObj.parameter;
			var tempTpl = $('#tempWarnTpl').html();
			var humidityTpl = $('#humidityWarnTpl').html();

			var len = dataTableList.list.length;

			for(var i = 0; i < len; i++){


				var eNum = resultObj.parameter.list[i].systemEnum;
				var dpId = resultObj.parameter.list[i].dpId;

				if ('00' == dataTableList.list[i].systemEnum){
					var tempHtml = juicer(tempTpl, dataTableList.list[i]);
					$("#temp_warn_" + dpId).html(tempHtml);
				}else if ('01' == dataTableList.list[i].systemEnum){
					var humidityHtml = juicer(humidityTpl, dataTableList.list[i]);
					$("#humidity_warn_" + dpId).html(humidityHtml);
				}

				if(dataTableList.list[i].top == undefined && dataTableList.list[i].systemEnum == '00'){
					$("#top_"+ dpId +"_00").html('预警上限： <i class="warningTopVal">未设置</i>');
				}
				if(dataTableList.list[i].top == undefined && dataTableList.list[i].systemEnum == '01'){
					$("#top_"+dpId+"_01").html('预警上限： <i class="warningBotVal">未设置</i>');
				}
				if(dataTableList.list[i].bottom == undefined && dataTableList.list[i].systemEnum == '00'){
					$("#bot_"+dpId+"_00").html('预警下限： <i class="warningTopVal">未设置</i>');
				}
				if(dataTableList.list[i].bottom == undefined && dataTableList.list[i].systemEnum == '01'){
					$("#bot_"+dpId+"_01").html('预警下限： <i class="warningBotVal">未设置</i>');
				}

			}

		}
	} else {
		layer.msg("请求服务器异常！");
	}
};

$('.refresh').on('click', function () {
	window.location.reload();
});

function autoCom(obj){

	var dpId = $(obj).attr('data-id');
	var eNum = $(obj).attr('data-typeVal');

	if ('00' == eNum){
		var top = $('#top_' + dpId + '_00' + ' .warningTopVal').html();
		var bot = $('#bot_' + dpId + '_00' + ' .warningBotVal').html();

		var topProcess = $('#topProcess_' + dpId + '_00').html();
		var bottomProcess = $('#bottomProcess_' + dpId + '_00').html();
		auto_00.topGroupId = $('#topGroupId_' + dpId + '_00').html();
		auto_00.bottomGroupId = $('#bottomGroupId_' + dpId + '_00').html();
		auto_00.topCommand = $('#topCommand_' + dpId + '_00').html();
		auto_00.bottomCommand = $('#bottomCommand_' + dpId + '_00').html();
		auto_00.topCondition = $('#topCondition_' + dpId + '_00').html();
		auto_00.bottomCondition = $('#bottomCondition_' + dpId + '_00').html();

		if(top == '未设置'){
			$('#top').val('');
		}else{
			$('#top').val(top);
		}
		if(bot == '未设置'){
			$('#bottom').val('');
		}else{
			$('#bottom').val(bot);
		}

		if(topProcess == '1'){
			$('#topWay').val(topProcess);
			queryGroupListFunTop();
		} else if(topProcess == '0'){
			$('#topWay').val(topProcess);
		}

		if(bottomProcess == '1'){
			$('#bottomWay').val(bottomProcess);
			queryGroupListFunBot();
		} else if(bottomProcess == '0'){
			$('#bottomWay').val(bottomProcess);
		}

	}else if ('01' == eNum){
		var top = $('#top_' + dpId + '_01' + ' .warningTopVal').html();
		var bot = $('#bot_' + dpId + '_01' + ' .warningBotVal').html();

		var topProcess = $('#topProcess_' + dpId + '_01').html();
		var bottomProcess = $('#bottomProcess_' + dpId + '_01').html();
		auto_01.topGroupId = $('#topGroupId_' + dpId + '_01').html();
		auto_01.bottomGroupId = $('#bottomGroupId_' + dpId + '_01').html();
		auto_01.topCommand = $('#topCommand_' + dpId + '_01').html();
		auto_01.bottomCommand = $('#bottomCommand_' + dpId + '_01').html();
		auto_01.topCondition = $('#topCondition_' + dpId + '_01').html();
		auto_01.bottomCondition = $('#bottomCondition_' + dpId + '_01').html();


		if(top == '未设置'){
			$('#top').val('');
		}else{
			$('#top').val(top);
		}
		if(bot == '未设置'){
			$('#bottom').val('');
		}else{
			$('#bottom').val(bot);
		}
		
		if(topProcess == '1'){
			$('#topWay').val(topProcess);
			queryGroupListFunTop();
		} else if(topProcess == '0'){
			$('#topWay').val(topProcess);
		}

		if(bottomProcess == '1'){
			$('#bottomWay').val(bottomProcess);
			queryGroupListFunBot();
		} else if(bottomProcess == '0'){
			$('#bottomWay').val(bottomProcess);
		}
	}
};

function autoTop_00(){
	$('#topGroup').val(auto_00.topGroupId);
	$('#topStop').val(auto_00.topCondition);
	$('#topIo').val(auto_00.topCommand);
}

function autoBot_00(){
	$('#botGroup').val(auto_00.bottomGroupId);
	$('#botStop').val(auto_00.bottomCondition);
	$('#botIo').val(auto_00.bottomCommand);
}
function autoTop_01(){
	$('#topGroup').val(auto_01.topGroupId);
	$('#topStop').val(auto_01.topCondition);
	$('#topIo').val(auto_01.topCommand);
}

function autoBot_01(){
	$('#botGroup').val(auto_01.bottomGroupId);
	$('#botStop').val(auto_01.bottomCondition);
	$('#botIo').val(auto_01.bottomCommand);
}