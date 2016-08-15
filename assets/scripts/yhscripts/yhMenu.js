$(function() {
		var menuBar = {
			menuList : [
				{menuIndex:1,menuName:"首页",menuUrl:"index.html",menuIcon:"fa-home"},
				{menuIndex:2,menuName:"操作员管理",menuUrl:'operatorManage.html',menuIcon:"fa-group"},
				{menuIndex:3,menuName:"场地管理",menuUrl:'fieldManage.html',menuIcon:"fa-crop"},
				{menuIndex:4,menuName:"传感器设备管理",menuUrl:'sensorManage.html',menuIcon:"fa-signal"},
				{menuIndex:5,menuName:"智能设备管理",menuUrl:'controlManage.html',menuIcon:"fa-cogs"},
				{menuIndex:6,menuName:"采集数据监控管理",menuUrl:'collectDataManage.html',menuIcon:"fa-cloud-upload"},
				{menuIndex:7,menuName:"智能设备监控管理",menuUrl:'smartDeviceManage.html',menuIcon:"fa-dashboard"},
				{menuIndex:8,menuName:"溯源管理",menuUrl:'originManage.html',menuIcon:"fa-crosshairs"},
				{menuIndex:9,menuName:"网络摄像机管理",menuUrl:'ipcManage.html',menuIcon:"fa-video-camera"},
                {menuIndex:10,menuName:"硬盘录像机管理",menuUrl:'nvrManage.html',menuIcon:"fa-hdd-o"},
                {menuIndex:11,menuName:"预警管理",menuUrl:'warningManage.html',menuIcon:"fa-warning"},
				{menuIndex:12,menuName:"统计中心",menuUrl:'nces.html',menuIcon:"fa-bar-chart-o"},
				{menuIndex:13,menuName:"报表中心",menuUrl:'reportManage.html',menuIcon:"fa-list-ul"},
				{menuIndex:14,menuName:"分组管理",menuUrl:'groupManage.html',menuIcon:"fa-th"}
			]
		};

		var menuTpl = '<div class="page-sidebar navbar-collapse collapse"><ul class="page-sidebar-menu"><li class="sidebar-toggler-wrapper"><div class="sidebar-toggler hidden-phone"></div></li><li class="sidebar-weather-wrapper"></li>{@each menuList as it,index}<li {@if it.menuIndex==1}class="start"{@/if} liIndex="${it.menuIndex}"><a href="${it.menuUrl}"><i class="fa ${it.menuIcon}"></i><span class="title">${it.menuName}</span><span class="selected"></span></a></li>{@/each}</ul></div>';

		var htmlContent = juicer(menuTpl, menuBar);

		$("#yhMenu").html(htmlContent);

		var curIndex = $("#yhMenu").attr("curIndex");

		$("li[liIndex='"+curIndex+"']").addClass("active");
});