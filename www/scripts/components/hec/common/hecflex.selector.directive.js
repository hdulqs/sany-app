/**
 * 类型：弹性域中共用的lov模板
 * Created by Dawn on 2017/8/17.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('heccommonSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected:'=',
                readonly: '=',
                itemId:'=?',
                itemCode:'=?',
                flexId:'@'
            },
            templateUrl: 'scripts/components/hec/common/hecflex.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecflexSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecflexSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecflexService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecflexService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.page = 0;
            $scope.lastPage= 1;
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.lists = [];
            $scope.searchKeyword = {value:""};

            $ionicModal.fromTemplateUrl('heccommon.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.lists = [];
                $scope.searchKeyword.value = "";
                $scope.loadMore(1);
            };

            $scope.selectItem = function (item) {
                $scope.itemCode = item.code;
                $scope.itemId = item.id;
                $scope.selected = item.name;
                $scope.modal.hide();
            };


            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecflexService.search($scope.searchKeyword.value,$scope.flexId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.lists = $scope.lists.concat(dataRes.result.record);
                    } else {
                        $scope.lists = [];
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                },function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if (error === 'keywords.is.ambiguous') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        PublicFunction.showToast($filter('translate')('hec_common.searchError'));  // 加载失败
                    }
                });
            };

            $scope.searchFlex = function () {
                $scope.lists = [];
                $scope.loadMore(1);
            };


        }
    ]);

