'use strict';
angular.module('huilianyi.services')
    .filter('chineseNumber', function () {
        var numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        return function (value) {
            return numbers[value];
        }
    })
