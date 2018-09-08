/**
 * Created by Yuko on 16/9/20.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('notFoundText', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                subTitle: '=',
                icon: '='
            },
            templateUrl: 'scripts/components/directive/not_found_text/not.found.text.tpl.html',
            controller: 'com.handchina.huilianyi.NotFoundTextController'
        }
    }])
    .controller('com.handchina.huilianyi.NotFoundTextController', ['$scope',
        function ($scope) {
        }]);
