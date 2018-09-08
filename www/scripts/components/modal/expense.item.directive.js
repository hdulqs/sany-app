/**
 * Created by Yuko on 16/7/9.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('expenseItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                originCurrencyCode:'=',
                dataItem: '=item',
                showDelete: '=delete',
                showWithdraw: '=withdraw',
                showApproval: '=',
                showEdit:'=edit',
                deleteExpense: '&',
                goDetail: '&',
                withdrawExpense: '&',
                agreeExpense: '&',
                rejectExpense: '&',
                canReject: '=',
                reject: '&'
            },
            templateUrl: 'scripts/components/modal/expense.item.directive.tpl.html',
            controller: 'com.handchina.hly.ExpenseItemDirectiveController'
        }
    }])
    .controller('com.handchina.hly.ExpenseItemDirectiveController', [
        '$scope','CurrencyCodeService','$sessionStorage', 'FunctionProfileService',
        function ($scope,CurrencyCodeService,$sessionStorage, FunctionProfileService) {
            $scope.language = $sessionStorage.lang;
            if($scope.dataItem.receiptFailType===1005){
                $scope.receiptFailReason=angular.fromJson($scope.dataItem.receiptFailReason);
            }
            if( $scope.dataItem.createLocation){
                $scope.dataItem.location = JSON.parse($scope.dataItem.createLocation);
            }
            if ($scope.dataItem.expenseTypeIconName === 'didi' || $scope.dataItem.expenseTypeIconName === 'airTickets' || $scope.dataItem.expenseTypeIconName === 'transportation'
                || $scope.dataItem.expenseTypeIconName === 'hotel' || $scope.dataItem.expenseTypeIconName == 'foodbeverage' || $scope.dataItem.expenseTypeIconName == 'coach'
                || $scope.dataItem.expenseTypeIconName === 'travel' || $scope.dataItem.expenseTypeIconName === 'meetings' || $scope.dataItem.expenseTypeIconName === 'privateCarForPublic') {
                for(var i = 0 ; i < $scope.dataItem.data.length; i++ ){
                    if($scope.dataItem.data[i].messageKey === 'departure.location' || $scope.dataItem.data[i].messageKey === 'destination.location'|| $scope.dataItem.data[i].messageKey === 'hotel.name'
                        || $scope.dataItem.data[i].messageKey === 'location' || $scope.dataItem.data[i].messageKey === 'depart.place' || $scope.dataItem.data[i].messageKey === 'destination'){
                        if($scope.dataItem.data[i].value !== null && $scope.dataItem.data[i].value !== ''){
                            if($scope.dataItem.data[i].value.indexOf('address') > -1){
                                $scope.dataItem.data[i].value = JSON.parse($scope.dataItem.data[i].value).address;
                            }
                        }
                    }
                }
            }
            $scope.code=CurrencyCodeService.getCurrencySymbol($scope.dataItem.invoiceCurrencyCode);
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

