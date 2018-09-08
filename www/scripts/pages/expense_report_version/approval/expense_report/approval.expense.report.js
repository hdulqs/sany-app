/**
 * Created by Yuko on 16/8/5.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_approval_expense_report_list', {
            url: '/erv/approval/expense/report/list?expenseReportOID',
            cache: false,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/approval/expense_report/approval.expense.report.tpl.html',
                    'controller': 'com.handchina.huilianyi.ErvApprovalExpenseReportListController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('approval');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvApprovalExpenseReportListController', ['$scope', 'ApprovalERVService', 'ParseLinks', '$state', '$stateParams', 'ExpenseReportService', '$ionicPopup', '$ionicLoading', '$ionicModal', '$ionicHistory',
        'CurrencyCodeService', '$timeout', 'FunctionProfileService', 'SelfDefineExpenseReport', 'TravelERVService', 'CostCenterService', 'CorporationEntityService', 'CompanyConfigurationService', 'CustomValueService', 'CompanyService', '$filter',
        'AgencyService', '$sessionStorage',
        function ($scope, ApprovalERVService, ParseLinks, $state, $stateParams, ExpenseReportService, $ionicPopup, $ionicLoading, $ionicModal, $ionicHistory, CurrencyCodeService,
                  $timeout, FunctionProfileService, SelfDefineExpenseReport, TravelERVService, CostCenterService,
                  CorporationEntityService, CompanyConfigurationService, CustomValueService, CompanyService, $filter, AgencyService, $sessionStorage) {

            var function_profile_for_check_standard = false;
            FunctionProfileService.getFuntionProfileJustCheckStandard()
                .then(function (data) {
                    if (data == "true" || data == true) {
                        function_profile_for_check_standard = true;
                    }
                });
            var opinionPopup = null;
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/approval/modal/approval.check.budget.html',{
                scope:$scope,
                animation:'none'
            }).then(function (modal) {
                $scope.expenseCheckBudgetModal=modal;

            });
            $scope.view = {
                originCurrencyCode:"",
                disable: false,
                approvalData: {},
                isBatchOpertion: false,
                canReject: true,
                showBatchIcon: false,
                selectAll: false,
                invoiceOIDs: [],
                hasInvoice: false,
                showDetail: true,
                language: $sessionStorage.lang,
                showRefund:function(){
                    //跳到借款单页面，审批页面不允许还款
                    $state.go('app.didi_refund_base',{
                        applicationOID:$scope.view.approvalData.loanApplicationOID,
                        formType:2005,
                        refundStatus:true
                    });
                },
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
                        || field.messageKey === 'cust_list' || field.messageKey === 'select_user'){
                        return true
                    } else {
                        return false
                    }
                },
                expandDetail: function () {
                    $scope.view.showDetail = !$scope.view.showDetail;
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.erv_approval_list');
                    }
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                countSelect: function (index) {
                    if ($scope.view.approvalData.expenseReportInvoices[index].checked) {
                        $scope.view.invoiceOIDs.push($scope.view.approvalData.expenseReportInvoices[index].invoiceOID);
                    } else {
                        $scope.view.selectAll = false;
                        var index = $.inArray($scope.view.approvalData.expenseReportInvoices[index].invoiceOID, $scope.view.invoiceOIDs);
                        $scope.view.invoiceOIDs.splice(index, 1);
                    }
                },
                selectAllAction: function () {
                    if ($scope.view.selectAll) {
                        for (var i = 0; i < $scope.view.approvalData.expenseReportInvoices.length; i++) {
                            $scope.view.approvalData.expenseReportInvoices[i].checked = true;
                            $scope.view.invoiceOIDs.push($scope.view.approvalData.expenseReportInvoices[i].invoiceOID);
                        }
                    } else {
                        $scope.view.invoiceOIDs = [];
                        for (var i = 0; i < $scope.view.approvalData.expenseReportInvoices.length; i++) {
                            $scope.view.approvalData.expenseReportInvoices[i].checked = false;
                        }
                    }
                },
                cancelBatch: function () {
                    $scope.view.isBatchOpertion = false;
                    $scope.view.canReject = true;
                },
                goTravelDetail: function () {
                    if ($scope.view.approvalData.type === 1001) {

                    } else if ($scope.view.approvalData.type === 1002) {
                        $state.go('app.erv_travel_detail', {applicationOID: $scope.view.approvalData.applicationOID});
                    } else if ($scope.view.approvalData.type === 1003) {
                        $state.go('app.erv_invoice_apply_approve_detail', {applicationOID: $scope.view.approvalData.applicationOID});
                    }
                },
                goDetail: function (invoice) {
                    $state.go('app.tab_erv_expense_consume_submit', {
                        expenseReportOID: $state.params.expenseReportOID,
                        expense: invoice.invoiceOID
                    });
                },
                showBatchOperation: function () {
                    $scope.view.closeBatchItem();
                    $scope.view.isBatchOpertion = true;
                    $scope.view.canReject = false;
                },
                agreeAll: function () {
                    $scope.view.disable = true;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.closeBatchItem();
                    var entry = {};
                    entry.entities = [];
                    var entryItem = {};
                    entryItem.entityOID = $stateParams.expenseReportOID;
                    entryItem.entityType = 1002;
                    entry.entities.push(entryItem);
                    entry.approvalTxt = '';
                    ApprovalERVService.agree(entry)
                        .success(function (data) {
                            $ionicLoading.hide();
                            if (data.failNum > 0) {
                                $scope.view.openWarningPopup($filter('translate')('error.failed'));
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('approval.already.passed'));
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);
                            }
                        })
                        .error(function(error){
                            $ionicLoading.hide();
                            if(error.message){
                                $scope.view.openWarningPopup(error.message)
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('error.failed'));
                            }
                        })
                        .finally(function () {
                            $scope.view.disable = false;
                        })
                },
                //费用驳回
                batchReject: function () {
                    if ($scope.view.invoiceOIDs.length === 0) {
                        $scope.view.openWarningPopup($filter('translate')('approval.please.select.the.cost'));
                    } else {
                        var data = {};
                        $scope.view.disable = true;
                        data.expenseOID = $stateParams.expenseReportOID;
                        data.invoiceOIDs = $scope.view.invoiceOIDs;
                        $scope.view.showReasonInput(data, 'invoice');
                    }
                },
                //驳回整单报销单
                rejectAll: function () {
                    $scope.view.closeBatchItem();
                    var entry = {};
                    entry.entities = [];
                    var entryItem = {};
                    entryItem.entityOID = $stateParams.expenseReportOID;
                    entryItem.entityType = 1002;
                    entry.entities.push(entryItem);
                    $scope.view.showReasonInput(entry, 'all');
                },
                rejectOne: function (invoice, index) {
                    $scope.view.closeBatchItem();
                    var data = {};
                    data.expenseOID = $stateParams.expenseReportOID;
                    data.invoiceOIDs = [];
                    data.invoiceOIDs.push(invoice.invoiceView.invoiceOID);
                    //var entry = {};
                    //entry.entities = [];
                    //var entryItem = {};
                    //entryItem.entityOID = invoiceOID;
                    //entryItem.entityType = 1002;
                    //entry.entities.push(entryItem);
                    $scope.view.showReasonInput(data, 'one', invoice);
                },
                showBatchItem: function () {
                    $scope.view.showBatchIcon = true;
                    $scope.batchItem.show();
                },
                closeBatchItem: function () {
                    $scope.view.showBatchIcon = false;
                    $scope.batchItem.hide();
                },
                showReasonInput: function (data, state, invoice) {
                    $scope.view.rejectReason = null;
                    opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter("translate")("approval.pleaseReason") + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>'+$filter('translate')('error.reason.for.rejection')+'</h5>',
                        scope: $scope,
                        buttons: [
                            {text:$filter('translate')('approval.cancel')},
                            {
                                text: $filter('translate')('approval.confirm'),
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template:$filter('translate')('approval.please.enter.the.reason.for.rejecting'),
                                            duration: '500'
                                        });
                                        e.preventDefault();
                                    } else {
                                        return $scope.view.rejectReason;
                                    }
                                }
                            }
                        ]
                    });
                    opinionPopup.then(function (res) {
                        if (res) {
                            $scope.showLoading();
                            //在MainAppController中，已经定义了该函数，可以重用
                            if (state === 'all') {
                                data.approvalTxt = $scope.view.rejectReason;
                                ApprovalERVService.reject(data)
                                    .success(function (data) {
                                        $ionicLoading.hide();
                                        if (data.failNum > 0) {
                                            if(data.failReason[$stateParams.expenseReportOID] === 'releaseBudget'){
                                                $scope.view.openWarningPopup($filter('translate')('error.release.budget.failed.withdraw.failed'));
                                            } else {
                                                $scope.view.openWarningPopup($filter('translate')('error.reject.failure'));
                                            }
                                        } else {
                                            $scope.view.openWarningPopup($filter('translate')('approval.rejected'));
                                            $timeout(function () {
                                                $scope.view.goBack();
                                            }, 500);
                                        }
                                    })
                                    .error(function (error){
                                        $ionicLoading.hide();
                                        if(error.message){
                                            $scope.view.openWarningPopup(error.message)
                                        } else {
                                            $scope.view.openWarningPopup($filter('translate')('error.failed'));
                                        }
                                    })
                                    .finally(function () {
                                        $scope.view.disable = false;
                                    })
                            } else if (state === 'invoice') {
                                //单笔驳回
                                data.approvalTxt = $scope.view.rejectReason;
                                ApprovalERVService.rejectInvoices(data)
                                    .success(function (data) {
                                        $scope.view.isBatchOpertion = false;
                                        $scope.view.canReject = true;
                                        if (data.failNum > 0) {
                                            if(data.message === 'releaseBudget'){
                                                $scope.view.openWarningPopup($filter('translate')('error.release.budget.failed.withdraw.failed'));
                                            } else {
                                                $scope.view.openWarningPopup($filter('translate')('error.reject.failure') + data.failNum + '条');
                                            }
                                            ExpenseReportService.getExpenseReportDetail($stateParams.expenseReportOID)
                                                .success(function (data) {
                                                    $ionicLoading.hide();
                                                    $scope.view.approvalData = data;
                                                    if($scope.view.approvalData.custFormValues && $scope.view.approvalData.custFormValues.length > 0){
                                                        getCustFormValues();
                                                    }
                                                    $scope.view.hasInvoice = false;
                                                    var num = 0;
                                                    for (; num < $scope.view.approvalData.expenseReportInvoices.length; num++) {
                                                        if ($scope.view.approvalData.expenseReportInvoices[num].status === 1000) {
                                                            $scope.view.hasInvoice = true;
                                                        }
                                                        $scope.view.approvalData.expenseReportInvoices[num].checked = false;
                                                        $scope.view.approvalData.expenseReportInvoices[num].date = $scope.view.approvalData.expenseReportInvoices[num].invoiceView.createdDate;//改用dayCharFilter
                                                    }
                                                    if (num === $scope.view.approvalData.expenseReportInvoices.length) {
                                                        if ($scope.view.hasInvoice === false) {
                                                            $scope.view.openWarningPopup($filter('translate')('error.there.is.no.charge.for.this.expense'));
                                                            $timeout(function () {
                                                                $scope.view.goBack();
                                                            }, 500);
                                                        }
                                                    }
                                                })
                                                .error(function (error) {
                                                    $ionicLoading.hide();
                                                    if(error.message){
                                                        $scope.view.openWarningPopup(error.message)
                                                    } else {
                                                        $scope.view.openWarningPopup($filter('translate')('error.failed'));
                                                    }
                                                })
                                        } else {
                                            ExpenseReportService.getExpenseReportDetail($stateParams.expenseReportOID)
                                                .success(function (data) {
                                                    $ionicLoading.hide();
                                                    $scope.view.approvalData = data;
                                                    if($scope.view.approvalData.custFormValues && $scope.view.approvalData.custFormValues.length > 0){
                                                        getCustFormValues();
                                                    }
                                                    for (var i = 0; i < $scope.view.approvalData.expenseReportInvoices.length; i++) {
                                                        $scope.view.approvalData.expenseReportInvoices[i].checked = false;
                                                        $scope.view.approvalData.expenseReportInvoices[i].date = $scope.view.approvalData.expenseReportInvoices[i].invoiceView.createdDate;//改用dayCharFilter
                                                    }
                                                })
                                                .error(function (error){
                                                    $ionicLoading.hide();
                                                    if(error.message){
                                                        $scope.view.openWarningPopup(error.message)
                                                    } else {
                                                        $scope.view.openWarningPopup($filter('translate')('error.failed'));
                                                    }
                                                });
                                            $scope.view.openWarningPopup($filter('translate')('approval.rejected'));
                                            if (data.successNum === $scope.view.approvalData.expenseReportInvoices.length) {
                                                $timeout(function () {
                                                    $scope.view.goBack();
                                                }, 500);
                                            }
                                        }
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        if(error.message){
                                            $scope.view.openWarningPopup(error.message)
                                        } else {
                                            $scope.view.openWarningPopup($filter('translate')('error.reject.failure'));
                                        }
                                    })
                                    .finally(function () {
                                        $scope.view.disable = false;
                                    })

                            } else if (state === 'one') {
                                data.approvalTxt = $scope.view.rejectReason;
                                ApprovalERVService.rejectInvoices(data)
                                    .success(function (data) {
                                        $ionicLoading.hide();
                                        if (data.failNum > 0) {
                                            if(data.message === 'releaseBudget'){
                                                $scope.view.openWarningPopup($filter('translate')('error.release.budget.failed.withdraw.failed'));
                                            } else {
                                                $scope.view.openWarningPopup($filter('translate')('error.reject.failure'));
                                            }
                                        } else {
                                            $scope.view.openWarningPopup($filter('translate')('approval.rejected'));
                                            var num = $.inArray(invoice, $scope.view.approvalData.expenseReportInvoices);
                                            $scope.view.approvalData.expenseReportInvoices.splice(num, 1);
                                            var hasNum = 0;
                                            for (var i = 0; i < $scope.view.approvalData.expenseReportInvoices.length; i++) {
                                                if ($scope.view.approvalData.expenseReportInvoices[i].status === 1000) {
                                                    hasNum++;
                                                } else if (i === $scope.view.approvalData.expenseReportInvoices.length - 1) {
                                                    if (hasNum === 0) {
                                                        $scope.view.goBack();
                                                    }
                                                }
                                            }
                                            if ($scope.view.approvalData.expenseReportInvoices.length === 0) {
                                                $timeout(function () {
                                                    $scope.view.goBack();
                                                }, 500);
                                            }
                                        }

                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        if(error.message){
                                            $scope.view.openWarningPopup(error.message)
                                        } else {
                                            $scope.view.openWarningPopup($filter('translate')('error.reject.failure'));
                                        }
                                    })
                                    .finally(function () {
                                        $scope.view.disable = false;
                                    })
                            }
                        } else {
                            $scope.view.disable = false;
                        }
                    });
                },
                //单笔费用驳回
                reject: function (data) {

                },
                //获取成本中心名字
                getCostCenterName: function(index){
                    var indexCostCenter = index;
                    var json = JSON.parse($scope.view.approvalData.custFormValues[indexCostCenter].dataSource);
                    $scope.view.approvalData.custFormValues[indexCostCenter].costCenterOID = json.costCenterOID;
                    if($scope.view.approvalData.custFormValues[indexCostCenter].value){
                        CostCenterService.getCostCenterItemDetail($scope.view.approvalData.custFormValues[indexCostCenter].value)
                            .success(function(data){
                                $scope.view.approvalData.custFormValues[indexCostCenter].costCenterName = data.name;
                            })
                            .error(function(){
                                $scope.view.approvalData.custFormValues[indexCostCenter].costCenterName = null;
                            })
                    } else{
                        $scope.view.approvalData.custFormValues[indexCostCenter].costCenterName = null;
                    }
                },
                //获取部门
                getDepartmentName: function(index){
                    SelfDefineExpenseReport.getDepartmentInfo($scope.view.approvalData.custFormValues[index].value)
                        .success(function(data){
                            if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                $scope.view.approvalData.custFormValues[index].departmentName = data.name;
                            } else {
                                $scope.view.approvalData.custFormValues[index].departmentName = data.path;
                            }
                        })
                },
                //获取已选择审批人的名字
                getSelectedApproval: function (index) {
                    var uerOID = [];
                    if ($scope.view.approvalData.custFormValues[index].value !== null && $scope.view.approvalData.custFormValues[index].value !== '') {
                        uerOID = $scope.view.approvalData.custFormValues[index].value.split(":");
                        $scope.view.approvalData.custFormValues[index].approvalSelectedName = '';
                        if (uerOID.length > 0) {
                            $scope.view.approvalData.custFormValues[index].memberList = [uerOID.length];
                            TravelERVService.getBatchUsers(uerOID)
                                .success(function (data) {
                                    var num = 0;
                                    for (; num < data.length; num++) {
                                        for (var j = 0; j < uerOID.length; j++) {
                                            if (uerOID[j] === data[num].userOID) {
                                                $scope.view.approvalData.custFormValues[index].memberList[j] = data[num];
                                            }
                                        }
                                    }
                                    if (num === data.length) {
                                        for (var i = 0; i < $scope.view.approvalData.custFormValues[index].memberList.length; i++) {
                                            if (i !== ($scope.view.approvalData.custFormValues[index].memberList.length - 1)) {
                                                $scope.view.approvalData.custFormValues[index].approvalSelectedName += $scope.view.approvalData.custFormValues[index].memberList[i].fullName + ','
                                            } else {
                                                $scope.view.approvalData.custFormValues[index].approvalSelectedName += $scope.view.approvalData.custFormValues[index].memberList[i].fullName;
                                            }
                                        }
                                    }
                                })
                        } else {
                            $scope.view.approvalData.custFormValues[index].memberList = [];
                            $scope.view.approvalData.custFormValues[index].approvalSelectedName = '';
                        }

                    } else {
                        $scope.view.approvalData.custFormValues[index].approvalSelectedName = '';
                    }
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if($scope.view.approvalData.custFormValues[index].value && $scope.view.approvalData.custFormValues[index].messageKey === 'select_corporation_entity'){
                        CorporationEntityService.getCorporationEntityDetail($scope.view.approvalData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.approvalData.custFormValues[index].entityName = data.companyName;
                            })
                    }
                },
                //获取值列表名字
                getValueName: function (index) {
                    CustomValueService.getMessageKey($scope.view.approvalData.custFormValues[index].customEnumerationOID, $scope.view.approvalData.custFormValues[index].value)
                        .then(function (data) {
                            $scope.view.approvalData.custFormValues[index].valueKey = data;
                        })
                },
                //银行卡
                getContactBankAccountName: function (index) {
                    if($scope.view.approvalData.custFormValues[index].value){
                        CompanyService.getBankAccountDetail($scope.view.approvalData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.approvalData.custFormValues[index].bankAccountNo = data.bankAccountNo;
                            })
                    }
                },
                openBudgetModal:function () {
                    $scope.expenseCheckBudgetModal.show();
                },
            };
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/approval/expense_report/batch.item.tpl.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.batchItem = modal;
            });
            function getCustFormValues(){
                if ($scope.view.approvalData.custFormValues && $scope.view.approvalData.custFormValues.length > 0) {
                    for (var i = 0; i < $scope.view.approvalData.custFormValues.length; i++) {
                        // 申请人
                        var formValue = $scope.view.approvalData.custFormValues[i];
                        if (formValue.messageKey === 'applicant') {
                            formValue.applicantName = $scope.view.approvalData.applicantName;
                        }
                        //值列表
                        if($scope.view.approvalData.custFormValues[i].fieldType === 'CUSTOM_ENUMERATION' || $scope.view.approvalData.custFormValues[i].messageKey === 'cust_list'){
                            if($scope.view.approvalData.custFormValues[i].dataSource && JSON.parse($scope.view.approvalData.custFormValues[i].dataSource)){
                                var json = JSON.parse($scope.view.approvalData.custFormValues[i].dataSource);
                                $scope.view.approvalData.custFormValues[i].customEnumerationOID = json.customEnumerationOID;
                            } else {
                                $scope.view.approvalData.custFormValues[i].customEnumerationOID = null;
                            }
                            if($scope.view.approvalData.custFormValues[i].value){
                                $scope.view.getValueName(i);
                            }
                        }
                        if ($scope.view.approvalData.custFormValues[i].messageKey === 'writeoff_flag') {
                            var indexWrite = i;
                            if ($scope.view.approvalData.custFormValues[indexWrite].value === 'true') {
                                $scope.view.approvalData.custFormValues[indexWrite].value = true;
                            } else {
                                $scope.view.approvalData.custFormValues[indexWrite].value = false;
                            }
                        }
                        //成本中心项目名字获取
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'select_cost_center'){
                            $scope.view.getCostCenterName(i);
                        }
                        //部门名称获取
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'select_department'){
                            $scope.view.getDepartmentName(i);
                        }
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'select_approver'){
                            $scope.view.getSelectedApproval(i);
                        }
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'select_user'){
                            $scope.view.getSelectedApproval(i);
                        }
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'currency_code'){
                            var currencyIndex = i;
                            $scope.currencyCode =$scope.view.approvalData.custFormValues[currencyIndex].value;
                        }
                        //法人实体
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'select_corporation_entity'){
                            $scope.view.getCorporationEntityName(i);
                        }
                        //联动开关
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'linkage_switch'){
                            if($scope.view.approvalData.custFormValues[i].value === 'true'){
                                $scope.view.approvalData.custFormValues[i].value = true;
                            } else {
                                $scope.view.approvalData.custFormValues[i].value = false;
                            }
                            if($scope.view.approvalData.custFormValues[i].fieldContent && JSON.parse($scope.view.approvalData.custFormValues[i].fieldContent)){
                                $scope.view.approvalData.custFormValues[i].content = JSON.parse($scope.view.approvalData.custFormValues[i].fieldContent);
                            } else {
                                $scope.view.approvalData.custFormValues[i].content = [];
                            }
                        }
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'select_box') {
                            //选择框
                            $scope.view.approvalData.custFormValues[i].selectValue = JSON.parse($scope.view.approvalData.custFormValues[i].value);
                        }
                        if($scope.view.approvalData.custFormValues[i].messageKey === 'contact_bank_account'){
                            //银行卡
                            $scope.view.approvalData.custFormValues[i].bankAccountNo = null;
                            $scope.view.getContactBankAccountName(i);
                        }
                    }
                }
            }
            var init = function () {


                $scope.showLoading();
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                    //设置费用是否可以驳回,默认可以驳回，查询fp，看看是否配置了不可驳回
                    if(data['app.approval.reject.batch.disabled']){  //设置费用不可驳回
                        $scope.view.canReject = false;
                    }
                });

                //在MainAppController中，已经定义了该函数，可以重用
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode = data.currencyCode;
                        $scope.currencyCode = data.currencyCode;

                        ExpenseReportService.getExpenseReportDetail($stateParams.expenseReportOID)
                            .success(function (data) {
                                $ionicLoading.hide();
                                $scope.view.approvalData = data;
                                /*头部tip错误显示*/
                                $scope.budgetError=[];
                                $scope.errorColor = false;
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
                                console.log($scope.budgetError);
                                //去差标结果检测
                                if(function_profile_for_check_standard){
                                    $scope.getFeeStandardResult($scope.view.approvalData.expenseReportInvoices);
                                }

                                getCustFormValues();
                                var num = 0;
                                for (; num < $scope.view.approvalData.expenseReportInvoices.length; num++) {
                                    if ($scope.view.approvalData.expenseReportInvoices[num].status === 1000) {
                                        $scope.view.hasInvoice = true;
                                    }
                                    $scope.view.approvalData.expenseReportInvoices[num].checked = false;
                                    $scope.view.approvalData.expenseReportInvoices[num].date = $scope.view.approvalData.expenseReportInvoices[num].invoiceView.createdDate;//改用dayCharFilter
                                }
                                if (num === $scope.view.approvalData.expenseReportInvoices.length) {
                                    if ($scope.view.hasInvoice === false) {
                                        $scope.view.openWarningPopup($filter('translate')('error.there.is.no.charge.for.this.expense'));
                                        $scope.goBack();
                                    }
                                }
                            })
                            .error(function (error) {
                                $ionicLoading.hide();
                                if(error.message){
                                    $scope.view.openWarningPopup(error.message)
                                } else {
                                    $scope.view.openWarningPopup($filter('translate')('error.failed'));
                                }
                            });
                    })
            };
            init();
            function expenseReportListSetRejectOrWarn(standardResult){
                if(standardResult.length===0){
                    return false;
                }
                var r_len=standardResult.length;
                var o_len=$scope.view.approvalData.expenseReportInvoices.length;
                for(var i=0;i<r_len;i++){
                    for(var j=0;j<o_len;j++){
                        if(standardResult[i].invoiceOID===$scope.view.approvalData.expenseReportInvoices[j].invoiceOID){
                            if(standardResult[i].actionType==="REJECT"){
                                $scope.view.approvalData.expenseReportInvoices[j].invoiceView.reject=true;
                                $scope.view.approvalData.expenseReportInvoices[j].invoiceView.rejectMesage=standardResult[i].message;

                            }else if(standardResult[i].actionType==="WARNING"){
                                $scope.view.approvalData.expenseReportInvoices[j].invoiceView.warning=true;
                                $scope.view.approvalData.expenseReportInvoices[j].invoiceView.warningMesage=standardResult[i].message;

                            }else if(standardResult[i].actionType==="OK"){
                                $scope.view.approvalData.expenseReportInvoices[j].invoiceView.warning=false;
                                $scope.view.approvalData.expenseReportInvoices[j].invoiceView.warning=false;
                            }
                        }
                    }
                }
            }
            //OIDs要拼接一个url,类似get请求后面的参数
            function getFeeOIDs(feeOids) {
                var string = '';
                for (var i = 0; i < feeOids.length; i++) {
                    string += 'invoiceOIDs=';
                    string += feeOids[i].invoiceOID;
                    if (i < feeOids.length - 1) {
                        string += '&';
                    }
                }
                return string;
            }
            $scope.getFeeStandardResult = function (feeOids) {
                var data = getFeeOIDs(feeOids);
                ExpenseReportService.getCheckStandardResult(data)
                    .success(function (data) {

                        expenseReportListSetRejectOrWarn(data)
                    })
                    .error(function (data) {
                    })
            }

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            $scope.$on('$ionicView.leave', function (event, viewData) {
                if(opinionPopup){
                    opinionPopup.close();
                }
            })
        }]);
