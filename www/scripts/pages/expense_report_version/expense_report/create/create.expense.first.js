/**
 * Created by Administrator on 2016/8/10.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab_erv_create_expense_first', {
                url: '/create/expense/first/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.first.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseFirstController'
                    }
                },
                params: {
                    expense: null,
                    message: null
                },
                resolve: {
                    content: function () {
                        return "create_first";
                    }
                },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('expense_report');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
            })
            .state('app.tab_erv_create_relative_expense_first', {
                url: '/create/relative/expense/first/:expenseReportOID/:applicationOID/:invoiceOID',
                cache: false,
                params: {
                    message: null,
                    expense: null
                },
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/expense_report/create/create.expense.first.html',
                        'controller': 'com.handchina.huilianyi.ErvCreateExpenseFirstController'
                    }
                },
                resolve: {
                    content: function () {
                        return "create_relative_first";
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            });

    }])
    .controller('com.handchina.huilianyi.ErvCreateExpenseFirstController', ['$scope', 'CompanyConfigurationService',
        'localStorageService', 'ExpenseReportService', 'content', 'Principal', '$ionicModal', '$state', 'CurrencyCodeService',
        'TravelERVService', '$ionicPopover', '$q', '$ionicLoading', 'InvoiceApplyERVService', '$timeout', 'CostCenterService',
        'PublicFunction', 'FunctionProfileService', 'FUNCTION_PROFILE','$filter',
        function ($scope, CompanyConfigurationService, localStorageService,
                  ExpenseReportService, content, Principal, $ionicModal, $state,
                  CurrencyCodeService, TravelERVService, $ionicPopover, $q,
                  $ionicLoading, InvoiceApplyERVService, $timeout,
                  CostCenterService, PublicFunction, FunctionProfileService, FUNCTION_PROFILE,$filter) {
            $scope.view = {
                approvalTitle:$filter('translate')('expense.The.approver'),
                content: content,
                isReadOnly: false,
                showMore: false,
                relateStatus: false,
                isReEditInvoice: false,
                isShowApproval: false,
                //判断是否只选择叶子节点的function profile key
                leafDepSelectorRequired: FUNCTION_PROFILE['leafDepSelectorRequired'],
                expenseFirstStep: {
                    expenseReportOID: '',
                    cash: CurrencyCodeService.getCashName(localStorageService.get('company.configuration').data.currencyCode),
                    code: localStorageService.get('company.configuration').data.currencyCode,
                    codeSymbol: CurrencyCodeService.getCurrencySymbol('CNY'),
                    remark: null,
                    cashCategoryList: localStorageService.get('cashList') ? localStorageService.get('cashList') : [],
                    departmentOID: null,
                    departmentName: null,
                    costCenterItemOID: null,
                    writeoffAmount: 0,
                    writeoffFlag: false,
                    approverOIDs: null,
                    type: 1001,
                    isFromNext: false,
                    expenseReportInvoices: [],
                    approvalSelectedName: ''

                },
                costName: null,
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
                depConfigurationStatus: false,
                costConfigurationStatus: false,
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                showLoading: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                },
                validateData: function () {
                    var deferred = $q.defer();
                    if ($scope.view.isShowApproval && !$scope.view.expenseFirstStep.approverOIDs && $scope.view.showArrow) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Please.select.the.approver'));
                        deferred.reject(false);
                    } else if (!$scope.view.expenseFirstStep.departmentOID && ((!$scope.view.functionProfileList && $scope.view.showArrow&&$scope.view.depConfigurationStatus) || !$scope.view.functionProfileList['er.department.selection.disabled'])) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Please.select.a.department'));
                        deferred.reject(false);
                    } else if (!$scope.view.expenseFirstStep.costCenterItemOID && ((!$scope.view.functionProfileList && $scope.view.showArrow&&view.costConfigurationStatus) || !$scope.view.functionProfileList['er.costCenter.selection.disabled'])) {
                        $scope.view.hasCostCenter?$scope.view.openWarningPopup($filter('translate')('expense.Please.select') + $scope.view.costName):$scope.view.openWarningPopup($filter('translate')('expense.Cost.center.is.not.configured'));
                        deferred.reject(false);
                    } else if ($scope.view.expenseFirstStep.remark && $scope.view.expenseFirstStep.remark.length >= 200) {
                        PublicFunction.showToast($filter('translate')('expense.Note.please.enter.less.than.200.characters'));
                        deferred.reject(false);
                    }
                    else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                }

            };

            // init modal
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/expense_report/create/select.cash.category.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            //打开货币Modal
            $scope.selectCashCategory = function () {
                $scope.modal.show();
            };
            //选择货币
            $scope.selectCash = function (data) {
                $scope.modal.hide();
                $scope.view.expenseFirstStep.cash = data;
                for (var i = 0; i < $scope.view.expenseFirstStep.cashCategoryList.length; i++) {
                    if (data == $scope.view.expenseFirstStep.cashCategoryList[i].name) {
                        $scope.view.expenseFirstStep.code = $scope.view.expenseFirstStep.cashCategoryList[i].code;
                        //$scope.view.expenseFirstStep.codeSymbol = $scope.view.expenseFirstStep.cashCategoryList[i].codeSymbol;
                    }
                }
            };
            //保存报销单
            $scope.saveExpense = function () {
                ExpenseReportService.setTab('1001');
                $scope.view.validateData().then(function () {
                    $scope.view.showLoading();
                    $scope.view.expense.expenseReportOID = $scope.view.expenseFirstStep.expenseReportOID ? $scope.view.expenseFirstStep.expenseReportOID : "";
                    $scope.view.expense.currencyCode = $scope.view.expenseFirstStep.code;
                    if ($scope.view.expenseFirstStep.departmentOID) {
                        $scope.view.expense.departmentOID = $scope.view.expenseFirstStep.departmentOID ? $scope.view.expenseFirstStep.departmentOID : $scope.view.expenseFirstStep.departmentOID.departmentOID;
                    }
                    $scope.view.expense.costCenterItemOID = $scope.view.expenseFirstStep.costCenterItemOID;
                    $scope.view.expense.remark = $scope.view.expenseFirstStep.remark;
                    $scope.view.expense.writeoffFlag = $scope.view.expenseFirstStep.writeoffFlag;
                    $scope.view.expense.approverOIDs = $scope.view.expenseFirstStep.approverOIDs;
                    $scope.view.expense.expenseReportInvoices = $scope.view.expenseFirstStep.expenseReportInvoices ? $scope.view.expenseFirstStep.expenseReportInvoices : [];
                    $scope.view.expense.type = $scope.view.expenseFirstStep.type;
                    $scope.view.expense.applicationOID = $scope.view.expenseFirstStep.applicationOID;
                    ExpenseReportService.saveExpenseReport($scope.view.expense)
                        .success(function (data) {
                            $timeout(function () {
                                if ($scope.view.content == 'create_first') {
                                    $state.go('app.tab_erv_create_expense_second', {
                                        expenseReportOID: data.expenseReportOID
                                    });
                                } else if ($scope.view.content == 'create_relative_first') {
                                    $state.go('app.tab_erv_create_relative_expense_second', {
                                        expenseReportOID: data.expenseReportOID
                                    });
                                }
                            }, 500);
                        })
                        .error(function(error){
                            if(error.message){
                                $scope.view.openWarningPopup(error.message);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('create_expense.error'));
                            }
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        })
                });
                if ($scope.view.expenseFirstStep.costCenterItemOID) {
                    CostCenterService.logLastCostCenterItem($scope.view.expenseFirstStep.costCenterItemOID);
                }
            };
            //报销单明细
            function getExpenseDetail(expenseReportOID) {
                ExpenseReportService.getExpenseReportDetail(expenseReportOID)
                    .success(function (data) {
                        if (data.type === 1001) {
                            $scope.view.title = $filter('translate')('expense.Daily.expense.account');
                            $scope.view.isReEditInvoice = false;
                            $scope.view.showArrow = true;
                        } else if (data.type === 1002) {
                            $scope.view.isReEditInvoice = false;
                            $scope.view.showArrow = false;
                            $scope.view.title = $filter('translate')('expense.Travel.expense.account');
                        } else if (data.type === 1003) {
                            $scope.view.isReEditInvoice = false;
                            $scope.view.showArrow = false;
                            $scope.view.title = $filter('translate')('expense.Reimbursement.list');
                        }
                        $scope.view.expenseFirstStep.type = data.type;
                        $scope.view.expenseFirstStep.expenseReportOID = data.expenseReportOID;
                        $scope.view.expenseFirstStep.departmentOID = data.departmentOID;
                        $scope.view.expenseFirstStep.departmentName = data.departmentName;
                        $scope.view.expenseFirstStep.departmentPath = data.departmentPath;
                        $scope.view.expenseFirstStep.costCenterItemOID = data.costCenterItemOID;
                        $scope.view.expenseFirstStep.writeoffFlag = data.writeoffFlag;
                        $scope.view.expenseFirstStep.approverOIDs = data.approverOIDs;
                        $scope.view.expenseFirstStep.remark = data.remark;
                        $scope.view.expenseFirstStep.code = data.currencyCode;
                        $scope.view.expenseFirstStep.cash = CurrencyCodeService.getCashName(data.currencyCode);
                        $scope.view.expenseFirstStep.expenseReportInvoices = data.expenseReportInvoices;
                        if (data.expenseReportInvoices && data.expenseReportInvoices.length > 0) {
                            $scope.view.isReadOnly = true;
                        } else {
                            $scope.view.isReadOnly = false;
                        }
                        var userOID = [];
                        if (data.approverOIDs) {
                            userOID = data.approverOIDs.split(":");
                            $scope.view.expenseFirstStep.approvalSelectedName = '';
                            if (userOID.length > 0) {
                                $scope.memberList = [userOID.length];
                                TravelERVService.getBatchUsers(userOID)
                                    .success(function (data) {
                                        var num = 0;
                                        for (; num < data.length; num++) {
                                            for (var j = 0; j < userOID.length; j++) {
                                                if (userOID[j] === data[num].userOID) {
                                                    $scope.memberList[j] = data[num];
                                                }
                                            }
                                        }
                                        //$scope.memberList = data;
                                        if (num === data.length) {
                                            for (var i = 0; i < $scope.memberList.length; i++) {
                                                if (i !== ($scope.memberList.length - 1)) {
                                                    $scope.view.expenseFirstStep.approvalSelectedName += $scope.memberList[i].fullName + ','
                                                } else {
                                                    $scope.view.expenseFirstStep.approvalSelectedName += $scope.memberList[i].fullName;
                                                }
                                            }
                                        }

                                    })
                            } else {
                                $scope.memberList = [];
                                $scope.view.expenseFirstStep.approvalSelectedName = '';
                            }
                        } else {
                            $scope.view.expenseFirstStep.approvalSelectedName = '';
                        }
                    })
                    .error(function(error){
                        if(error.message){
                            $scope.view.openWarningPopup(error.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('create_expense.error'));
                        }
                    })
                    .error(function(error){
                        if(error.message){
                            $scope.view.openWarningPopup(error.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('create_expense.error'));
                        }
                    })
            }

            //获取差旅申请明细
            function getTravelDetail(applicationOID) {
                TravelERVService.getTravelDetail(applicationOID)
                    .success(function (data) {
                        $scope.view.expenseFirstStep.type = data.type;
                        $scope.view.expenseFirstStep.applicationOID = data.applicationOID;
                        $scope.view.expenseFirstStep.departmentOID = data.travelApplication.departmentOID;
                        $scope.view.expenseFirstStep.departmentName = data.travelApplication.departmentName;
                        $scope.view.expenseFirstStep.costCenterItemOID = data.travelApplication.costCenterItemOID;
                        $scope.view.expenseFirstStep.approverOIDs = data.travelApplication.approverOIDs;
                    })
                    .error(function(error){
                        if(error.message){
                            $scope.view.openWarningPopup(error.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('create_expense.error'));
                        }
                    })
            }

            //获取费用报销单明细
            function getInvoiceDetail(invoiceOID) {
                InvoiceApplyERVService.getInvoiceApplyDetail(invoiceOID)
                    .success(function (data) {
                        $scope.view.expenseFirstStep.type = data.status;
                        $scope.view.expenseFirstStep.applicationOID = data.applicationOID;
                        $scope.view.expenseFirstStep.departmentOID = data.expenseApplication.departmentOID;
                        $scope.view.expenseFirstStep.departmentName = data.expenseApplication.departmentName;
                        $scope.view.expenseFirstStep.costCenterItemOID = data.expenseApplication.costCenterItemOID;
                        $scope.view.expenseFirstStep.approverOIDs = data.expenseApplication.approverOIDs;
                    })
                    .error(function(error){
                        if(error.message){
                            $scope.view.openWarningPopup(error.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('create_expense.error'));
                        }
                    })
            }

            function init() {
                //根据公司配置显示部门或项目
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        $scope.view.depConfigurationStatus = data.configuration.ui.showDepartmentSelector.expenseReports;
                        $scope.view.costConfigurationStatus = data.configuration.ui.showCostCenterSelector.applications;
                        if ((!data.configuration.approvalRule && !data.configuration.approvalRule.approvalMode) || ((data.configuration.approvalRule) && (data.configuration.approvalRule.approvalMode) && data.configuration.approvalRule.approvalMode === 1003)) {
                            $scope.view.isShowApproval = true;
                            $scope.view.approvalMaxLength = data.configuration.approvalRule.maxApprovalChain;
                        } else {
                            $scope.view.isShowApproval = false;
                        }
                    });

                Principal.identity(true).then(function (data) {
                    $scope.view.expenseFirstStep.departmentOID = data.departmentOID;
                    $scope.view.expenseFirstStep.departmentPath = data.departmentName;
                });

                if ($state.params.expenseReportOID) {
                    getExpenseDetail($state.params.expenseReportOID);
                }
                //关联报销单第一步
                if ($scope.view.content == 'create_relative_first') {
                    $scope.view.isReEditInvoice = true;
                    $scope.view.showArrow = false;
                    //关联差旅
                    if ($state.params.applicationOID) {
                        $scope.view.title = $filter('translate')('expense.Travel.expense.account');
                        getTravelDetail($state.params.applicationOID);
                    }
                    //关联费用
                    if ($state.params.invoiceOID) {
                        $scope.view.title = $filter('translate')('expense.Reimbursement.list');
                        getInvoiceDetail($state.params.invoiceOID);
                    }
                } else if ($scope.view.content == 'create_first') {
                    $scope.view.title = $filter('translate')('expense.Daily.expense.account');
                    if ($state.params.message == 'create_second' ||
                        $state.params.message == 'normal' ||
                        $state.params.message == 'withdraw'||
                        $state.params.message == 'approval_reject' ||
                        $state.params.message == 'audit_reject') {
                        $scope.view.isReEditInvoice = false;
                        $scope.view.showArrow = true;
                        $scope.view.isReadOnly = true;
                    } else {
                        $scope.view.isReEditInvoice = true;
                        $scope.view.showArrow = true;
                    }
                }
            }

            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
                CostCenterService.getMyCostCenters().then(function (data) {
                    $scope.view.hasCostCenter = data.length>0 && data[0].costCenterItems.length>0;
                    $scope.view.costName = data.length>0?data[0].name:$filter('translate')('expense.Cost.center');
                });
            });

        }])
