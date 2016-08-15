/**
 * Created by ply on 2016/8/3.
 */
$(function () {
    queryUserDpListById();
});

var totalTempData = {
    dpId: '',
    beginDate: '',
    endDate: ''
};
var totalLightData = {
    dpId: '',
    beginDate: '',
    endDate: ''
};
var queryUserDpList = {
    userId : ''
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

            queryTotalInfo();
        }

    } else {
        layer.msg("请求服务器异常！");
    }
};


function queryTotalInfo(){
    totalTempData.dpId = $('#changDpInfo').val();
    totalTempData.beginDate = '';
    totalTempData.endDate = '';

    //temp
    YhHttp.init(YhHttpServiceCode.QUERY_TEMP_TOTAL_LIST.CODE);
    YhHttp.send(totalTempData, queryTempTotalInfoCallBack);
};

var queryTempTotalInfoCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.list == null || resultObj.parameter.list == ''){
            return;
        } else {
            var timeArr = [];
            var tempArr = [];
            var totalTempYh = 0;

            var param = resultObj.parameter;
            var paramLen = param.list.length;
            for(var i = 0; i < paramLen; i++){
                totalTempYh = totalTempYh + Number(param.list[i].avgTemp);
                var year = param.list[i].dataTime.substring(0, 4);
                var month = param.list[i].dataTime.substring(4, 6);
                var day = param.list[i].dataTime.substring(6, 8);
                timeArr.push(year + '-' + month + '-' + day);
                tempArr.push(param.list[i].avgTemp);
            }
            var avgTempYh = totalTempYh/paramLen;
            tempFun(timeArr, tempArr, avgTempYh);
        }
    } else {
        layer.msg('请求服务器异常！');
    }
};
var queryLightTotalInfoCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.list == null || resultObj.parameter.list == ''){
            return;
        } else {
            var timeArr = [];
            var lightArr = [];
            var totalLightYh = 0;

            var param = resultObj.parameter;
            var paramLen = param.list.length;
            for(var i = 0; i < paramLen; i++){
                totalLightYh = totalLightYh + Number(param.list[i].totalLight);
                var year = param.list[i].dataTime.substring(0, 4);
                var month = param.list[i].dataTime.substring(4, 6);
                var day = param.list[i].dataTime.substring(6, 8);
                timeArr.push(year + '-' + month + '-' + day);
                lightArr.push(param.list[i].totalLight);
            }
            lightFun(timeArr, lightArr, totalLightYh);
        }
    } else {
        layer.msg('请求服务器异常！');
    }
};

$('.searchBtn').on('click', function () {
    var begin = $('#d4311').val();
    var end = $('#d4312').val();

    var yearb = begin.substring(0, 4);
    var monthb = begin.substring(5, 7);
    var dayb = begin.substring(8, 10);

    var yeare = end.substring(0, 4);
    var monthe = end.substring(5, 7);
    var daye = end.substring(8, 10);

    var beginTime = yearb + monthb + dayb;
    var endTime = yeare + monthe + daye;
    if(beginTime != ''){
        beginTime = beginTime + '000000';
    }
    if(endTime != ''){
        endTime = endTime + '000000';
    }


    totalTempData.dpId = $('#changDpInfo').val();
    totalTempData.beginDate = beginTime;
    totalTempData.endDate = endTime;

    //temp
    YhHttp.init(YhHttpServiceCode.QUERY_TEMP_TOTAL_LIST.CODE);
    YhHttp.send(totalTempData, queryTempTotalInfoCallBack);
});

$('.queryLight').live('click', function () {
    var begin = $('#d4311').val();
    var end = $('#d4312').val();

    var yearb = begin.substring(0, 4);
    var monthb = begin.substring(5, 7);
    var dayb = begin.substring(8, 10);

    var yeare = end.substring(0, 4);
    var monthe = end.substring(5, 7);
    var daye = end.substring(8, 10);

    var beginTime = yearb + monthb + dayb;
    var endTime = yeare + monthe + daye;
    if(beginTime != ''){
        beginTime = beginTime + '000000';
    }
    if(endTime != ''){
        endTime = endTime + '000000';
    }


    totalLightData.dpId = $('#changDpInfo').val();
    totalLightData.beginDate = beginTime;
    totalLightData.endDate = endTime;

    //light
    YhHttp.init(YhHttpServiceCode.QUERY_LIGHT_TOTAL_LIST.CODE);
    YhHttp.send(totalLightData, queryLightTotalInfoCallBack);
});




// 基于准备好的dom，初始化echarts实例
$('#temp').on('click', function () {
    $('#query').removeClass('queryLight').addClass('searchBtn');

    totalTempData.dpId = $('#changDpInfo').val();
    totalTempData.beginDate = '';
    totalTempData.endDate = '';

    YhHttp.init(YhHttpServiceCode.QUERY_TEMP_TOTAL_LIST.CODE);
    YhHttp.send(totalTempData, queryTempTotalInfoCallBack);
});
$('#light').on('click', function () {
    $('#query').removeClass('searchBtn').addClass('queryLight');

    totalLightData.dpId = $('#changDpInfo').val();
    totalLightData.beginDate = '';
    totalLightData.endDate = '';

    YhHttp.init(YhHttpServiceCode.QUERY_LIGHT_TOTAL_LIST.CODE);
    YhHttp.send(totalLightData, queryLightTotalInfoCallBack);
});
var myChart = echarts.init(document.getElementById('main'));



function tempFun(time, temp, avg){
    myChart.showLoading({
        text: '正在努力的读取数据中...', //loading话术
    });
    myChart.hideLoading();

    var option = {
        title: {
            text: '温度'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'温度',
                type:'line',
                data: temp
            }
        ]
    };
// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, true);
    window.onresize = myChart.resize;

    var tempTotal = '平均温度：<span>' + Math.round(avg*10)/10 + '</span>℃';
    $('.total').html(tempTotal);
}

function lightFun(time, light, total) {

    myChart.showLoading({
        text: '正在努力的读取数据中...', //loading话术
    });
    myChart.hideLoading();


    var option1 = {
        title: {
            text: '光照'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }, toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'光照',
                type:'line',
                stack: '总量',
                data:light
            }
        ]
    };
    myChart.setOption(option1, true);
    window.onresize = myChart.resize;

    var lightTotal = '累计光照：<span>' + total + '</span>小时';
    $('.total').html(lightTotal);
};


