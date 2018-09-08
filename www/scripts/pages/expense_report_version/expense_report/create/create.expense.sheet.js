/**
 * Created by Administrator on 2016/8/8.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tab_erv_expense_normal', {
                url: '/create/expense/normal/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.second.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseSheetController'
                    }
                },
                data: {
                    pageClass: 'expense'
                },
                params: {
                    expense: null,
                    message: null
                },
                resolve: {
                    content: function () {
                        return "normal";
                    },
                    isTravelExpense: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account_book.tpl');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.tab_erv_expense_withdraw', {
                url: '/create/expense/withdraw/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.second.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseSheetController'
                    }
                },
                params: {
                    expense: null,
                    message: null
                },
                data: {
                    pageClass: 'expense'
                },
                resolve: {
                    content: function () {
                        return "withdraw";
                    },
                    isTravelExpense: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account_book.tpl');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.tab_erv_expense_approval_reject', {
                url: '/create/expense/approval/reject/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.second.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseSheetController'
                    }
                },
                data: {
                    pageClass: 'expense'
                },
                params: {
                    expense: null,
                    message: null
                },
                resolve: {
                    content: function () {
                        return "approval_reject";
                    },
                    isTravelExpense: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account_book.tpl');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }

            })
            .state('app.tab_erv_expense_audit_reject', {
                url: '/create/expense/audit/reject/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.second.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseSheetController'
                    }
                },
                data: {
                    pageClass: 'expense'
                },
                params: {
                    expense: null,
                    message: null
                },
                resolve: {
                    content: function () {
                        return 'audit_reject';
                    },
                    isTravelExpense: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account_book.tpl');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            });
    }])
    .controller('com.handchina.huilianyi.ErvCreateExpenseSheetController', ['$scope', 'ExpenseReportService', 'content',
        '$state', 'localStorageService', '$ionicLoading', 'InvoiceService', 'TravelERVService', 'CurrencyCodeService',
        'isTravelExpense', '$ionicModal', '$q', 'Principal', '$ionicHistory', '$timeout', '$filter', 'CostCenterService',
        'ExpenseService', 'MAX_ER_INVOICE_NUM', 'ApprovalPopupService', '$sessionStorage','CompanyConfigurationService',
        function ($scope, ExpenseReportService, content, $state, localStorageService, $ionicLoading,
                  InvoiceService, TravelERVService, CurrencyCodeService,
                  isTravelExpense, $ionicModal, $q, Principal, $ionicHistory, $timeout, $filter, CostCenterService,
                  ExpenseService, MAX_ER_INVOICE_NUM, ApprovalPopupService, $sessionStorage,CompanyConfigurationService) {
            $scope.view = {
                content: content,
                isTravelExpense: isTravelExpense,
                title: null,
                againChoice: true,
                canDelete: true,
                goBackStatus: false,
                symbol: CurrencyCodeService.getCurrencySymbol('CNY'),
                expenseFirstStep: {
                    cash: $filter('translate')('expense.text'),
                    code: 'CNY',
                    codeSymbol: "",
                    cashCategoryList: localStorageService.get('cashList') ? localStorageService.get('cashList') : []
                },
                expenseNextStep: {
                    showInformation: false,
                    invoiceOIDs: [],
                    writeoffAmount: 0,
                    writeoffFlag: false,
                    expenseReportOID: '',
                    cash:$filter('translate')('expense.text'),
                    code: 'CNY',
                    businessCode: '',
                    remark: null,
                    departmentOID: null,
                    costCenterItemOID: null,
                    approverOIDs: null,
                    type: 1001,
                    applicationParticipants: [],
                    codeSymbol: CurrencyCodeService.getCurrencySymbol("CNY")
                },
                expenseReportList: [],
                expenseObjects: localStorageService.get('expenseObjects') ? localStorageService.get('expenseObjects') : [],
                deleteInvoiceList: localStorageService.get('deleteInvoiceList') ? localStorageService.get('deleteInvoiceList') : [],
                nothing: false,
                amount: 0,
                invoiceNum: 0,
                language: $sessionStorage.lang,//获取当前页面语言环境
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
                validateData: function () {
                    var deferred = $q.defer();
                    if ($scope.view.expenseReportList && $scope.view.expenseReportList.length === 0) {
                        $scope.view.openLoading($filter('translate')('expense.Please.add.cost'));
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                }
            };

            //选择费用的OID 列表
            $scope.selectedInvoiceOids = [];

            //是否显示头信息
            $scope.showHeaderInformation = function () {
                $scope.view.expenseNextStep.showInformation = !$scope.view.expenseNextStep.showInformation;
            };
            $scope.goTo = function (stateName) {
                $scope.view.goBackStatus = false;
                if (stateName === 'app.account_book') {
                    //增加参数invoiceNum
                    $state.go(stateName, {
                        message: $scope.view.content,
                        expenseReportOID: $state.params.expenseReportOID,
                        currencyCode: $scope.view.expenseNextStep.code,
                        invoiceNum: $scope.selectedInvoiceOids.length
                    });
                } else if (stateName === 'app.expense_create') {
                    //手动添加费用
                    if ($scope.selectedInvoiceOids.length >= MAX_ER_INVOICE_NUM) {
                        $scope.view.openLoading($filter('translate')('expense.Expense.account.added.at.200'));
                    } else {
                        $state.go(stateName, {
                            message: $scope.view.content,
                            expenseReportOID: $state.params.expenseReportOID,
                            currencyCode: $scope.view.expenseNextStep.code,
                            invoiceNum: MAX_ER_INVOICE_NUM - $scope.selectedInvoiceOids.length
                        });
                    }
                } else {
                    $state.go(stateName, {
                        message: $scope.view.content,
                        expenseReportOID: $state.params.expenseReportOID,
                        currencyCode: $scope.view.expenseNextStep.code
                    });
                }
            };
            //查看费用详情
            $scope.showDetail = function (expense) {
                $scope.view.goBackStatus = false;
                $state.go('app.tab_erv_expense_consume_init', {
                    expense: expense,
                    message: $scope.view.content,
                    expenseReportOID: $state.params.expenseReportOID
                });
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
            //删除一条费用
            $scope.deleteInvoice = function (data) {
                // if (localStorageService.get('expenseObjects')) {
                //     var expenseList = localStorageService.get('expenseObjects');
                //     var addExpenseList = expenseList.filter(function (item) {
                //         return item.invoiceOID === data;
                //     });
                //     //删除新建的费用
                //     if (addExpenseList && addExpenseList.length > 0) {
                //         var newArr = $scope.view.expenseReportList.filter(function (value) {
                //             return $scope.view.expenseList.indexOf(value) > -1;
                //         });
                //         for (var i = 0; i < newArr.length; i++) {
                //             if (newArr[i].invoiceOID === data) {
                //                 $scope.view.amount = $scope.view.amount - newArr[i].amount;
                //                 expenseList.forEach(function(item,index){
                //                    if(item.invoiceOID===data){
                //                        expenseList.splice(index, 1);
                //                    }
                //                 });
                //                 $scope.view.expenseReportList.forEach(function(item,index){
                //                     if(item.invoiceOID===data){
                //                         $scope.view.expenseReportList.splice(index, 1);
                //                     }
                //                 });
                //                 //if ($scope.view.expenseNextStep.expenseReportInvoices && $scope.view.expenseNextStep.expenseReportInvoices.length > 0) {
                //                 //    $scope.view.expenseNextStep.expenseReportInvoices.forEach(function(item,index){
                //                 //        if(item.invoiceOID===data){
                //                 //            $scope.view.expenseNextStep.expenseReportInvoices.splice(index, 1)
                //                 //        }
                //                 //    });
                //                 //}
                //                 if (localStorageService.get('expenseObjects')) {
                //                     localStorageService.set('expenseObjects', expenseList);
                //                 }
                //                 $scope.view.openLoading('删除成功');
                //                 break;
                //             }
                //         }
                //     } else {
                //         //$scope.view.showLoading();
                //         ExpenseReportService.removeExpense($state.params.expenseReportOID, data)
                //             .success(function () {
                //                 $scope.view.openLoading('删除成功');
                //                 $scope.view.expenseReportList = [];
                //                 $scope.view.expenseNextStep.expenseReportInvoices=[];
                //                 //$scope.view.amount=0;
                //                 getExpenseDetail($state.params.expenseReportOID);
                //             });
                //     }
                // } else {
                //     //$scope.view.showLoading();
                //     ExpenseReportService.removeExpense($state.params.expenseReportOID, data)
                //         .success(function () {
                //             $scope.view.expenseReportList = [];
                //             $scope.view.expenseNextStep.expenseReportInvoices=[];
                //             getExpenseDetail($state.params.expenseReportOID);
                //             $scope.view.openLoading('删除成功');
                //         });
                // }
                var index = $scope.view.expenseObjects.indexOf(data.invoiceOID);
                //新增的费用
                if (index > -1) {
                    $scope.view.expenseObjects.splice(index, 1);
                    localStorageService.set('expenseObjects', $scope.view.expenseObjects);
                    //从列表数组中删除
                    $scope.spliceList($scope.view.expenseReportList, data);
                    $scope.view.amount = $scope.view.amount - data.amount;
                    $scope.view.openLoading($filter('translate')('expense.Delete the success'));
                    $scope.view.nothing = $scope.view.expenseReportList.length > 0;
                    $scope.selectedInvoiceOids = $scope.selectedInvoiceOids.filter(function (item) {
                        return item != data.invoiceOID;
                    });
                    if ($scope.view.expenseNextStep.expenseDetails &&
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices &&
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.forEach(function (item, index) {
                            if (item.invoiceOID == data.invoiceOID) {
                                $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.splice(index, 1);
                            }
                        });
                    }
                } else {
                    //报销单中已存的费用
                    ExpenseReportService.removeExpense($state.params.expenseReportOID, data.invoiceOID)
                        .success(function () {
                            //从列表数组中删除
                            $scope.spliceList($scope.view.expenseReportList, data);
                            $scope.view.amount = $scope.view.amount - data.amount;
                            $scope.view.openLoading($filter('translate')('expense.Delete.the.success'));
                            $scope.view.nothing = $scope.view.expenseReportList.length > 0;
                            if ($scope.view.expenseNextStep.expenseDetails &&
                                $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices &&
                                $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                                $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.forEach(function (item, index) {
                                    if (item.invoiceOID == data.invoiceOID) {
                                        $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.splice(index, 1);
                                    }
                                });
                            }
                            $scope.selectedInvoiceOids = $scope.selectedInvoiceOids.filter(function (item) {
                                return item != data.invoiceOID;
                            });
                        });
                }
            };
            $scope.spliceList = function (list, item) {
                for (var i = 0; i < list.length; i++) {
                    if (item.invoiceOID === list[i].invoiceOID) {
                        list.splice(i, 1);
                        break;
                    }
                }
            };
            //保存报销单
            $scope.saveExpense = function () {
                ExpenseReportService.setTab('1001');
                $scope.view.showLoading();
                var expense = {
                    expenseReportOID: $scope.view.expenseNextStep.expenseReportOID,
                    currencyCode: $scope.view.expenseNextStep.code,
                    expenseReportInvoices: $scope.view.expenseNextStep.expenseReportInvoices ? $scope.view.expenseNextStep.expenseReportInvoices : [],
                    departmentOID: $scope.view.expenseNextStep.departmentOID,
                    costCenterItemOID: $scope.view.expenseNextStep.costCenterItemOID,
                    remark: $scope.view.expenseNextStep.remark,
                    type: $scope.view.expenseNextStep.type,
                    writeoffFlag: $scope.view.expenseNextStep.writeoffFlag,
                    writeoffAmount: 0,
                    approverOIDs: $scope.view.expenseNextStep.approverOIDs,
                    applicationOID: $scope.view.expenseNextStep.applicationOID
                };
                //添加已有的费用
                if ($scope.view.expenseNextStep.expenseDetails &&
                    $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices &&
                    $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                    var expenseDetails = $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices;
                    for (var i = 0; i < expenseDetails.length; i++) {
                        var expenseReportInvoice = {};
                        expenseReportInvoice.invoiceOID = expenseDetails[i].invoiceOID;
                        expenseReportInvoice.expenseReportInvoiceOID = expenseDetails[i].expenseReportInvoiceOID;
                        expense.expenseReportInvoices.push(expenseReportInvoice);
                    }
                }
                //新增的费用
                if (localStorageService.get('expenseObjects')) {
                    var expenseList = localStorageService.get('expenseObjects');
                    for (var i = 0; i < expenseList.length; i++) {
                        var expenseReportInvoice = {
                            expenseReportInvoiceOID: ""
                        };
                        expenseReportInvoice.invoiceOID = expenseList[i];
                        expense.expenseReportInvoices.push(expenseReportInvoice);
                    }
                }

                ExpenseReportService.saveExpenseReport(expense)
                    .success(function () {
                        $ionicLoading.hide();
                        localStorageService.remove('expenseObjects');
                        $scope.view.openWarningPopup($filter('translate')('expense.Save.success'));
                        $timeout(function () {
                            $state.go('app.tab_erv.expense_report');
                        }, 500);

                    }).error(function () {
                    $ionicLoading.hide();
                    localStorageService.remove('expenseObjects');
                });
            };
            //创建报销单
            $scope.commitExpense = function () {
                ExpenseReportService.setTab('1002');
                $scope.view.validateData().then(function () {
                    $scope.view.showLoading();
                    var expense = {
                        expenseReportOID: $scope.view.expenseNextStep.expenseReportOID,
                        currencyCode: $scope.view.expenseNextStep.code,
                        expenseReportInvoices: $scope.view.expenseNextStep.expenseReportInvoices ? $scope.view.expenseNextStep.expenseReportInvoices : [],
                        departmentOID: $scope.view.expenseNextStep.departmentOID,
                        costCenterItemOID: $scope.view.expenseNextStep.costCenterItemOID,
                        remark: $scope.view.expenseNextStep.remark,
                        type: $scope.view.expenseNextStep.type,
                        writeoffFlag: $scope.view.expenseNextStep.writeoffFlag,
                        writeoffAmount: 0,
                        approverOIDs: $scope.view.expenseNextStep.approverOIDs,
                        applicationOID: $scope.view.expenseNextStep.applicationOID
                    };
                    // if (localStorageService.get('expenseObjects')) {
                    //     var expenseList = localStorageService.get('expenseObjects');
                    //     for (var i = 0; i < expenseList.length; i++) {
                    //         var expenseReportInvoice = {
                    //             expenseReportInvoiceOID: ""
                    //         };
                    //         expenseReportInvoice.invoiceOID = expenseList[i].invoiceOID;
                    //         expense.expenseReportInvoices.push(expenseReportInvoice);
                    //     }
                    // }
                    //添加已有的费用
                    if ($scope.view.expenseNextStep.expenseDetails.expenseReportInvoices && 0 < $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices.length) {
                        var expenseDetails = $scope.view.expenseNextStep.expenseDetails.expenseReportInvoices;
                        for (var i = 0; i < expenseDetails.length; i++) {
                            var expenseReportInvoice = {};
                            expenseReportInvoice.invoiceOID = expenseDetails[i].invoiceOID;
                            expenseReportInvoice.expenseReportInvoiceOID = expenseDetails[i].expenseReportInvoiceOID;
                            expense.expenseReportInvoices.push(expenseReportInvoice);
                        }
                    }
                    //新增的费用
                    if (localStorageService.get('expenseObjects')) {
                        var expenseList = localStorageService.get('expenseObjects');
                        for (var i = 0; i < expenseList.length; i++) {
                            var expenseReportInvoice = {
                                expenseReportInvoiceOID: ""
                            };
                            expenseReportInvoice.invoiceOID = expenseList[i];
                            expense.expenseReportInvoices.push(expenseReportInvoice);
                        }
                    }
                    ExpenseReportService.commitExpenseReport(expense)
                        .success(function () {
                            $ionicLoading.hide();
                            localStorageService.remove('expenseObjects');
                            $scope.view.openWarningPopup($filter('translate')('expense.Submitted.successfully'));
                            $timeout(function () {
                                ApprovalPopupService.setCount();
                                $state.go('app.tab_erv.expense_report');
                            }, 500);
                        }).error(function (error) {
                        $ionicLoading.hide();
                        if(error.errorCode === 'OUT_OF_BUDGET'){
                            $scope.view.openWarningPopup($filter('translate')('expense.Excess.budget.Do.not.submit'));
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('expense.submit.failed'));
                        }
                        localStorageService.remove('expenseObjects');
                    });
                })

                ;
            };

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
                                .then(function (response) {
                                    Array.prototype.push.apply($scope.view.expenseReportList, response.data);
                                    $scope.view.expenseReportList.forEach(function (item) {
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

            //获取本位币
            CompanyConfigurationService.getCompanyConfiguration()
                .then(function (data) {
                    //获取公司本位币
                    $scope.view.originCurrencyCode=data.currencyCode;
                })

            //报销单明细
            function getExpenseDetail(expenseReportOID) {
                ExpenseReportService.getExpenseReportDetail(expenseReportOID)
                    .success(function (data) {

                        //console.log(data)

                        $scope.view.amount = data.totalAmount;
                        if (data.type === 1001) {
                            $scope.view.title = $filter('translate')('expense.Daily.expense.account');
                            $scope.view.canEdit = true;
                            $scope.view.showRelativeInformation = false;
                        } else if (data.type === 1002) {
                            $scope.view.title = data.title;
                            $scope.view.canEdit = false;
                            $scope.view.showRelativeInformation = true;
                        } else if (data.type === 1003) {
                            $scope.view.title = data.title;
                            $scope.view.canEdit = false;
                            $scope.view.showRelativeInformation = true;
                        }
                        $scope.view.expenseNextStep.expenseDetails = data;
                        if (data.approvalHistoryDTOs) {
                            $scope.view.expenseNextStep.expenseDetails.approvalHistory = data.approvalHistoryDTOs;
                            $scope.view.expenseNextStep.expenseDetails.approvalHistory.rejectTypes = [];
                            for (var i = 0; i < (data.approvalHistoryDTOs && data.approvalHistoryDTOs.length); i++) {
                                if (data.approvalHistoryDTOs[i].remark) {
                                    $scope.view.expenseNextStep.expenseDetails.approvalHistory[i].remarks = angular.fromJson(data.approvalHistoryDTOs[i].remark);
                                    $scope.view.expenseNextStep.expenseDetails.approvalHistory[i].remarks.value = [];
                                    for (var key in $scope.view.expenseNextStep.expenseDetails.approvalHistory[i].remarks.rejectTypeAmountMap) {
                                        var rejectTypes = {
                                            key: '',
                                            amount: 0
                                        };
                                        rejectTypes.key = key;
                                        rejectTypes.amount = $scope.view.expenseNextStep.expenseDetails.approvalHistory[i].remarks.rejectTypeAmountMap[key];
                                        $scope.view.expenseNextStep.expenseDetails.approvalHistory[i].remarks.value.push(rejectTypes);
                                    }
                                }
                            }
                        }
                        $scope.view.expenseNextStep.departmentName = data.departmentName;
                        $scope.view.expenseNextStep.departmentPath=data.departmentPath;
                        $scope.view.expenseNextStep.startDate = data.travelStartDate;
                        $scope.view.expenseNextStep.endDate = data.travelEndDate;
                        $scope.view.expenseNextStep.averageBudget = data.budgetAmount;
                        $scope.view.expenseNextStep.type = data.type;
                        $scope.view.expenseNextStep.expenseReportOID = data.expenseReportOID;
                        $scope.view.expenseNextStep.departmentOID = data.departmentOID ? data.departmentOID : "";
                        $scope.view.expenseNextStep.costCenterItemOID = data.costCenterItemOID ? data.costCenterItemOID : "";
                        $scope.view.expenseNextStep.approverOIDs = data.approverOIDs;
                        $scope.view.expenseNextStep.businessCode = data.businessCode;
                        $scope.view.expenseNextStep.codeSymbol = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                        $scope.view.expenseFirstStep.code = data.currencyCode;
                        $scope.view.expenseNextStep.code = data.currencyCode;
                        $scope.view.expenseNextStep.writeoffFlag = data.writeoffFlag;
                        $scope.view.expenseNextStep.remark = data.remark;
                        $scope.view.expenseNextStep.applicationOID = data.applicationOID ? data.applicationOID : "";
                        // for (var i = 0; i < (data.expenseReportInvoices && data.expenseReportInvoices.length); i++) {
                        //     var invoiceOID = data.expenseReportInvoices[i].invoiceOID;
                        //     $scope.view.expenseNextStep.expenseReportInvoices = data.expenseReportInvoices;
                        //     $scope.view.expenseNextStep.invoiceOIDs.push(invoiceOID);
                        //     data.expenseReportInvoices[i].invoiceView.week = new Date(data.expenseReportInvoices[i].invoiceView.createdDate).getDay();
                        //     data.expenseReportInvoices[i].invoiceView.formatDate = new Date(data.expenseReportInvoices[i].invoiceView.createdDate).Format('yyyy-MM-dd');
                        //     $scope.view.expenseReportList.push(data.expenseReportInvoices[i].invoiceView);
                        //     $scope.view.expenseReportList = $filter('orderBy')($scope.view.expenseReportList, 'formatDate', true);
                        //     $scope.view.nothing = $scope.view.expenseReportList.length > 0;
                        // }
                        // if (localStorageService.get('expenseObjects')) {
                        //     var invoiceOIDs = [];
                        //     $scope.view.expenseList = localStorageService.get('expenseObjects');
                        //     for (var i = 0; i < $scope.view.expenseList.length; i++) {
                        //         $scope.view.expenseReportList.push($scope.view.expenseList[i]);
                        //         $scope.view.expenseNextStep.invoiceOIDs.push($scope.view.expenseList[i].invoiceOID);
                        //     }
                        //     for (var i = 0; i < $scope.view.expenseReportList.length; i++) {
                        //         invoiceOIDs.push($scope.view.expenseReportList[i].invoiceOID);
                        //         $scope.view.expenseReportList[i].week = new Date($scope.view.expenseReportList[i].createdDate).getDay();
                        //         $scope.view.expenseReportList[i].formatDate = new Date($scope.view.expenseReportList[i].createdDate).Format('yyyy-MM-dd');
                        //     }
                        //     $scope.getSum(invoiceOIDs);
                        //     $scope.view.expenseReportList = $filter('orderBy')($scope.view.expenseReportList, 'formatDate', true);
                        // }
                        var invoiceOIDs = [];
                        //计算原有报销单中费用数量
                        if (data.expenseReportInvoices && data.expenseReportInvoices.length) {
                            $scope.view.invoiceNum = data.expenseReportInvoices.length;
                        }
                        for (var i = 0; i < (data.expenseReportInvoices && data.expenseReportInvoices.length); i++) {
                            var invoiceOID = data.expenseReportInvoices[i].invoiceOID;
                            invoiceOIDs.push(invoiceOID);
                        }


                        if (localStorageService.get('expenseObjects')) {
                            $scope.view.expenseList = localStorageService.get('expenseObjects');
                            Array.prototype.push.apply(invoiceOIDs, $scope.view.expenseList);
                        }

                        $scope.view.expenseNextStep.invoiceOIDs = invoiceOIDs;
                        $scope.selectedInvoiceOids = invoiceOIDs;
                        //报销单明细里的费用OID列表
                        $scope.getSum(invoiceOIDs);
                        //$scope.view.expenseReportList = $filter('orderBy')($scope.view.expenseReportList, 'formatDate', true);
                        $scope.pagenation.total = invoiceOIDs.length;
                        if ($scope.pagenation.total > 0) {
                            $scope.pagenation.maxPage = Math.ceil(invoiceOIDs.length / $scope.pagenation.size) - 1;
                        }
                        $scope.view.nothing = invoiceOIDs.length > 0;
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
                    });
            }

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

            function init() {
                //报销单明细
                if ($scope.view.content == 'normal' || $scope.view.content == 'withdraw') {
                    if ($state.params.expenseReportOID) {
                        $scope.view.expenseReportList = [];
                        getExpenseDetail($state.params.expenseReportOID);
                    }

                }
                if ($scope.view.content == 'approval_reject' || $scope.view.content == 'audit_reject') {
                    $scope.view.canDelete = true;
                    if ($state.params.expenseReportOID) {
                        $scope.view.expenseReportList = [];
                        getExpenseDetail($state.params.expenseReportOID);

                    }
                }
            }

            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                $scope.view.goBackStatus = true;
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if ((toState.name == 'app.tab_erv.expense_report'
                    && fromState.name == 'app.tab_erv_expense_normal') ||
                    (toState.name == 'app.tab_erv.expense_report'
                    && fromState.name == 'app.tab_erv_expense_withdraw') ||
                    (toState.name == 'app.tab_erv.expense_report'
                    && fromState.name == 'app.tab_erv_expense_approval_reject') ||
                    (toState.name == 'app.tab_erv.expense_report'
                    && fromState.name == 'app.tab_erv_expense_audit_reject') ||
                    (toState.name == 'app.tab_erv.expense_report'
                    && fromState.name == 'app.tab_erv_expense_receipt_reject')) {
                    if (localStorageService.get('expenseObjects')) {
                        localStorageService.remove('expenseObjects');
                    }
                    if (localStorageService.get('deleteInvoiceList')) {
                        localStorageService.remove('deleteInvoiceList');
                    }
                } else if ((toState.name == 'app.tab_erv_expense_consume_init'
                    && fromState.name == 'app.tab_erv_expense_normal') ||
                    (toState.name == 'app.tab_erv_expense_consume_init'
                    && fromState.name == 'app.tab_erv_expense_withdraw')) {
                    if ($scope.view.goBackStatus) {
                        ExpenseReportService.setTab('1001');
                        $state.go('app.tab_erv.expense_report');
                    }
                }
            });

        }]);
