/**
 * Created by Yuko on 16/11/25.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('linkageSwitch', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                field: '=',
                applicant: '=?' //申请人oid
            },
            templateUrl: 'scripts/components/directive/linkage_switch/linkage.switch.directive.html',
            controller: 'com.handchina.huilianyi.linkageSwitchDirectiveController'
        }
    }])
    .controller('com.handchina.huilianyi.linkageSwitchDirectiveController', ['$scope', '$ionicModal', '$ionicLoading', 'TravelERVService', '$q',
        function ($scope, $ionicModal, $ionicLoading, TravelERVService, $q) {

        }])

