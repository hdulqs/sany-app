/**
 * Created by Dawn on 2017/8/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.completeInfo', {
                cache: false,
                url: '/completeInfo',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/complete_info/completeInfo.html',
                        controller: 'completeDailyCtrl',
                        controllerAs:'vm'
                    }
                }
            })
    }])
    .controller('completeDailyCtrl', ['$scope','$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        function ($scope,  $filter,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout) {
            var vm = this;
            vm.save = save;
            vm.addApplicationInfo = addApplicationInfo;
            function addApplicationInfo() {
                $state.go('app.travelReqLine');
            }
            function save() {
                $state.go('app.reqList');
            }
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };
        }]);


