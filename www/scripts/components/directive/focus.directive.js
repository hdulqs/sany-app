/**
 * Created by Bin 17/03/22/
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('setFocus', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                trigger: '='
            },
            link: function (scope, element) {
                scope.$watch('trigger', function (value) {
                    if (value) {
                        $timeout(function () {
                            element[0].focus();
                        })
                    }
                })
            }
        }
    });
