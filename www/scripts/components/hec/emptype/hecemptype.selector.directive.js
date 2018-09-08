/**
 * 类型：combox
 * 费用申请单-差旅申请--差旅同行人-员工类型
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecemptypeSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                empTypeName:'=',
                readonly: '=',
                isInternal:'='
            },
            templateUrl: 'scripts/components/hec/emptype/hecemptype.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecemptypeSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecemptypeSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecemptypeService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecemptypeService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.emptypes = [];

            $ionicModal.fromTemplateUrl('hecemptype.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.emptypes = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (emptype) {
                $scope.empTypeName = emptype.code_value_name;
                $scope.selected = emptype.code_value;
                if(emptype.code_value === "INTERNAL_STAFF"){
                    $scope.isInternal = true;
                }else{
                    $scope.isInternal = false;
                }
                $scope.modal.hide();
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecemptypeService.searchKeywords(page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.emptypes = $scope.emptypes.concat(dataRes.result.record);
                    }else{
                        $scope.emptypes = [];
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

