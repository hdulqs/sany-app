/**
 * 类型：combox
 * 费用账本-新建费用-业务期间
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecperiodSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                readonly: '=',
                companyId:'='
            },
            templateUrl: 'scripts/components/hec/period/hecperiod.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecperiodSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecperiodSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecperiodService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecperiodService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.periods = [];

            $ionicModal.fromTemplateUrl('hecperiod.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.periods = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (period) {
                $scope.selected = period.period_name;
                $scope.modal.hide();
            };

            $scope.searchPeriod = function () {
                $scope.periods = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecperiodService.searchKeywords($scope.companyId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.periods = $scope.periods.concat(dataRes.result.record);
                    }else{
                        $scope.periods = [];
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

