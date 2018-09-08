'use strict';

angular.module('huilianyi.services')
    .factory('ApprovalPopupService', ['$rootScope', '$state', 'ApprovalERVService', 'localStorageService', '$timeout', 'FunctionProfileService', 'ThirdPartService', 'PublicFunction', '$ionicPopup', 'TravelERVService', '$filter', function($rootScope, $state, ApprovalERVService, localStorageService, $timeout, FunctionProfileService, ThirdPartService, PublicFunction, $ionicPopup, TravelERVService, $filter) {
        var reference = null;
        function inAppBrowserLoadStart(event) {
            if (event.url.indexOf('closeInAppBrowser.html') !== -1) {
                reference.close();
            }

            // 如果是安卓系统并且是下载文件的链接,在系统浏览器打开下载.
            if (ionic.Platform.isAndroid()){
                var url = event.url;
                var extension = url.split("?").pop().split("=")[0];
                if (extension==="down_id") {
                    var ref = cordova.InAppBrowser.open(encodeURI(url), '_system', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no');
                    ref.addEventListener('exit', inAppBrowserClose);
                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                    //window.open(encodeURI(url), '_system', 'location=no');
                }
            }
        }
        function inAppBrowserClose() {
            reference.removeEventListener('loadstart', inAppBrowserLoadStart);
            reference.removeEventListener('exit', inAppBrowserClose);
            reference = null;
        }

        /*获取控制开关列表*/
        var getFunctionProfileList = function () {
            FunctionProfileService.getFunctionProfileList().then(function(data){
                $rootScope.functionProfileList = data;
            });
        };

        /*跳转美克审批*/
        var meiKeApproval = function(){
            var hasClickSSO = false;
            if(!hasClickSSO) {
                hasClickSSO = true;
                ThirdPartService.getMeiKeApproval()
                    .success(function(data){
                        hasClickSSO  = false;
                        reference = cordova.InAppBrowser.open(encodeURI(data.url), '_blank', 'location=no,toolbar=to');
                        reference.addEventListener('loadstart', inAppBrowserLoadStart);
                        reference.addEventListener('exit', inAppBrowserClose);
                    })
                    .error(function () {
                        PublicFunction.showToast($filter('translate')('error_comp.error'));
                        hasClickSSO  = false;
                    })
            }
        };

        var goTo = function (state) {
            if (state === 'app.erv_approval_list') {
                ApprovalERVService.setStatus('waitApproval');
                $state.go(state);
            } else if (state === 'app.erv_travel_list') {
                TravelERVService.setTab('init');
                $state.go(state);
            } else {
                $state.go(state);
            }
        };
        /*判断是普通审批还是美克审批*/
        var judgeApproval = function(){
            if(!$rootScope.functionProfileList['approval.disabled']){
                goTo('app.erv_approval_list');
            } else if(!$rootScope.functionProfileList['approval.external.disabled']){
                meiKeApproval();
            }
        };
        /*显示待审批数目弹框*/
        var showPop = function () {
            if($rootScope.functionProfileList === null){
                getFunctionProfileList();
            }
            var isShow =(!$rootScope.functionProfileList || !$rootScope.functionProfileList['approval.disabled']);
            if($rootScope.totalCount > 0 && isShow ){
                $ionicPopup.confirm({
                    title: $filter('translate')('popup.you.have') + $rootScope.totalCount + $filter('translate')('popup.need.to.be.processed'),
                    cancelText: $filter('translate')('popup.cancel'),
                    okText: $filter('translate')('popup.ok')
                }).then(function (res) {
                    if (res) {
                        judgeApproval();    // 点击查看按钮后，跳转到待审批页面
                    }
                });
            }
        };
        /*设置待审批数量到localstorage中*/
        var setCount = function () {
            ApprovalERVService.getApprovalList(0, 1)
                .success(function (data, status, headers) { // 保存待审批数量到localstorage中
                    $rootScope.approvalCount = headers('x-total-count');
                    localStorageService.set('exitApprovalCounts', $rootScope.approvalCount);
                }).error(function (err) {
                console.log(err);
            });
        };
        /*获取待审核数量*/
        var getCount = function () { // 获取进入后台到唤醒这段时间内待审批数量
            // 进入前记录审批数目
            ApprovalERVService.getApprovalList(0, 1)
                .success(function (data, status, headers) {
                    var enterApprovalCounts = headers('x-total-count');
                    if($rootScope.approvalCount > 0){   // pause进入后台，approvalCount不清空
                        $rootScope.totalCount = enterApprovalCounts - $rootScope.approvalCount;
                    }else{
                        var exitApprovalCounts = localStorageService.get('exitApprovalCounts');
                        if(exitApprovalCounts !== undefined && exitApprovalCounts !=='' && exitApprovalCounts !== null){   // 杀死进程，从localstorage中获取
                            $rootScope.totalCount = enterApprovalCounts - exitApprovalCounts;
                        }
                        // 初次安装，不提示
                    }
                    $timeout(function () {
                        $rootScope.approvalCount = enterApprovalCounts;
                        showPop();  // 获取数量后，弹框显示
                        // 在获取到审核数量之后，将之存储到localstorage中
                        localStorageService.set('exitApprovalCounts', $rootScope.approvalCount);
                    }, 500);
                });
        };
        return {
                setCount: setCount,
                getCount: getCount
            }
        }
    ]);
