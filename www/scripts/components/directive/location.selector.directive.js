'use strict';
angular.module('huilianyi.pages')
    .directive('locationSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                styleClassName: '@',
                callback: '=',
                location: '=',
                expenseType: '=',
                readonly: '='
            },
            templateUrl: 'scripts/components/directive/location.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.LocationSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.LocationSelectorController', [
        '$scope', '$http', '$ionicModal', 'MapService', 'LocationService', '$sessionStorage','$filter', 'PublicFunction',
        function ($scope, $http, $ionicModal, MapService, LocationService, $sessionStorage,$filter, PublicFunction) {
            var mode = 'nearby';
            var placeType = null;
            $scope.map = null;
            $scope.searchKeyword = '';
            $scope.page = 1;
            $scope.size = 15;
            $scope.locations = [];
            $scope.markers = [];
            $ionicModal.fromTemplateUrl('location.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.locationDisplayName = function () {
                if ($scope.selected) {
                    var location = {};
                    try {
                        location = angular.fromJson($scope.selected);
                    } catch(error) {
                        location = $scope.selected;
                    }

                    if (location.address) {
                        return location.address
                    } else {
                        return location
                    }
                }  else {
                    return null;
                }
            };
            $scope.openDialog = function () {
                $scope.modal.show();
                mode = 'nearby';
                $scope.locations = [];
                determinePlaceType();
                $scope.loadMore(1);
            };
            $scope.selectItem = function (item) {
                if ($scope.callback) {
                    $scope.callback(item);
                }
                var result = {
                    address: item.name,
                    longitude: item.longitude,
                    latitude: item.latitude
                };
                $scope.selected = JSON.stringify(result);
                $scope.modal.hide();
            };
            $scope.searchLocation = function (keyword) {
                mode = 'keyword';
                $scope.locations = [];
                $scope.loadMore(1, keyword);
            };

            $scope.loadMore = function (page, keyword) {
                $scope.page = page;
                var q = null;
                if (mode === 'nearby') {
                    q = LocationService.searchNearby(placeType, $scope.location.longitude, $scope.location.latitude, page, $scope.size);
                } else {
                    q = LocationService.searchKeywords(keyword, placeType, $sessionStorage.currentCity, page, $scope.size);
                }
                q.then(function (data) {
                    $scope.locations = $scope.locations.concat(data);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if(error==='keywords.is.ambiguous' || error==='location.service.failed') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        //PublicFunction.showToast($filter('translate')('location_js.searchError'));  // 加载失败
                    }

                });
            };
            var determinePlaceType = function () {
                switch ($scope.expenseType) {
                    case $filter('translate')('location_js.ticket')://机票
                        placeType = '150100';
                        break;
                    case $filter('translate')('location_js.train')://火车
                        placeType = '150200';
                        break;
                    case $filter('translate')('location_js.catering')://餐饮
                        placeType = '05';
                        break;
                    case $filter('translate')('location_js.hotel')://酒店
                        placeType = '10';
                        break;
                    case $filter('translate')('location_js.conference')://会务
                        placeType = '10';
                        break;
                    case $filter('translate')('location_js.traffic')://交通
                        placeType = '15';
                        break;
                    case $filter('translate')('location_js.coach')://大巴
                        placeType = '15';
                        break;
                    default:
                        placeType = null;
                        break;

                }
            }
        }
    ]);

