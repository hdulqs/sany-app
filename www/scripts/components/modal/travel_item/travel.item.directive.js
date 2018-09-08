/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('travelItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                item: '=item',
                canDelete: '=',
                isShowType: '=',
                withdraw: '=',
                isHideState: '=',
                deleteTravel: '&',
                goDetail: '&',
                withdrawTravel: '&',
                canApproval: '=',
                agree: '&',
                reject: '&'
            },
            templateUrl: 'scripts/components/modal/travel_item/travel.item.directive.tpl.html',
            controller: 'com.handchina.hly.TravelItemDirectiveController'
        }
    }])
    .controller('com.handchina.hly.TravelItemDirectiveController', [
        '$scope', 'CurrencyCodeService',
        function ($scope, CurrencyCodeService) {
            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.item.travelApplication.currencyCode);
        }]);


