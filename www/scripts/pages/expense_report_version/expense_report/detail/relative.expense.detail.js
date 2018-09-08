/**
 * Created by Administrator on 2016/7/31.
 */
'use strict'
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab_erv_relative_travel_expense', {
                url: '/relative/travel/expense',
                cache: false,
                params: {
                    status: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/relative.expense.detail.html',
                        controller: 'com.handchina.huilianyi.ErvRelativeExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'travel_expense'
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.tab_erv_relative_invoice_expense', {
                url: '/relative/invoice/expense',
                cache: false,
                params: {
                    status: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/relative.expense.detail.html',
                        controller: 'com.handchina.huilianyi.ErvRelativeExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.ErvRelativeExpenseController', ['$scope', '$state', 'TravelERVService', 'ParseLinks', 'content',
        'InvoiceApplyERVService', '$ionicPopover', '$ionicLoading', '$ionicHistory', 'ExpenseReportService', '$location','$filter',
        function ($scope, $state, TravelERVService, ParseLinks, content, InvoiceApplyERVService,
                  $ionicPopover, $ionicLoading, $ionicHistory, ExpenseReportService, $location,$filter) {
            $scope.view = {
                content: content,
                showMore: false,
                nothing: false,
                relateStatus: false,
                travelStatus: false,
                invoiceStatus: false,
                goBackStatus: false,
                markStatus: false,
                page: {
                    current: 0,
                    size: 15,
                    links: null,
                    lastPage: 0,
                    total: 0

                },
                relativeTravelExpenseList: [],
                relativeInvoiceExpenseList: [],
                type: 1001,
                showLoading: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                }

            };
            $scope.doRefresh = function () {
                $scope.view.page.current = 0;
                $scope.view.relativeTravelExpenseList = [];
                $scope.view.relativeInvoiceExpenseList = [];
                $scope.getRelativeExpense($scope.view.page.current, true);
            };
            $scope.getRelativeExpense = function (page, refreshData) {
                $scope.view.page.current = page;
                $scope.view.showLoading();
                if ($state.params.status === 1002) {
                    TravelERVService.getTravelList($scope.view.page.current, $scope.view.page.size, 1003)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                $scope.view.nothing = false;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.view.relativeTravelExpenseList.push(data[i]);
                                }
                                if (page === 0) {
                                    $scope.view.page.lastPage = ParseLinks.parse(headers('link')).last;
                                    //$scope.view.page.total = headers('x-total-count');
                                }
                            } else {
                                if (page === 0) {
                                    $scope.view.nothing = true;
                                }
                            }
                        })
                        .finally(function () {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                } else if ($state.params.status === 1003) {
                    InvoiceApplyERVService.searchInvoiceApply($scope.view.page.current, $scope.view.page.size, 1003)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                $scope.view.nothing = false;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.view.relativeInvoiceExpenseList.push(data[i]);
                                }
                                if (page === 0) {
                                    $scope.view.page.lastPage = ParseLinks.parse(headers('link')).last;
                                    //$scope.view.page.total = headers('x-total-count');
                                }
                            } else {
                                if (page === 0) {
                                    $scope.view.nothing = true;
                                }
                            }
                        })
                        .finally(function () {
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });

                }
            };
            $scope.showRelativeExpenseDetail = function () {
                $scope.view.showMore = !$scope.view.showMore;

            };
            $scope.createRelativeExpense = function (item) {
                if ($scope.view.content == 'travel_expense') {
                    $state.go('app.tab_erv_create_relative_expense_first', {
                        applicationOID: item.applicationOID
                    })
                } else if ($scope.view.content == 'invoice_expense') {
                    $state.go('app.tab_erv_create_relative_expense_first', {
                        invoiceOID: item.applicationOID
                    })
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, ViewData) {
                ViewData.enableBack = true;
                $scope.view.goBackStatus = true;
            });
            $scope.goBack = function () {
                if ($location.path() === '/relative/invoice/expense' || $location.path() === '/relative/travel/expense') {
                    $state.go('app.tab_erv.expense_report')
                }
            };
            $scope.$on('$ionicView.enter', function () {
                //显示头信息
                if ($state.params.status) {
                    if ($state.params.status == 1002) {
                        $scope.view.title = $filter('translate')('expense.Travel.expense.account');
                        $scope.view.dividerTitle = $filter('translate')('expense.Associated.travel.application.form');
                        $scope.getRelativeExpense(0);
                    } else if ($state.params.status == 1003) {
                        $scope.view.title = $filter('translate')('expense.Reimbursement.list');
                        $scope.view.dividerTitle = $filter('translate')('expense.Associated.cost.application.form');
                        $scope.getRelativeExpense(0);
                    }
                }
            });
        }]);
