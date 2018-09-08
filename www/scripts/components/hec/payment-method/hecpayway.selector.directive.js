/**
 * 类型：combox
 * 付款方式 （申请单-报销单共用）
 * Created by Dawn on 2017/10/20.
 */

'use strict';
angular.module('huilianyi.pages')
    .directive('hecpaywaySelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                paymentMethodDesc:'=',
                readonly: '='
            },
            templateUrl: 'scripts/components/hec/payment-method/hecpayway.selector.directive.html',
            controller: 'com.handchina.hly.dialog.hecpaywaySelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.hecpaywaySelectorController', [
        '$scope', '$http', '$ionicModal',  'hecpaywayService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, hecpaywayService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.payList = [];

            $ionicModal.fromTemplateUrl('hecpayway.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.payList = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (item) {
                $scope.paymentMethodDesc = item.description;
                $scope.selected = item.payment_method_id;
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.payList = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                var q = hecpaywayService.searchKeywords(page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage  = dataRes.result.pageCount;
                    if ($scope.lastPage  > 0) {
                        $scope.payList = $scope.payList.concat(dataRes.result.record);
                    }else{
                        $scope.payList = [];
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

