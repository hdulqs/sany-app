/**
 * 飞机仓位类型：combox
 * 差旅申请单--差旅申请行--机票舱位
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('heccabinSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                codeValueName:'=',
                readonly: '='
            },
            templateUrl: 'scripts/components/hec/cabin/heccabin.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecCabinSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecCabinSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecCabinService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecCabinService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.cabins = [];

            $ionicModal.fromTemplateUrl('heccabin.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.cabins = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (cabin) {
                $scope.codeValueName = cabin.code_value_name;
                $scope.selected = cabin.code_value;
                $scope.modal.hide();
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecCabinService.searchKeywords(page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.cabins = $scope.cabins.concat(dataRes.result.record);
                    }else{
                        $scope.cabins = [];
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

