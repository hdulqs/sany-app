'use strict';
angular.module('huilianyi.pages')
    .directive('borrowMoneyItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                item: '=item',
                goDetail: '&',
                code: '@'
            },
            templateUrl: 'scripts/components/modal/borrow_money_item/borrow.money.item.directive.tpl.html',
            controller: 'com.handchina.hly.BorrowMoneyDirectiveController'
        }
    }])
    .controller('com.handchina.hly.BorrowMoneyDirectiveController', [
        '$scope', 'CurrencyCodeService',
        function ($scope, CurrencyCodeService) {
            //$scope.code = CurrencyCodeService.getCurrencySymbol('CNY');
        }]);
