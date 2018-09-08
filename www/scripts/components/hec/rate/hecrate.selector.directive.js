/**
 * 类型：combox
 * 费用账本-新建费用-税率
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecrateSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                rateName:'=',
                readonly: '=',
                taxTypeRate: '='
            },
            templateUrl: 'scripts/components/hec/rate/hecrate.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecrateSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecrateSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecrateService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecrateService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.rates = [];

            $ionicModal.fromTemplateUrl('hecrate.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.rates = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (rate) {
                $scope.rateName = rate.tax_type_desc;
                $scope.selected = rate.tax_type_id;
                $scope.taxTypeRate = rate.tax_type_rate;
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.rates = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecrateService.searchKeywords( page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.rates = $scope.rates.concat(dataRes.result.record);
                    }else{
                        $scope.rates = [];
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

