/**
 * Created by Yuko on 16/10/28.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.custom_application_list', {
                url: '/custom/application/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.list.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationListController'
                    }
                },
                data: {
                    pageClass: 'custom-application'
                },
                params: {
                    message: null
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.CustomApplicationListController', ['$scope', '$state', '$ionicLoading', '$ionicPopover', 'NotificationService', '$rootScope', 'PushService',
        'CustomApplicationServices', '$ionicScrollDelegate', 'ParseLinks', 'PublicFunction', 'FunctionProfileService', 'CompanyConfigurationService', 'CurrencyCodeService', '$filter',
        'NetworkInformationService', 'localStorageService', 'LocalStorageKeys', 'ServiceBaseURL', 'ServiceHttpURL', '$ionicPlatform', '$ionicPopup', 'Principal','$ionicListDelegate',
        function ($scope, $state, $ionicLoading, $ionicPopover,
                  NotificationService, $rootScope, PushService, CustomApplicationServices,
                  $ionicScrollDelegate, ParseLinks, PublicFunction, FunctionProfileService,
                  CompanyConfigurationService, CurrencyCodeService, $filter, NetworkInformationService,
                  localStorageService, LocalStorageKeys, ServiceBaseURL, ServiceHttpURL,
                  $ionicPlatform, $ionicPopup, Principal,$ionicListDelegate) {
            var ref = null;
            function inAppBrowserLoadStart(event) {
                if (event.url.indexOf('closeInAppBrowser.html?travelStatus=') !== -1 || (event.url.indexOf('closeInAppBrowser.html') !== -1 && event.url.indexOf('CallBack=') === -1)) {
                    if (event.url.indexOf('closeInAppBrowser.html?travelStatus=init') !== -1) {
                        $scope.view.travelStatus = 'init';
                        $scope.view.tabIndex = 0;
                        FunctionProfileService.getFunctionProfileList().then(function (data) {
                            $scope.view.functionProfileList = data;
                            $scope.view.canDelete = !$scope.view.functionProfileList["ca.opt.delete.disabled"];
                        });
                        $scope.view.canWithdraw = false;
                        ref.close();
                        $scope.view.getApplicationList(0);
                    } else if (event.url.indexOf('closeInAppBrowser.html?travelStatus=submit') !== -1) {
                        $scope.view.travelStatus = 'submit';
                        $scope.view.tabIndex = 1;
                        $scope.view.canDelete = false;
                        FunctionProfileService.getFunctionProfileList().then(function (data) {
                            $scope.view.functionProfileList = data;
                            $scope.view.canWithdraw = $scope.view.functionProfileList["ca.opt.withdraw.disabled"] == true? false: true;
                        });
                        ref.close();
                        $scope.view.getApplicationList(0);
                    } else if (event.url.indexOf('closeInAppBrowser.html?travelStatus=passed') !== -1) {
                        $scope.view.travelStatus = 'passed';
                        $scope.view.tabIndex = 2;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        ref.close();
                        $scope.view.getApplicationList(0);
                    } else {
                        ref.close();
                        $scope.view.getApplicationList(0);
                    }
                }
            }
            function inAppBrowserClose() {
                ref.removeEventListener('loadstart', inAppBrowserLoadStart);
                ref.removeEventListener('exit', inAppBrowserClose);
                ref = null;
            }
            $scope.view = {
                useOID: null, //用户oid
                accessToken: null,
                networkError: false,
                networkErrorText: $filter('translate')('error.network'),
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error.server'),
                systemErrorSubText: $filter('translate')('error.system'),
                systemErrorIcon: "img/error-icon/system-error.png",
                tabItem: [
                    {name: $filter('translate')('status.waiting.submit')},
                    {name: $filter('translate')('status.waiting.approval')},
                    {name: $filter('translate')('status.passed')}
                ],
                markStatus: false,
                tabIndex: 0,
                travelStatus: null,
                pageable: {
                    page: 0,
                    size: 10
                },
                applicationList: [],
                nothing: false,
                dataNum: {
                    lastPage: 0,
                    total: 0
                },
                canDelete: false,
                canWithdraw: false,
                isShowType: false,
                goBack: function(){
                    // 返回首页,避免京东申请提交订单之后跳转到列表页面,再点返回键时跳到申请提交的页面
                    $state.go('app.tab_erv.homepage');
                },
                changeTab: function (index) {
                    if ($scope.view.tabIndex !== index) {
                        $scope.view.tabIndex = index;
                        $scope.view.pageable.page = 0;
                        $scope.view.dataNum.lastPage = 0;
                        $scope.view.applicationList = [];
                        if ($scope.view.tabIndex === 0) {
                            $scope.view.travelStatus = 'init';
                            $scope.view.canDelete = $scope.view.functionProfileList["ca.opt.delete.disabled"] == true? false: true;
                            $scope.view.canWithdraw = false;
                        } else if ($scope.view.tabIndex === 1) {
                            $scope.view.travelStatus = 'submit';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = $scope.view.functionProfileList["ca.opt.withdraw.disabled"] == true? false: true;
                        } else if ($scope.view.tabIndex === 2) {
                            $scope.view.travelStatus = 'passed';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = false;
                        }
                        $scope.view.nothing = false;
                        $scope.view.applicationList = [];
                        $scope.view.getApplicationList($scope.view.pageable.page);
                    }
                },
                goTo: function (state, ev) {
                    CustomApplicationServices.setTab($scope.view.travelStatus);
                    $state.go(state);
                },
                //上拉刷新
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = 0;
                    $scope.view.travelList = [];
                    // $scope.view.applicationList = [];
                    $scope.view.nothing = false;
                    $scope.view.getApplicationList(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                //加载新的一条数据
                loadOneApplication: function (applicationOID, refreshData) {
                    for (var i = 0; i < $scope.view.applicationList.length; i++) {
                        if ($scope.view.applicationList[i].applicationOID === applicationOID) {
                            $scope.view.applicationList.splice(i, 1);
                            break;
                        }
                    }
                    if ($scope.view.pageable.page < $scope.view.dataNum.lastPage) {
                        CustomApplicationServices.getCustomApplicationList('1001', ($scope.view.pageable.page + 1) * $scope.view.pageable.size, 1)
                            .success(function (data) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.applicationList.push(data[i]);
                                    }
                                }
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('status.error'));
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    } else {
                        if ($scope.view.applicationList.length === 0) {
                            $scope.view.nothing = true;
                        }
                    }
                },
                goDetail: function (application) {
                    CustomApplicationServices.setTab($scope.view.travelStatus);
                    if (application.formOID) {
                        if(!application.formType){
                            if(application.type){
                                if(application.type === 1003){
                                    application.formType = 2003;
                                } else if(application.type === 1001){
                                    application.formType = 2002;
                                } else if(application.type === 1002){
                                    application.formType = 2001;
                                }
                            }
                        }
                        if(application.formType == 4100 || application.formType == '4100'){
                            application.type = 4100;
                        }
                        if ($scope.view.travelStatus === 'init') {
                            // 京东申请跳转
                            if(application.type===1004){
                                $state.go('app.jingdong_application_edit', {applicationOID: application.applicationOID});
                            } else if(application.type === 4100){
                                //flyback申请
                                var url = '?action=edit&applicationOID=' + application.applicationOID + '&access_token=' + $scope.view.accessToken;
                                $scope.jumpToFlyback(url);
                            } else if(application.type == 1002){
                                //差旅申请
                                $state.go('app.custom_application_travel_next', {
                                    applicationOID: application.applicationOID,
                                    formType: 2001
                                });
                            } else {
                                // 其他自定义申请
                                $state.go('app.custom_application_edit', {applicationOID: application.applicationOID, formType: application.formType});
                            }
                        } else if ($scope.view.travelStatus === 'submit') {
                            // 京东申请跳转
                            if(application.type===1004){
                                $state.go('app.jingdong_application_wait_approval', {applicationOID: application.applicationOID});
                            }  else if(application.type === 4100){
                                //flyback申请
                                var url = '?action=submit&applicationOID=' + application.applicationOID + '&access_token=' + $scope.view.accessToken;
                                $scope.jumpToFlyback(url);
                            } else {
                                // 其他自定义申请
                                $state.go('app.custom_application_wait_approval', {applicationOID: application.applicationOID, formType: application.formType});
                            }
                        } else if ($scope.view.travelStatus === 'passed') {
                            // 京东申请跳转
                            if(application.type===1004){
                                $state.go('app.jingdong_application_has_pass', {applicationOID: application.applicationOID});
                            }
                            else if(application.type === 4100){
                                //flyback申请
                                var url = '?action=passed&applicationOID=' + application.applicationOID + '&access_token=' + $scope.view.accessToken;
                                if(application.travelApplication && application.travelApplication.businessCode){
                                    url = url + '&businessCode=' + application.travelApplication.businessCode;
                                }
                                $scope.jumpToFlyback(url);
                            }
                            //借款申请
                            else if(application.type === 2005 && application.status !==1003 && application.status !==1004){
                                $state.go('app.custom_application_refund', {applicationOID: application.applicationOID, formType: application.formType})
                            }
                            // 其他自定义申请
                            else {
                                $state.go('app.custom_application_has_pass', {applicationOID: application.applicationOID, formType: application.formType});
                            }
                        }
                    } else {
                        //旧数据
                        if (application.type === 1001) {
                            //费用申请
                            if ($scope.view.travelStatus === 'init') {
                                $state.go('app.erv_init_invoice_apply', {applicationOID: application.applicationOID});
                            } else if ($scope.view.travelStatus === 'submit') {
                                $state.go('app.erv_invoice_apply_detail', {applicationOID: application.applicationOID});
                            } else if ($scope.view.travelStatus === 'passed') {
                                $state.go('app.erv_invoice_apply_detail_next', {applicationOID: application.applicationOID});
                            }
                        } else if (application.type === 1002) {
                            //差旅申请
                            if ($scope.view.travelStatus === 'init') {
                                if (application.status === 1001 && (application.rejectType === 1002 || application.rejectType === 1001)) {
                                    $state.go('app.erv_travel_detail_edit', {applicationOID: application.applicationOID});
                                } else {
                                    $state.go('app.erv_init_travel_base', {applicationOID: application.applicationOID});
                                }
                            } else if ($scope.view.travelStatus === 'submit') {
                                $state.go('app.erv_travel_wait_approval', {applicationOID: application.applicationOID});
                            } else if ($scope.view.travelStatus === 'passed') {
                                $state.go('app.erv_travel_has_pass', {applicationOID: application.applicationOID});
                            }
                        }
                    }

                },
                //删除申请单
                deleteApplication: function (application) {
                    if(application.applicationOID){
                        CustomApplicationServices.deleteApplicationForAll(application.applicationOID)
                            .success(function () {
                                $scope.view.loadOneApplication(application.applicationOID);
                                PublicFunction.showToast($filter('translate')('status.deleted'));
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('status.error'));
                            })
                    }
                },
                //撤回
                withdrawApplication: function (applicationOID) {
                    var data = {
                        entities: []
                    };
                    var entitty = {};
                    entitty.entityOID = applicationOID;
                    entitty.entityType = 1001;
                    data.entities.push(entitty);
                    CustomApplicationServices.withdrawApplication(data)
                        .success(function (data) {
                            if(data.failNum > 0){
                                PublicFunction.showToast($filter('translate')('status.error'));
                            } else {
                                $scope.view.loadOneApplication(applicationOID);
                                PublicFunction.showToast($filter('translate')('status.withdrawed'));
                            }
                        })
                        .error(function () {
                            PublicFunction.showToast($filter('translate')('status.error'));
                        })
                },
                //关闭申请单
                closeApplication: function (index) {
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        title: $filter('translate')('custom.application.tip.close_application'), //是否停用该申请单
                        template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.close_can_not_relate') + '</p>', //停用后将不可与报销单相关联
                        cancelText: $filter('translate')('common.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('common.sure_close'), //确认停用
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            CustomApplicationServices.closeApplication($scope.view.applicationList[index].applicationOID, $scope.view.userOID)
                                .success(function (data) {
                                    if(data && (data.errorCode == 1000 || data.errorCode == 1003 )){
                                        $scope.view.applicationList[index].applicationParticipant.closed = 1;
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.has_closed')); //已停用
                                    } else if(data && data.errorCode == 1001){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.application_no_pay')); //申请单所关联的报销单未付款
                                    } else if(data && data.errorCode == 1002){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.current_applicant_no_exist')); //当前参与人不存在
                                    } else{
                                        PublicFunction.showToast($filter('translate')('status.error'));
                                    }
                                })
                                .error(function (data) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                })
                                .finally(function () {
                                    $ionicListDelegate.closeOptionButtons();
                                })
                        } else {
                            $ionicListDelegate.closeOptionButtons();
                        }
                    })
                },
                //重新启用申请单
                restartApplication: function (index) {
                    // $scope.view.applicationList[index].closeDate
                    $scope.nextCloseDate = new Date();
                    var closeDay = 0;
                    if($scope.view.applicationList[index].formType == 2001 || $scope.view.applicationList[index].formType == 2002){
                        if($scope.view.applicationList[index].customFormProperties && $scope.view.applicationList[index].customFormProperties.restartCloseDay && parseInt($scope.view.applicationList[index].customFormProperties.restartCloseDay) == $scope.view.applicationList[index].customFormProperties.restartCloseDay){
                            $scope.nextCloseDate.setDate($scope.nextCloseDate.getDate() + $scope.view.applicationList[index].customFormProperties.restartCloseDay);
                        }
                        if($scope.view.applicationList[index].closeDate){
                            if(Date.parse(new Date($scope.view.applicationList[index].closeDate)) - Date.parse(new Date($scope.nextCloseDate)) < 0){
                                $scope.nextCloseDate = new Date($scope.view.applicationList[index].closeDate);
                            }
                        }
                    }
                    $scope.nextCloseDate = new Date($scope.nextCloseDate).Format('yyyy-MM-dd');
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        title: $filter('translate')('custom.application.tip.restart_application'), //是否重新启用该申请单
                        template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.expect_next_close_time') +':{{nextCloseDate}} </p>', //预计下次停用时间
                        cancelText: $filter('translate')('common.cancel'), //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('custom.application.button.sure_restart'), //重新启用
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            CustomApplicationServices.restartApplication($scope.view.applicationList[index].applicationOID, $scope.view.userOID, $scope.view.applicationList[index].customFormProperties.restartCloseDay)
                                .success(function (data) {
                                    $scope.view.applicationList[index].applicationParticipant.closed = 0;
                                    PublicFunction.showToast($filter('translate')('custom.application.tip.has_restart')); //已重新启用
                                })
                                .error(function (data) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                })
                                .finally(function () {
                                    $ionicListDelegate.closeOptionButtons();
                                })
                        } else {
                            $ionicListDelegate.closeOptionButtons();
                        }
                    })
                },
                getApplicationList: function (page, refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    if(refreshData){

                    } else if( page == 0){
                        $scope.showLoading();
                    }
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.pageable.page = page;
                    if ($scope.view.pageable.page === 0) {
                        $ionicScrollDelegate.scrollTop();
                        $scope.view.dataNum.lastPage=0;
                    }
                    var state = null;
                    if ($scope.view.travelStatus === 'init') {
                        state = 1001;
                    } else if ($scope.view.travelStatus === 'submit') {
                        state = 1002;
                    } else if ($scope.view.travelStatus === 'passed') {
                        state = [1003,1004,1005,1006,1007,1008];
                    }
                    CustomApplicationServices.getCustomApplicationList(state, page, $scope.view.pageable.size)
                        .success(function (data, status, headers) {
                            $ionicLoading.hide();
                            if (data.length > 0) {
                                $scope.view.nothing = false;
                                if(page == 0){
                                    $scope.view.applicationList = data;
                                } else {
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.applicationList.push(data[i]);
                                    }
                                }
                                $scope.view.dataNum.total = headers('x-total-count');
                                $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                            } else {
                                if (page === 0) {
                                    $scope.view.nothing = true;
                                    $scope.view.applicationList = [];
                                }
                            }
                        })
                        .error(function (error, status) {
                            $scope.view.applicationList = [];
                            $ionicLoading.hide();
                            if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                $scope.view.networkError = true;
                            } else if (status === 503) {
                                $scope.view.systemError = true;
                            } else {
                                PublicFunction.showToast($filter('translate')('status.error'));
                            }
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                }
            };
            $scope.showApplicationMenu = function (ev) {
                $scope.view.markStatus = !$scope.view.markStatus;
                if ($scope.view.markStatus) {
                    // 如果只有一种有效申请, 直接跳到对应申请
                    if ($scope.customApplication.length===1){
                        $scope.selectCustomApplication($scope.customApplication[0]);
                    } else {
                        $scope.popover.show(ev);
                    }
                }
            };
            $scope.selectCustomApplication = function (item) {
                $scope.view.markStatus = false;
                $scope.popover.hide();
                if(item.formType == '4100' || item.formType == 4100){
                    //flyback申请
                    var url = '?action=create&access_token=' + $scope.view.accessToken;
                    $scope.jumpToFlyback(url);
                } else {
                    $state.go('app.custom_application_create', {formOID: item.formOID});
                }
            };
            $scope.$on('popover.hidden', function () {
                $scope.view.markStatus = false;
            });

            $ionicPopover.fromTemplateUrl("scripts/pages/expense_report_version/custom_application/custom.application.menu.popover.tpl.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });

            //这个函数废弃,币种符号用三位大写字母
            $scope.getCode = function (application) {
                if(application.formType === 2001){
                    if(application.travelApplication.currencyCode){
                        return CurrencyCodeService.getCurrencySymbol(application.travelApplication.currencyCode);
                    } else {
                        return $scope.code;
                    }
                } else if(application.formType === 2002){
                    if(application.expenseApplication.currencyCode){
                        return CurrencyCodeService.getCurrencySymbol(application.expenseApplication.currencyCode);
                    } else {
                        return $scope.code;
                    }
                } else if(application.formType === 2003){
                    if(application.travelBookerApplication.currencyCode){
                        return CurrencyCodeService.getCurrencySymbol(application.travelBookerApplication.currencyCode);
                    } else {
                        return $scope.code;
                    }
                } else if(application.formType === 2004){
                    if(application.jingDongOrderApplication.currencyCode){
                        return CurrencyCodeService.getCurrencySymbol(application.jingDongOrderApplication.currencyCode);
                    } else {
                        return $scope.code;
                    }
                } else if(application.formType === 2005){
                    if(application.loanApplication.currencyCode){
                        return CurrencyCodeService.getCurrencySymbol(application.loanApplication.currencyCode);
                    } else {
                        return $scope.code;
                    }
                } else {
                    return $scope.code;
                }
            }

            $scope.jumpToFlyback = function (url) {
                url = ServiceHttpURL + '/hand' + url;
                ref = cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=no');
                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                ref.addEventListener('exit', inAppBrowserClose);
            }

            var init = function () {
                Principal.identity().then(function (data) {
                    $scope.view.userOID = data.userOID;
                })

                var token = localStorageService.get(LocalStorageKeys.token);
                $scope.view.accessToken = token.access_token;
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (configuration) {
                        //设置本位币:
                        $scope.view.originCurrencyCode = configuration.currencyCode;
                        $scope.view.currencyCode = configuration.currencyCode;
                        $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                    })
                NotificationService.countUnReadMessage()
                    .success(function (data) {
                        $scope.total = data;
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
                if (CustomApplicationServices.getTab()) {
                    $scope.view.travelStatus = CustomApplicationServices.getTab();
                    if ($scope.view.travelStatus === 'init') {
                        $scope.view.tabIndex = 0;
                        FunctionProfileService.getFunctionProfileList().then(function (data) {
                            $scope.view.functionProfileList = data;
                            $scope.view.canDelete = $scope.view.functionProfileList["ca.opt.delete.disabled"] == true? false: true;
                        });
                        $scope.view.canWithdraw = false;
                        $scope.view.getApplicationList($scope.view.pageable.page);
                    } else if ($scope.view.travelStatus === 'submit') {
                        $scope.view.tabIndex = 1;
                        $scope.view.canDelete = false;
                        FunctionProfileService.getFunctionProfileList().then(function (data) {
                            $scope.view.functionProfileList = data;
                            $scope.view.canWithdraw = $scope.view.functionProfileList["ca.opt.withdraw.disabled"] == true? false: true;
                        });
                        $scope.view.getApplicationList($scope.view.pageable.page);
                    } else if ($scope.view.travelStatus === 'passed') {
                        $scope.view.tabIndex = 2;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getApplicationList($scope.view.pageable.page);
                    } else {
                        $scope.view.travelStatus = 'init';
                        $scope.view.tabIndex = 0;
                        $scope.view.canDelete = true;
                        $scope.view.canWithdraw = false;
                        $scope.view.getApplicationList($scope.view.pageable.page);
                    }
                } else {
                    $scope.view.travelStatus = 'init';
                    $scope.view.tabIndex = 0;
                    FunctionProfileService.getFunctionProfileList().then(function (data) {
                        $scope.view.functionProfileList = data;
                        $scope.view.canDelete = $scope.view.functionProfileList["ca.opt.delete.disabled"] == true? false: true;
                    });
                    $scope.view.canWithdraw = false;
                    $scope.view.getApplicationList($scope.view.pageable.page);
                }
            };
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;
                });
                // 获取本人可以创建的申请单列表
                CustomApplicationServices.getApplicationFormsCanSelect()
                    .then(function (data) {
                        $scope.customApplication = data;
                    })
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                // 如果是从京东创建跳转到申请单列表,返回时返回首页
                if($scope.popover){
                    $scope.popover.hide();
                }
                if (toState.name === 'app.jingdong_application_create') {
                    $state.go('app.tab_erv.homepage')
                }
            });
        }])
