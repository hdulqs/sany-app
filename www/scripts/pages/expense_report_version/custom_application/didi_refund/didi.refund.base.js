/**
 * Created by hly on 2016/12/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.didi_refund_base', {
                url: '/didi/refund/base?applicationOID?formType',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/custom_application/didi_refund/didi.refund.base.html',
                        'controller': 'huilianyi.DiDiRefundController'
                    }
                },
                params:{
                    refundStatus:null
                },
                resolve: {
                    isShowHistory: function () {
                        return false;
                    },
                    isReadOnly: function () {
                        return false;
                    },
                    content: function () {
                        return 'base';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            ////通知财务还款后跳的页面
            //.state('app.didi_refund_history', {
            //    url: '/didi/refund/history?applicationOID?formType',
            //    views: {
            //        'page-content@app': {
            //            'templateUrl': 'scripts/pages/expense_report_version/custom_application/didi_refund/didi.refund.base.html',
            //            'controller': 'huilianyi.DiDiRefundController'
            //        }
            //    },
            //    resolve: {
            //        isShowHistory: function () {
            //            return true;
            //        },
            //        isReadOnly: function () {
            //            return false;
            //        },
            //        content: function () {
            //            return 'history';
            //        }
            //    },
            //    params:{
            //        refundStatus:null
            //    }
            //})
            ////审批页面过来
            //.state('app.didi_refund_approval', {
            //    url: '/didi/refund/approval?applicationOID?formType',
            //    views: {
            //        'page-content@app': {
            //            'templateUrl': 'scripts/pages/expense_report_version/custom_application/didi_refund/didi.refund.base.html',
            //            'controller': 'huilianyi.DiDiRefundController'
            //        }
            //    },
            //    params:{
            //        refundStatus:null
            //    },
            //    resolve: {
            //        isShowHistory: function () {
            //            return true;
            //        },
            //        isReadOnly: function () {
            //            return true;
            //        },
            //        content: function () {
            //            return 'approval';
            //        }
            //    }
            //})
    }])
    .controller('huilianyi.DiDiRefundController', ['$scope', '$state', 'isShowHistory', 'isReadOnly', '$stateParams', 'content', 'CustomApplicationServices', 'CompanyConfigurationService', 'CurrencyCodeService',
        function ($scope, $state, isShowHistory, isReadOnly, $stateParams, content, CustomApplicationServices, CompanyConfigurationService, CurrencyCodeService) {











            $scope.view = {
                isShowHistory: isShowHistory,
                isReadOnly: isReadOnly,
                content: content,
                backStatus: true,
                noRefund: $stateParams.refundStatus,
                refundDataList: [],
                goTo: function (item) {
                    $scope.view.backStatus = false;
                    if(item){
                        if (item.status !== '1001') {
                            if(item.type==='2'){
                                $state.go('app.tab_erv_expense_detail_audit_passed',{
                                    expenseReportOID: item.expenseReportOid
                                })

                            }else{
                                $state.go('app.didi_refund_detail_readonly', {
                                    applicationOID: $stateParams.applicationOID,
                                    formType: $stateParams.formType,
                                    repaymentOid: item.repaymentOid
                                });
                            }
                        } else if (item.status === '1001') {
                            if(item.type==='2'){
                                $state.go('app.tab_erv_expense_detail_audit_passed',{
                                    expenseReportOID: item.expenseReportOid
                                })
                            }else{
                                $state.go('app.didi_refund_detail_wait', {
                                    applicationOID: $stateParams.applicationOID,
                                    formType: $stateParams.formType,
                                    repaymentOid: item.repaymentOid
                                });
                            }
                        }
                    } else {
                        $state.go('app.didi_refund_detail', {
                            applicationOID: $stateParams.applicationOID,
                            formType: $stateParams.formType,
                            amount: $scope.view.refundData.writeoffArtificialDTO.stayWriteoffAmount
                        });
                    }

                }
            };
            $scope.$on('$ionicView.enter', function () {
                var url = '/api/loan/application/';
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    //获取本位币
                    $scope.originCurrencyCode = data.currencyCode;
                    $scope.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                    CustomApplicationServices.getApplicationDetail(url, $stateParams.applicationOID)
                        .success(function (data) {
                            $scope.view.refundData = data;
                            CustomApplicationServices.getRefundList(data.applicationOID)
                                .success(function (dataList) {
                                    if (dataList && dataList.length > 0) {
                                        dataList.forEach(function (item) {
                                            $scope.view.refundDataList.push(item);
                                        });
                                    }
                                })
                        })
                });
            });
            $scope.$on('$stateChangeSuccess', function (event, toState, fromState) {
                if ($scope.view.backStatus && toState.name === 'app.didi_refund_detail') {
                    $state.go('app.custom_application_refund', {
                        applicationOID: $stateParams.applicationOID,
                        formType: $stateParams.formType
                    });

                }
            });
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
