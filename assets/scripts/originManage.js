/**
 * Created by zhan on 2016/5/31.
 */

/* 产品 */
var addProductTable = {
    productName: '',
    dpId: '',
    ownerId: '',
    cropId: '',
    produceTime: '',
    expectHarvestTime: '',
    expectYield: ''
};

var modifyProductTable = {
    productId: '',
    productName: '',
    status:'',
    dpName:'',
    productPeriod:'',
    totalPesticide:'',
    totalFertilizer:'',
    produceTime: '',
    expectHarvestTime: '',
    expectYield: '',
    realHarvestTime: '',
    realYield: ''
};

var deleteProductTable = {
    productId: ''
};

var updateProductTable = {
    productId: ''
};

/* 新增操作 */
var addOperationTable = {
    operationType: '',
    productId: '',
    materialId: '',
    remark: ''
};

/* 修改操作 */
var modifyOperationTable = {
    operationType: '',
    operationId: '',
    productId: '',
    materialId: '',
    remark: ''
};

/* 删除操作 */
var deleteOperationTable = {
    operationId: '',
    operationType: ''
};

//查询场地列表请求参数
var queryDpTable = {
    userId: ''
};

var cropInfoTable = {
    pageSize: '',
    pageNum: ''
};

var dpInfoTable = {
    dpId: ''
};

var dpPlantTable = {
    list: [],
    status: ''
};

/*获取农资信息列表*/
var queryMaterialTable = {
    productType: '',
    isHis: false
};

/*分页查询操作记录列表*/
var queryOperationRecordTable = {
    productId: '',
    pageSize: '',
    pageNum: ''
};

/*获取最新操作详情*/
var operationDetailTable = {
    productId: '',
    operationType: ''
};

var addProductTableList = {
    dpList: null,
    cropNameList: null
};

var operationTableList = {
    operationList: null
};

var operationHisTableList = {
    operationHisList: null
};

/* 查询用户场地列表 */
var dataTableList = null;
var status = null;
var dpInfoList = null;

