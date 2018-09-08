/**
 * 类型：lov
 * （报销单-申请单）-收款方
 * Created by Dawn on 2017/10/20.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecbeneficiarySelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                beneficiaryDesc: '=',
                readonly: '=',
                companyId: '=',
                paymentObject: '@',//收款对象：客户CUSTOMER  供应商VENDER
                accountNum:'=?',//默认银行账号
                accountName:'=?',//默认账户名
                bankCode:'=?',//银行code
                bankName:'=?',//银行name
                bankLocationCode:'=?',//分行code
                bankLocationName:'=?',//分行name
            },
            templateUrl: 'scripts/components/hec/beneficiary/hecbeneficiary.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.hecbeneficiarySelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.hecbeneficiarySelectorController', [
        '$scope', '$http', '$ionicModal', 'HecbeneficiaryService', '$sessionStorage', '$filter', 'PublicFunction', 'LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecbeneficiaryService, $sessionStorage, $filter, PublicFunction, LocalStorageKeys) {
            $scope.searchKeyword = {value: ""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.beneficiaryList = [];
            $scope.nothing = false;

            $ionicModal.fromTemplateUrl('hecbeneficiary.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.beneficiaryList = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (beneficiary) {
                $scope.beneficiaryDesc = beneficiary.partner_code;
                $scope.selected = beneficiary.id;
                $scope.accountNum = beneficiary.account_number;
                $scope.accountName = beneficiary.account_name;
                $scope.bankCode = beneficiary.bank_code;
                $scope.bankName = beneficiary.bank_name;
                $scope.bankLocationCode = beneficiary.bank_location_code;
                $scope.bankLocationName = beneficiary.bank_location_name;
                $scope.modal.hide();
            };

            $scope.searchBeneficiary = function () {
                $scope.beneficiaryList = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var dataType = "csh_payment_req_customer";
                if($scope.paymentObject == 'CUSTOMER'){//客户
                    dataType = 'csh_payment_req_customer';
                }else if($scope.paymentObject == 'VENDER'){//供应商
                    dataType = 'csh_payment_req_vendor';
                }
                var q = HecbeneficiaryService.searchKeywords($scope.searchKeyword.value,dataType, $scope.companyId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    if(dataRes.success){
                        $scope.lastPage = dataRes.result.pageCount;
                        if ($scope.lastPage > 0) {
                            $scope.nothing = false;
                            $scope.beneficiaryList = $scope.beneficiaryList.concat(dataRes.result.record);
                        } else {
                            $scope.nothing = true;
                            $scope.beneficiaryList = [];
                        }
                    }else{
                        PublicFunction.showToast(dataRes.error);  // 加载失败
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if (error === 'keywords.is.ambiguous') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        PublicFunction.showToast($filter('translate')('hec_common.searchError'));  // 加载失败
                    }
                });

            };

            //页面销毁时,释放modal占用的资源
            $scope.$on('$ionicView.leave', function (event, viewData) {
                $scope.modal.remove();
            });
        }
    ]);

