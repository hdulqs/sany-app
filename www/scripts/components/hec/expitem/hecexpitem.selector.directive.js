/**
 * 类型：lov
 * 费用账本--费用项目(暂未使用)
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecexpitemSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                expItemName:'=',
                readonly: '=',
                companyId:'=',
                expTypeId:'='
            },
            templateUrl: 'scripts/components/hec/expitem/hecexpitem.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecexpitemSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecexpitemSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecexpitemService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecexpitemService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.searchKeyword = {value:""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.expitems = [];

            $ionicModal.fromTemplateUrl('hecexpitem.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.expitems = [];
                $scope.searchKeyword.value = "";
                $scope.loadMore(1,$scope.searchKeyword);
            };

            $scope.selectItem = function (expitem) {
                $scope.expItemName = expitem.expense_item_description;
                $scope.selected = expitem.expense_item_id;
                $scope.modal.hide();
            };

            $scope.searchExpItem = function () {
                $scope.expitems = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecexpitemService.searchKeywords($scope.searchKeyword.value,$scope.companyId, $scope.expTypeId,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.expitems = $scope.expitems.concat(dataRes.result.record);
                    }else{
                        $scope.expitems = [];
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

