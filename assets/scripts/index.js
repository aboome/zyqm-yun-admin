$(function () {
    queryForecasters();
});

var forecasters = {
    userId: ''
}

function queryForecasters() {
    forecasters.userId = $.cookie('userId');

    YhHttp.init(YhHttpServiceCode.QUERY_FORECASTERS_INFO.CODE);
    YhHttp.send(forecasters, queryForecastersCallBack);
};

function queryForecastersCallBack(result){
    if(result != '' && result != null){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter == '' || resultObj.parameter == null || $.isEmptyObject(resultObj.parameter)){
            $('.outContact').html('失联');
            return;
        } else {

            $('.temp-num').html(resultObj.parameter.temperature);
            $('.humidity').html(resultObj.parameter.humidity);
            $('.illumination').html(resultObj.parameter.illumination);
            $('.rainfall').html(resultObj.parameter.rainfall);
            $('.pressure').html(resultObj.parameter.pressure);
            $('.pm25').html(resultObj.parameter.pm25);
            $('.co2').html(resultObj.parameter.co2);
            $('.windSpeed').html(resultObj.parameter.windSpeed);
            $('.windDirection').html(resultObj.parameter.windDirection);
            $('.soilTemp').html(resultObj.parameter.soilTemp);
            $('.soilHum').html(resultObj.parameter.soilHum);

            if(resultObj.parameter.rainSnowFlag == '0.0'){
                $('.rain').html('无');
            } else if(resultObj.parameter.rainSnowFlag == '1.0'){
                $('.rain').html('有');
            }


            var md = new Date();
            var currentTime = md.getTime();
            console.log(md.getTime());

            var time = resultObj.parameter.collectTime;
            console.log('resultObj:' + resultObj);
            var year = time.substring(0, 4);
            var month = time.substring(4, 6);
            var day = time.substring(6, 8);
            var hours = time.substring(8, 10);
            var minutes = time.substring(10, 12);
            var seconds = time.substring(12, 14);

            var upLoadTime = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            var upTime = (new Date(upLoadTime)).getTime();
            console.log(upTime);

            if(currentTime - upTime > 7200000){
                $('.outContact').html('失联');

                $('.temp-num').html('');
                $('.humidity').html('');
                $('.illumination').html('');
                $('.rainfall').html('');
                $('.pressure').html('');
                $('.pm25').html('');
                $('.co2').html('');
                $('.windSpeed').html('');
                $('.windDirection').html('');
                $('.soilTemp').html('');
                $('.soilHum').html('');
                $('.rain').html('');
            }


            $('.year').html(year);
            $('.month').html(month);
            $('.day').html(day);

            var weekList = [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六'
            ];
            var week = new Date(year+ '/' + month +'/' + day).getDay();
            function weekFun(w){
                $('.week').html(w);
            };

            switch(week){
                case 0: weekFun(weekList[0]); break;
                case 1: weekFun(weekList[1]); break;
                case 2: weekFun(weekList[2]); break;
                case 3: weekFun(weekList[3]); break;
                case 4: weekFun(weekList[4]); break;
                case 5: weekFun(weekList[5]); break;
                case 6: weekFun(weekList[6]); break;
            };
        }
    } else {
        layer.msg('请求服务器失败！');
    }
};