$(function () {

    queryFieldInfo();

    queryCropInfo();

    /* 新增产品信息 */
    $('.addPlant').on('click', function () {

        addProductLayer();

    });


    /* 修改产品信息 */
    $('.modify').live('click', function () {

        modifyProductTable.productName = $(this).parents('tr').children('td:nth-child(2)').text();
        modifyProductTable.status = $(this).parents('tr').children('td:nth-child(3)').text();
        modifyProductTable.dpName = $(this).parents('tr').children('td:nth-child(4)').text();
        modifyProductTable.produceTime = $(this).parents('tr').children('td:nth-child(5)').text();
        modifyProductTable.productPeriod = $(this).parents('tr').children('td:nth-child(6)').text();
        modifyProductTable.totalPesticide = $(this).parents('tr').children('td:nth-child(7)').text();
        modifyProductTable.totalFertilizer = $(this).parents('tr').children('td:nth-child(8)').text();

        modifyProductTable.productId = $(this).parents('tr').children('td:nth-child(10)').text();
        modifyProductTable.expectHarvestTime = $(this).parents('tr').children('td:nth-child(11)').text();
        modifyProductTable.expectYield = $(this).parents('tr').children('td:nth-child(12)').text();
        modifyProductTable.realHarvestTime = $(this).parents('tr').children('td:nth-child(13)').text();
        modifyProductTable.realYield = $(this).parents('tr').children('td:nth-child(14)').text();

        modifyProductLayer();

    });

    /* 更新产品周期 */
    $('.update').live('click', function () {

        updateProductTable.productId = $(this).parents('tr').children('td:nth-child(10)').text();

        layer.open({
            type: 1,
            title: '更新周期信息',
            area: ['320px', '180px'],
            shadeClose: false,
            content: $('#updatePeriod'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                updateProductPeriod();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了删除', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });

    /* 删除产品信息 */
    $('.delete').live('click', function () {

        deleteProductTable.productId = $(this).parents('tr').children('td:nth-child(10)').text();

        deleteProductLayer();

    });

    /* 查看详情 */
    $('.detail').live('click', function () {

        var productName = $(this).parents('tr').children('td:nth-child(2)').text();
        var status = $(this).parents('tr').children('td:nth-child(3)').text();
        var dpName = $(this).parents('tr').children('td:nth-child(4)').text();
        var produceTime = $(this).parents('tr').children('td:nth-child(5)').text();
        var productPeriod = $(this).parents('tr').children('td:nth-child(6)').text();
        var totalPesticide = $(this).parents('tr').children('td:nth-child(7)').text();
        var totalFertilizer = $(this).parents('tr').children('td:nth-child(8)').text();
        var expectHarvestTime = $(this).parents('tr').children('td:nth-child(11)').text();
        var expectYield = $(this).parents('tr').children('td:nth-child(12)').text();
        var realHarvestTime = $(this).parents('tr').children('td:nth-child(13)').text();
        var realYield = $(this).parents('tr').children('td:nth-child(14)').text();

        $('#de-plantName').html(productName);
        $('#de-status').html(status);
        $('#de-dpName').html(dpName);
        $('#de-startDate').html(produceTime);
        $('#de-productPeriod').html(productPeriod);
        $('#de-totalPesticide').html(totalPesticide);
        $('#de-totalFertilizer').html(totalFertilizer);
        $('#de-expectHarvestTime').html(expectHarvestTime);
        $('#de-expectYield').html(expectYield);
        $('#de-realHarvestTime').html(realHarvestTime);
        $('#de-realYield').html(realYield);

        layer.open({
            type: 1,
            title: '详情',
            area: ['430px', '550px'],
            shadeClose: false,
            content: $('#detail'),
            btn: '关闭'
        });
    });

    $('.sow').live('click', function () {
        addOperationTable.productId = $(event.target).parents().children('td:nth-child(10)').text();
        queryMaterial('01', false);
    });
    $('.spray').live('click', function () {
        addOperationTable.productId = $(event.target).parents().children('td:nth-child(10)').text();
        queryMaterial('02', false);
    });
    $('.fertilize').live('click', function () {
        addOperationTable.productId = $(event.target).parents().children('td:nth-child(10)').text();
        queryMaterial('03', false);
    });

    /* 查询 */
    $('.searchBtn').on('click', function () {
        queryDpPlantInfo();
    });

    /* 操作历史 */
    $('.history').live('click', function () {
        YHLayer.loading();
        queryOperationInfo();
    });

    /* 删除操作历史 */
    $('.deleteOpe').live('click', function () {
        data = $(this).attr('data-id');
        var opeType = $(event.target).parents().children('td:nth-child(1)').text();
        if (opeType == '播种') {
            deleteOperationTable.operationType = '01';
        } else if (opeType == '打药') {
            deleteOperationTable.operationType = '02';
        } else if (opeType == '施肥') {
            deleteOperationTable.operationType = '03';
        }

        layer.open({
            type: 1,
            title: '删除',
            area: ['320px', '180px'],
            shadeClose: false,
            content: $('#delOperation'),
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                delOperationInfo();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了删除', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });

});

function queryFieldInfo() {

    YHLayer.loading();

    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }
    queryDpTable.userId = $.cookie('userId');

    YhHttp.init(YhHttpServiceCode.QUERY_DP_LIST_BY_USER_ID.CODE);
    YhHttp.send(queryDpTable, queryFieldInfoCallBack);

}

var queryFieldInfoCallBack = function (result) {

    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
        } else {
            YHLayer.closeAllLayer();

            addProductTableList.dpList = resultObj.parameter.list;

            dataTableList = resultObj.parameter;
            dpInfoList = dataTableList.list;

            var tpl = $('#dpInfoSelect').html();
            var dpSelectHtml = juicer(tpl, dataTableList);
            $('#dpCondition').html(dpSelectHtml);

            queryDpPlantInfo();
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }

};

/* 获取大棚种植列表(09) */
var productInfoList = null;

var queryDpPlantInfo = function () {

    YHLayer.loading();

    dpPlantTable.list = [];

    if ($("#dpSelect").attr("value") == '-1'){
        for (var i = 0; i < dpInfoList.length; i++) {
            dpInfoTable = {};
            dpInfoTable.dpId = dpInfoList[i].dpId;
            dpPlantTable.list.push(dpInfoTable);
        }
    }else {
        dpInfoTable = {};
        dpInfoTable.dpId = $("#dpSelect").attr("value");
        dpPlantTable.list.push(dpInfoTable);
    }

    dpPlantTable.status = $("#plantStatus").attr("value");

    YhHttp.init(YhHttpServiceCode.QUERY_DP_PRODUCTION_INFO.CODE);
    YhHttp.send(dpPlantTable, queryDpPlantInfoCallBack);

};

var queryDpPlantInfoCallBack = function (result) {

    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
        } else {
            YHLayer.closeAllLayer();
            productInfoList = resultObj.parameter;
            changeText();
            var tpl = $('#dpPlantTbTpl').html();
            var tableHtml = juicer(tpl, productInfoList);
            $("#dpPlantTb").html("<tr></tr>" + tableHtml);

            var sta = $('.status').html();
            if(sta == '已收获'){
                $('.otherPeriod').css('display', 'none');
            }
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }

};

function changeText() {
    var periodList = productInfoList.list;
    var periodName = '';
    var statusVal = '';
    var startTime = '';
    for (var i = 0; i < periodList.length; i++) {
        var proPeriod = periodList[i].list;
        for (var j = 0; j < proPeriod.length; j++) {
            var proPeriod2 = proPeriod[j].productPeriod;
            var status = proPeriod[j].status;
            var produceTime = proPeriod[j].produceTime;

            /* 周期 */
            if (proPeriod2 == '00') {
                periodName = '准备期';
            } else if (proPeriod2 == '01') {
                periodName = '种子发芽期';
            } else if (proPeriod2 == '02') {
                periodName = '幼苗期';
            } else if (proPeriod2 == '03') {
                periodName = '开花期';
            } else if (proPeriod2 == '04') {
                periodName = '结果期';
            } else if (proPeriod2 == '11') {
                periodName = '营养生长阶段';
            } else if (proPeriod2 == '12') {
                periodName = '生殖生长阶段';
            } else if (proPeriod2 == '21') {
                periodName = '童期';
            } else if (proPeriod2 == '22') {
                periodName = '成年期';
            } else if (proPeriod2 == '23') {
                periodName = '衰老期';
            } else if (proPeriod2 == '31') {
                periodName = '营养生长阶';
            } else if (proPeriod2 == '32') {
                periodName = '成年期';
            } else if (proPeriod2 == '33') {
                periodName = '衰老期';
            }

            /* 状态 */
            if (status == '01') {
                statusVal = '未收获';
            } else if (status == '10') {
                statusVal = '已收获';
            }
            proPeriod[j].productPeriod = periodName;
            proPeriod[j].status = statusVal;
            /* 播种时间 */
            var year = produceTime.slice(0, 4);
            var month = produceTime.slice(4, 6);
            var day = produceTime.slice(6, 8);
            proPeriod[j].produceTime = year + '/' + month + '/' + day;
            proPeriod[j].expectHarvestTime = proPeriod[j].expectHarvestTime.slice(0,4)+ '/' +proPeriod[j].expectHarvestTime.slice(4,6)+ '/' +proPeriod[j].expectHarvestTime.slice(6,8);
            if (typeof(proPeriod[j].realHarvestTime) != "undefined"){
                proPeriod[j].realHarvestTime = proPeriod[j].realHarvestTime.slice(0,4)+ '/' +proPeriod[j].realHarvestTime.slice(4,6)+ '/' +proPeriod[j].realHarvestTime.slice(6,8);
            }
        }
    }
}

/* 获取农作物信息列表 */
function queryCropInfo() {

    YHLayer.loading();

    cropInfoTable.pageSize = '';
    cropInfoTable.pageNum = '';

    YhHttp.init(YhHttpServiceCode.QUERY_CROP_LIST.CODE);
    YhHttp.send(cropInfoTable, queryCropInfoCallBack);

}

var queryCropInfoCallBack = function (result) {

    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
        } else {
            YHLayer.closeAllLayer();
            addProductTableList.cropNameList = resultObj.parameter.list;
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }
};

function addProductLayer() {

    var corpContent = juicer($('#cropNameTpl').html(), addProductTableList);
    $('#cropNameList').html(corpContent);

    var dpContent = juicer($('#dpNameTpl').html(), addProductTableList);
    $('#dpNameList').html(dpContent);

    $('#cropName').val('');
    $('#plantName').val('');
    $('#dpName').val('');
    $('#produceTime').val('');
    $('#expectHarvestTime').val('');
    $('#expectYield').val('');

    $('.help-block').remove();

    layer.open({
        type: 1,
        title: '新增种植物',
        area: 'auto',
        maxWidth: '450px',
        shadeClose: false,
        content: $('#addDpPlant'),
        btn: ['确定', '取消'],
        yes: function (index, layero) {

            if(!$('#addDpPlantInfo').valid()){
                return 0;
            }

            YHLayer.loading();
            addDpPlant();
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了新增', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function addDpPlant() {

    if ($.cookie('userId') == null || $.cookie('userId') == '') {
        return;
    }

    var produceTimes = $('#produceTime').val().split('/').join('');
    var times = $('#expectHarvestTime').val().split('/').join('');

    addProductTable.productName = $('#plantName').val();
    addProductTable.dpId = $('#dpName').find('option:selected').val();
    addProductTable.ownerId = $.cookie('userId');
    addProductTable.cropId = $('#cropName').find('option:selected').val();
    addProductTable.produceTime = produceTimes + '000000';
    addProductTable.expectHarvestTime = times + '000000';
    addProductTable.expectYield = $('#expectYield').val();

    YhHttp.init(YhHttpServiceCode.ADD_PRODUCT_INFO.CODE);
    YhHttp.send(addProductTable, addProductInfoCallBack);

}

var addProductInfoCallBack = function (result) {

    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDpPlantInfo();
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDpPlantInfo();
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('新增失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDpPlantInfo();
        });
    }

};

function modifyProductLayer() {

    $('#mo-productName').val( modifyProductTable.productName);
    $('#mo-status').text(modifyProductTable.status);
    $('#mo-dpName').text(modifyProductTable.dpName);
    $('#mo-produceTime').val(modifyProductTable.produceTime);
    $('#mo-productPeriod').text(modifyProductTable.productPeriod);
    $('#mo-totalPesticide').text(modifyProductTable.totalPesticide);
    $('#mo-totalFertilizer').text(modifyProductTable.totalFertilizer);
    $('#mo-expectHarvestTime').val(modifyProductTable.expectHarvestTime);
    $('#mo-expectYield').val(modifyProductTable.expectYield);
    $('#mo-realHarvestTime').val(modifyProductTable.realHarvestTime);
    $('#mo-realYield').val(modifyProductTable.realYield);

    $('.help-block').remove();

    layer.open({
        type: 1,
        title: '修改种植物',
        area: 'auto',
        maxWidth:'550px',
        shadeClose: false,
        content: $('#modifyDpPlant'),
        btn: ['确定', '取消'],
        yes: function (index, layero) {

            if(!$('#modifyDpPlantInfo').valid()){
                return 0;
            }

            var proTimes = $(layero).find('#mo-produceTime').val().split('/').join('');
            var expTimes = $(layero).find('#mo-expectHarvestTime').val().split('/').join('');
            var reaTimes = $(layero).find('#mo-realHarvestTime').val().split('/').join('');

            modifyProductTable.productName = $(layero).find('#mo-productName').val();
            modifyProductTable.produceTime = proTimes + '000000';
            modifyProductTable.expectHarvestTime = expTimes + '000000';
            modifyProductTable.expectYield = $(layero).find('#mo-expectYield').val();
            if (reaTimes != '' && reaTimes != null){
                modifyProductTable.realHarvestTime = reaTimes + '000000';
            }

            modifyProductTable.realYield = $(layero).find('#mo-realYield').val();
            YHLayer.loading();
            modifyProductInfo();
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了修改', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

var modifyProductInfo = function () {

    YhHttp.init(YhHttpServiceCode.MODIFY_PRODUCT_INFO.CODE);
    YhHttp.send(modifyProductTable, modifyProductInfoCallBack);

};

var modifyProductInfoCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDpPlantInfo();
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDpPlantInfo();
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('修改失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDpPlantInfo();
        });
    }
};

function deleteProductLayer() {

    var content = juicer($('#delOperation').html(), 0);

    layer.open({
        type: 1,
        title: '删除种植物信息',
        area: ['320px', '180px'],
        shadeClose: false,
        content: content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            YHLayer.loading();
            delProduct();
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了删除', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function delProduct() {

    YhHttp.init(YhHttpServiceCode.DELETE_PRODUCT_INFO.CODE);
    YhHttp.send(deleteProductTable, deleteProductCallBack);

}

var deleteProductCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDpPlantInfo();
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDpPlantInfo();
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('删除失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDpPlantInfo();
        });
    }
};

function updateProductPeriod() {

    YhHttp.init(YhHttpServiceCode.UPDATE_PRODUCT_PERIOD.CODE);
    YhHttp.send(updateProductTable, updateProductPeriodCallBack);

}

var updateProductPeriodCallBack = function (result) {
    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDpPlantInfo();
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDpPlantInfo();
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('更新周期信息失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDpPlantInfo();
        });
    }
};



var modifyOpeObj = {
    operationType: null,
    period: null,
    operationTime: null,
    materialId: null,
    materialName: null,
    companyName: null,
    companyWeb: null,
    companyDesc: null
};

/* 修改操作历史 */
var data = '';
$('.modifyOpe').live('click', function () {

    modifyOpeObj.operationType = $(event.target).parents('tr').children('td:nth-child(1)').text();
    modifyOpeObj.period = $(event.target).parents('tr').children('td:nth-child(2)').text();
    modifyOpeObj.operationTime = $(event.target).parents('tr').children('td:nth-child(3)').text();
    modifyOpeObj.materialId = $(event.target).parents('tr').children('td:nth-child(4)').data('value');
    modifyOpeObj.materialName = $(event.target).parents('tr').children('td:nth-child(4)').text();
    modifyOpeObj.companyName = $(event.target).parents('tr').children('td:nth-child(5)').text();
    modifyOpeObj.companyWeb = $(event.target).parents('tr').children('td:nth-child(6)').text();
    modifyOpeObj.companyDesc = $(event.target).parents('tr').children('td:nth-child(7)').text();

    if (modifyOpeObj.operationType == '播种') {
        queryMaterial('01', true);
    } else if (modifyOpeObj.operationType == '打药') {
        queryMaterial('02', true);
    } else if (modifyOpeObj.operationType == '施肥') {
        queryMaterial('03', true);
    }

    data = $(this).attr('data-id');
});

function showModifyOpe() {

    var content = juicer($('#modifyOperation').html(), operationHisTableList);

    layer.open({
        type: 1,
        title: '修改操作',
        area: ['430px', '420px'],
        shadeClose: false,
        content: content,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            modifyOperationInfo();
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了修改', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });

    $('#mo-operationType').html(modifyOpeObj.operationType);
    $('#mo-period').html(modifyOpeObj.period);
    $('#mo-operationTime').html(modifyOpeObj.operationTime);
    $('#mo-companyName').html(modifyOpeObj.companyName);
    $('#mo-companyWeb').html(modifyOpeObj.companyWeb);
    $('#mo-companyDesc').html(modifyOpeObj.companyDesc);
    $('#mo-materialName').val(modifyOpeObj.materialId);
}

/* 获取操作信息 */
var operationInfoList = null;

function queryOperationInfo() {

    queryOperationRecordTable.productId = $(event.target).parents().children('td:nth-child(10)').text();
    queryOperationRecordTable.pageSize = 100;
    queryOperationRecordTable.pageNum = 1;

    YhHttp.init(YhHttpServiceCode.QUERY_OPERATION_LIST.CODE);
    YhHttp.send(queryOperationRecordTable, queryOperationInfoCallBack);

}

var queryOperationInfoCallBack = function (result) {
    if (result != null && result != '') {
        $('.active').removeClass('active');
        $('#sowingLi').addClass('active');
        $('.tab-pane fade in active').removeClass('tab-pane fade in active');
        $('#sowing').addClass('tab-pane fade in active');
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
            YHLayer.closeAllLayer();
            $("#sowingTb").html("<tr></tr>");
            $("#sprayTb").html("<tr></tr>");
            $("#fertilizeTb").html("<tr></tr>");
        } else {
            YHLayer.closeAllLayer();
            operationInfoList = resultObj.parameter;
            changeOperationText();
            var sowingTpl = $('#sowingTbTpl').html();
            var sprayTpl = $('#sprayTbTpl').html();
            var fertilizeTpl = $('#fertilizeTbTpl').html();
            var sowingHtml = juicer(sowingTpl, operationInfoList);
            var sprayHtml = juicer(sprayTpl, operationInfoList);
            var fertilizeHtml = juicer(fertilizeTpl, operationInfoList);
            $("#sowingTb").html("<tr></tr>" + sowingHtml);
            $("#sprayTb").html("<tr></tr>" + sprayHtml);
            $("#fertilizeTb").html("<tr></tr>" + fertilizeHtml);

        }

        layer.open({
            type: 1,
            title: false,
            area: ['60%', '60%'],
            shadeClose: false,
            content: $('#controlHistory'),
            btn: '关闭'
        });
    } else {
        YHLayer.closeAllLayer();
        layer.msg('新增操作失败，请稍候重试！', {icon: 2, time: 1000}, function () {
        });
    }
};

/* 修改操作记录 */
function modifyOperationInfo() {

    var opeType = modifyOpeObj.operationType;

    if (opeType == '播种') {
        modifyOperationTable.operationType = '01';
    } else if (opeType == '打药') {
        modifyOperationTable.operationType = '02';
    } else if (opeType == '施肥') {
        modifyOperationTable.operationType = '03';
    }

    modifyOperationTable.operationId = data;
    modifyOperationTable.materialId = $('#mo-materialName').val();
    modifyOperationTable.productId = queryOperationRecordTable.productId;

    YhHttp.init(YhHttpServiceCode.MODIFY_OPERATION_INFO.CODE);
    YhHttp.send(modifyOperationTable, modifyOperationInfoCallBack);

}

var modifyOperationInfoCallBack = function (result) {

    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('修改操作失败，请稍候重试！', {icon: 0, time: 1000}, function () {
        });
    }

};

/* 删除操作记录 */
function delOperationInfo() {

    deleteOperationTable.operationId = data;

    YhHttp.init(YhHttpServiceCode.DELETE_OPERATION_INFO.CODE);
    YhHttp.send(deleteOperationTable, delOperationInfoCallBack);

}

var delOperationInfoCallBack = function (result) {

    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDpPlantInfo();
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDpPlantInfo();
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('删除操作失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDpPlantInfo();
        });
    }

};

var operationList = new Array();

function changeOperationText() {
    operationList = operationInfoList.list;
    var operationTypeText = '';
    var periodVal = '';
    var operationTime = '';
    for (var i = 0; i < operationList.length; i++) {
        var operationType = operationList[i].operationType;
        var period = operationList[i].productPeriod;
        var time = operationList[i].operationTime;
        /* 周期 */
        if (period == '00') {
            periodVal = '准备期';
        } else if (period == '01') {
            periodVal = '种子发芽期';
        } else if (period == '02') {
            periodVal = '幼苗期';
        } else if (period == '03') {
            periodVal = '开花期';
        } else if (period == '04') {
            periodVal = '结果期';
        } else if (period == '11') {
            periodVal = '营养生长阶段';
        } else if (period == '12') {
            periodVal = '生殖生长阶段';
        } else if (period == '21') {
            periodVal = '童期';
        } else if (period == '22') {
            periodVal = '成年期';
        } else if (period == '23') {
            periodVal = '衰老期';
        } else if (period == '31') {
            periodVal = '营养生长阶';
        } else if (period == '32') {
            periodVal = '成年期';
        } else if (period == '33') {
            periodVal = '衰老期';
        }

        /* 操作类型 */
        if (operationType == '01') {
            operationTypeText = '播种';
        } else if (operationType == '02') {
            operationTypeText = '打药';
        } else if (operationType == '03') {
            operationTypeText = '施肥';
        }
        operationList[i].productPeriod = periodVal;
        operationList[i].operationType = operationTypeText;
        /* 操作时间 */
        var year = time.slice(0, 4);
        var month = time.slice(4, 6);
        var day = time.slice(6, 8);
        var hours = time.slice(8, 10);
        var minutes = time.slice(10, 12);
        var seconds = time.slice(12, 14);
        operationList[i].operationTime = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    ;
};

/*获取农资信息列表*/
var materialList = new Array();

function queryMaterial(typeNum, isHis) {

    queryMaterialTable.productType = typeNum;
    queryMaterialTable.isHis = isHis;

    YhHttp.init(YhHttpServiceCode.QUERY_MATERIAL_LIST.CODE);
    YhHttp.send(queryMaterialTable, queryMaterialCallBack);

}

var queryMaterialCallBack = function (result) {

    if (result != null && result != '') {
        var resultObj = JSON.parse(result);
        if (resultObj.parameter.list == null || resultObj.parameter.list == '') {

        } else {
            operationTableList.operationList = resultObj.parameter.list;
            operationHisTableList.operationHisList = resultObj.parameter.list;

            if (queryMaterialTable.productType == '01' && !queryMaterialTable.isHis) {
                sow();
            } else if (queryMaterialTable.productType == '02' && !queryMaterialTable.isHis) {
                spray();
            } else if (queryMaterialTable.productType == '03' && !queryMaterialTable.isHis) {
                fertilize();
            } else if (queryMaterialTable.productType == '01' && queryMaterialTable.isHis) {
                showModifyOpe();
            } else if (queryMaterialTable.productType == '02' && queryMaterialTable.isHis) {
                showModifyOpe();
            } else if (queryMaterialTable.productType == '03' && queryMaterialTable.isHis) {
                showModifyOpe();
            }
        }
    } else {
        layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
        });
    }

};


function addOperation(typeNum) {

    addOperationTable.operationType = typeNum;
    addOperationTable.materialId = $('.addControl').find('option:selected').val();

    YhHttp.init(YhHttpServiceCode.ADD_OPERATION_INFO.CODE);
    YhHttp.send(addOperationTable, addOperationCallBack);

}

var addOperationCallBack = function (result) {

    if(result != null && result != ''){
        var resultObj = JSON.parse(result);
        if(resultObj.parameter.status != null && resultObj.parameter.status == '0000'){
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 1, time: 1000}, function () {
                queryDpPlantInfo();
            });
        } else {
            YHLayer.closeAllLayer();
            layer.msg(resultObj.parameter.message, {icon: 2, time: 1000}, function () {
                queryDpPlantInfo();
            });
        }
    } else {
        YHLayer.closeAllLayer();
        layer.msg('新增操作失败，请稍候重试！', {icon: 0, time: 1000}, function () {
            queryDpPlantInfo();
        });
    }

};

function sow() {
    var content = juicer($('#sowContentTpl').html(), operationTableList);
    layer.open({
        type: 1,
        title: '播种',
        area: ['430px', '180px'],
        shadeClose: false,
        content: content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            YHLayer.loading();
            addOperation('01');
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了播种', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function spray() {
    var content = juicer($('#sprayContentTpl').html(), operationTableList);
    layer.open({
        type: 1,
        title: '打药',
        area: ['430px', '180px'],
        shadeClose: false,
        content: content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            YHLayer.loading();
            addOperation('02');
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了打药', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

function fertilize() {
    var content = juicer($('#fertilizeContentTpl').html(), operationTableList);
    layer.open({
        type: 1,
        title: '施肥',
        area: ['430px', '180px'],
        shadeClose: false,
        content: content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            YHLayer.loading();
            addOperation('03');
        }, btn2: function (index, layero) {
            layer.msg('您已经取消了施肥', {
                time: 2000, //2s后自动关闭
                btn: ['知道了']
            })
        }
    });
}

