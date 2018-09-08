/**
 * 类型：combox
 * 借款申请单--行--银行账号
 * Created by rong.hu on 2017/10/23.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecaccountSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                accountNumber:'=',
                accountName:'=',
                partnerId:'=',
                readonly: '=',
            },
            templateUrl: 'scripts/components/hec/account/hecaccount.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecAccountSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecAccountSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecAccountService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecAccountService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.nothing = false;
            $ionicModal.fromTemplateUrl('hecreqitem.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.accounts = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (loanType) {
                $scope.accountNumber = loanType.account_number;
                $scope.accountName = loanType.account_name;
                $scope.selected = loanType.account_number;
                $scope.modal.hide();
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecAccountService.searchKeywords($scope.partnerId,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.nothing = false;
                        $scope.accounts = $scope.accounts.concat(dataRes.result.record);
                    }else{
                        $scope.nothing = true;
                        $scope.accounts=[];
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
        }
    ]);

