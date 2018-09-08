/**
 * 类型：lov
 * 费用账本-新建费用-部门
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecunitSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                unitName:'=',
                readonly: '=',
                companyId:'=',
                respCenterId:'=?',
                respCenterName:'=?',
                positionId:'=?'
            },
            templateUrl: 'scripts/components/hec/unit/hecunit.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecunitSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecunitSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecunitService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecunitService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.searchKeyword = {value:""};
            $ionicModal.fromTemplateUrl('hecunit.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.units = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (unit) {
                $scope.unitName = unit.unit_code_name;
                $scope.selected = unit.unit_id;
                $scope.respCenterId =unit.responsibility_center_id?unit.responsibility_center_id:'';
                $scope.respCenterName= unit.responsibility_center_name?unit.responsibility_center_name:'';
                $scope.positionId = unit.position_id? unit.position_id:'';
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.units = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecunitService.searchKeywords($scope.searchKeyword.value,$scope.companyId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.units = $scope.units.concat(dataRes.result.record);
                    }else{
                        $scope.units=[];
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

