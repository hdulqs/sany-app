/**
 * Created by liyinsen on 2016/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_invoice_apply_list', {
            url: '/erv/invoice/apply/list',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.list.tpl.html',
                    controller: 'com.handchina.huilianyi.ErvInvoiceApplyListController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('invoice_apply');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvInvoiceApplyListController', ['$scope', '$filter','$state', 'InvoiceApplyERVService', 'ParseLinks', '$ionicLoading', 'TravelERVService', 'NotificationService', '$rootScope', 'PushService', 'FunctionProfileService', 'NetworkInformationService',
        function ($scope, $filter, $state, InvoiceApplyERVService, ParseLinks, $ionicLoading, TravelERVService, NotificationService, $rootScope, PushService, FunctionProfileService, NetworkInformationService) {
            $scope.view = {
                networkError: false,
                networkErrorText:$filter('translate')('error.network')/*哎呀,网络出错了!*/,
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText:$filter('translate')('error.server')/*服务器开小差了*/,
                systemErrorSubText:$filter('translate')('error.system')/* 技术小哥正在努力修复!*/,
                systemErrorIcon: "img/error-icon/system-error.png",
                tabItem: [
                    {name:$filter('translate')('invoice.pending.submit')/*待提交*/},
                    {name:$filter('translate')('invoice.approving')/*审批中*/},
                    {name:$filter('translate')('invoice.passed')/*已通过*/}
                ],
                tabIndex: 0,
                invoiceApplyStatus: null,
                pageable: {
                    page: 0,
                    size: 100
                },
                invoiceApplyList: [],
                nothing: false,
                dataNum: {
                    lastPage: 0,
                    total: 0
                },
                changeTab: function(index){
                    if ($scope.view.tabIndex !== index) {
                        $scope.view.tabIndex = index;
                        $scope.view.pageable.page = 0;
                        $scope.view.dataNum.lastPage = 0;
                        if ($scope.view.tabIndex === 0) {
                            $scope.view.invoiceApplyStatus = 'init';
                            $scope.view.canDelete = !$scope.view.functionProfileList["ea.opt.delete.disabled"];
                            $scope.view.canWithdraw = false;
                        } else if ($scope.view.tabIndex === 1) {
                            $scope.view.invoiceApplyStatus = 'submit';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = !$scope.view.functionProfileList["ea.opt.withdraw.disabled"];
                        } else if ($scope.view.tabIndex === 2) {
                            $scope.view.invoiceApplyStatus = 'passed';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = false;
                        }
                        $scope.view.nothing = false;
                        $scope.view.invoiceApplyList = [];
                        $scope.view.getInvoiceApplyList($scope.view.pageable.page);
                    }
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goTo: function (state) {
                    $state.go(state);
                },
                //上拉刷新
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = 0;
                    $scope.view.invoiceApplyList = [];
                    $scope.view.nothing = false;
                    $scope.view.getInvoiceApplyList(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                //加载新的一条数据
                loadOneInvoiceApply: function (applicationOID) {
                    for (var i = 0; i < $scope.view.invoiceApplyList.length; i++) {
                        if ($scope.view.invoiceApplyList[i].applicationOID === applicationOID) {
                            $scope.view.invoiceApplyList.splice(i, 1);
                            break;
                        }
                    }
                    if ($scope.view.pageable.page < $scope.view.dataNum.lastPage) {
                        InvoiceApplyERVService.searchInvoiceApply(($scope.view.pageable.page + 1) * $scope.view.pageable.size , 1, '1001')
                            .success(function(data){
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.invoiceApplyList.push(data[i]);
                                    }
                                }
                            })
                    } else {
                        if ($scope.view.invoiceApplyList.length === 0) {
                            $scope.view.nothing = true;
                        }
                    }
                },
                goDetail: function(applicationOID){
                    InvoiceApplyERVService.setTab($scope.view.invoiceApplyStatus);
                    if($scope.view.invoiceApplyStatus === 'init'){
                        $state.go('app.erv_init_invoice_apply',{applicationOID: applicationOID});
                    } else if($scope.view.invoiceApplyStatus === 'submit'){
                        $state.go('app.erv_invoice_apply_detail',{applicationOID: applicationOID});
                    } else if($scope.view.invoiceApplyStatus === 'passed'){
                        $state.go('app.erv_invoice_apply_detail_next',{applicationOID: applicationOID});
                    }
                },
                //删除费用申请
                deleteInvoiceApply: function(applicationOID){
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    InvoiceApplyERVService.deleteInvoiceApply(applicationOID)
                        .success(function(){
                            $ionicLoading.hide();
                            $scope.view.loadOneInvoiceApply(applicationOID);
                            $scope.view.openWarningPopup($filter('translate')('invoice.delete.success')/*删除成功*/);
                        })
                        .error(function () {
                            $ionicLoading.hide();
                        });
                },
                //撤回
                withdrawInvoiceApply: function (applicationOID) {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var data = {
                        entities: []
                    };
                    var entitty = {};
                    entitty.entityOID = applicationOID;
                    entitty.entityType = 1001;
                    data.entities.push(entitty);
                    TravelERVService.withdrawTravel(data)
                        .success(function () {
                            $scope.view.loadOneInvoiceApply(applicationOID);
                            $scope.view.openWarningPopup($filter('translate')('invoice.withdraw.success')/*撤回成功*/);
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        });
                },
                getInvoiceApplyList : function (page) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.pageable.page = page;
                    var state = null;
                    if($scope.view.invoiceApplyStatus === 'init'){
                        state = 1001;
                    } else if($scope.view.invoiceApplyStatus === 'submit'){
                        state = 1002;
                    } else if($scope.view.invoiceApplyStatus === 'passed'){
                        state = 1003;
                    }
                    InvoiceApplyERVService.searchInvoiceApply(page, $scope.view.pageable.size, state)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                $scope.view.nothing = false;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.view.invoiceApplyList.push(data[i]);
                                }
                                if (page === 0) {
                                    $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                    $scope.view.dataNum.total = headers('x-total-count');
                                }
                            } else {
                                if (page === 0) {
                                    $scope.view.nothing = true;
                                }
                            }
                        })
                        .error(function (error, status) {
                            if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                $scope.view.networkError = true;
                            } else if (status === 503) {
                                $scope.view.systemError = true;
                            }
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        });
                }

            };

            var init = function () {
                NotificationService.countUnReadMessage()
                    .success(function (data) {
                        $scope.total = data;
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
                if (InvoiceApplyERVService.getTab()) {
                    $scope.view.invoiceApplyStatus = InvoiceApplyERVService.getTab();
                    if ($scope.view.invoiceApplyStatus === 'init') {
                        $scope.view.tabIndex = 0;
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            $scope.view.functionProfileList = data;
                            $scope.view.canDelete = !$scope.view.functionProfileList["ea.opt.delete.disabled"];
                        });
                        $scope.view.canWithdraw = false;
                        $scope.view.getInvoiceApplyList($scope.view.pageable.page);
                    } else if ($scope.view.invoiceApplyStatus === 'submit') {
                        $scope.view.tabIndex = 1;
                        $scope.view.canDelete = false;
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            $scope.view.functionProfileList = data;
                            $scope.view.canWithdraw = !$scope.view.functionProfileList["ea.opt.withdraw.disabled"];
                        });
                        $scope.view.getInvoiceApplyList($scope.view.pageable.page);
                    } else if ($scope.view.invoiceApplyStatus === 'passed') {
                        $scope.view.tabIndex = 2;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getInvoiceApplyList($scope.view.pageable.page);
                    } else {
                        $scope.view.invoiceApplyStatus = 'init';
                        $scope.view.tabIndex = 0;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getInvoiceApplyList($scope.view.pageable.page);
                    }
                } else {
                    $scope.view.tabIndex = 0;
                    $scope.view.invoiceApplyStatus = 'init';
                    FunctionProfileService.getFunctionProfileList().then(function(data){
                        $scope.view.functionProfileList = data;
                        $scope.view.canDelete = !$scope.view.functionProfileList["ea.opt.delete.disabled"];
                    });
                    $scope.view.canWithdraw = false;
                    $scope.view.getInvoiceApplyList($scope.view.pageable.page);
                }
            };
            init();

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
