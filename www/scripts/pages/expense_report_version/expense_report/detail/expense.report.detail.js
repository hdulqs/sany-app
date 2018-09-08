'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        /*员工提交，经理审批中*/
        $stateProvider.state('app.tab_erv_expense_detail_submit', {
                url: '/expense/detail/submit/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/expense.report.detail.html',
                        controller: 'com.handchina.huilianyi.ErvExpenseDetail'
                    }
                },
            resolve: {
                content: function () {
                    return 'submit';
                },
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('expense_report');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
            })
            /*经理审批通过，员工报销单列表中查看，审批通过*/
            .state('app.tab_erv_expense_detail_passed', {
                url: '/expense/detail/passed/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/expense.report.detail.html',
                        controller: 'com.handchina.huilianyi.ErvExpenseDetail'
                    }
                },
                params: {
                    message: null
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            /*财务审核通过， 员工在报销单列表中查看的审核通过，状态：已通过*/
            .state('app.tab_erv_expense_detail_audit_passed', {
                url: '/expense/detail/audit/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/expense.report.detail.html',
                        controller: 'com.handchina.huilianyi.ErvExpenseDetail'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            /*财务已经付款， 员工在报销单列表中查看的已付款状态，状态：已付款*/
            .state('app.tab_erv_expense_detail_finance_loaned', {
                url: '/expense/detail/finance/:expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/expense.report.detail.html',
                        controller: 'com.handchina.huilianyi.ErvExpenseDetail'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.ErvExpenseDetail', ['$scope', 'ParseLinks', 'ExpenseService', '$state', '$ionicPopup', 'content', 'ExpenseReportService', '$ionicLoading', 'CurrencyCodeService', '$stateParams',
        'FunctionProfileService', 'TravelERVService', 'SelfDefineExpenseReport', 'CostCenterService', 'CorporationEntityService', 'CompanyConfigurationService', 'CustomValueService', 'CompanyService', '$filter',
        'AgencyService', '$sessionStorage','$ionicModal',
        function ($scope, ParseLinks, ExpenseService, $state, $ionicPopup, content, ExpenseReportService, $ionicLoading, CurrencyCodeService, $stateParams, FunctionProfileService, TravelERVService, SelfDefineExpenseReport,
                  CostCenterService, CorporationEntityService, CompanyConfigurationService, CustomValueService, CompanyService, $filter, AgencyService, $sessionStorage,$ionicModal) {

            var function_profile_for_check_standard = false;
            FunctionProfileService.getFuntionProfileJustCheckStandard()
                .then(function (data) {
                    if (data == "true" || data == true) {
                        function_profile_for_check_standard = true;
                    }
                });
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/modal/expense.check.budget.html',{
                scope:$scope,
                animation:'none'
            }).then(function (modal) {
                $scope.expenseCheckBudgetModal=modal;

            });
            $scope.view = {
                notFoundIcon: 'img/error-icon/not-found.png',
                isNotFound: false,
                notFoundText: $filter('translate')('expense.The.expense.account.has.been.deleted'),
                language: $sessionStorage.lang,//获取当前环境语言
                //固定字段
                isBaseMessageKey: function (field) {
                    // if(field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'title' || field.messageKey === 'start_date' || field.messageKey === 'remark' ||
                    //     field.messageKey === 'select_participant' || field.messageKey === 'end_date' || field.messageKey === 'currency_code' || field.messageKey === 'budget_detail' || field.messageKey === 'average_budget' ||
                    //     field.messageKey === 'select_cost_center' || field.messageKey === 'select_department' || field.messageKey === 'select_approver' || field.messageKey === 'select_corporation_entity' ||
                    //     field.messageKey === 'linkage_switch'){
                    //     return true;
                    // } else {
                    //     return false;
                    // }

                    if(field.messageKey === 'title' || field.messageKey === 'select_department'){
                        return true;
                    } else {
                        return false;
                    }
                },
                //fieldValue 不能直接拿来用的,需要转换
                isNotNativeFieldValue: function (field) {
                    if(field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'select_cost_center' ||
                        field.messageKey === 'select_approver' ||field.messageKey === 'select_corporation_entity' || field.messageKey === 'linkage_switch'
                        || field.messageKey === 'cust_list' || field.messageKey === 'select_user' || field.messageKey === 'contact_bank_account'){
                        return true
                    } else {
                        return false
                    }
                },
                //获取成本中心名字
                getCostCenterName: function(index){
                    var indexCostCenter = index;
                    var json = JSON.parse($scope.views.expenseDetails.custFormValues[indexCostCenter].dataSource);
                    $scope.views.expenseDetails.custFormValues[indexCostCenter].costCenterOID = json.costCenterOID;
                    if($scope.views.expenseDetails.custFormValues[indexCostCenter].value){
                        CostCenterService.getCostCenterItemDetail($scope.views.expenseDetails.custFormValues[indexCostCenter].value)
                            .success(function(data){
                                $scope.views.expenseDetails.custFormValues[indexCostCenter].costCenterName = data.name;
                            })
                            .error(function(){
                                $scope.views.expenseDetails.custFormValues[indexCostCenter].costCenterName = null;
                            })
                    } else{
                        $scope.views.expenseDetails.custFormValues[indexCostCenter].costCenterName = null;
                    }
                },
                //获取部门
                getDepartmentName: function(index){
                    SelfDefineExpenseReport.getDepartmentInfo($scope.views.expenseDetails.custFormValues[index].value)
                        .success(function(data){
                            if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                $scope.views.expenseDetails.custFormValues[index].departmentName = data.name;
                            } else {
                                $scope.views.expenseDetails.custFormValues[index].departmentName = data.path;
                            }
                        })
                },
                //获取已选择审批人的名字
                getSelectedApproval: function (index) {
                    var uerOID = [];
                    if ($scope.views.expenseDetails.custFormValues[index].value !== null && $scope.views.expenseDetails.custFormValues[index].value !== '') {
                        uerOID = $scope.views.expenseDetails.custFormValues[index].value.split(":");
                        $scope.views.expenseDetails.custFormValues[index].approvalSelectedName = '';
                        if (uerOID.length > 0) {
                            $scope.views.expenseDetails.custFormValues[index].memberList = [uerOID.length];
                            TravelERVService.getBatchUsers(uerOID)
                                .success(function (data) {
                                    var num = 0;
                                    for (; num < data.length; num++) {
                                        for (var j = 0; j < uerOID.length; j++) {
                                            if (uerOID[j] === data[num].userOID) {
                                                $scope.views.expenseDetails.custFormValues[index].memberList[j] = data[num];
                                            }
                                        }
                                    }
                                    if (num === data.length) {
                                        for (var i = 0; i < $scope.views.expenseDetails.custFormValues[index].memberList.length; i++) {
                                            if (i !== ($scope.views.expenseDetails.custFormValues[index].memberList.length - 1)) {
                                                $scope.views.expenseDetails.custFormValues[index].approvalSelectedName += $scope.views.expenseDetails.custFormValues[index].memberList[i].fullName + ','
                                            } else {
                                                $scope.views.expenseDetails.custFormValues[index].approvalSelectedName += $scope.views.expenseDetails.custFormValues[index].memberList[i].fullName;
                                            }
                                        }
                                    }
                                })
                        } else {
                            $scope.views.expenseDetails.custFormValues[index].memberList = [];
                            $scope.views.expenseDetails.custFormValues[index].approvalSelectedName = '';
                        }

                    } else {
                        $scope.views.expenseDetails.custFormValues[index].approvalSelectedName = '';
                    }
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if($scope.views.expenseDetails.custFormValues[index].value && $scope.views.expenseDetails.custFormValues[index].messageKey === 'select_corporation_entity'){
                        CorporationEntityService.getCorporationEntityDetail($scope.views.expenseDetails.custFormValues[index].value)
                            .success(function (data) {
                                $scope.views.expenseDetails.custFormValues[index].entityName = data.companyName;
                            })
                    }
                },
                //获取值列表名字
                getValueName: function (index) {
                    CustomValueService.getMessageKey($scope.views.expenseDetails.custFormValues[index].customEnumerationOID, $scope.views.expenseDetails.custFormValues[index].value)
                        .then(function (data) {
                            $scope.views.expenseDetails.custFormValues[index].valueKey = data;
                        })
                },
                //银行卡
                getContactBankAccountName: function (index) {
                    if($scope.views.expenseDetails.custFormValues[index].value){
                        CompanyService.getBankAccountDetail($scope.views.expenseDetails.custFormValues[index].value)
                            .success(function (data) {
                                $scope.views.expenseDetails.custFormValues[index].bankAccountNo = data.bankAccountNo;
                            })
                    }
                },
                showRefund:function(){
                    $state.go('app.didi_refund_base',{
                        applicationOID:$scope.views.expenseDetails.loanApplicationOID,
                        formType:2005,
                        refundStatus:true
                    });

                },
                openBudgetModal:function () {
                    $scope.expenseCheckBudgetModal.show();
                },
            };
            $scope.views = {
                showHaveBillStatus: true,
                showNoBillStatus: true,
                expenseItemList: [],
                invoiceOidContainerWithoutReceiptList:[],
                invoiceOidContainerWithReceiptList:[],
                withReceiptList: [],
                withoutReceiptList: [],
                approvalHistory: [],
                content: content,
                expandDetail: true,
                splitName: null,
                page: {
                    current: 0,
                    size: 10,
                    links: null
                },
                nothing: false,
                printStatus: false,
                recallStatus: false,
                openLoading: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    })
                },
                expandExpenseDetail: function () {
                    $scope.views.expandDetail = !$scope.views.expandDetail;
                },

                changeMode: function (mode) {
                    if (mode === 'list') {
                        $('.tab-mode-second').removeClass('active');
                        if (!$('.tab-mode-first').hasClass('active')) {
                            $('.tab-mode-first').addClass('active');
                        }
                    } else if (mode === 'map') {
                        $('.tab-mode-first').removeClass('active');
                        if (!$('.tab-mode-second').hasClass('active')) {
                            $('.tab-mode-second').addClass('active');
                        }
                    }
                },
                showLoading: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                }


            };
            //撤回
            $scope.recall = function () {
                $scope.views.showLoading();
                var expense = {
                    entities: [
                        {
                            entityOID: '',
                            entityType: 1002
                        }
                    ]
                };
                for (var i = 0; i < expense.entities.length; i++) {
                    expense.entities[i].entityOID = $state.params.expenseReportOID;
                }
                ExpenseReportService.recallExpenseReport(expense)
                    .success(function (data) {
                        $ionicLoading.hide();
                        if(data.failNum > 0){
                            if(data.failReason[$state.params.expenseReportOID] === 'releaseBudget'){
                                $scope.views.openLoading($filter('translate')('expense.Release.the.budget.withdraw.the.failure'));
                            } else {
                                $scope.views.openLoading($filter('translate')('expense.Make.a.mistake'));
                            }
                        } else {
                            ExpenseReportService.setTab('1002');
                            $scope.views.openLoading($filter('translate')('expense.Withdraw.the.success'));
                            $state.go('app.tab_erv.expense_report');
                        }

                    })
                    .error(function () {
                        $ionicLoading.hide();
                    });

            };
            //是否显示发票详情
            $scope.showBillDetail = function (data) {
                if (data == 'hasBill') {
                    $scope.views.showHaveBillStatus = !$scope.views.showHaveBillStatus;
                } else if (data == 'noBill') {
                    $scope.views.showNoBillStatus = !$scope.views.showNoBillStatus;
                }
            };
            //跳转到消费详情
            $scope.showExpenseConsumeDetail = function (expense) {
                $state.go('app.tab_erv_expense_consume_submit', {
                    expense: expense.invoiceOID,
                    expenseReportOID: $state.params.expenseReportOID

                })
            };
            $scope.printExpense = function () {
                if ($scope.views.expenseDetails.children) {
                    $scope.views.expenseDetails.children.forEach(function (item) {
                        if (item.status === 1003 && item.printable) {
                            print(item.expenseReportOID);
                        }
                    })
                } else {
                    print($state.params.expenseReportOID);
                }
            };
            function print(expenseReportOID) {
                ExpenseReportService.printExpense(expenseReportOID)
                    .success(function (data) {
                        if (data) {
                            window.open(data.fileURL, '_system');
                        } else {
                            // 出错了,请联系汇联易客服
                            $scope.views.openLoading($filter('translate')('expense.printError'));
                        }
                    });
            }
            function init() {
                if ($state.params.expenseReportOID) {
                    CompanyConfigurationService.getCompanyConfiguration()
                        .then(function (data) {
                            //获取公司本位币
                            $scope.view.originCurrencyCode=data.currencyCode;
                            $scope.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                            ExpenseReportService.getExpenseReportDetail($state.params.expenseReportOID)
                                .success(function (data) {
                                    if ($scope.views.content == 'passed') {
                                        if ($state.params.message == 'approval') {
                                            $scope.views.printStatus = false;
                                        }
                                    }
                                    $scope.views.expenseDetails = data;
                                    //错误头部信息显示
                                    /*之所以写这句话 是为了兼容modal  乐雨写死了 我这边只能跟着写死 时间*/
                                    $scope.errorColor = false;
                                    $scope.view.reportData = {};
                                    $scope.view.reportData.lastModifiedDate =data.lastModifiedDate;
                                    $scope.budgetError=[];
                                    if(data.warnning){
                                        var warning=JSON.parse(data.warnning);
                                        $scope.budgetError.push({
                                            externalPropertyName:warning.externalPropertyName,
                                            message:warning.message
                                        });
                                        $scope.budgetError.forEach(function (item) {
                                            item.errorMsg=[];
                                            if(item.message){
                                                item.errorMsg = item.message.split(",").map(function(item, index) {
                                                    return {id: index, msg: item}
                                                })
                                            }
                                            //error框背景颜色显示
                                            if(item.externalPropertyName =='1001' || item.externalPropertyName =='1003' || item.externalPropertyName =='1004' || item.externalPropertyName =='2001'){
                                                $scope.errorColor = true;
                                            }
                                        });
                                    }

                                        //console.log($scope.views.expenseDetails)
                                        //console.log($scope.views.expenseDetails.currencyCode)


                                    if($scope.views.expenseDetails.formOID !== null && $scope.views.expenseDetails.formOID !== ''){
                                        if ($scope.views.expenseDetails.custFormValues && $scope.views.expenseDetails.custFormValues.length > 0) {
                                            for (var i = 0; i < $scope.views.expenseDetails.custFormValues.length; i++) {
                                                // 申请人
                                                var formValue = $scope.views.expenseDetails.custFormValues[i];
                                                if (formValue.messageKey === 'applicant') {
                                                    formValue.applicantName = $scope.views.expenseDetails.applicantName;
                                                }
                                                //值列表
                                                if($scope.views.expenseDetails.custFormValues[i].fieldType === 'CUSTOM_ENUMERATION' || $scope.views.expenseDetails.custFormValues[i].messageKey === 'cust_list'){
                                                    if($scope.views.expenseDetails.custFormValues[i].dataSource && JSON.parse($scope.views.expenseDetails.custFormValues[i].dataSource)){
                                                        var json = JSON.parse($scope.views.expenseDetails.custFormValues[i].dataSource);
                                                        $scope.views.expenseDetails.custFormValues[i].customEnumerationOID = json.customEnumerationOID;
                                                    } else {
                                                        $scope.views.expenseDetails.custFormValues[i].customEnumerationOID = null;
                                                    }
                                                    if($scope.views.expenseDetails.custFormValues[i].value){
                                                        $scope.view.getValueName(i);
                                                    }
                                                }
                                                if ($scope.views.expenseDetails.custFormValues[i].messageKey === 'writeoff_flag') {
                                                    var indexWrite = i;
                                                    if ($scope.views.expenseDetails.custFormValues[indexWrite].value === 'true') {
                                                        $scope.views.expenseDetails.custFormValues[indexWrite].value = true;
                                                    } else {
                                                        $scope.views.expenseDetails.custFormValues[indexWrite].value = false;
                                                    }
                                                }
                                                //成本中心项目名字获取
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'select_cost_center'){
                                                    $scope.view.getCostCenterName(i);
                                                }
                                                //部门名称获取
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'select_department'){
                                                    $scope.view.getDepartmentName(i);
                                                }
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'select_approver'){
                                                    $scope.view.getSelectedApproval(i);
                                                }
                                                if ($scope.views.expenseDetails.custFormValues[i].messageKey === 'select_user') {
                                                    $scope.view.getSelectedApproval(i);
                                                }
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'currency_code'){
                                                    var currencyIndex = i;
                                                    $scope.code = CurrencyCodeService.getCurrencySymbol($scope.views.expenseDetails.custFormValues[currencyIndex].value);
                                                }
                                                //法人实体
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'select_corporation_entity'){
                                                    $scope.view.getCorporationEntityName(i);
                                                }
                                                //联动开关
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'linkage_switch'){
                                                    if($scope.views.expenseDetails.custFormValues[i].value === 'true'){
                                                        $scope.views.expenseDetails.custFormValues[i].value = true;
                                                    } else {
                                                        $scope.views.expenseDetails.custFormValues[i].value = false;
                                                    }
                                                    if($scope.views.expenseDetails.custFormValues[i].fieldContent && JSON.parse($scope.views.expenseDetails.custFormValues[i].fieldContent)){
                                                        $scope.views.expenseDetails.custFormValues[i].content = JSON.parse($scope.views.expenseDetails.custFormValues[i].fieldContent);
                                                    } else {
                                                        $scope.views.expenseDetails.custFormValues[i].content = [];
                                                    }
                                                }
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'select_box') {
                                                    //选择框
                                                    $scope.views.expenseDetails.custFormValues[i].selectValue = JSON.parse($scope.views.expenseDetails.custFormValues[i].value);
                                                }
                                                if($scope.views.expenseDetails.custFormValues[i].messageKey === 'contact_bank_account'){
                                                    //银行卡
                                                    $scope.views.expenseDetails.custFormValues[i].bankAccountNo = null;
                                                    $scope.view.getContactBankAccountName(i);
                                                }
                                            }
                                        }
                                    }
                                    if($scope.views.expenseDetails.formName){

                                    } else {
                                        $scope.views.expenseDetails.formName =$filter('translate')('expense.Expense.account.details');
                                    }
                                    if (data.approvalHistoryDTOs) {
                                        data.approvalHistoryDTOs.forEach(function (item) {
                                            $scope.views.approvalHistory.push(item);
                                        })
                                    }
                                    $scope.views.currencyCode = data.currencyCode;
                                    $scope.views.symbol = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                                    if (data.children && data.children.length > 0) {
                                        var expenseStatus = [];
                                        for (var j = 0; j < data.children.length; j++) {
                                            /**
                                             * 判断报销单是否可打印，审核通过和审批通过都可以看到，当用户设置profile，可以控制打印按钮是否显示
                                             * app.expense.report.print.passed.disabled(审批通过)
                                             * app.report.expense.print.audit.disabled(审核通过)
                                             */
                                            if ((data.children[j].statusView === 1003 &&
                                                !$scope.view.functionProfileList['app.expense.report.print.passed.disabled']) ||
                                                (data.children[j].statusView === 1004 &&
                                                !$scope.view.functionProfileList['app.report.expense.print.audit.disabled'])) {

                                                expenseStatus.push(data.children[j].printable);
                                            } else {
                                                expenseStatus.push(false);
                                            }
                                            //根据报销单是否可打印来筛选报销单状态
                                            //贴票金额不显示开票通过
                                            //供应商不显示审核通过
                                            if (data.children[j].printable) {
                                                if (data.children[j].approvalHistoryDTOs) {
                                                    data.children[j].approvalHistoryDTOs.forEach(function (history) {
                                                        history.splitName = data.children[j].splitName;
                                                        history.baseCurrencyRealPayAmount = data.children[j].baseCurrencyRealPayAmount;
                                                        if (history.operation >= 3001) {
                                                            if (history.operation !== 4011) {
                                                                $scope.views.approvalHistory.push(history);
                                                            }
                                                        }
                                                    })
                                                }
                                            } else {
                                                if (data.children[j].approvalHistoryDTOs) {
                                                    data.children[j].approvalHistoryDTOs.forEach(function (history) {
                                                        history.splitName = data.children[j].splitName;
                                                        history.baseCurrencyRealPayAmount = data.children[j].baseCurrencyRealPayAmount
                                                        if (history.operation >= 3001) {
                                                            if (history.operation !== 3001) {
                                                                $scope.views.approvalHistory.push(history);
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                        }
                                        $scope.views.printStatus = expenseStatus.indexOf(true) > -1;
                                    } else {
                                        /**
                                         * 判断报销单是否可打印，审核通过和审批通过都可以看到，当用户设置profile，可以控制打印按钮是否显示
                                         * app.expense.report.print.passed.disabled(审批通过)
                                         * app.report.expense.print.audit.disabled(审核通过)
                                         */
                                        if ((data.statusView === 1003 &&
                                            !$scope.view.functionProfileList['app.expense.report.print.passed.disabled']) ||
                                            (data.statusView === 1004 &&
                                            !$scope.view.functionProfileList['app.report.expense.print.audit.disabled']) ) {

                                            $scope.views.printStatus = data.printable;
                                        } else {
                                            $scope.views.printStatus = false;
                                        }
                                        for (var i = 0; i < (data.expenseReportInvoices && data.expenseReportInvoices.length); i++) {
                                            //收集invoiceOID,请求费用差标结果/api/travel/standard/results?invoiceOIDs=xxx&invoiceOIDs=xxx
                                            //因为页面渲染的时候,是分为贴票与不贴票显示的,所以,这个也需要分开收集,到时候请求结果可以一一对应;
                                            if (data.expenseReportInvoices[i].invoiceView) {
                                                if (!data.expenseReportInvoices[i].invoiceView.withReceipt) {
                                                    $scope.views.withoutReceiptList.push(data.expenseReportInvoices[i].invoiceView)
                                                    $scope.views.invoiceOidContainerWithoutReceiptList.push(data.expenseReportInvoices[i].invoiceOID);

                                                } else {
                                                    $scope.views.withReceiptList.push(data.expenseReportInvoices[i].invoiceView)
                                                    $scope.views.invoiceOidContainerWithReceiptList.push(data.expenseReportInvoices[i].invoiceOID);
                                                }
                                            }
                                        }

                                        //请求差标结果
                                        if(function_profile_for_check_standard){
                                            $scope.getFeeStandardResult($scope.views.invoiceOidContainerWithoutReceiptList,$scope.views.invoiceOidContainerWithReceiptList);
                                        }




                                    }
                                    for (var k = 0; k < ( $scope.views.approvalHistory && $scope.views.approvalHistory.length); k++) {
                                        if ($scope.views.approvalHistory[k].remark) {
                                            $scope.views.approvalHistory[k].remarks = angular.fromJson($scope.views.approvalHistory[k].remark);
                                            $scope.views.approvalHistory[k].remarks.value = [];
                                            for (var key in $scope.views.approvalHistory[k].remarks.rejectTypeAmountMap) {
                                                var rejectTypes = {
                                                    key: '',
                                                    amount: 0
                                                };
                                                rejectTypes.key = key;
                                                rejectTypes.amount = $scope.views.approvalHistory[k].remarks.rejectTypeAmountMap[key];
                                                $scope.views.approvalHistory[k].remarks.value.push(rejectTypes)
                                            }
                                        }
                                    }
                                })
                                .error(function (data) {
                                    if (data.errorCode === 'OBJECT_NOT_FOUND') {
                                        $scope.view.isNotFound = true;
                                    }
                                })
                        });
                }
                if ($scope.views.content == 'submit') {
                    $scope.views.recallStatus = true;
                }
            }

            init();
            //OIDs要拼接一个url,类似get请求后面的参数

            function getFeeOIDs(feeOids) {
                var string = '';
                for (var i = 0; i < feeOids.length; i++) {
                    string += 'invoiceOIDs=';
                    string += feeOids[i];
                    if (i < feeOids.length - 1) {
                        string += '&';
                    }
                }
                return string;
            }

            /*
             * param1:费用的本身的数组,$scope.view.expenseReportList
             * param2:检测结果,data
             * 根据这个检测结果,通过比对OIDs,给相应的费用添加拒绝或者提醒字段
             * 在显示费用的指令里面,通过这个字段,显示相应的样式
             * */
            function withoutReceiptListSetRejectOrWarn(standardResult){
                if(standardResult.length===0){
                    return false;
                }
                var r_len=standardResult.length;
                var o_len=$scope.views.withoutReceiptList.length;
                for(var i=0;i<r_len;i++){
                    for(var j=0;j<o_len;j++){
                        if(standardResult[i].invoiceOID===$scope.views.withoutReceiptList[j].invoiceOID){
                            if(standardResult[i].actionType==="REJECT"){
                                $scope.views.withoutReceiptList[j].reject=true;
                                $scope.views.withoutReceiptList[j].rejectMesage=standardResult[i].message;

                            }else if(standardResult[i].actionType==="WARNING"){
                                $scope.views.withoutReceiptList[j].warning=true;
                                $scope.views.withoutReceiptList[j].warningMesage=standardResult[i].message;

                            }else if(standardResult[i].actionType==="OK"){
                                $scope.views.withoutReceiptList[j].warning=false;
                                $scope.views.withoutReceiptList[j].warning=false;

                            }
                        }
                    }
                }
            }
            function withReceiptListSetRejectOrWarn(standardResult){
                if(standardResult.length===0){
                    return false;
                }
                var r_len=standardResult.length;
                var o_len=$scope.views.withReceiptList.length;
                for(var i=0;i<r_len;i++){
                    for(var j=0;j<o_len;j++){
                        if(standardResult[i].invoiceOID===$scope.views.withReceiptList[j].invoiceOID){
                            if(standardResult[i].actionType==="REJECT"){
                                $scope.views.withReceiptList[j].reject=true;
                                $scope.views.withReceiptList[j].rejectMesage=standardResult[i].message;

                            }else if(standardResult[i].actionType==="WARNING"){
                                $scope.views.withReceiptList[j].warning=true;
                                $scope.views.withReceiptList[j].warningMesage=standardResult[i].message;

                            }else if(standardResult[i].actionType==="OK"){
                                $scope.views.withReceiptList[j].warning=false;
                                $scope.views.withReceiptList[j].warning=false;
                            }
                        }
                    }
                }
            }
            $scope.getFeeStandardResult = function (withoutReceiptList,withReceiptList) {
                if(withoutReceiptList.length>0){
                    var w_out_data = getFeeOIDs(withoutReceiptList);
                    ExpenseReportService.getCheckStandardResult(w_out_data)
                        .success(function (data) {
                            withoutReceiptListSetRejectOrWarn(data)
                        })
                }
                if(withReceiptList.length>0){
                    var w_data = getFeeOIDs(withReceiptList);
                    ExpenseReportService.getCheckStandardResult(w_data)
                        .success(function (data) {
                            withReceiptListSetRejectOrWarn(data)
                        })
                }

            }
            //货币
            $scope.getCashName = function (currencyCode) {
                if (currencyCode !== null && currencyCode !== '') {
                    return CurrencyCodeService.getCashName(currencyCode)
                } else {
                    return null;
                }
            }
            $scope.$on('$ionicView.beforeEnter', function (event, ViewData) {
                ViewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;
                });
            })
        }])
;
