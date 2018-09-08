'use strict';
angular.module('huilianyi.pages')
    .directive('userAvatar', function () {
        return {
            restrict: 'E',
            scope: {
                fullName: '=',
                iconUrl: '=',
                employId: '=',
                bigger: '=',
                isEnternal: '='
            },
            templateUrl: 'scripts/components/directive/user.avatar.tpl.html',
            controller: 'com.handchina.huilianyi.UserAvatarController'
        }
    })
    .controller('com.handchina.huilianyi.UserAvatarController', ['$scope',
        function ($scope) {
            if($scope.employId){
                var number = parseInt($scope.employId.match(/\d+/g)[0]) % 3 ;
                if(number === 0){
                    $scope.bgClass = 'bg-avatar-zero';
                } else if(number === 1){
                    $scope.bgClass = 'bg-avatar-one';
                } else if(number === 2){
                    $scope.bgClass = 'bg-avatar-two';
                }
            } else {
                $scope.bgClass = 'bg-avatar-default';
            }
        }])
    .filter('surnameFilter', function () {
        return function (fullName) {
            var isChineseName = /^[\u4e00-\u9fa5]+$/.test(fullName);
            if (isChineseName) {
                return fullName.substring(0, 1);
            } else {
                return fullName.substring(0, 1).toUpperCase();
            }
        }
    });

