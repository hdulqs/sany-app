/**
 * Created by Administrator on 2016/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab_erv.expense_report', {
            url: '/expense/report',
            cache: false,
            data: {
                pageClass: 'erv-expense'
            },
            views: {
                'tab-erv-expense': {
                    'templateUrl': 'scripts/pages/expense_report_version/expense_report/expense.report.tpl.html',
                    controller: 'com.handchina.huilianyi.ErvExpenseController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('expense_report');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }

        })
    }])
    .controller('com.handchina.huilianyi.ErvExpenseController', ['$scope', '$state',
        'ExpenseService', 'ExpenseReportService', 'ParseLinks', '$ionicLoading', '$ionicScrollDelegate',
        'CompanyConfigurationService', 'CurrencyCodeService', 'localStorageService', 'NotificationService', '$rootScope', 'PushService',
        '$ionicHistory','$ionicPopover', 'SelfDefineExpenseReport', '$ionicModal', 'TravelERVService', 'FunctionProfileService', 'NetworkInformationService','$filter',
        function ($scope, $state, ExpenseService, ExpenseReportService, ParseLinks, $ionicLoading,
                  $ionicScrollDelegate, CompanyConfigurationService, CurrencyCodeService, localStorageService,
                  NotificationService, $rootScope, PushService, $ionicHistory,$ionicPopover, SelfDefineExpenseReport, $ionicModal, TravelERVService, FunctionProfileService, NetworkInformationService,$filter) {

            $scope.goTo = function (stateName) {
                if ($scope.view.tabIndex === 0 || $scope.view.tabIndex === 1) {
                    ExpenseReportService.setTab($scope.view.status)
                } else if ($scope.view.tabIndex === 2) {
                    $scope.view.status = ['1003', '1004', '1005', '1006', '1007', '1008'];
                    ExpenseReportService.setTab($scope.view.status)
                }
                $state.go(stateName);
            };
            $scope.view = {
                networkError: false,
                networkErrorText:$filter('translate')('expense.network'),
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText:$filter('translate')('expense.server'),
                systemErrorSubText: $filter('translate')('expense.system'),
                systemErrorIcon: "img/error-icon/system-error.png",
                markStatus: false,
                hasCer: false, //function profile是否有自定义报销单列表
                tabItem: [
                    {name: $filter('translate')('expense.To.submit')},
                    {name: $filter('translate')('expense.In.the.examination.and.approval')},
                    {name: $filter('translate')('expense.Have.been.approval')}
                ],
                pageable: {
                    page: 0,
                    size: 10,
                    links: null
                },
                dataNum: {
                    lastPage: 0,
                    total: 0
                },
                tabIndex: -1,
                status: null,//报销单状态
                expenseList: [],
                cashCategoryList: [],
                nothing: false,
                canDelete: false,
                canWithdraw: false,
                openLoading: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    });
                },
                showLoading: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                },
                changeTab: function (index) {
                    if ($scope.view.tabIndex !== index) {
                        $scope.view.tabIndex = index;
                        $scope.view.pageable.page = 0;
                        $scope.view.dataNum.lastPage = 0;
                        if ($scope.view.tabIndex === 0) {
                            $scope.view.canDelete = !$scope.view.functionProfileList["er.opt.delete.disabled"];
                            $scope.view.canWithdraw = false;
                            $scope.view.status = '1001';
                            ExpenseReportService.setTab($scope.view.status);
                        } else if ($scope.view.tabIndex === 1) {
                            $scope.view.canDelete = false;
                            $scope.view.status = '1002';
                            $scope.view.canWithdraw = !$scope.view.functionProfileList["er.opt.withdraw.disabled"];
                            ExpenseReportService.setTab($scope.view.status);
                        } else if ($scope.view.tabIndex === 2) {
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = false;
                            $scope.view.status = ['1003', '1004', '1005', '1006', '1007', '1008'];
                            ExpenseReportService.setTab($scope.view.status);
                        }
                        $scope.view.nothing = false;
                        $scope.view.expenseList = [];
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    }

                },
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = 0;
                    $scope.view.nothing = false;
                    $scope.view.getExpenseList(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                getExpenseList: function (page, refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = page;
                    if ( $scope.view.pageable.page === 0) {
                        if(!refreshData){
                            $scope.view.showLoading();
                            $scope.view.expenseList = [];
                        }
                        $scope.view.dataNum.lastPage=0;
                        $ionicScrollDelegate.scrollTop();
                    }
                    if ($scope.view.tabIndex === 0 || $scope.view.tabIndex === 1) {
                        ExpenseReportService.getExpenseReportList($scope.view.status, page, $scope.view.pageable.size)
                            .success(function (data, status, headers) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    if(page == 0){
                                        $scope.view.expenseList = data;
                                    } else {
                                        for (var i = 0; i < data.length; i++) {
                                            $scope.view.expenseList.push(data[i]);
                                        }
                                    }
                                } else {
                                    if (page === 0) {
                                        $scope.view.nothing = true;
                                    }
                                }
                                $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                $scope.view.dataNum.total = headers('x-total-count');
                            })
                            .error(function (error, status) {
                                if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
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
                    } else {
                        ExpenseReportService.getExpenseReportList($scope.view.status, page, $scope.view.pageable.size)
                            .success(function (data, status, headers) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    if(page === 0){
                                        $scope.view.expenseList = data;
                                    } else {
                                        for (var i = 0; i < data.length; i++) {
                                            $scope.view.expenseList.push(data[i]);
                                        }
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
                            .finally(function () {
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    }
                },
                //跳转到报销单详情
                goExpenseReportDetail: function (expense) {
                    if ($scope.view.tabIndex === 0 || $scope.view.tabIndex === 1) {
                        ExpenseReportService.setTab(expense.status)
                    } else if ($scope.view.tabIndex === 2) {
                        $scope.view.status = ['1003', '1004', '1005', '1006', '1007', '1008'];
                        ExpenseReportService.setTab($scope.view.status)
                    }
                    if (expense.status !== 1001) {
                        if (expense.status === 1002) {
                            //审批中
                            $state.go('app.tab_erv_expense_detail_submit', {
                                expenseReportOID: expense.expenseReportOID
                            })
                        } else if (expense.status === 1003) {
                            //审批通过
                            $state.go('app.tab_erv_expense_detail_passed', {
                                expenseReportOID: expense.expenseReportOID
                            })
                        } else if (expense.status === 1004 || expense.status === 1007) {
                            //审核通过
                            $state.go('app.tab_erv_expense_detail_audit_passed', {
                                expenseReportOID: expense.expenseReportOID
                            })
                        } else if (expense.status === 1005) {
                            //已付款
                            $state.go('app.tab_erv_expense_detail_finance_loaned', {
                                expenseReportOID: expense.expenseReportOID
                            })
                        }
                    } else if (expense.status === 1001) {
                        if (expense.hasOwnProperty('formOID')) {
                            $state.go('app.self_define_expense_report_next', {expenseReportOID: expense.expenseReportOID});
                        } else {
                            //需进一步判断报销单的状态:已驳回,编辑中,已撤回
                            if (expense.rejectType === 1000) {
                                //编辑中
                                $state.go('app.tab_erv_expense_normal',
                                    {
                                        expenseReportOID: expense.expenseReportOID
                                    }
                                );

                            } else if (expense.rejectType === 1001) {
                                //已撤回
                                $state.go('app.tab_erv_expense_withdraw',
                                    {
                                        expenseReportOID: expense.expenseReportOID
                                    }
                                );
                            } else if (expense.rejectType === 1002) {
                                //审批驳回
                                $state.go('app.tab_erv_expense_approval_reject',
                                    {
                                        expenseReportOID: expense.expenseReportOID
                                    }
                                );
                            } else if (expense.rejectType === 1003 || expense.rejectType === 1004) {
                                //财务审核驳回
                                $state.go('app.tab_erv_expense_audit_reject',
                                    {
                                        expenseReportOID: expense.expenseReportOID
                                    }
                                );
                            }
                        }
                    }
                },
                    loadOneTravel: function (expenseReportOID, status, refreshData) {
                        for (var i = 0; i < $scope.view.expenseList.length; i++) {
                            if ($scope.view.expenseList[i].expenseReportOID === expenseReportOID) {
                                $scope.view.expenseList.splice(i, 1);
                                break;
                            }
                        }
                        if ($scope.view.pageable.page < $scope.view.dataNum.lastPage) {
                            ExpenseReportService.getExpenseReportList(($scope.view.pageable.page + 1) * $scope.view.pageable.size, 1, status)
                                .success(function (data) {
                                    if (data.length > 0) {
                                        $scope.view.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            $scope.view.expenseList.push(data[i]);
                                        }
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                    if (refreshData) {
                                        $scope.$broadcast('scroll.refreshComplete');
                                    }
                                });
                        } else {
                            if ($scope.view.expenseList.length === 0) {
                                $scope.view.nothing = true;
                            }
                        }

                    },
                    //删除报销单
                    deleteExpenseReport: function (data) {
                        $scope.view.showLoading();
                        ExpenseReportService.deleteExpenseReport(data)
                            .success(function () {
                                $ionicLoading.hide();
                                $scope.view.loadOneTravel(data, '1001');
                                $scope.view.openLoading($filter('translate')('expense.Delete.the.success'));
                            })
                            .error(function () {
                                $ionicLoading.hide();
                            });
                    },
                    withdraw: function (item) {
                        var expenseOID = item;
                        $scope.view.showLoading();
                        var expense = {
                            entities: [
                                {
                                    entityOID: '',
                                    entityType: 1002
                                }
                            ]
                        };
                        for (var i = 0; i < expense.entities.length; i++) {
                            expense.entities[i].entityOID = item;
                        }
                        ExpenseReportService.recallExpenseReport(expense)
                            .success(function (data) {
                                $ionicLoading.hide();
                                if(data.failNum > 0){
                                    if(data.failReason[expenseOID] === 'releaseBudget'){
                                        $scope.view.openLoading($filter('translate')('expense.Release.the.budget.withdraw.the.failure'));
                                    } else {
                                        $scope.view.openLoading($filter('translate')('expense.error'));
                                    }
                                } else {
                                    $scope.view.loadOneTravel(item, '1002');
                                    $scope.view.openLoading($filter('translate')('expense.Withdraw.the.success'));
                                }
                            })
                            .error(function(){
                                $ionicLoading.hide();
                            })
                    }
            };

            $scope.relate = {
                selectFormOID: null,
                page: 0,
                size: 20,
                lastPage: 0,
                nothing: false,
                applicationOID: null,
                relateApplicationList: [],
                filter: {
                    types: null,
                    status: 1003,
                    rejectTypes: 1000,
                    startDate: null,
                    endDate: null
                },
                cancel: function(){
                    $scope.relateApplicationModal.hide();
                },
                selectApplication: function(item){
                    $scope.relate.applicationOID = item.applicationOID;
                    $scope.relateApplicationModal.hide();
                    $state.go('app.self_define_expense_report_create', {
                        formOID: $scope.relate.selectFormOID,
                        applicationOID: $scope.relate.applicationOID
                    })
                },
                loadMoreApplication: function(page){
                    $scope.relate.page = page;
                    if(page === 0){
                        $scope.relate.relateApplicationList = [];
                    }
                    // 显示loading
                    $scope.showLoading();
                    SelfDefineExpenseReport.getRelateApplication($scope.relate.selectFormOID, page, $scope.relate.size)
                        .then(function (response) {
                            if(page === 0){
                                $scope.relate.lastPage = ParseLinks.parse(response.headers('link')).last;
                            }
                            // 判断是否没有关联的申请单
                            $scope.relate.nothing = page===0 && response.data.length===0;

                            Array.prototype.push.apply($scope.relate.relateApplicationList, response.data);
                        })
                        .finally(function () {
                            // hide loading
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });

                    // SelfDefineExpenseReport.getApplicationList(page, $scope.relate.size, $scope.relate.filter)
                    //     .success(function(data, status, headers){
                    //         if(page === 0){
                    //             $scope.relate.lastPage = ParseLinks.parse(headers('link')).last;
                    //         }
                    //         if(page === 0 && data.length === 0){
                    //             $scope.relate.nothing = true;
                    //         }
                    //         for(var i = 0; i < data.length; i++){
                    //             $scope.relate.relateApplicationList.push(data[i]);
                    //         }
                    //     })
                    //     .finally(function () {
                    //         $scope.$broadcast('scroll.infiniteScrollComplete');
                    //     });
                    //TravelERVService.getTravelList(page, $scope.relate.size, enumId)
                    //    .success(function(data, status, headers){
                    //        if(page === 0){
                    //            $scope.relate.lastPage = ParseLinks.parse(headers('link')).last;
                    //        }
                    //        if(page === 0 && data.length === 0){
                    //            $scope.relate.nothing = true;
                    //        }
                    //        for(var i = 0; i < data.length; i++){
                    //            $scope.relate.relateApplicationList.push(data[i]);
                    //        }
                    //    })
                    //    .finally(function () {
                    //        $scope.$broadcast('scroll.infiniteScrollComplete');
                    //    });
                }
            };
            $ionicPopover.fromTemplateUrl("scripts/pages/expense_report_version/expense_report/create/create.relative.expense.popover.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            //展开关联报销单详情
            $scope.relateExpense = function ($event) {
                $scope.view.markStatus = !$scope.view.markStatus;
                if ($scope.view.markStatus) {
                    // 如果只有一种有效报销单, 直接跳到对应的报销单
                    if ($scope.myCustomForm.length===1){
                        $scope.selectExpense($scope.myCustomForm[0])
                    } else {
                        $scope.popover.show($event);
                    }
                }
            };
            //关联报销单
            $scope.selectExpense = function (item) {
                //if(item.formName === '日常报销单'){
                //    $scope.view.type = 1001;
                //    $state.go('app.tab_erv_create_expense_first');
                //} else if(item.formName === '差旅报销单'){
                //    $scope.view.type = 1002;
                //    $state.go('app.tab_erv_relative_travel_expense', {
                //        status: $scope.view.type
                //    })
                //} else if(item.formName === '费用报销单'){
                //    $scope.view.type= 1003;
                //    $state.go('app.tab_erv_relative_invoice_expense', {
                //        status: $scope.view.type
                //    })

                //if (data == 'dailyExpense') {
                //    $scope.view.type = 1001;
                //    $state.go('app.tab_erv_create_expense_first');
                //} else {
                //    if (data == 'travelExpense') {
                //        $scope.view.type = 1002;
                //        $state.go('app.tab_erv_relative_travel_expense', {
                //            status: $scope.view.type
                //        })
                //    } else if (data == 'invoiceExpense') {
                //        $scope.view.type= 1003;
                //        $state.go('app.tab_erv_relative_invoice_expense', {
                //            status: $scope.view.type
                //        })
                //    }
                //}
                $scope.popover.hide();
                $scope.view.markStatus = false;

                if(item.formType === 3001){
                    $state.go('app.self_define_expense_report_create', {
                        formOID: item.formOID
                    })
                } else {
                    if(item.formType === 3003){
                        //费用申请单
                        $scope.relate.filter.types = 1001;
                    } else if(item.formType === 3002){
                        //差旅申请单
                        $scope.relate.filter.types = 1002;
                    }
                    $scope.relate.selectFormOID = item.formOID;
                    $scope.relateApplicationModal.show();
                    $scope.relate.loadMoreApplication(0);
                }
            };
            //关联申请单
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/relate_application/select.application.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.relateApplicationModal = modal;
            });
            $scope.$on('popover.hidden', function () {
                $scope.view.markStatus = false;
            });
            $scope.$on('$ionicView.enter', function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                if (ExpenseReportService.getTab()) {
                    $scope.view.status = ExpenseReportService.getTab();
                    if ($scope.view.status == '1001') {
                        $scope.view.tabIndex = 0;
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            $scope.view.functionProfileList = data;
                            $scope.view.canDelete = !$scope.view.functionProfileList["er.opt.delete.disabled"];
                        });
                        $scope.view.canWithdraw = false;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    } else if ($scope.view.status == '1002') {
                        $scope.view.tabIndex = 1;
                        $scope.view.canDelete = false;
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            $scope.view.functionProfileList = data;
                           	$scope.view.canWithdraw = !$scope.view.functionProfileList["er.opt.withdraw.disabled"];
                        });
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    } else {
                        $scope.view.tabIndex = 2;
                        $scope.view.canWithdraw = false;
                        $scope.view.canDelete = false;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    }
                } else {
                    $scope.view.status = '1001';
                    $scope.view.tabIndex = 0;
                    FunctionProfileService.getFunctionProfileList().then(function(data){
                        $scope.view.functionProfileList = data;
                        $scope.view.canDelete = !$scope.view.functionProfileList["er.opt.delete.disabled"];
                    });
                    $scope.view.getExpenseList($scope.view.pageable.page);
                }

                //根据公司配置显示部门或项目
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode=data.currencyCode;
                        //获取币种
                        SelfDefineExpenseReport.getCashCategoryList()
                            .success(function (data) {
                                //这个货币接口改了
                                //只有可用的币种可以选,有些币种是不可以选的
                                data = data.filter(function (item) {
                                    return item.enable===true;
                                });
                                //币种列表
                                if (data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        var currency = {
                                            name: '',
                                            code: '',
                                            codeSymbol: ''
                                        };
                                        currency.name = data[i].currencyName;
                                        currency.code = data[i].currency;
                                        currency.codeSymbol = CurrencyCodeService.getCurrencySymbol(currency.code);
                                        $scope.view.cashCategoryList.push(currency);
                                        localStorageService.set('cashList', $scope.view.cashCategoryList);
                                    }
                                }
                            });
                    });
                NotificationService.countUnReadMessage()
                    .success(function(data){
                        $scope.total = data;
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
            });
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                //$scope.myCustomForm = [];
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
                // 获取本人可以创建的报销单列表
                SelfDefineExpenseReport.getExpenseReportFormsCanSelect()
                    .then(function(data){
                        $scope.myCustomForm = data;
                    })
            });
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if($scope.popover){
                    $scope.popover.hide();
                }
              if($scope.relateApplicationModal){
                  $scope.relateApplicationModal.hide();
              }

            })


        }]);
