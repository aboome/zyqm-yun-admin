$(function() {
    var indexStatics = {
	    userId: ''
    };

	function queryIndexStatics() {
				
	    var userId = $.cookie('userId');

		if (null == userId) {
			return;
		}

		indexStatics.userId = userId;
        YHLayer.loading();
		YhHttp.init(YhHttpServiceCode.QUERY_INDEX_STATICS.CODE);
		YhHttp.send(indexStatics, queryIndexStaticsCallBack);
	};
			
    queryIndexStatics();
	

});

var queryIndexStaticsCallBack = function(result) {
	if (result != null && result != '') {
		var resultObj = JSON.parse(result);
		if (resultObj.parameter == null || resultObj.parameter == '') {
            YHLayer.closeAllLayer();
		} else {
            YHLayer.closeAllLayer();
		    var param = resultObj.parameter;
			$("#dpNum").text(param.dpCount);
			$("#sensorNum").text(param.sensorCount);
			$("#controlDeviceNum").text(param.deviceCount);
			$("#vedioNum").text(param.ipcCount);
		}

	} else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
	}
};
