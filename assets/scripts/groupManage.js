/**
 * Created by gao on 2016/7/22.
 */
$(function(){
    var queryGroupInfo = {
        dpId: ''
    };
    var addGroupTable = {
        groupName: '',
        dpId: '',
        systemType: ''
    };

    var delGroupTable = {
        groupId: ''
    };
    var queryUserDpList = {
        userId : ""
    };

    var queryGroupList = {
        dpId : "",
        systemType : ""
    };

    var singleDeviceSetting = {
        groupId: '',
        status: '',
        direct: ''
    };

    var groupTableList = {
        groupList : null
    };
    var modifyDataTable = {
        groupId: '',
        groupName: ''
    };
    var settingDeviceTable = {
        list: [],
        groupId: ''
    };
    var queryDpDeviceList = {
        dpId: ''
    };
    var queryDeviceTable = {
        groupId: ''
    };
    var deviceInfoDataTable = {
        deviceId: ''
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

    var queryDpListCallBack = function(result) {
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
                YHLayer.closeAllLayer();
            } else {
                YHLayer.closeAllLayer();
                groupTableList.groupList = resultObj.parameter.list;
                var param = resultObj.parameter;
                var tpl = $('#dpInfoSelect').html();
                var htmlContent = juicer(tpl, param);
                $("#dpCondition").html(htmlContent);
                $("select option:nth-child(2)").attr("selected", "selected");
                queryGroupListByDpId();
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
                window.location.reload();
            });
        }
    };

    queryUserDpListById();

    /*
     *   when selected item changed
     */

    $(".searchGroup").live("change", function() {
        queryGroupListByDpId();
    });


    function queryGroupListByDpId(dpId) {
        var loginUserId = $.cookie('userId');

        if (null == loginUserId) {
            return;
        }

        var dpId = $("#dpSelect").attr("value");

        if (dpId == null || dpId == '') {
            layer.msg("请选择大棚！");
            return;
        }

        if (dpId == '-1') {
            $("#GroupList").html("");
            return;
        }

        queryGroupList.dpId = dpId;
        queryGroupList.systemType = $('#shengtai').val();

        YhHttp.init(YhHttpServiceCode.QUERY_DEVICE_GROUP_LIST.CODE);
        YhHttp.send(queryGroupList, queryGroupListCallBack);
    }

    var queryGroupListCallBack = function(result) {
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
                YHLayer.closeAllLayer();
                $("#groupList").html('');
                $('#groupContent').hide();
            } else {
                YHLayer.closeAllLayer();
                $('#groupContent').show();
                var param = resultObj.parameter;
                var tpl = $('#groupTbTpl').html();
                var htmlContent = juicer(tpl, param);
                $("#groupList").html(htmlContent);

                selectedLi();
                $('#group_0').addClass('active');
            }

        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    };

    /*
     *   add Group
     */
    $('#addGro').live('click', function(){
        addGroupLayer();
    });
    function addGroupLayer(){
        $('#dpNameList').html(juicer($('#dpNameTpl').html(), groupTableList));
        $('#groupName').val('');
        $('#dpName').val('');
        $('#addSolution').val('');
        $('.help-block').remove();

        layer.open({
            type: 1,
            title: '新增',
            area: 'auto',
            maxWidth:'450px',
            shadeClose: false,
            content: $('#addGroup'),
            btn: ['确定', '关闭'],
            yes: function (index, layero) {

                if(!$('#addGroupInfo').valid()){
                    return;
                }
                YHLayer.loading();
                addGroup();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了新增', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    }

    function addGroup (){
        if ($.cookie('userId') == null || $.cookie('userId') == '') {
            return;
        }
        addGroupTable.groupName = $('#groupName').val();
        addGroupTable.dpId = $('#dpName').val();
        addGroupTable.systemType = $('#addSolution').val();

        YhHttp.init(YhHttpServiceCode.ADD_GROUP.CODE);
        YhHttp.send(addGroupTable, addGroupCallback);
    }

    function addGroupCallback(result){
        if(result != null && result != ''){
            var resultObj = JSON.parse(result);
            if(resultObj.parameter == null || resultObj.parameter == ''){
                YHLayer.closeAllLayer();
            } else {
                YHLayer.closeAllLayer();
                if(resultObj.parameter.status == '0000'){
                    layer.msg(resultObj.parameter.message, {icon: 1, time: 500}, function () {
                        queryGroupListByDpId();
                    });
                } else {
                    layer.msg(resultObj.parameter.message, {icon: 2, time: 500}, function () {
                        queryGroupListByDpId();
                    });
                }
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
                window.location.reload();
            });
        }
    }
    

    /*
     *   modify Group
     */
    /* 修改按钮 */
    $('.modifyGroup').live('click', function() {
        var content = juicer($('#modifyTpl').html(), 0);
        layer.open({
            type: 1,
            title: '修改',
            area: ['420px', '200px'],
            shadeClose: false,
            content: content,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                modifyGroup();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了修改', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
        var name = $(this).attr('data-name');
        $('#mGroupName').val(name);
    });

    function modifyGroup(){
        modifyDataTable.groupName = $('#mGroupName').val();
        modifyDataTable.groupId = $('#disGroupId').html();

        YhHttp.init(YhHttpServiceCode.MODIFY_GROUP.CODE);
        YhHttp.send(modifyDataTable, modifyGroupCallback);
    }

    function modifyGroupCallback(result) {
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter == null || resultObj.parameter == '') {
                YHLayer.closeAllLayer();
            } else {
                YHLayer.closeAllLayer();
                if(resultObj.parameter.status == '0000'){
                    layer.msg(resultObj.parameter.message, {icon: 1, time: 500}, function () {
                        window.location.reload();
                    });
                }else{
                    layer.msg(resultObj.parameter.message, {icon: 2, time: 500}, function () {
                        window.location.reload();
                    });
                }
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
                window.location.reload();
            });
        }
    }

    /*
     *   delete Group
     */
    $('.deleteGroup').live('click', function(){
        delLayer();
    });
    function delLayer(){
        var content = '您确定要删除该分组吗？';
        layer.open({
            type: 1,
            title: '删除',
            area: ['260px', '180px'],
            shadeClose: false,
            content: content,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                delOperation ();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了删除', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    }

    function delOperation (){

        delGroupTable.groupId = $('#disGroupId').html();

        YhHttp.init(YhHttpServiceCode.DELETE_GROUP.CODE);
        YhHttp.send(delGroupTable, delOperationCallback);
    }

    function delOperationCallback(result){
        if(result != null && result != ''){
            var resultObj = JSON.parse(result);
            if(resultObj.parameter == null || resultObj.parameter == ''){
                YHLayer.closeAllLayer();
            } else {
                YHLayer.closeAllLayer();
                if(resultObj.parameter.status == '0000'){
                    layer.msg(resultObj.parameter.message, {icon: 1, time: 500}, function () {
                        window.location.reload();
                    });
                }else{
                    layer.msg(resultObj.parameter.message, {icon: 2, time: 500}, function () {
                        window.location.reload();
                    });
                }
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    }

    $('.update').live('click', function(){
        updateLayer ();
    });

    function updateLayer (){
        var content = juicer($('#settingAuth').html(), queryDpDevice ());
        layer.open({
            type: 1,
            title: '更新分组设备',
            area: ['430px', '520px'],
            shadeClose: false,
            content: content,
            scrollbar: false,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                settingDevice ();
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了设置', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });

    }

    var queryDpDevice = function () {
        queryDpDeviceList.dpId = $("#dpSelect").attr("value");

        YhHttp.init(YhHttpServiceCode.QUERY_DEVICE_LIST_IN_DP.CODE);
        YhHttp.send(queryDpDeviceList, queryDpDeviceCallback);
    };

    var queryDpDeviceCallback = function (result) {
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
                YHLayer.closeLoading();
            } else {
                var deviceList = resultObj.parameter;
                var tpl = $('#settingTpl').html();
                var htmlContent = juicer(tpl, deviceList);
                $("#settingAuthInfo").html('<tr></tr>' + htmlContent);

                /* 已选中 */
                
                $(".device").each(function() {
                    var controlDeviceId = $(this).attr('data-id');
                    $("input:checkbox[value="+controlDeviceId+"]").attr('checked','true');
                });

                /* 全选 */
                $('#checkAll').click(function() {
                    $("input[name='dp']").attr('checked',this.checked);
                });

                var $subBox = $("input[name='dp']");
                $subBox.click(function(){
                    $('#checkAll').attr("checked",$subBox.length == $("input[name='dp']:checked").length ? true : false);
                });
            }
        } else {
            YHLayer.closeLoading();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    };
    
    $('.groupItem').live('click', function () {
        $('.displayGroControl').css('display', 'inline-block');
        $('#groupList li a').removeClass('active');
        $(this).addClass('active');

        var groupId = $(this).attr('data-id');
        queryDeviceTable.groupId = groupId;
        $('#groupContentHtml').attr('data-groupId', groupId);
        $('#disGroupId').html(groupId);


        var n = $(this).attr('data-name');
        $('.modifyGroup').attr('data-name', n);

        YhHttp.init(YhHttpServiceCode.QUERY_GROUP_DEVICE.CODE);
        YhHttp.send(queryDeviceTable, queryDeviceCallback);
    });
    
    function queryDeviceCallback (result){
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter.list == null || resultObj.parameter.list == '') {
                YHLayer.closeAllLayer();
                $("#groupContentHtml").html('');
            } else {
                YHLayer.closeAllLayer();
                var deviceList = resultObj.parameter;
                var tpl = $('#queryDeviceTpl').html();
                var htmlContent = juicer(tpl, deviceList);
                $("#groupContentHtml").html(htmlContent);
                color();
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    }


    function settingDevice (){

        settingDeviceTable.list = [];

        $('input[name="dp"]:checked').each(function(){
            deviceInfoDataTable = {};
            deviceInfoDataTable.deviceId = $(this).val();
            settingDeviceTable.list.push(deviceInfoDataTable);
            settingDeviceTable.groupId = $('#groupContentHtml').attr('data-groupId');
        });

        YhHttp.init(YhHttpServiceCode.UPDATE_GROUP_DEVICE.CODE);
        YhHttp.send(settingDeviceTable, settingDeviceCallback);
    }

    function settingDeviceCallback(result){
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter == null || resultObj.parameter == '') {
                YHLayer.closeAllLayer();
            } else {
                YHLayer.closeAllLayer();
                if(resultObj.parameter.status == '0000'){
                    layer.msg(resultObj.parameter.message, {icon: 1, time: 500}, function () {
                        queryGroupListByDpId();
                    });
                }else{
                    layer.msg(resultObj.parameter.message, {icon: 2, time: 500}, function () {
                        queryGroupListByDpId();
                    });
                }
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    }

    $('.groupForwardOpen').live('click', function () {
        var content = '您确定要正向开启该设备吗？';
        layer.open({
            type: 1,
            title: '正向开启',
            area: ['260px', '180px'],
            shadeClose: false,
            content: content,
            scrollbar: false,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                singleGroupDevice(1, 1);
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了正向开启', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });

    $('.groupReverseOpen').live('click', function () {
        var content = '您确定要反向开启该设备吗？';
        layer.open({
            type: 1,
            title: '正向开启',
            area: ['260px', '180px'],
            shadeClose: false,
            content: content,
            scrollbar: false,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                singleGroupDevice(1, 0);
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了反向开启', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });

    $('.groupClose').live('click', function () {
        var content = '您确定要关闭全部分组吗？';
        layer.open({
            type: 1,
            title: '正向开启',
            area: ['260px', '180px'],
            shadeClose: false,
            content: content,
            scrollbar: false,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                YHLayer.loading();
                singleGroupDevice(0, 0);
            }, btn2: function (index, layero) {
                layer.msg('您已经取消了关闭分组', {
                    time: 2000, //2s后自动关闭
                    btn: ['知道了']
                })
            }
        });
    });

    var singleGroupDevice = function (sta, dir) {
        singleDeviceSetting.groupId = $('#groupContentHtml').attr('data-groupId');
        singleDeviceSetting.status = sta;
        singleDeviceSetting.direct = dir;

        YhHttp.init(YhHttpServiceCode.SETTING_GROUP_DEVICE.CODE);
        YhHttp.send(singleDeviceSetting, singleGroupDeviceCallback);
    };

    var singleGroupDeviceCallback = function (result) {
        if (result != null && result != '') {
            var resultObj = JSON.parse(result);
            if (resultObj.parameter == null || resultObj.parameter == '') {
                YHLayer.closeAllLayer();
            } else {
                YHLayer.closeAllLayer();
                if(resultObj.parameter.status == '0000'){
                    layer.msg(resultObj.parameter.message, {icon: 1, time: 500}, function () {
                        queryGroupListByDpId();
                    });
                }else{
                    layer.msg(resultObj.parameter.message, {icon: 2, time: 500}, function () {
                        queryGroupListByDpId();
                    });
                }
            }
        } else {
            YHLayer.closeAllLayer();
            layer.msg('请求服务器异常！', {icon: 0, time: 1000}, function () {
            });
        }
    };


    function color(){
        $('#groupContentHtml ul li:nth-child(even)').addClass('even');
        $('#groupContentHtml ul li:nth-child(odd)').addClass('odd');
        $('#groupContentHtml ul li:first-child').removeClass('odd');

        hover();
    }

    function hover(){
        $("#groupContentHtml ul li").hover(
            function(){$(this).addClass("hover");$('#groupContentHtml ul li:first-child').removeClass('hover');},
            function(){$(this).removeClass("hover");}
        );
    };

    function selectedLi(){
        var sel = $('#group_0').attr('data-id');
        queryDeviceTable.groupId = sel;

        $('#groupContentHtml').attr('data-groupId', sel);
        $('#disGroupId').html(sel);

        YhHttp.init(YhHttpServiceCode.QUERY_GROUP_DEVICE.CODE);
        YhHttp.send(queryDeviceTable, queryDeviceCallback);
    };
    
});