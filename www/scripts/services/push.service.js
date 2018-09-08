'use strict';
angular.module('huilianyi.services')
    .factory('PushService', ['localStorageService', 'ServiceBaseURL', '$http', '$state', '$ionicPopup', 'LocalStorageKeys', 'Principal', '$rootScope', 'NotificationService','PageValueService',
        'ReqHeaderService',
        function (localStorageService, ServiceBaseURL, $http, $state, $ionicPopup, LocalStorageKeys, Principal, $rootScope, NotificationService,PageValueService,
                  ReqHeaderService) {
            var isPushPluginEnabled = function () {
                if (window.plugins && window.plugins.jPushPlugin) {
                    return true;
                } else {
                    return false;
                }
            };
            var onTagsWithAlias = function (data) {

            };
            var onOpenNotificationForIOS = function (message) {
                if (ionic.Platform.isAndroid()) {
                    window.plugins.jPushPlugin.clearAllNotification();
                } else if (ionic.Platform.isIOS()) {
                    window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function (data) {
                        data = data - 1 < 0 ? 0 : data - 1;
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(data);
                    });
                }
                if (message.data) {
                    processMessage(message.data);
                } else {
                    //$state.go('tabs.mainpage');
                    $state.go('app.tab_erv.homepage');
                }
            };
            var onOpenNotificationForAndroid = function (message) {
                window.plugins.jPushPlugin.clearAllNotification();
                var data = message.extras['cn.jpush.android.EXTRA'].data;
                if (angular.isDefined(data) && data !== null && data !== '') { // 推送返回有数据
                    //判断data 是否是json对象，还是JSON字符串，如果是字符串，则强制转换成json对象
                    var data = angular.isObject(data) ? data : JSON.parse(data);
                    processMessage(data);
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
            var processMessage = function (data) {
                // 进入这里，代表打开了通知栏消息，要发送一个监听事件
                $rootScope.openNotification = false;
                $rootScope.$emit('openNotification:success');
                if (data.targetParams.indexOf(";")) {
                    var hecParams = data.targetParams.split(";");
                    var messageOID = hecParams[0];
                    NotificationService.remarkRead(messageOID)
                        .success(function () {
                            var goFlag = hecParams[1];//跳转标志：1/跳转  0/不跳转
                            if (goFlag == '1') {
                                var type = hecParams[2];//类型：approval/审批中心  EXP_REPORT/报销单模块  EXP_REQUISITION/申请单模块  PAYMENT_REQUISITION/借款单  ACP_REQUISITION/付款单
                                if (type == 'approval') {
                                    var params = {
                                        'messageFlag':'Y',
                                        'status':'waitApproval',
                                        'type':'approval'
                                    };
                                    var approvalItem = {
                                        "instance_param": hecParams[5],	//header_id
                                        "record_id": hecParams[6],			//用来获取同意操作的action_id
                                        "instance_id": hecParams[7]		//用来获取审批记录
                                    }
                                    var docType = hecParams[4];//待审批单据类型
                                    if (docType == 'EXP_REQUISITION') {
                                        params.approvalReq = approvalItem;
                                        PageValueService.set("appCenterReq", params);
                                        $state.go('app.approvalReq');
                                    } else if (docType == 'EXP_REPORT') {
                                        params.approvalReport = approvalItem;
                                        PageValueService.set("appCenterReport", params);
                                        $state.go('app.approvalReport');
                                    } else if (docType == 'PAYMENT_REQUISITION') {
                                        params.approvalLoan = approvalItem;
                                        PageValueService.set("appCenterLoan", params);
                                        $state.go('app.approvalLoan');
                                    } else if (docType == 'ACP_REQUISITION') {
                                        params.approvalPayment = approvalItem;
                                        PageValueService.set("appCenterPayment", params);
                                        $state.go('app.approvalPayment');
                                    }
                                }else{
                                    var headerId = hecParams[4];
                                    NotificationService.getDocStatus(headerId ,type).then(function (res) {
                                        if (res.data.success && res.data.result.pageCount>0 && res.data.result.record[0].status) {
                                            //GENERATE、SUBMITTED、REJECTED、TAKEN_BACK、APPROVED
                                            var docStatus = res.data.result.record[0].status;
                                            console.log(type+"单据类型："+docStatus+"  "+res.data.result.pageCount);
                                            //单据新增状态
                                            if(docStatus=='GENERATE'||docStatus=='TAKEN_BACK'||docStatus=='REJECTED'){
                                                PageValueService.set("messageFlag", "Y");
                                                if(type=="EXP_REQUISITION"){//申请单
                                                    var reqTypeCode= hecParams[5];
                                                    if(reqTypeCode==="1010"||reqTypeCode==="1015"){ //差旅申请
                                                        $state.go('app.travelReqHeader', {reqHeaderId: hecParams[4]});
                                                    }else{
                                                        $state.go('app.dailyReqHeader', {reqHeaderId: hecParams[4]});
                                                    }
                                                }else if(type=='PAYMENT_REQUISITION'){//借款单
                                                    $state.go('app.loanReqHeader', {loanReqHeaderId: hecParams[4]});
                                                }else if(type=='EXP_REPORT'){//报销单
                                                    $state.go('app.reportHeader', {headerId: hecParams[4]});
                                                }
                                            }else{
                                                var params = {'messageFlag': 'Y'};
                                                if(docStatus=='SUBMITTED'){//单据提交待审批状态
                                                    params.status='waitApproval';
                                                    params.passFlag='N';
                                                }else if(docStatus=='APPROVED'){//审批通过状态
                                                    params.status='hasApproval';
                                                    params.passFlag='Y';
                                                }
                                                if(type=="EXP_REQUISITION"){//申请单
                                                    params.type = 'req'
                                                    params.approvalReq={instance_param: hecParams[4]}
                                                    PageValueService.set("appCenterReq", params);
                                                    $state.go('app.approvalReq');
                                                }else if(type=='PAYMENT_REQUISITION'){//借款单
                                                    params.type = 'req'
                                                    params.approvalLoan={instance_param: hecParams[3]}
                                                    PageValueService.set("appCenterLoan", params);
                                                    $state.go('app.approvalLoan');
                                                }else if(type=='EXP_REPORT'){//报销单
                                                    params.type = 'report'
                                                    params.approvalReport={instance_param: hecParams[4]}
                                                    PageValueService.set("appCenterReport", params);
                                                    $state.go('app.approvalReport');
                                                }
                                            }
                                        }else {
                                            PublicFunction.showToast($filter('translate')('error.get.document.status.faild'));//获取单据状态失败!
                                        }
                                    }, function (error) {
                                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                    });
                                }
                            }
                        }).error(function (error, status) {
                        console.log("设置消息read属性失败");
                        PublicFunction.showToast("设置消息read属性失败");
                    });
                } else {
                    var params;
                    try {
                        params = JSON.parse(data.targetParams);
                    } catch (e) {
                        params = data.targetParams;
                    }
                    $state.go(data.targetState, params);
                }

                /*var params;
                 try {
                 params = JSON.parse(data.targetParams);
                 } catch (e) {
                 params = data.targetParams;
                 }
                 if (data.targetState == 'app.third_party_invoice') {
                 var newParam = {
                 expense: null,
                 message: 'app.erv_notification'
                 };
                 newParam.expense = params.invoiceOID;
                 $state.go('app.expense_third_part', newParam);
                 } else {
                 $state.go(data.targetState, params);
                 }*/
            };
            var onReceiveNotification = function (data) {
                var alertContent = '';
                var messageData = null;
                if (ionic.Platform.isAndroid()) {
                    alertContent = window.plugins.jPushPlugin.receiveNotification.title;
                    messageData = window.plugins.jPushPlugin.receiveNotification.extras.data;
                } else {
                    alertContent = data.aps.alert;
                    messageData = data.data;
                }
            };
            var onReceiveMessage = function (data) {
                var alertContent = '';
                var messageData = null;
                if (ionic.Platform.isAndroid()) {
                    alertContent = window.plugins.jPushPlugin.receiveNotification.title;
                    messageData = window.plugins.jPushPlugin.receiveNotification.extras.data;
                } else {
                    alertContent = data.aps.alert;
                    messageData = data.data;
                }
            };
            var onGetRegistrationID = function (data) {
                if (data.length == 0) {
                    // retry
                    window.setTimeout(function () {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
                    }, 1000);
                } else {
                    registrationID = data;
                }
            };

            var registerUserDevice = function () {
                if (!isPushPluginEnabled()) {
                    return;
                }
                var deviceID = registrationID;
                if (deviceID) {
                    var platform = null;
                    if (ionic.Platform.isIOS()) {
                        platform = 'IOS';
                    }
                    if (ionic.Platform.isAndroid()) {
                        platform = 'ANDROID';
                    }
                    $http({
                        url: ServiceBaseURL.url + '/api/push/register',
                        method: 'POST',
                        data: "deviceID=" + deviceID + "&vendorType=JPUSH&mobilePlatform=" + platform,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).success(function () {
                        localStorageService.set(LocalStorageKeys.push.deviceID, deviceID);
                        localStorageService.set(LocalStorageKeys.push.cleared, true);
                    });
                } else {
                    window.setTimeout(function () {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
                        registerUserDevice();
                    }, 1000);
                }
            }

            var onAppResume = function () {
            };
            var registrationID;
            return {
                initPushService: function () {
                    if (!isPushPluginEnabled()) {
                        return;
                    }
                    window.plugins.jPushPlugin.init();
                    if (!localStorageService.get('notification.register')) {
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
                    }
                    document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
                    document.addEventListener("jpush.openNotification", onOpenNotificationForIOS, false);
                    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
                    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
                    document.addEventListener("resume", onAppResume, false);
                    if (ionic.Platform.isAndroid()) {
                        window.plugins.jPushPlugin.openNotificationInAndroidCallback = onOpenNotificationForAndroid;
                    }
                },
                registerUserDevice: registerUserDevice,
                unRegisterUserDevice: function () {
                    if (registrationID) {
                        $http({
                            url: ServiceBaseURL.url + '/api/push/register?deviceID=' + registrationID,
                            method: 'DELETE',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        });
                    }
                },
                stopPushService: function () {
                    if (!isPushPluginEnabled()) {
                        return;
                    }
                    window.plugins.jPushPlugin.stopPush();
                },
                resumePushService: function () {
                    if (!isPushPluginEnabled()) {
                        return;
                    }
                    window.plugins.jPushPlugin.resumePush();
                },
                setBadge: function (data) {
                    if (!isPushPluginEnabled()) {
                        return;
                    }
                    //清除iOS版本应用右上角的角标
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    //window.plugins.jPushPlugin.setApplicationIconBadgeNumber(data);
                },
                setTag: function () {
                    if (!isPushPluginEnabled()) {
                        return;
                    }
                    if (!localStorageService.get('push.hasSetTag')) {
                        Principal.identity().then(function (data) {
                            if (data) {
                                window.plugins.jPushPlugin.setTags(data.companyOID);
                                localStorageService.set('push.hasSetTag', true);
                            }
                        });
                    }
                },
                clearNotification: function () {
                    if (!isPushPluginEnabled()) {
                        return;
                    }
                    if (ionic.Platform.isAndroid()) {
                        window.plugins.jPushPlugin.clearAllNotification();
                    } else if (ionic.Platform.isIOS()) {
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    }
                }
            };
        }]);
