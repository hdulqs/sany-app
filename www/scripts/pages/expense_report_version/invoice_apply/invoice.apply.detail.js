/**
 * Created by liyinsen on 2016/8/2.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_invoice_apply_detail', {
                url: '/erv/invoice/apply/detail?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'waitApproval';
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
            .state('app.erv_invoice_apply_approve_detail', {
                url: '/erv/invoice/apply/approve/detail?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'detail';
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
            .state('app.erv_invoice_apply_detail_next', {
                url: '/erv/invoice/apply/detail/next?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'hasPass';
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
            .state('app.erv_invoice_apply_detail_approval', {
                url: '/erv/invoice/apply/detail/approval?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approval';
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
            .state('app.erv_invoice_apply_detail_reject', {
                url: '/erv/invoice/apply/detail/reject?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplyDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'hasReject';
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
    .controller('com.handchina.huilianyi.ErvInvoiceApplyDetailController',
        ['$scope', '$stateParams', 'InvoiceApplyERVService', '$ionicLoading', '$ionicHistory', 'content',
            'TravelERVService', '$ionicPopup', 'ApprovalERVService', '$state', 'CurrencyCodeService',
            'FunctionProfileService','$filter', '$sessionStorage','CompanyConfigurationService',
        function ($scope, $stateParams, InvoiceApplyERVService, $ionicLoading, $ionicHistory, content,
                  TravelERVService, $ionicPopup, ApprovalERVService, $state, CurrencyCodeService,
                  FunctionProfileService,$filter, $sessionStorage,CompanyConfigurationService) {
            $scope.view = {
                notFoundIcon: 'img/error-icon/not-found.png',
                isNotFound: false,
                notFoundText:$filter('translate')('invoice.the.cost.application.has.been.deleted') /*该费用申请已删除*/,
                pageable: {
                    page: 0,
                    size: 10
                },
                rejectReason: null,
                content: content,
                showInvoiceApplyMember: true,
                language: $sessionStorage.lang,
                //撤回
                withdrawInvoiceApply: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var data = {
                        entities: []
                    };
                    var entitty = {};
                    entitty.entityOID = $stateParams.applicationOID;
                    entitty.entityType = 1001;
                    data.entities.push(entitty);
                    TravelERVService.withdrawTravel(data)
                        .success(function () {
                            $ionicLoading.hide();
                            $scope.view.openWarningPopup($filter('translate')('invoice.withdraw.success')/*撤回成功*/);
                            $scope.view.goBack();
                        })
                        .error(function (data) {
                            if(data.message){
                                $scope.view.openWarningPopup(data.message);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                            }
                            $ionicLoading.hide();
                        });
                },
                showOpinionPopup: function () {
                    var opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter('translate')('invoice.please.enter.the.reason.for.rejecting') + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>'+$filter('translate')('invoice.reason.for.rejection')+'</h5>'/*驳回理由*/,
                        scope: $scope,
                        buttons: [
                            {text:$filter('translate')('invoice.cancel')/* 取消*/},
                            {
                                text:$filter('translate')('invoice.confirm') /*确认*/,
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('invoice.please.enter.the.reason.for.rejecting')/*请输入驳回理由*/,
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
                            $scope.view.reject();
                        } else {
                        }
                    });
                },
                reject: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var entry = {};
                    entry.entities = [];
                    var entryItem = {};
                    entryItem.entityOID = $stateParams.applicationOID;
                    entryItem.entityType = 1001;
                    entry.entities.push(entryItem);
                    entry.approvalTxt = $scope.view.rejectReason;
                    ApprovalERVService.reject(entry)
                        .success(function (data) {
                            if(data.failNum > 0){
                                $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('invoice.rejected')/*已驳回*/);
                                $scope.view.goBack();
                            }
                        }).finally(function (){
                            $ionicLoading.hide();
                        });
                },
                agree: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var entry = {};
                    entry.entities = [];
                    var entryItem = {};
                    entryItem.entityOID = $stateParams.applicationOID;
                    entryItem.entityType = 1001;
                    entry.entities.push(entryItem);
                    entry.approvalTxt = '';
                    ApprovalERVService.agree(entry)
                        .success(function (data) {
                            $ionicLoading.hide();
                            if(data.failNum > 0){
                                $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                            } else {
                                $scope.view.openWarningPopup($filter('translate')('invoice.passed')/*已通过*/);
                                $scope.view.goBack();
                            }

                        })
                },
                edit: function () {
                    $state.go("app.erv_init_invoice_apply", {applicationOID: $stateParams.applicationOID});
                },
                //生成报销单
                exportExpense: function () {
                    $state.go('app.tab_erv_create_relative_expense_first',
                        {invoiceOID: $stateParams.applicationOID});
                    //$state.go('app.tab_erv.expense_report', {applicationOID: $stateParams.applicationOID});
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.erv_invoice_apply_list');
                    }
                },
                expandInvoiceApplyMember: function () {
                    $scope.view.showInvoiceApplyMember = !$scope.view.showInvoiceApplyMember;
                }
            };
            $scope.init = function () {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                if ($scope.view.content === 'approval') {
                    $scope.view.title =$filter('translate')('invoice.cost.application') /*费用申请*/;
                } else if ($scope.view.content === 'detail') {
                    $scope.view.title =$filter('translate')('invoice.cost.application') /*费用申请*/;
                } else if ($scope.view.content === 'waitApproval') {
                    $scope.view.title = $filter('translate')('invoice.cost.application') /*费用申请*/;
                } else if ($scope.view.content === 'hasReject') {
                    $scope.view.title =$filter('translate')('invoice.cost.application') /*费用申请*/;
                } else if ($scope.view.content === 'hasPass') {
                    $scope.view.title = $filter('translate')('invoice.cost.application') /*费用申请*/;
                }
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode = data.currencyCode;
                    })
                InvoiceApplyERVService.getInvoiceApplyDetail($stateParams.applicationOID)
                    .success(function (data) {
                        $scope.view.invoiceApply = data;

                        $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.invoiceApply.expenseApplication.currencyCode);
                    })
                    .error(function (data) {
                        if (data.errorCode === 'OBJECT_NOT_FOUND') {
                            $scope.view.isNotFound = true;
                        } else if(data.message){
                            $scope.view.openWarningPopup(data.message);
                        } else {
                            $scope.view.openWarningPopup($filter('translate')('error.error')/*出错了*/);
                        }
                    }).finally(function (){
                        $ionicLoading.hide();
                    });
            };
            $scope.init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
