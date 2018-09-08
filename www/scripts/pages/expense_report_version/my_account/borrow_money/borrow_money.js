'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.borrow_money', {
            url: '/borrow/money',
            cache: false,
            params: {},
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/my_account/borrow_money/borrow_money.tpl.html',
                    controller: 'com.handchina.hly.BorrowMoneyController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('my');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        });
    }])
    .controller('com.handchina.hly.BorrowMoneyController',
        ['$scope', '$state', '$ionicScrollDelegate', '$ionicLoading', 'FunctionProfileService', 'CurrencyCodeService', 'BorrowMoneyService', 'ParseLinks', 'CompanyConfigurationService','$filter',
            function ($scope, $state, $ionicScrollDelegate, $ionicLoading, FunctionProfileService, CurrencyCodeService, BorrowMoneyService, ParseLinks, CompanyConfigurationService,$filter) {
                $scope.view = {
                    networkError: false,
                    networkErrorText:$filter('translate')('interface_my.network'),
                    networkErrorIcon: "img/error-icon/network-error.png",
                    systemError: false,
                    systemErrorText: $filter('translate')('interface_my.server'),
                    systemErrorSubText: $filter('translate')('interface_my.system'),
                    systemErrorIcon: "img/error-icon/system-error.png",
                    borrowList: [],
                    code: 'CNY',//本位币
                    pageable: {
                        page: 0,
                        size: 10
                    },
                    dataNum: {
                        lastPage: 0,
                        total: 0
                    },
                    StayWriteoff: {},//待还款金额
                    loadMore: function (page, refreshData) {
                        $scope.view.getStayWriteoffAmount();
                        $scope.view.networkError = false;
                        $scope.view.systemError = false;
                        $scope.showLoading();
                        //在MainAppController中，已经定义了该函数，可以重用
                        $scope.view.pageable.page = page;
                        if ($scope.view.pageable.page === 0) {
                            $ionicScrollDelegate.scrollTop();
                        }
                        BorrowMoneyService.getBorrowList(page, $scope.view.pageable.size)
                            .success(function (data, status, headers) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    angular.forEach(data, function (item) {
                                        item.createdMonth = new Date(item.createdDate).Format('yyyy-MM');
                                    });
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.borrowList.push(data[i]);
                                    }
                                    $scope.view.dataNum.total = headers('x-total-count');
                                    $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                } else {
                                    if (page === 0) {
                                        $scope.view.nothing = true;
                                    }
                                }
                            })
                            .error(function (error, status) {
                                if (status === -1) {
                                    $scope.view.networkError = true;
                                } else if (status === 503) {
                                    $scope.view.systemError = true;
                                }
                            })
                            .finally(function () {
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    },
                    doRefresh: function () {
                        $scope.view.networkError = false;
                        $scope.view.systemError = false;
                        $scope.view.pageable.page = 0;
                        $scope.view.borrowList = [];
                        $scope.view.nothing = false;
                        $scope.view.loadMore(0, true);
                        $scope.$broadcast('scroll.refreshComplete');
                    },
                    goDetail: function (item) {
                        //1001 申请单   1002 报销单（还款 进行中）  1003 报销单（还款 已完成）
                        if (item.status === 1001) {
                            $state.go('app.custom_application_notification_readonly', {
                                applicationOID: item.entityOID,
                                formType: 2005 //借款申请
                            })
                        } else if (item.status === 1002 || item.status === 1003) {
                            $state.go('app.tab_erv_expense_detail_passed', {
                                expenseReportOID: item.entityOID
                            })
                        }
                    },
                    getStayWriteoffAmount: function () {
                        BorrowMoneyService.getStayWriteoffAmount()
                            .success(function (data) {
                                $scope.view.StayWriteoff = data;
                            });
                    }
                };

                function init() {
                    $scope.view.loadMore(0, false);
                }

                init();

                $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                    viewData.enableBack = true;
                    FunctionProfileService.getFunctionProfileList().then(function (data) {
                        $scope.view.functionProfileList = data;
                    });
                    CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                        $scope.view.companyConfiguration = data;
                        $scope.view.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                    });
                });

                $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    if (toState.name == 'app.didi_sync') {
                        $state.go('app.tab_erv.account');
                    }
                });
            }]);

