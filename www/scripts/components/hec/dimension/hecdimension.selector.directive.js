/**
 * 类型：combox
 * 费用账本-新建费用-维度
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecdimensionSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                dimensionId:'@',
                companyId:'@',
                dimDesc:'=',
                readonly: '=',
                dimPrompt:'=',
                loanFlag:'@'//借款单调用的接口不一样
            },
            templateUrl: 'scripts/components/hec/dimension/hecdimension.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecdimensionSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecdimensionSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecdimensionService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecdimensionService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.searchKeyword = {value:""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.dimensions = [];

            $ionicModal.fromTemplateUrl('hecdimension.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.dimensions = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (dimension) {
                if($scope.loanFlag=='loan'){
                    $scope.dimDesc = dimension.project_name;
                    $scope.selected = dimension.project_id;
                }else{
                    $scope.dimDesc = dimension.description;
                    $scope.selected = dimension.dimension_value_id;
                }
                $scope.modal.hide();
            };

            $scope.searchDimension = function () {
                $scope.dimensions = [];
                $scope.loadMore(1);
            };


            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecdimensionService.getDimensionDetail($scope.searchKeyword.value,$scope.companyId,$scope.dimensionId,$scope.loanFlag,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.dimensions = $scope.dimensions.concat(dataRes.result.record);
                    }else{
                        $scope.dimensions = [];
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

