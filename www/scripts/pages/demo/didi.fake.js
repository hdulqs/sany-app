/**
 * Created by jingren on 16/8/26.
 */
'use strict';

angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.didi_fake_demo', {
            url: '/demo/didi_fake',
            cache: false,
            views: {
                'main@': {
                    templateUrl: 'scripts/pages/demo/didi_fake.tpl.html',
                    controller: 'DidiFakeController'
                }
            }
        })
    }])
    .controller('DidiFakeController', ['$scope', 'DidiFakeService', 'localStorageService', '$ionicLoading', '$filter',
        function ($scope, DidiFakeService, localStorageService, $ionicLoading, $filter) {
            $scope.phoneNum = localStorageService.get('username');
            // console.log($scope.phoneNum);
            $scope.takingATaxi = function (phoneNum) {
                DidiFakeService.getDidiOrders(phoneNum).then(function (res) {
                    if(res.status === 200){
                        $ionicLoading.show({template: $filter('translate')('didi_fake.order.success'), noBackdrop: true, duration: 2000});
                    }
                    // console.log(res);
                }, function (err) {
                    console.log(err);
                    $ionicLoading.show({template: $filter('translate')('didi_fake.request.error'), noBackdrop: true, duration: 2000});
                });
            }
    }])
    .factory('DidiFakeService', ['$q', '$http', 'ServiceBaseURL', function ($q, $http, ServiceBaseURL) {
        return {
            getDidiOrders : function (phoneNum) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/demo/didi/orders/call?phone=' + phoneNum,
                        data: {}
                    }).then(function (res) {
                        resolve(res);
                    }, function (err) {
                        reject(err);
                    })
                })
            }
        };
    }])
;
