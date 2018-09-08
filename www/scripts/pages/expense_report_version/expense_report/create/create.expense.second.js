/**
 * Created by Administrator on 2016/8/10.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab_erv_create_expense_second', {
                url: '/create/expense/second/:expenseReportOID',
                cache: false,
                params: {
                    expense: null
                },
                data: {
                    pageClass: 'expense'
                },
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.second.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseSecondController'
                    }
                },
                resolve: {
                    content: function () {
                        return "create_second";
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
        })
            .state('app.tab_erv_create_relative_expense_second', {
                url: '/create/relative/expense/second/:expenseReportOID',
                cache: false,
                params: {
                    expense: null
                },
                data: {
                    pageClass: 'expense'
                },
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.second.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseSecondController'
                    }
                },
                resolve: {
                    content: function () {
                        return "create_relative_second";
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
    .controller('com.handchina.huilianyi.ErvCreateExpenseSecondController', ['$scope', '$state', 'CurrencyCodeService',
        'localStorageService', 'InvoiceService', 'ExpenseReportService',
        'content', '$ionicLoading', '$q', '$timeout', 'TravelERVService', 'Principal', '$ionicHistory','CostCenterService',
        '$filter', 'ExpenseService', 'MAX_ER_INVOICE_NUM','CompanyConfigurationService',
        function ($scope, $state, CurrencyCodeService, localStorageService,
                  InvoiceService, ExpenseReportService, content, $ionicLoading, $q,
                  $timeout, TravelERVService, Principal, $ionicHistory, CostCenterService, $filter, ExpenseService,
                  MAX_ER_INVOICE_NUM,CompanyConfigurationService) {


            $scope.view = {
                amount: 0,
                originCurrencyCode:"",
                content: content,
                canDelete: true,
                goBackStatus: false,
                symbol: CurrencyCodeService.getCurrencySymbol('CNY'),
                expenseNextStep: {
                    expenseReportOID: '',
                    invoiceOIDs: [],
                    writeoffAmount: 0,
                    writeoffFlag: false,
                    showInformation: false,
                    cash: '',
                    code: '',
                    remark: null,
                    departmentOID: null,
                    costCenterItemOID: null,
                    approverOIDs: null,
                    type: 1001,
                    codeSymbol: CurrencyCodeService.getCurrencySymbol('CNY'),
                    applicationParticipants: []
                },
                expenseReportList: [],//报销单费用列表
                expenseObjects: localStorageService.get('expenseObjects') ? localStorageService.get('expenseObjects') : [],
                invoiceNum: 0,
                expense: {
                    expenseReportOID: "",
                    currencyCode: "",
                    expenseReportInvoices: [],
                    departmentOID: "",
                    costCenterItemOID: "",
                    remark: "",
                    type: 1001,
                    writeoffFlag: false,
                    writeoffAmount: 0,
                    approverOIDs: "",
                    applicationOID: null
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                validateData: function () {
                    var deferred = $q.defer();
                    if ($scope.view.expenseReportList && $scope.view.expenseReportList.length == 0) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Please.add.cost'));
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                showLoading: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                }
            };
            //已选费用的OID 列表
            $scope.selectedInvoiceOids = [];

            $scope.pagenation = {
                page: 0,
                size: 10,
                total: 0,
                maxPage: 0,
                loadMore: function (page) {
                    $scope.pagenation.page = page;
                    if (page === 0) {
                        $scope.view.expenseReportList = [];
                    }
                    if (page <= $scope.pagenation.maxPage) {
                        var pieceOIDs = $scope.selectedInvoiceOids.slice(page * $scope.pagenation.size, (1 + page) * $scope.pagenation.size);
                        if (pieceOIDs.length > 0) {
                            ExpenseService.getExpenseByOIDs(pieceOIDs)
                                .then(function(response) {
                                    Array.prototype.push.apply($scope.view.expenseReportList, response.data);
                                    $scope.view.expenseReportList.forEach(function(item) {
                                        item.week = new Date(item.createdDate).getDay();
                                        item.formatDate = $filter('date')(item.createdDate, 'yyyy-MM-dd');
                                    });
                                    $scope.view.expenseReportList = $filter('orderBy')($scope.view.expenseReportList, 'createdDate', true);
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                });
                        }
                    }
                }
            };
            //是否显示头信息
            $scope.showHeaderInformation = function () {
                $scope.view.expenseNextStep.showInformation = !$scope.view.expenseNextStep.showInformation;
            };
            //添加费用
            $scope.goTo = function (stateName) {
                $scope.view.goBackStatus = false;
                if (stateName === 'app.account_book') {
                    //增加参数invoiceNum
                    $state.go(stateName, {
                        message: $scope.view.content,
                        expenseReportOID: $state.params.expenseReportOID,
                        currencyCode:$scope.view.expenseNextStep.code,
                        invoiceNum: $scope.view.invoiceNum
                    });
                } else if (stateName ==='app.expense_create') {
                    //手动添加费用
                    if ($scope.selectedInvoiceOids.length >= MAX_ER_INVOICE_NUM) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Expense.account.added.at.200'));
                    } else {
                        $state.go(stateName, {
                            message: $scope.view.content,
                            expenseReportOID: $state.params.expenseReportOID,
                            currencyCode:$scope.view.expenseNextStep.code,
                            hasHistory: false
                        });
                    }
                } else {
                    $state.go(stateName, {
                        message: $scope.view.content,
                        expenseReportOID: $state.params.expenseReportOID,
                        currencyCode:$scope.view.expenseNextStep.code
                    });
                }
            };
            //修改报销单
            $scope.editExpense = function () {
                $scope.view.goBackStatus = false;
                if($scope.view.expenseNextStep.type===1001){
                    $state.go('app.tab_erv_create_expense_first', {
                        expenseReportOID: $state.params.expenseReportOID,
                        message: $scope.view.content
                    });
                }else if($scope.view.expenseNextStep.type === 1002){
                    $state.go('app.tab_erv_create_relative_expense_first', {
                        expenseReportOID: $state.params.expenseReportOID,
                        applicationOID:$scope.view.expenseNextStep.applicationOID,
                        message: $scope.view.content
                    });
                }else if($scope.view.expenseNextStep.type === 1003){
                    $state.go('app.tab_erv_create_relative_expense_first', {
                        expenseReportOID: $state.params.expenseReportOID,
                        invoiceOID:$scope.view.expenseNextStep.applicationOID,
                        message: $scope.view.content
                    });
                }

            };
            //保存报销单
            $scope.saveExpense = function () {
                ExpenseReportService.setTab('1001');
                $scope.view.showLoading();
                $scope.view.expense.expenseReportOID = $scope.view.expenseNextStep.expenseReportOID;
                $scope.view.expense.currencyCode = $scope.view.expenseNextStep.code;
                $scope.view.expense.departmentOID = $scope.view.expenseNextStep.departmentOID;
                $scope.view.expense.costCenterItemOID = $scope.view.expenseNextStep.costCenterItemOID;
                $scope.view.expense.remark = $scope.view.expenseNextStep.remark;
                $scope.view.expense.writeoffFlag = $scope.view.expenseNextStep.writeoffFlag;
                //$scope.view.expense.writeoffAmount = $scope.view.expenseNextStep.writeoffAmount;
                $scope.view.expense.approverOIDs = $scope.view.expenseNextStep.approverOIDs;
                $scope.view.expense.type = $scope.view.expenseNextStep.type;
                $scope.view.expense.applicationOID = $scope.view.expenseNextStep.applicationOID;

                //添加已有的费用
                if ($scope.view.expenseNextStep.expenseDetails &&
                    $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices &&
                    $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                    var expenseDetails = $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices;
                    for (var i = 0; i < expenseDetails.length; i++) {
                        var expenseReportInvoice = {};
                        expenseReportInvoice.invoiceOID = expenseDetails[i].invoiceOID;
                        expenseReportInvoice.expenseReportInvoiceOID = expenseDetails[i].expenseReportInvoiceOID;
                        $scope.view.expense.expenseReportInvoices.push(expenseReportInvoice);
                    }
                }
                //新增的费用
                if (localStorageService.get('expenseObjects')) {
                    var expenseList = localStorageService.get('expenseObjects');
                    for (var i = 0; i < expenseList.length; i++) {
                        var expenseReportInvoice = {
                            expenseReportInvoiceOID: "",
                        };
                        expenseReportInvoice.invoiceOID = expenseList[i];
                        $scope.view.expense.expenseReportInvoices.push(expenseReportInvoice);
                    }
                }
                ExpenseReportService.saveExpenseReport($scope.view.expense)
                    .success(function () {
                        $ionicLoading.hide();
                        localStorageService.remove('expenseObjects');
                        $scope.view.openWarningPopup($filter('translate')('expense.Save.success'));
                        $timeout(function () {
                            $state.go('app.tab_erv.expense_report');
                        }, 500);
                    }).error(function (error) {
                        $ionicLoading.hide();
                        if(error.message){
                            $scope.view.openWarningPopup(error.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('expense.Save.failed'));
                        }
                        localStorageService.remove('expenseObjects');
                    });

                //if($scope.view.expense.costCenterItemOID){
                //    CostCenterService.logLastCostCenterItem($scope.invoice.costCenterItemOID);
                //}

            };
            //创建报销单
            $scope.commitExpense = function () {
                ExpenseReportService.setTab('1002');
                $scope.view.validateData().then(function () {
                    $scope.view.showLoading();
                    $scope.view.expense.expenseReportOID = $scope.view.expenseNextStep.expenseReportOID;
                    $scope.view.expense.currencyCode = $scope.view.expenseNextStep.code;
                    $scope.view.expense.departmentOID = $scope.view.expenseNextStep.departmentOID;
                    $scope.view.expense.costCenterItemOID = $scope.view.expenseNextStep.costCenterItemOID;
                    $scope.view.expense.remark = $scope.view.expenseNextStep.remark;
                    $scope.view.expense.writeoffFlag = $scope.view.expenseNextStep.writeoffFlag;
                    //$scope.view.expense.writeoffAmount = $scope.view.expenseNextStep.writeoffAmount;
                    $scope.view.expense.approverOIDs = $scope.view.expenseNextStep.approverOIDs;
                    $scope.view.expense.type = $scope.view.expenseNextStep.type;
                    $scope.view.expense.applicationOID = $scope.view.expenseNextStep.applicationOID;
                    // for (var i = 0; i < ($scope.view.expenseReportList && $scope.view.expenseReportList.length); i++) {
                    //     var expenseReportInvoice = {
                    //         expenseReportInvoiceOID: "",
                    //     };
                    //     expenseReportInvoice.invoiceOID = $scope.view.expenseReportList[i].invoiceOID;
                    //     $scope.view.expense.expenseReportInvoices.push(expenseReportInvoice);

                    // }
                    //添加已有的费用
                    if ($scope.view.expenseNextStep.expenseDetails &&
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices &&
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                        var expenseDetails = $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices;
                        for (var i = 0; i < expenseDetails.length; i++) {
                            var expenseReportInvoice = {};
                            expenseReportInvoice.invoiceOID = expenseDetails[i].invoiceOID;
                            expenseReportInvoice.expenseReportInvoiceOID = expenseDetails[i].expenseReportInvoiceOID;
                            $scope.view.expense.expenseReportInvoices.push(expenseReportInvoice);
                        }
                    }
                    //新增的费用
                    if (localStorageService.get('expenseObjects')) {
                        var expenseList = localStorageService.get('expenseObjects');
                        for (var i = 0; i < expenseList.length; i++) {
                            var expenseReportInvoice = {
                                expenseReportInvoiceOID: "",
                            };
                            expenseReportInvoice.invoiceOID = expenseList[i];
                            $scope.view.expense.expenseReportInvoices.push(expenseReportInvoice);
                        }
                    }
                    ExpenseReportService.commitExpenseReport($scope.view.expense)
                        .success(function () {
                            localStorageService.remove('expenseObjects');
                            $scope.view.openWarningPopup($filter('translate')('expense.Submitted.successfully'));
                            $timeout(function () {
                                $state.go('app.tab_erv.expense_report');
                            }, 500);
                        })
                        .error(function (error) {
                            if(error.message === 'OUT_OF_BUDGET'){
                                $scope.view.openWarningPopup($filter('translate')('expense.Excess.budget.Do.not.submit'));
                            } else if(error.message){
                                $scope.view.openWarningPopup(error.message);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('expense.submit.failed'));
                            }
                            localStorageService.remove('expenseObjects');
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        })
                    ;
                });
            };
            //查看费用详情
            $scope.showDetail = function (expense) {
                if ($scope.view.content == 'create_second') {
                    $state.go('app.tab_erv_expense_consume_init', {
                        expense: expense,
                        message: $scope.view.content,
                        expenseReportOID: $state.params.expenseReportOID
                    });
                }
            };

            //删除一条费用
            $scope.deleteInvoice = function (data) {
                // for (var i = 0; i < $scope.view.expenseNextStep.invoiceOIDs.length; i++) {
                //     if ($scope.view.expenseNextStep.invoiceOIDs[i] == data) {
                //         $scope.view.expenseReportList.forEach(function(item,index){
                //             if(item.invoiceOID==$scope.view.expenseNextStep.invoiceOIDs[i]){
                //                 $scope.view.amount = $scope.view.amount - $scope.view.expenseReportList[index].amount;
                //                 $scope.view.expenseReportList.splice(index, 1);
                //             }
                //         });
                //         $scope.view.expenseNextStep.invoiceOIDs.forEach(function(item,index){
                //             if(item.invoiceOID==$scope.view.expenseNextStep.invoiceOIDs[i]){
                //                 $scope.view.expenseNextStep.invoiceOIDs.splice(index, 1);
                //             }
                //         });
                //         if (localStorageService.get('expenseObjects')) {
                //             //localStorageService.set('expenseObjects', $scope.view.expenseReportList);
                //             localStorageService.set('expenseObjects', $scope.view.expenseNextStep.invoiceOIDs);
                //         }
                //         break;
                //     }
                // }
                var index = $scope.view.expenseObjects.indexOf(data.invoiceOID);
                if (index > -1) {
                    $scope.view.expenseObjects.splice(index, 1);
                    $scope.selectedInvoiceOids = angular.copy($scope.view.expenseObjects);
                    localStorageService.set('expenseObjects', $scope.view.expenseObjects);
                    //从列表数组中删除
                    for (var i = 0; i < $scope.view.expenseReportList.length; i++) {
                        if ($scope.view.expenseReportList[i].invoiceOID === data.invoiceOID) {
                            $scope.view.expenseReportList.splice(i, 1);
                            break;
                        }
                    }
                    if ($scope.view.expenseNextStep.expenseDetails &&
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices &&
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.forEach(function (item, index) {
                            if (item.invoiceOID == data.invoiceOID) {
                                $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.splice(index, 1);
                            }
                        });
                    }
                    //重新计算总金额
                    $scope.view.amount = $scope.view.amount - data.amount;
                    $scope.view.openWarningPopup($filter('translate')('expense.Delete.the.success'));
                    $scope.view.nothing = $scope.view.expenseReportList.length > 0;
                }
                $scope.view.nothing = $scope.view.expenseReportList.length > 0;
            };
            //报销单明细
            function getExpenseDetail(expenseReportOID) {
                ExpenseReportService.getExpenseReportDetail(expenseReportOID)
                    .success(function (data) {
                        if (data.type !== 1001) {
                            $scope.view.title = data.title;
                            $scope.view.showRelativeInformation = true;
                        }else{
                            $scope.view.title = $filter('translate')('expense.Daily.expense.account');
                        }
                        $scope.view.expenseNextStep.expenseDetails = data;

                        $scope.view.amount = data.totalAmount;
                        $scope.view.expenseNextStep.startDate = data.travelStartDate;
                        $scope.view.expenseNextStep.endDate = data.travelEndDate;
                        $scope.view.expenseNextStep.averageBudget = data.budgetAmount;
                        $scope.view.expenseNextStep.expenseReportOID = data.expenseReportOID;
                        $scope.view.expenseNextStep.departmentOID = data.departmentOID;
                        $scope.view.expenseNextStep.departmentName = data.departmentName;
                        $scope.view.expenseNextStep.departmentPath=data.departmentPath;
                        $scope.view.expenseNextStep.costCenterItemOID = data.costCenterItemOID;
                        $scope.view.expenseNextStep.writeoffFlag = data.writeoffFlag;
                        $scope.view.expenseNextStep.approverOIDs = data.approverOIDs;
                        $scope.view.expenseNextStep.code = data.currencyCode;
                        $scope.view.expenseNextStep.remark = data.remark;
                        $scope.view.expenseNextStep.type = data.type;
                        $scope.view.expenseNextStep.applicationOID = data.applicationOID;
                        $scope.view.expenseNextStep.codeSymbol = CurrencyCodeService.getCurrencySymbol(data.currencyCode);

                        var invoiceOIDs = [];
                        if (data.expenseReportInvoices && data.expenseReportInvoices.length) {
                            $scope.view.invoiceNum = data.expenseReportInvoices.length;
                        }
                        for (var i = 0; i < (data.expenseReportInvoices && data.expenseReportInvoices.length); i++) {
                            invoiceOIDs.push(data.expenseReportInvoices[i].invoiceOID);
                        }

                        if (localStorageService.get('expenseObjects')) {
                            $scope.view.expenseList = localStorageService.get('expenseObjects');
                            Array.prototype.push.apply(invoiceOIDs, $scope.view.expenseList);
                            // for (var i = 0; i < $scope.view.expenseList.length; i++) {
                            //     $scope.view.expenseReportList.push($scope.view.expenseList[i]);
                            //     $scope.view.expenseNextStep.invoiceOIDs.push($scope.view.expenseList[i].invoiceOID);
                            // }
                            // for (var i = 0; i < $scope.view.expenseReportList.length; i++) {
                            //     invoiceOIDs.push($scope.view.expenseReportList[i].invoiceOID);
                            //     $scope.view.expenseReportList[i].week = new Date($scope.view.expenseReportList[i].createdDate).getDay();
                            //     $scope.view.expenseReportList[i].formatDate = new Date($scope.view.expenseReportList[i].createdDate).Format('yyyy-MM-dd');
                            // }
                            // $scope.view.expenseNextStep.invoiceOIDs = invoiceOIDs;
                            // //报销单明细里的费用OID列表
                            // $scope.getSum(invoiceOIDs);
                            // $scope.view.expenseReportList = $filter('orderBy')($scope.view.expenseReportList, 'formatDate', true);
                        }

                        $scope.view.expenseNextStep.invoiceOIDs = invoiceOIDs;
                        $scope.selectedInvoiceOids = invoiceOIDs;
                        //报销单明细里的费用OID列表
                        $scope.getSum(invoiceOIDs);
                        $scope.view.nothing = invoiceOIDs.length > 0;
                        $scope.pagenation.total = invoiceOIDs.length;
                        if ($scope.pagenation.total > 0) {
                            $scope.pagenation.maxPage = Math.ceil(invoiceOIDs.length / $scope.pagenation.size) - 1;
                        }

                        $scope.pagenation.loadMore(0);
                        Principal.identity().then(function (data) {
                            var applications = {
                                fullName: '',
                                participantOID: '',
                                avatar: ''
                            };
                            applications.fullName = data.fullName;
                            applications.participantOID = data.userOID;
                            applications.avatar = data.avatar;
                            $scope.view.expenseNextStep.applicationParticipants.push(applications);
                        });
                    })
                    .error(function(error){
                        if(error.message){
                            $scope.view.openWarningPopup(error.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('expense.error'));
                        }
                    })
            }

            function init() {
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode = data.currencyCode;
                    })

                if ($scope.view.content == 'create_second') {
                    if ($state.params.expenseReportOID) {
                        getExpenseDetail($state.params.expenseReportOID);
                    }
                }
                if ($scope.view.content == 'create_relative_second') {
                    if ($state.params.expenseReportOID) {
                        $scope.view.showRelativeInformation = true;
                        getExpenseDetail($state.params.expenseReportOID);
                    }
                }

            }

            init();
            //计算费用总和
            $scope.getSum = function (invoiceOIDs) {
                if (invoiceOIDs && invoiceOIDs.length > 0) {
                    InvoiceService.getSumByPost(invoiceOIDs)
                    .success(function (data) {
                        $scope.view.amount = data;
                    });
                } else {
                    $scope.view.amount = 0;
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                $scope.view.goBackStatus = true;
                viewData.enableBack = true;

            });
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if ((toState.name == 'app.tab_erv_create_expense_first'&&
                    fromState.name == 'app.tab_erv_create_expense_second') ||
                    (toState.name == 'app.tab_erv_create_relative_expense_first' &&
                        fromState.name == 'app.tab_erv_create_relative_expense_second')) {
                    if ($scope.view.goBackStatus) {
                        ExpenseReportService.setTab('1001');
                        $state.go('app.tab_erv.expense_report');
                        if (localStorageService.get('expenseObjects')) {
                            localStorageService.remove('expenseObjects');
                        }
                    }
                }
            });
        }]);
