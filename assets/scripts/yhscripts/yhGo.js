/**
 * Created by zhan on 2016/7/19.
 */
var YhHttpContent = {
    parameter: '',
    serviceCode: '',
    timestamp: '',
    uuid: ''
};
var YhHttp = {
    URL: 'http://127.0.0.1:8080/agnet/app/open_api',
    DOWN_URL: 'http://127.0.0.1:8080/agnet/download/open_api',
    /*URL: 'http://10.10.150.103:8080/agnet/app/open_api',
    DOWN_URL: 'http://10.10.150.103:8080/agnet/download/open_api',*/
    init: function (code) {
        YhHttpContent.serviceCode = code;
        YhHttpContent.parameter = '';
        YhHttpContent.timestamp = '';
        YhHttpContent.uuid = '';
    },
    send: function (msg, method) {
        var paramString = JSON.stringify(msg);
        YhHttpContent.parameter = paramString;
        var sendString = 'appMsg=' + JSON.stringify(YhHttpContent);
        var httpUrl = YhHttp.URL;
        $.post(httpUrl, sendString, method);
    },
    download: function (msg, method) {
        var paramString = JSON.stringify(msg);
        YhHttpContent.parameter = paramString;
        var sendString = 'appMsg=' + JSON.stringify(YhHttpContent);
        var httpUrl = YhHttp.DOWN_URL;
        $.post(httpUrl, sendString, method);
    },
};

var YhHttpServiceCode = {

    //公用模块(00)

    // 查询用户下的大棚列表
    QUERY_DP_LIST_BY_USER_ID: {CODE: 'app0002'},

    //新增用户大棚 (0006)
    ADD_USER_DP: {CODE: 'app0006'},

    //修改用户大棚信息(0007)
    MODIFY_USER_DP: {CODE: 'app0007'},

    //查询用户网关(0008)
    QUERY_USER_GATEWAY_LIST: {CODE: 'app0008'},

    //删除用户大棚（0009）
    DELETE_USER_DP: {CODE: 'app0009'},

    //查询场地详情（0010）
    QUERY_USER_DP_DETAIL: {CODE: 'app0010'},

    //Web端查询用户的大棚列表（00  11）
    QUERY_USER_DP_LIST: {CODE: 'app0011'},



    //注册（0100）
    REGISTER: {CODE: 'app0100'},

    //登录（0101）
    LOGIN: {CODE: 'app0101'},

    //查询用户信息
    QUERY_USER_INFO: {CODE: 'app0102'},

    //修改密码（0103）
    MODIFY_USER_PASSWORD: {CODE: 'app0103'},

    //添加操作员
    ADD_OPERATOR: {CODE: 'app0105'},

    //删除操作员
    DELETE_OPERATOR: {CODE: 'app0106'},

    //设置操作员权限
    SETTING_OPERATOR: {CODE: 'app0108'},

    //查询操作员列表
    QUERY_OPERATOR: {CODE: 'app0109'},


    //获取监测信息
    QUERY_SENSOR_INFO: {CODE: 'app0200'},

    //获取监测信息详情
    QUERY_SENSOR_INFO_DETAIL: {CODE: 'app0201'},

    //修改传感器设备
    MODIFY_SENSOR: {CODE: 'app0205'},

    //删除传感器设备
    DELETE_SENSOR: {CODE: 'app0204'},

    //分页查询传感器列表
    QUERY_SENSOR_LIST: {CODE: 'app0209'},


    // 打开设备
    OPEN_DEVICE: {CODE: 'app0300'},

    // 取消任务
    CANCEL_TASK: {CODE: 'app0302'},

    // 查询大棚下设备列表
    QUERY_DEVICE_LIST_IN_DP: {CODE: 'app0304'},

    // 关闭设备
    CLOSE_DEVICE: {CODE: 'app0305'},

    // 重新开启任务
    RESTART_TASK: {CODE: 'app0306'},

    // 更新控制设备下所有设备状态
    REFRESH_DEIVCE_STATUS_DP: {CODE: 'app0307'},

    //查询智能设备详情
    QUERY_CONTROL_DEVICE_DETAIL: {CODE: 'app0309'},

    //修改控制设备
    MODIFY_CONTROL_DEVICE: {CODE: 'app0310'},

    //删除控制设备
    DELETE_CONTROL_DEVICE: {CODE: 'app0311'},

    //分页查询控制设备列表
    PAGE_QUERY_CONTROL_DEVICE_LIST: {CODE: 'app0312'},


    //设置预警
    SETTING_WARNING: {CODE: 'app0400'},

    // 查询预警列表
    QUERY_WARNING_LIST: {CODE: 'app0401'},

    // 预警详情
    DETAIL_WARNING: {CODE: 'app0404'},
    //批量查询预警设置信息
    QUERY_WARNING_SETTING_INFO: {CODE: 'app0405'},


    //查询网络摄像头列表
    QUERY_NETWORK_IPC_LIST: {CODE: 'app0603'},

    //查询硬盘录像机列表
    QUERY_HARD_NVR_LIST: {CODE: 'app0604'},


    //新增产品信息(0701)
    ADD_PRODUCT_INFO: {CODE: 'app0701'},

    //修改产品信息(0702)
    MODIFY_PRODUCT_INFO: {CODE: 'app0702'},

    //删除产品信息(0703)
    DELETE_PRODUCT_INFO: {CODE: 'app0703'},

    //更新产品周期(0704)
    UPDATE_PRODUCT_PERIOD:{CODE:'app0704'},

    //新增操作信息(0705)
    ADD_OPERATION_INFO:{CODE:'app0705'},

    //修改操作信息(0706)
    MODIFY_OPERATION_INFO:{CODE:'app0706'},

    //删除操作信息(0707)
    DELETE_OPERATION_INFO:{CODE:'app0707'},

    //获取农作物信息列表(0708)
    QUERY_CROP_LIST: {CODE: 'app0708'},

    //获取大棚种植列表(0709)
    QUERY_DP_PRODUCTION_INFO: {CODE: 'app0709'},

    //获取农资信息列表(0710)
    QUERY_MATERIAL_LIST: {CODE:'app0710'},

    //分页查询操作记录列表(0711)
    QUERY_OPERATION_LIST: {CODE:'app0711'},


    //查询气象站详情
    QUERY_FORECASTERS_INFO: {CODE: 'app0805'},
    //设备分组列表查询
    QUERY_DEVICE_GROUP_LIST: {CODE: 'app0807'},
    //单组设备控制
    SETTING_GROUP_DEVICE: {CODE: 'app0808'},


    //单组设备查询
    QUERY_GROUP_DEVICE: {CODE: 'app0814'},
    //新建分组信息
    ADD_GROUP: {CODE: 'app0815'},
    //修改分组信息
    MODIFY_GROUP: {CODE: 'app0816'},
    //删除分组信息
    DELETE_GROUP: {CODE: 'app0817'},
    UPDATE_GROUP_DEVICE: {CODE: 'app0818'},

    //查询用户基础实施数量
    QUERY_INDEX_STATICS: {CODE: 'app0900'},
    //查询数据报表
    QUERY_FORMS_DATA: {CODE: 'app0901'},
    //查询温度统计列表
    QUERY_TEMP_TOTAL_LIST: {CODE: 'app0902'},
    //查询光照统计列表
    QUERY_LIGHT_TOTAL_LIST: {CODE: 'app0903'},

    //导出温度数据
    EXPORT_TEMP_DATA: {CODE: 'app1001'},

    //导出光照数据
    EXPORT_LIGHT_DATA: {CODE: 'app1002'},
};

