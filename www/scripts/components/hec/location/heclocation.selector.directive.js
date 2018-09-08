/**
 * 类型：lov
 * 费用申请单--差旅申请--城市(出发地和到达地)
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('heclocationSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                locName: '=',
                readonly: '=',
                locType: "@",
                stateFlag: "=?", // Y/国际城市  N/国内城市
                reqTypeCode: '=?',  //差旅申请单类型： 1010/国内  1015/国际
                cityName: "=?",   //当地点的stateFlag为N(国内)，需要隐藏城市输入框，并清空城市
                placeId:"=?"
            },
            templateUrl: 'scripts/components/hec/location/heclocation.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HeclocationSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HeclocationSelectorController', [
        '$scope', '$http', '$ionicModal', 'HeclocationService', '$sessionStorage', '$filter', 'PublicFunction', 'LocalStorageKeys',
        function ($scope, $http, $ionicModal, HeclocationService, $sessionStorage, $filter, PublicFunction, LocalStorageKeys) {
            $scope.searchKeyword = {value: ""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.locations = [];

            $ionicModal.fromTemplateUrl('heclocation.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.locations = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (location) {
                $scope.locName = location.place_desc;
                $scope.selected = location.place_code;
                $scope.stateFlag = location.state_flag;
                $scope.placeId = location.place_id;
                if($scope.stateFlag === "N"){
                    $scope.cityName = "";
                }
                $scope.modal.hide();
            };

            $scope.searchLocation = function () {
                $scope.locations = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HeclocationService.searchKeywords($scope.searchKeyword.value, $scope.reqTypeCode, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.locations = $scope.locations.concat(dataRes.result.record);
                    } else {
                        $scope.locations = [];
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

