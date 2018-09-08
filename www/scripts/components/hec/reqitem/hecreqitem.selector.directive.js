/**
 * 类型：combox
 * 费用申请单--通用申请行--申请项目
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecreqitemSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                reqItemName:'=',
                readonly: '=',
                companyId:'=',
                expenseTypeId:'='
            },
            templateUrl: 'scripts/components/hec/reqitem/hecreqitem.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecReqItemSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecReqItemSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecReqItemService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecReqItemService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
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
                $scope.reqItems = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (reqItem) {
                $scope.reqItemName = reqItem.description;
                $scope.selected = reqItem.req_item_id;
                $scope.modal.hide();
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecReqItemService.searchKeywords($scope.companyId, $scope.expenseTypeId,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.nothing = false;
                        $scope.reqItems = $scope.reqItems.concat(dataRes.result.record);
                    }else{
                        $scope.nothing = true;
                        $scope.reqItems=[];
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

