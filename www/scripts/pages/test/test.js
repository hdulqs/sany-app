/**
 * Created by Dawn on 2017/8/1.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.test', {
                cache: false,
                url: '/test',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/test/test.html',
                        controller: 'testController',
                        controllerAs: 'vm'
                    }
                }
            })
    }])
    .controller('testController', ['$scope', '$q', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', 'HecImageService', 'PublicFunction','$ionicPopup',
        function ($scope, $q, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, HecImageService, PublicFunction,$ionicPopup) {
            var vm = this;
            vm.sysCodeName = "";
            vm.sysCode="";
            vm.readOnly = false;
            vm.sysCodeId = "";

            vm.goBack = goBack;

            $scope.test = function () {
                $ionicPopup.alert({
                    title: $filter('translate')('system_check.The.new.version.is.detected'),
                    template: '<p style="text-align: center">' + $filter('translate')('system_check.mandatory.update') + '</p>',
                    okText: $filter('translate')('system_check.ok')
                })
                /* system_code传值：
                 *   待遇级别类型：TREAMENT_LEVEL_TYPE
                 *   是否园区入驻：SETTLED_PARK
                 *   机票供应商：AIRPLANE_VENDER
                 *   酒店供应商：HOTEL_VENDER*/
                console.log("sysCodeName == "+vm.sysCodeName+" sysCode="+vm.sysCode+" sysCodeId="+vm.sysCodeId);
            }

            //返回
            function goBack() {
                $state.go('app.tab_erv.homepage');
            };

        }]);
