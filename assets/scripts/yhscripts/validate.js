/**
 * Created by zhan on 2016/7/19.
 */
$(function () {

    jQuery.validator.addMethod("userName", function(value, element) {
        var userName = /^[A-Za-z0-9_]*$/g;
        return this.optional(element) || (userName.test(value));
    }, "只能输入数字、字母和下划线");

    jQuery.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");

    // 中文三个字节
    jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {
        var length = value.length;
        for(var i = 0; i < value.length; i++){
            if(value.charCodeAt(i) > 127){
                length = length + 2;
            }
        }
        return this.optional(element) || ( length >= param[0] && length <= param[1] );
    }, "1个中文占3个字节");

    /*登录页面验证用户输入*/
    $('#bmh-form').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            username: {required: true},
            password: {required: true}
        },
        messages: {
            username: {required: "请输入您的账号"},
            password: {required: "请输入您的密码"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });


    $('#bmh-reg-form').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            username: {required: true, rangelength: [6, 20]},
            password: {required: true, rangelength: [8, 20]},
            password_confirm: {required: true, rangelength: [8, 20], equalTo: '#password'},
            phone: {required: true, isMobile: true}
        },
        messages: {
            username: {required: "请输入您的用户名", rangelength: "用户名长度为 6 到 20 之间"},
            password: {required: "请输入您的密码", rangelength: "密码长度为 8 到 20 之间"},
            password_confirm: {required: "请确认您的密码", rangelength: "密码长度为 8 到 20 之间", equalTo: "请保证两次输入的密码相同"},
            phone: {required: "请确认您的手机号"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //修改密码校验
    $('#modifyPasswordInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            oldPsw: {required: true, rangelength: [8, 20]},
            newPsw: {required: true, rangelength: [8, 20],userName:true},
            conformPsw: {required: true, rangelength: [8, 20], equalTo: '#newPsw'}
        },
        messages: {
            oldPsw: {required: "请输入您的密码", rangelength: "密码长度为 8 到 20 之间"},
            newPsw: {required: "请输入您的密码", rangelength: "密码长度为 8 到 20 之间",userName:"密码只能输入数字和字母"},
            conformPsw: {required: "请确认您的密码", rangelength: "密码长度为 8 到 20 之间", equalTo: "请保证两次输入的密码相同"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //新增操作员校验
    $('#addOperatorInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            operatorName: {required: true, rangelength: [6, 20],userName:true},
            operatorPsw: {required: true, rangelength: [8, 20]},
            operatorPhone: {required: true, isMobile: true}
        },
        messages: {
            operatorName: {required: "请输入操作员账号", rangelength: "账号长度为 6 到 20 之间"},
            operatorPsw: {required: "请输入操作员密码", rangelength: "密码长度为 8 到 20 之间"},
            operatorPhone: {required: "请确认正确的手机号",isMobile:"请确认正确的手机号"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //新增场地信息校验
    $('#addDpInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            addDpName: {required: true, maxlength: 32},
            addDpAgName: {required: true, maxlength: 64},
            addDpAddr: {required: true, maxlength:128},
            addSolution:{required: true,minlength:1},
            addGatewayName:{required:true,minlength:1}
        },
        messages: {
            addDpName: {required: "请输入场地名称", maxlength: "场地名称长度最大为32个字符"},
            addDpAgName: {required: "请输入场地种植物名称", maxlength: "场地种植物名称长度最大为64个字符"},
            addDpAddr: {required: "请输入场地位置信息", maxlength:"场地位置信息长度最大为128个字符"},
            addSolution:{required: "请选择场地解决方案信息",minlength:"请选择场地解决方案信息"},
            addGatewayName:{required:"请选择场地网关信息",minlength:"请选择场地网关信息"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //修改场地信息校验
    $('#modifyDpInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            modifyDpName: {required: true, maxlength: 32},
            modifyDpAgName: {required: true, maxlength: 64},
            modifyDpAddr: {required: true, maxlength: 128},
            modifySolution:{required: true,minlength:1}
        },
        messages: {
            modifyDpName: {required: "请输入场地名称", maxlength: "场地名称长度最大为32个字符"},
            modifyDpAgName: {required: "请输入场地种植物名称", maxlength: "场地种植物名称长度最大为64个字符"},
            modifyDpAddr: {required: "请输入场地位置信息", maxlength:"场地位置信息长度最大为128个字符"},
            modifySolution:{required: "请选择场地解决方案信息",minlength:"请选择场地解决方案信息"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //修改采集设备信息校验
    $('#modifySensorInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            sensorName: {required: true, maxlength: 32}
        },
        messages: {
            sensorName: {required: "请输入传感器名称", maxlength: "传感器名称长度最大为32个字符"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //修改控制设备信息校验
    $('#modifyControlInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            controlName: {required: true, maxlength: 32}
        },
        messages: {
            controlName: {required: "请输入控制设备名称", maxlength: "控制设备名称长度最大为32个字符"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //新增种植物信息验证
    $('#addDpPlantInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            cropName: {required: true, minlength: 1},
            plantName: {required: true, maxlength: 128},
            dpName: {required: true, minlength: 1},
            produceTime :{required: true, date:true},
            expectHarvestTime:{required: true, date:true},
            expectYield:{required: true, number:true}
        },
        messages: {
            cropName: {required: "请选择作物类型", minlength: "请选择作物类型"},
            plantName: {required: "请输入种植物名称", maxlength: "种植物名称长度最大为128个字符"},
            dpName: {required: "请选择场地信息", minlength: "请选择场地信息"},
            produceTime:{required:"请输入播种日期",date:"请输入正确的日期信息"},
            expectHarvestTime:{required:"请输入预期收获日期",date:"请输入正确的日期信息"},
            expectYield:{required:"请输入预期产量",number:"请输入正确的数字"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //修改种植物信息验证
    $('#modifyDpPlantInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            modifyProductName: {required: true, maxlength: 128},
            modifyProduceTime :{required: true, date:true},
            modifyExpectHarvestTime:{required: true, date:true},
            modifyExpectYield:{required: true, number:true},
            modifyRealHarvestTime:{date:true},
            modifyRealYield:{number:true}
        },
        messages: {
            modifyProductName: {required: "请输入种植物名称", maxlength: "种植物名称长度最大为128个字符"},
            modifyProduceTime:{required:"请输入播种日期",date:"请输入正确的日期信息"},
            modifyExpectHarvestTime:{required:"请输入预期收获日期",date:"请输入正确的日期信息"},
            modifyExpectYield:{required:"请输入预期产量",number:"请输入正确的数字"},
            modifyRealHarvestTime:{date:"请输入正确的日期信息"},
            modifyRealYield:{number:"请输入正确的数字"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //新增分组信息验证
    $('#addGroupInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            groupName: {required: true, maxlength: 128},
            dpName :{required: true, minlength: 1},
            systemEnum:{required: true, minlength:1}
        },
        messages: {
            groupName: {required: "请输入分组名称", maxlength: "分组名称长度最大为128个字符"},
            dpName:{required:"请选择场地信息",minlength:"请选择场地信息"},
            systemEnum:{required:"请选择生态系统信息",minlength:"请选择生态系统信息"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

    //打开设备信息验证
    $('#openDeviceInfo').validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        rules: {
            modelType:{required: true, minlength: 1},
            direct:{required: true, minlength: 1},
            time: {required: true, digits:true,	min:0}
        },
        messages: {
            modelType:{required: "请选择打开模式", minlength: "请选择打开模式"},
            direct:{required: "请选择设备打开方向", minlength: "请选择设备打开方向"},
            time:{required:"请输入开启时长",digits:"请输入整数",min:"请输入大于等于0的整数"}
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.closest('.input-icon'));
        }
    });

});