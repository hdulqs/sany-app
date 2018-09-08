/**
 * Created by liyinsen on 2016/7/28.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_invoice_apply_create', {
                url: '/erv/invoice/apply/create',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.create.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyCreateController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'create';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('invoice_apply');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_init_invoice_apply', {
                url: '/erv/init/invoice/apply?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.create.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyCreateController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
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
    .controller('com.handchina.huilianyi.ErvInvoiceApplyCreateController', ['$scope',  '$filter','$state', 'Principal', 'LocationService', 'content', 'InvoiceApplyERVService',
        'CompanyConfigurationService', 'localStorageService', '$ionicHistory', '$ionicLoading', '$q', '$stateParams', 'CurrencyCodeService', 'ExpenseService', 'TravelERVService', '$timeout', 'CostCenterService', 'FUNCTION_PROFILE', 'FunctionProfileService', 'ManagerPrompt', 'DepartmentService', 'PublicFunction','ApprovalPopupService',
        function ($scope, $filter, $state, Principal, LocationService, content, InvoiceApplyERVService, CompanyConfigurationService, localStorageService, $ionicHistory, $ionicLoading, $q, $stateParams, CurrencyCodeService, ExpenseService, TravelERVService, $timeout, CostCenterService, FUNCTION_PROFILE, FunctionProfileService, ManagerPrompt, DepartmentService, PublicFunction, ApprovalPopupService) {
            $scope.view = {
                participantHolder: '搜索姓名或者工号',
                approvalTitle: $filter('translate')('invoice.approval.of.people')/* 审批人*/,
                showCostCenter: null,
                showDepartment: null,
                departmentInfo: null,
                approver: [],
                approvalMaxLength: null,
                approvalSelectedName: '',
                isShowApproval: false,
                data: {},
                content: content,
                initDataFinish: false,
                isNewInvoiceApplyItineraries: false,
                readonly: false,
                //判断是否只选择叶子节点的function profile key
                leafDepSelectorRequired: FUNCTION_PROFILE['leafDepSelectorRequired'],
                invoiceApply: {
                    applicationParticipants: [],//参与人
                    detail: "string",//详情
                    expenseApplication: {//费用申请字段(其它是公共)
                        approverOIDs: '',
                        departmentOID: null,
                        departmentName: null,
                        costCenterItemOID: null,
                        costCenterItemName: null,
                        borrowAmount: 0,//借款金额
                        borrowFlag: false,//是否借款
                        currencyCode: '',//货币代码
                        expenseBudgetList: [],
                        referenceOID: '',//关联的oid 部门，成本中心的oid
                        referenceType: 0,//关联的类型1001成本中心,1002部门
                        totalBudget: 0//总预算
                    },
                    remark: "",//备注
                    title: ""//标题（事由）
                },
                typeList: [],
                costName: null,
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goTo: function (state) {
                    $state.go(state);
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.erv_invoice_apply_list');
                    }
                },
                saveInvoiceApply: function () {

                    var deferred = $q.defer();
                    if ($scope.view.invoiceApply.title === '' || $scope.view.invoiceApply.title === null) {
                        //请输入事由
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.the.reason'));
                        deferred.reject(false);
                    } else if ($scope.view.invoiceApply.title.length > 50) {
                        /*事由请输入最多50个汉字*/
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.input.up.to.50.characters'));
                        deferred.reject(false);
                    } else {
                        if ($scope.view.departmentInfo) {
                            if ($scope.view.departmentInfo.name) {
                                $scope.view.invoiceApply.expenseApplication.departmentName = $scope.view.departmentInfo.name;
                            }
                            if ($scope.view.departmentInfo.departmentOID) {
                                $scope.view.invoiceApply.expenseApplication.departmentOID = $scope.view.departmentInfo.departmentOID;
                            }
                        }
                        InvoiceApplyERVService.saveInvoiceApply($scope.view.invoiceApply)
                            .success(function () {
                                /*保存成功*/
                                $scope.view.openWarningPopup($filter('translate')('invoice.save.success'));
                                $scope.view.goBack();
                            })
                            .error(function(data){
                                if(data.message){
                                    $scope.view.openWarningPopup(data.message);
                                } else {
                                    /*出错了*/
                                    $scope.view.openWarningPopup($filter('translate')('error.error'));
                                }
                            });
                        if ($scope.view.invoiceApply.expenseApplication.costCenterItemOID) {
                            CostCenterService.logLastCostCenterItem($scope.view.invoiceApply.expenseApplication.costCenterItemOID);
                        }
                    }
                    return deferred.promise;
                },
                validateData: function () {
                    var deferred = $q.defer();
                    if ($scope.view.invoiceApply.title === '' || $scope.view.invoiceApply.title === null) {
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.the.reason')/*请输入事由*/);
                        deferred.reject(false);
                    } else if ($scope.view.invoiceApply.title.length > 50) {
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.input.up.to.50.characters')/*事由请输入最多50个汉字*/);
                        deferred.reject(false);
                    } else if (!$scope.view.invoiceApply.expenseApplication.departmentName &&
                        ((!$scope.view.functionProfileList && $scope.view.showDepartment) || !$scope.view.functionProfileList['ea.department.selection.disabled'])) {
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.select.department')/*请选择部门*/);
                        deferred.reject(false);
                    } else if (!$scope.view.invoiceApply.expenseApplication.costCenterItemOID && ((!$scope.view.functionProfileList && $scope.view.showCostcenter) || !$scope.view.functionProfileList['ea.costCenter.selection.disabled'])) {
                        $scope.view.hasCostCenter?$scope.view.openWarningPopup($filter('translate')('invoice.please.select')/*请选择 */+ $scope.view.costName):$scope.view.openWarningPopup($filter('translate')('error.cost.center.is.not.configured')/*成本中心未配置，请联系管理员*/);
                        deferred.reject(false);
                    } else if (!$scope.view.invoiceApply.expenseApplication.approverOIDs && $scope.view.isShowApproval) {
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.select.the.examination.and.approval')/*请选择审批人*/);
                        deferred.reject(false);
                    } else if (!$scope.view.invoiceApply.expenseApplication.expenseBudgetList.length > 0) {
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.cost.type.and.amount')/*请输入费用类型及金额*/);
                        deferred.reject(false);
                    } else if ($scope.view.invoiceApply.expenseApplication.borrowFlag && ($scope.view.invoiceApply.expenseApplication.borrowAmount > $scope.view.invoiceApply.expenseApplication.totalBudget)) {
                        $scope.view.openWarningPopup($filter('translate')('invoice.apply.for.loan.amount.shall.not.exceed.the.total.amount')/*申请贷款金额不能超过总金额*/);
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                saveDataInvoiceApply: function(){
                    InvoiceApplyERVService.setTab('submit');
                    InvoiceApplyERVService.submitInvoiceApply($scope.view.invoiceApply)
                        .success(function () {
                            $ionicLoading.hide();
                            $scope.view.openWarningPopup($filter('translate')('invoice.submit.successfully')/*提交成功*/);
                            $timeout(function () {
                                ApprovalPopupService.setCount();
                                $scope.view.goBack();
                            }, 500);
                        })
                        .error(function (data) {
                            $ionicLoading.hide();
                            if(data.message){
                                $scope.view.openWarningPopup(data.message);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                            }
                        });
                    if ($scope.view.invoiceApply.expenseApplication.costCenterItemOID) {
                        CostCenterService.logLastCostCenterItem($scope.view.invoiceApply.expenseApplication.costCenterItemOID);
                    }
                },
                submitInvoiceApply: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    //var approverStr = '';
                    //for(var i = 0; i < $scope.view.approver.length; i++){
                    //    if(i === $scope.view.approver.length -1){
                    //        approverStr += $scope.view.approver[i].userOID;
                    //        $scope.view.invoiceApply.expenseApplication.approverOIDs = approverStr;
                    //    } else {
                    //        approverStr += $scope.view.approver[i].userOID + ':';
                    //    }
                    //}
                    $scope.view.validateData().then(function () {
                        // 如果表单有部门并且公司配置为部门经理审批并且所选择部门没有部门经理,提示错误信息
                        if($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode===1002 && ((!$scope.view.functionProfileList && $scope.view.showDepartment) || !$scope.view.functionProfileList['ta.department.selection.disabled'])){
                            DepartmentService.getDepartmentInfo($scope.view.invoiceApply.expenseApplication.departmentOID).then(function(response){
                                if(!response.data.managerOID){
                                    PublicFunction.showToast(ManagerPrompt);
                                } else {
                                    InvoiceApplyERVService.setTab('submit');
                                    $scope.view.saveDataInvoiceApply();
                                }
                            })
                        } else {
                            InvoiceApplyERVService.setTab('submit');
                            $scope.view.saveDataInvoiceApply();
                        }
                    })
                }
            };

            var init = function () {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Principal.identity().then(function (data) {
                    ExpenseService.getExpenseTypes(data.companyOID)
                        .then(function (data) {
                            $scope.view.typeList = data;
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        });
                });

                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode=data.currencyCode;
                        $scope.expenseApplicationCurrencyCode=data.currencyCode;
                        $scope.view.invoiceApply.expenseApplication.currencyCode = data.currencyCode;
                        $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.invoiceApply.expenseApplication.currencyCode);
                        $scope.view.showDepartment = data.configuration.ui.showDepartmentSelector.applications;
                        $scope.view.showCostCenter = data.configuration.ui.showCostCenterSelector.applications;
                        if ((!data.configuration.approvalRule && !data.configuration.approvalRule.approvalMode) || ((data.configuration.approvalRule) && (data.configuration.approvalRule.approvalMode) && data.configuration.approvalRule.approvalMode === 1003)) {
                            $scope.view.isShowApproval = true;
                            $scope.view.approvalMaxLength = data.configuration.approvalRule.maxApprovalChain;
                        } else {
                            $scope.view.isShowApproval = false;
                        }
                    })
                    .finally(function (){
                        $ionicLoading.hide();
                    });
                if ($scope.view.content === 'init') {
                    $scope.view.title = $filter('translate')('invoice.amendment.fee.application')/*修改费用申请*/;
                    InvoiceApplyERVService.getInvoiceApplyDetail($stateParams.applicationOID)
                        .success(function(data){
                            $scope.view.invoiceApply = data;
                            $scope.view.initDataFinish = true;

                            var uerOID = [];
                            if ($scope.view.invoiceApply.expenseApplication.approverOIDs !== null && $scope.view.invoiceApply.expenseApplication.approverOIDs !== '') {
                                uerOID = $scope.view.invoiceApply.expenseApplication.approverOIDs.split(":");
                                $scope.memberList = [uerOID.length];
                                $scope.view.approvalSelectedName = '';
                                TravelERVService.getBatchUsers(uerOID)
                                    .success(function (data) {
                                        //$scope.memberList = data;
                                        var num = 0;
                                        for (; num < data.length; num++) {
                                            for (var j = 0; j < uerOID.length; j++) {
                                                if (uerOID[j] === data[num].userOID) {
                                                    $scope.memberList[j] = data[num];
                                                }
                                            }
                                        }
                                        if (num === data.length) {
                                            for (var i = 0; i < $scope.memberList.length; i++) {
                                                if (i !== ($scope.memberList.length - 1)) {
                                                    $scope.view.approvalSelectedName += $scope.memberList[i].fullName + ','
                                                } else {
                                                    $scope.view.approvalSelectedName += $scope.memberList[i].fullName
                                                }
                                            }
                                        }

                                    })
                                    .error(function (data) {
                                        if(data.message){
                                            $scope.view.openWarningPopup(data.message);
                                        } else {
                                            $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                                        }
                                    })
                            } else {
                                $scope.view.approvalSelectedName = '';
                            }

                        })
                        .error(function (data) {
                            if(data.message){
                                $scope.view.openWarningPopup(data.message);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                            }
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        });
                    $scope.view.isNewInvoiceApplyItineraries = false;
                    $scope.view.readonly = false;
                } else if ($scope.view.content === 'create') {
                    //LocationService.getCurrentLocation();
                    $scope.view.title =$filter('translate')('invoice.new.cost.application')/* 新建费用申请*/;
                    Principal.identity().then(function (data) {
                        $scope.view.invoiceApply.expenseApplication.departmentName = data.departmentName;
                        $scope.view.invoiceApply.expenseApplication.departmentOID = data.departmentOID;
                        var item = {};
                        item.avatar = data.filePath;
                        item.fullName = data.fullName;
                        item.participantOID = data.userOID;
                        item.userOID = data.userOID;
                        $scope.view.invoiceApply.applicationParticipants.push(item);
                        $scope.view.isNewInvoiceApplyItineraries = true;
                    }).finally(function (){
                        $ionicLoading.hide();
                    });
                }
            };
            init();
            $scope.$on('$ionicView.beforeEnter', function () {
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
                CostCenterService.getMyCostCenters().then(function (data) {
                    $scope.view.hasCostCenter = data.length>0 && data[0].costCenterItems.length>0;
                    $scope.view.costName = data.length>0?data[0].name:$filter('translate')('invoice.cost.center')/*成本中心*/;
                });
            });
        }]);
