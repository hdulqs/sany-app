'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.approval_map', {
                url: '/approval/map',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/approval/map.view.tpl.html',
                        controller: 'com.handchina.hly.MapViewController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('approval');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.hly.MapViewController',
        ['$scope', 'MapService', 'InvoiceService', '$ionicHistory', 'ExpenseService', '$rootScope', 'PushService',
        function ($scope, MapService, InvoiceService, $ionicHistory, ExpenseService, $rootScope, PushService) {
            $scope.map = null;
            $scope.dates = [];
            $scope.expenses = {};
            $scope.$on('$ionicView.enter', function () {
                ExpenseService.getMessageList(0, 1)
                    .success(function (data, status, headers) {
                        $scope.total = headers('x-total-count');
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
                $scope.map = MapService.initMap('MapCanvas');
                InvoiceService.getInvoices(0, 100).success(function (data) {

                    $scope.expense.markers = {};
                    $scope.expense.data = data;
                    for (var i = 0; i < data.length; i++) {
                        var hasGPSFields = false;
                        var markers = [];
                        for (var j = 0; j < data[i].data.length; j++) {
                            var field = data[i].data[j];
                            if (field.fieldType === 'GPS') {
                                hasGPSFields = true;
                                markers.push(JSON.parse(field.value));
                                if (!data[i].markers) {
                                    data[i].markers = [];
                                }
                                data[i].markers.push(JSON.parse(field.value));
                            }
                        }
                        if (!$scope.expense.markers[i]) {
                            $scope.expense.markers[i] = [];
                        }
                        if (!$scope.expense.highlightedMarkers[i]) {
                            $scope.expense.highlightedMarkers[i] = []
                        }
                        if (markers.length === 1) {
                            var marker = MapService.createMarker($scope.map, markers[0].longitude, markers[0].latitude)
                            var highlightMarker = MapService.createHightMarker($scope.map, markers[0].longitude, markers[0].latitude)
                            $scope.expense.markers[i].push(marker);
                            $scope.expense.highlightedMarkers[i].push(highlightMarker);
                        } else {
                            var marker1 = MapService.createMarker($scope.map, markers[0].longitude, markers[0].latitude)
                            var highlightMarker1 = MapService.createHightMarker($scope.map, markers[0].longitude, markers[0].latitude)
                            $scope.expense.markers[i].push(marker1);
                            $scope.expense.highlightedMarkers[i].push(highlightMarker1);
                            var marker2 = MapService.createMarker($scope.map, markers[1].longitude, markers[1].latitude)
                            var highlightMarker2 = MapService.createHightMarker($scope.map, markers[1].longitude, markers[1].latitude)
                            $scope.expense.markers[i].push(marker2);
                            $scope.expense.highlightedMarkers[i].push(highlightMarker2);
                            new AMap.Polyline({
                                path: [[markers[0].longitude, markers[0].latitude], [markers[1].longitude, markers[1].latitude]],            // 设置线覆盖物路径
                                strokeColor: '#3366FF',   // 线颜色
                                strokeOpacity: 1,         // 线透明度
                                strokeWeight: 4,          // 线宽
                                strokeStyle: 'solid',     // 线样式
                                strokeDasharray: [10, 5], // 补充线样式
                                geodesic: true            // 绘制大地线
                            }).setMap($scope.map);
                        }

                        if (i !== 0) {
                            highlightMarker.hide();
                        }
                    }
                    $scope.map.setFitView();
                })

            });

            $scope.expense = {
                data: [],
                dates: [],
                markers: [],
                highlightedMarkers: []
                // isDetailMode: true,
                // openExpenseDetail: function (expense) {
                //     $scope.expense.isDetailMode = !$scope.expense.isDetailMode;
                // }
            };
            $scope.slides = {};

            $scope.$watch('slides.currentExpenseIndex;', function (newValue, oldValue) {
                if (typeof newValue !== 'undefined') {
                    var markers = $scope.expense.highlightedMarkers[newValue];
                    if (markers) {
                        angular.forEach(markers, function (marker) {
                            marker.show();
                        });
                    }
                }
                if (typeof oldValue !== 'undefined') {
                    angular.forEach($scope.expense.highlightedMarkers[oldValue], function (marker) {
                        marker.hide();
                    })
                }
            });
        }]);

