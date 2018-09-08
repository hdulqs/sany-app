/**
 * Created by hly on 2016/12/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.didi_refund_detail', {
                url: '/didi/refund/detail?applicationOID?formType',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/custom_application/didi_refund/didi.refund.detail.html',
                        'controller': 'huilianyi.DiDiRefundDetailController'
                    }
                },
                params: {
                    amount: null
                },
                resolve: {
                    isReadOnly: function () {
                        return false;
                    },
                    isFinish: function () {
                        return false;
                    },
                    isApproval: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            //进行中
            .state('app.didi_refund_detail_wait', {
                url: '/didi/refund/detail/wait?applicationOID?formType?repaymentOid',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/custom_application/didi_refund/didi.refund.detail.html',
                        'controller': 'huilianyi.DiDiRefundDetailController'
                    }
                },
                resolve: {
                    isReadOnly: function () {
                        return true;
                    },
                    isFinish: function () {
                        return false;
                    },
                    isApproval: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            //还款完成和失败
            .state('app.didi_refund_detail_readonly', {
                url: '/didi/refund/detail/readonly?applicationOID?formType?repaymentOid',
                cache: false,
                views: {
                    'page-content@app': {
                        'templateUrl': 'scripts/pages/expense_report_version/custom_application/didi_refund/didi.refund.detail.html',
                        'controller': 'huilianyi.DiDiRefundDetailController'
                    }
                },
                resolve: {
                    isReadOnly: function () {
                        return true;
                    },
                    isFinish: function () {
                        return true;
                    },
                    isApproval: function () {
                        return false;
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('huilianyi.DiDiRefundDetailController', ['$scope', 'Principal', '$state', 'isReadOnly', 'isFinish',
        'isApproval', '$ionicModal', '$ionicPopup', '$stateParams', 'CustomApplicationServices', 'PublicFunction',
        '$q', 'CompanyConfigurationService', 'CurrencyCodeService', '$ionicLoading', 'FunctionProfileService',
        '$timeout','$ionicPlatform','$ionicHistory','$location', '$filter', '$sessionStorage',
        function ($scope, Principal, $state, isReadOnly, isFinish, isApproval, $ionicModal, $ionicPopup, $stateParams,
                  CustomApplicationServices, PublicFunction, $q, CompanyConfigurationService, CurrencyCodeService,
                  $ionicLoading, FunctionProfileService, $timeout,$ionicPlatform,$ionicHistory,$location, $filter, $sessionStorage) {
            $scope.view = {
                accountPlaceholder:$filter('translate')('didi_detail.bank'),//开户银行
                amount: $stateParams.amount,//需还款总金额
                isReadOnly: isReadOnly,
                isFinish: isFinish,
                isApproval: isApproval,
                deleteAttachment: [],
                title: $filter('translate')('didi_refund.I.want.to.reimbursement'),//我要还款
                uploadFinish: true,
                keyboardVisible: false,
                backStatus: false,
                disabled: false,
                decimalLenght: 2,
                refundData: {
                    acceptAccountName: '',
                    acceptAccount: '',
                    acceptBankName: '',
                    payAccount: '',
                    payAccountName: '',
                    payBankName: '',
                    repaymentValue: '',
                    repayAttchment: [],
                    allAmount: false
                },
                language: $sessionStorage.lang,//获取当前页面语言环境
                clearData: function (data) {
                    if (data in $scope.view.refundData) {
                        $scope.view.refundData[data] = '';
                    }
                },
                validate: function () {
                    var defer = $q.defer();
                    if (!$scope.view.refundData.acceptAccountName || !$scope.view.refundData.payAccountName) {
                        PublicFunction.showToast($filter('translate')('didi_detail_js.Please.enter.the.name.to.open.an.account'));//请输入开户名
                        defer.reject(false);
                    } else if (!$scope.view.refundData.acceptAccount || !$scope.view.refundData.payAccount) {
                        PublicFunction.showToast($filter('translate')('didi_detail_js.Please.enter.the.account.opening.an.account'));//请输入开户账号
                        defer.reject(false);
                    } else if (!$scope.view.refundData.acceptBankName || !$scope.view.refundData.payBankName) {
                        PublicFunction.showToast($filter('translate')('didi_detail_js.Please.enter.the.bank'));//请输入开户银行
                        defer.reject(false);
                    } else if (isNaN(parseFloat($scope.view.refundData.repaymentValue))) {
                        PublicFunction.showToast($filter('translate')('didi_detail_js.The.amount.must.be.greater.than.zero'));//金额必须大于0
                        defer.reject(false);
                    } else if (parseFloat($scope.view.refundData.repaymentValue) > parseFloat($stateParams.amount)) {
                        PublicFunction.showToast($filter('translate')('didi_detail_js.The.amount.is.not.greater.than.for.payments'));//金额不能大于待还款金额
                        defer.reject(false);
                    } else if ($scope.view.functionProfileList && !$scope.view.functionProfileList['app.didi.refund.upload.disabled']) {
                        if ($scope.view.refundData.repayAttchment && $scope.view.refundData.repayAttchment.length === 0) {
                            PublicFunction.showToast($filter('translate')('didi_detail_js.Please.upload.pictures'));//请上传图片
                            defer.reject(false);
                        }else{
                            defer.resolve(true);
                        }
                    } else {
                        defer.resolve(true);
                    }
                    return defer.promise;
                },
                commit: function () {
                    if ($scope.view.uploadFinish) {
                        $scope.view.validate().then(function () {
                            PublicFunction.showLoading();
                            var hasFinish = false;
                            $scope.view.disabled = true;
                            $scope.view.refundData.loanApplicationOid = $stateParams.applicationOID;
                            $scope.view.refundData.repaymentValue = parseFloat($scope.view.refundData.repaymentValue) ? parseFloat($scope.view.refundData.repaymentValue) : 0;
                            $scope.view.refundData.acceptAccount = $scope.view.refundData.acceptAccount.split(' ').join('');
                            $scope.view.refundData.payAccount = $scope.view.refundData.payAccount.split(' ').join('');
                            //没有删除的照片
                            if ($scope.view.deleteAttachment && $scope.view.deleteAttachment.length === 0) {
                                var i = 0;
                                for (; i < $scope.view.refundData.repayAttchment.length; i++) {
                                    if ($scope.view.refundData.repayAttchment[i].attachmentOID === -1) {
                                        $scope.view.refundData.repayAttchment.splice(i,1);
                                    }
                                }
                                if (i === $scope.view.refundData.repayAttchment.length) {
                                    hasFinish = true;
                                }
                            } else {
                                var deleteIndex = 0;
                                var attachIndex = 0;
                                for (; deleteIndex < $scope.view.deleteAttachment.length; deleteIndex++) {
                                    for (; attachIndex < $scope.view.refundData.repayAttchment.length; attachIndex) {
                                        if ($scope.view.refundData.repayAttchment[attachIndex].attachmentOID === -1) {
                                            $scope.view.attachments.splice(attachIndex, 1);
                                            break;
                                        }
                                        if ($scope.view.deleteAttachment[deleteIndex] === $scope.view.refundData.repayAttchment[attachIndex].attachmentOID) {
                                            $scope.view.refundData.repayAttchment.splice(attachIndex, 1);
                                            break;
                                        }
                                    }
                                }
                                if (deleteIndex === $scope.view.deleteAttachment.length && attachIndex === $scope.view.attachments.length) {
                                    hasFinish = true;
                                }
                            }
                            if (hasFinish) {
                                CustomApplicationServices.commitRefund($scope.view.refundData)
                                    .success(function () {
                                        var refundStatus = false;
                                        if (parseFloat($scope.view.refundData.repaymentValue) === $stateParams.amount) {
                                            refundStatus = true;
                                        }
                                        PublicFunction.showToast($filter('translate')('didi_detail_js.Submitted.successfully'));//提交成功
                                        $timeout(function () {
                                            $state.go('app.didi_refund_base', {
                                                applicationOID: $stateParams.applicationOID,
                                                formType: $stateParams.formType,
                                                refundStatus: refundStatus
                                            });
                                        }, 500);
                                    })
                                    .error(function () {
                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                    })
                                    .finally(function () {
                                        $ionicLoading.hide();
                                        $scope.view.disabled = false;
                                    })
                            }
                        })
                    } else {
                        $scope.view.disabled = false;
                        PublicFunction.showToast($filter('translate')('didi_detail_js.Pictures.are.on.the.cross'));//图片正在上传中...
                    }
                }
            };


            $scope.keyboardSettings = {
                action: function (number) {
                    $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue ? $scope.view.refundData.repaymentValue.toString() : '';
                    var decimal;
                    if ($scope.view.refundData.repaymentValue.indexOf('.') > -1) {
                        decimal = $scope.view.refundData.repaymentValue.split('.')[1];
                        if (decimal.length < $scope.view.decimalLenght) {
                            $scope.view.refundData.repaymentValue += number;
                        }
                    } else {
                        $scope.view.refundData.repaymentValue += number;
                        if ($scope.view.refundData.repaymentValue.length > 1 && $scope.view.refundData.repaymentValue.substr(0, 1) === '0' && $scope.view.refundData.repaymentValue.substr(2, 1) !== '0') {
                            PublicFunction.showToast($filter('translate')('didi_detail_js.Please.enter.the.legal.amount'));//请输入合法的金额
                            $scope.view.refundData.repaymentValue = '';
                            return;
                        }

                    }
                },
                leftButton: {
                    html: '.',
                    action: function () {
                        $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue ? $scope.view.refundData.repaymentValue.toString() : '';
                        var index = $scope.view.refundData.repaymentValue.indexOf('.');
                        if (index === -1) {
                            if ($scope.view.refundData.repaymentValue) {
                                $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue + '.';
                            } else {
                                $scope.view.refundData.repaymentValue = '0.';
                            }
                        } else {
                            if (index === 0) {
                                $scope.view.refundData.repaymentValue = '0.00';
                            } else {
                                if (!$scope.view.refundData.repaymentValue.split('.')[1]) {
                                    $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue.slice(0, index) + '.00';
                                }
                            }
                        }
                    }
                },
                rightButton: {
                    html: '<i class="icon ion-backspace"></i>',
                    action: function () {
                        $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue ? $scope.view.refundData.repaymentValue.toString() : '';
                        $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue.slice(0, -1);
                    }
                },
                topButton: {
                    html: "<span>" + $filter('translate')('didi_detail.close') + "</span>",
                    action: function ($event) {
                        $scope.hideKeyboard($event);
                        e.stopPropagation();
                    }
                }
            };
            $ionicPlatform.registerBackButtonAction(function (e) {
                //判断处于哪个页面时双击退出
                if($location.path() === '/didi/refund/detail'){
                    if($scope.view.keyboardVisible){
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.view.keyboardVisible = false;
                            });
                        }, 0);
                    }else{
                        $ionicHistory.goBack();
                    }
                }
                event.stopPropagation();
                return false;
            }, 101);
            $scope.showKeyboard = function (event) {
                $scope.keyboardStatus = true;
                $scope.view.keyboardVisible = true;
                event.stopPropagation();
            };

            $scope.hideKeyboard = function (event) {
                $scope.view.keyboardVisible = false;
                setTimeout(function () {
                    $scope.keyboardStatus = false;
                    $scope.$apply();
                },500);
                event.stopPropagation();
            };


            $scope.$watch('view.refundData.repaymentValue', function (newValue, oldValue) {
                if (newValue && parseFloat(newValue) !== parseFloat($stateParams.amount)) {
                    $scope.view.refundData.allAmount = false;
                    $scope.view.refundData.repaymentValue = newValue;
                } else if (newValue && parseFloat(newValue) === parseFloat($stateParams.amount)) {
                    $scope.view.refundData.allAmount = true;
                    $scope.view.refundData.repaymentValue = newValue;
                }
            });
            $scope.$watch('view.refundData.allAmount', function (newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    $scope.view.refundData.repaymentValue = $stateParams.amount;
                }

            });
            $scope.$on('$ionicView.enter', function () {
                // if ($scope.view.isReadOnly) {
                //     $scope.view.title = $filter('translate')('didi_detail_js.Transfer.payments');//转账还款
                // }
                if ($scope.view.functionProfileList && !$scope.view.functionProfileList['app.didi.refund.amount.disabled']) {
                    $scope.view.refundData.repaymentValue = $stateParams.amount;
                } else {
                    $scope.view.refundData.repaymentValue = '';
                }
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                    $scope.originCurrencyCode = data.currencyCode;
                    Principal.identity().then(function (response) {
                        if (response.corporationOID) {
                            CustomApplicationServices.getReceiptDetails(response.corporationOID)
                                .success(function (data) {
                                    $scope.view.refundData.acceptAccountName = data.companyName;
                                    $scope.view.refundData.acceptBankName = data.accountBank;
                                    $scope.view.refundData.acceptAccount = data.cardNumber;
                                });
                        }
                        CustomApplicationServices.getOwnerAccount()
                            .success(function (data) {
                                if (data && data.length > 0) {
                                    $scope.view.refundData.payAccountName = data[0].bankAccountName;
                                    $scope.view.refundData.payAccount = data[0].bankAccountNo;
                                    $scope.view.refundData.payBankName = data[0].bankName;
                                }
                            })
                    });
                });

                //还款各种状态查询
                if ($stateParams.repaymentOid) {
                    CustomApplicationServices.getRefundStatusDetail($stateParams.repaymentOid)
                        .success(function (data) {
                            console.log($scope.view.refundData)
                            $scope.view.refundData = data;
                            if ($scope.view.isReadOnly) {
                                if($scope.view.refundData.type==='0'){
                                    $scope.view.title = $filter('translate')('didi_detail_js.cashRepayment');//现金还款
                                }else{
                                    $scope.view.title = $filter('translate')('didi_detail_js.Transfer.payments');//转账还款
                                }
                            }
                        })
                }

            });
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
