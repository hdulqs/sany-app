/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('moreSetting', ['$http', function () {
        return {
            restrict: 'E',
            scope: {

            },
            templateUrl: 'scripts/components/modal/more_setting/more.setting.tpl.html',
            controller: 'com.handchina.hly.MoreSettingDirectiveController'
        }
    }])
    .controller('com.handchina.hly.MoreSettingDirectiveController', [
        '$scope',
        function ($scope) {

        }]);

