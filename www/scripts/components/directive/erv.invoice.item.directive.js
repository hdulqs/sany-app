/**
 * Created by Yuko on 16/7/9.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('ervInvoiceItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                originCurrencyCode:'=originCurrencyCode',
                dataItem: '=item',
                showDelete: '=delete',
                showWithdraw: '=withdraw',
                showDetail: '=',
                showApproval: '=',
                deleteExpense: '&',
                goDetail: '&',
                withdrawExpense: '&',
                agreeExpense: '&',
                rejectExpense: '&'
            },
            templateUrl: 'scripts/components/directive/erv.invoice.item.directive.tpl.html',
            controller: 'com.handchina.hly.ErvInvoiceItemDirectiveController'
        }
    }])
    .controller('com.handchina.hly.ErvInvoiceItemDirectiveController', [
        '$scope', 'CurrencyCodeService', '$sessionStorage',
        function ($scope, CurrencyCodeService, $sessionStorage) {
            //console.log($scope.originCurrencyCode)

            $scope.language = $sessionStorage.lang;//获取当前语言环境
            if ($scope.dataItem.createLocation) {
                $scope.dataItem.location = JSON.parse($scope.dataItem.createLocation);
            }
            if ($scope.dataItem.expenseTypeIconName === 'didi' || $scope.dataItem.expenseTypeIconName === 'airTickets' || $scope.dataItem.expenseTypeIconName === 'transportation'
                || $scope.dataItem.expenseTypeIconName === 'hotel' || $scope.dataItem.expenseTypeIconName == 'foodbeverage' || $scope.dataItem.expenseTypeIconName == 'coach'
                || $scope.dataItem.expenseTypeIconName === 'travel' || $scope.dataItem.expenseTypeIconName === 'meetings' || $scope.dataItem.expenseTypeIconName === 'privateCarForPublic') {
                for (var i = 0; i < $scope.dataItem.data.length; i++) {
                    if ($scope.dataItem.data[i].messageKey === 'departure.location' || $scope.dataItem.data[i].messageKey === 'destination.location' || $scope.dataItem.data[i].messageKey === 'hotel.name'
                        || $scope.dataItem.data[i].messageKey === 'location' || $scope.dataItem.data[i].messageKey === 'DEPARTURE_LOCATION' || $scope.dataItem.data[i].messageKey === 'ARRIVAL_LOCATION'
                        || $scope.dataItem.data[i].messageKey === 'depart.place' || $scope.dataItem.data[i].messageKey === 'destination') {
                        if ($scope.dataItem.data[i].value !== null && $scope.dataItem.data[i].value !== '') {
                            if ($scope.dataItem.data[i].value.indexOf('address') > -1) {
                                $scope.dataItem.data[i].value = JSON.parse($scope.dataItem.data[i].value).address;
                            } else {
                                $scope.dataItem.data[i].value = $scope.dataItem.data[i].value;
                            }
                        }
                    }
                }
            }
            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.dataItem.invoiceCurrencyCode);
            $scope.showStartIcon = function () {
                var showFlag = false;
                if($scope.dataItem.data){
                    for (var i = 0; i < $scope.dataItem.data.length; i++) {
                        var field = $scope.dataItem.data[i];
                        if((field.messageKey === 'start.time' || field.messageKey === 'depart.time' || field.messageKey === 'departure.location' || field.messageKey === 'DEPARTURE_LOCATION' || field.messageKey === 'depart.place') && field.value){
                            showFlag = true;
                            break;
                        }
                    }
                }
                return showFlag;
            };
            $scope.showEndIcon = function () {
                var showFlag = false;
                if($scope.dataItem.data){
                    for (var i = 0; i < $scope.dataItem.data.length; i++) {
                        var field = $scope.dataItem.data[i];
                        if((field.messageKey === 'end.time' || field.messageKey === 'arrive.time' || field.messageKey === 'destination.location'||field.messageKey === 'ARRIVAL_LOCATION' || field.messageKey === 'destination') && field.value){
                            showFlag = true;
                            break;
                        }
                    }
                }
                return showFlag;
            };
        }]);

