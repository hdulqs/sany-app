/**
 * Created by Dawn on 2017/8/5.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.travelReqDetail', {
                cache: false,
                url: '/travelReqDetail',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/wait_approve/travelReqDetail.html',
                        controller: 'travelReqDetailCtrl',
                        controllerAs:'vm'
                    }
                }
            })
    }])
    .controller('travelReqDetailCtrl', ['$scope','$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        function ($scope,  $filter,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout) {
            var vm = this;
            vm.test = "测试！";
            vm.expandDetail = true;
            vm.expandExpenseDetail=expandExpenseDetail;
            function expandExpenseDetail() {
                vm.expandDetail =  !vm.expandDetail;
            }
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };


        }]);
