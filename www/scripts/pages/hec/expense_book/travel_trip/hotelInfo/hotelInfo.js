/**
 * Created by Dawn on 2017/8/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.hotelInfo', {
                cache: false,
                url: '/hotelInfo',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/hotelInfo/hotelInfo.html',
                        controller: 'hotelInfoCtrl',
                        controllerAs:'vm'
                    }
                }
            })
    }])
    .controller('hotelInfoCtrl', ['$scope','$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        function ($scope,  $filter,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout) {
            var vm = this;
            vm.test = "测试！";
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };
        }]);
