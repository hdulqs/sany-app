/**
 * 类型：lov
 * 费用账本-新建费用-成本中心
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecrespSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                respName: '=',
                readonly: '=',
                companyId: '=',
                unitId: '=',
                employeeId: '=?'
            },
            templateUrl: 'scripts/components/hec/resp/hecresp.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecrespSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecrespSelectorController', [
        '$scope', '$http', '$ionicModal', 'HecrespService', '$sessionStorage', '$filter', 'PublicFunction', 'LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecrespService, $sessionStorage, $filter, PublicFunction, LocalStorageKeys) {
            $scope.searchKeyword = {value: ""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.resps = [];
            $scope.nothing = false;

            $ionicModal.fromTemplateUrl('hecresp.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.resps = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (resp) {
                $scope.respName = resp.responsibility_center_name;
                $scope.selected = resp.responsibility_center_id;
                $scope.modal.hide();
            };

            $scope.searchResp = function () {
                $scope.resps = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecrespService.searchKeywords($scope.searchKeyword.value, $scope.companyId, $scope.unitId, $scope.employeeId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.nothing = false;
                        $scope.resps = $scope.resps.concat(dataRes.result.record);
                    } else {
                        $scope.nothing = true;
                        $scope.resps = [];
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

