/**
 * Created by Administrator on 2016/7/28.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('expenseReportItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                originCurrencyCode: '=',
                showDelete: '=',
                showWithdraw: '=',
                isHideState: '=',
                isHideType: '=',
                isShowName: '=',
                canApproval: '=',
                agree: '&',
                reject: '&',
                deleteExpense: '&',
                goDetail: '&',
                withdrawExpense: '&'
            },
            templateUrl: 'scripts/components/modal/expense_item/expense.report.item.directive.tpl.html',
            controller: 'com.handchina.huilianyi.ExpenseReportItemDirectiveController'
        }
    }])
    .controller('com.handchina.huilianyi.ExpenseReportItemDirectiveController', ['$scope', 'localStorageService', 'CurrencyCodeService', '$sessionStorage','$filter',
        function ($scope, localStorageService, CurrencyCodeService, $sessionStorage,$filter) {

            //setTimeout(function(){
            //    console.log($scope.item);
            //    console.log($scope.originCurrencyCode);
            //},3000)
            if ($scope.item && $scope.item.warnning) {
                $scope.item.errorMsg = JSON.parse($scope.item.warnning);
            }
            $scope.view = {
                expenseNames: [],
                rejectStatus: false
            };
            //判断报销单的状态
            function compareExpenseStatus(item) {
                if (item.statusView === 1001) {
                    if (item.rejectType === 1000) {
                        $scope.view.taskName = 'NORMAL';
                    } else if (item.rejectType === 1001) {
                        $scope.view.taskName = 'WITHDRAW';
                    } else if (item.rejectType === 1002) {
                        $scope.view.taskName = 'APPROVAL_REJECT';
                    } else if (item.rejectType === 1003) {
                        $scope.view.taskName = 'AUDIT_REJECT';
                    } else if (item.rejectType === 1004) {
                        $scope.view.taskName = 'RECEIPT_REJECT';
                    }
                } else if (item.statusView === 1002) {
                    $scope.view.taskName = 'SUBMIT';
                } else if (item.statusView === 1003) {
                    $scope.view.taskName = 'PASSED';
                } else if (item.statusView === 1004) {
                    $scope.view.taskName = 'FINANCE_AUDIT_PASSED';
                } else if (item.statusView === 1005) {
                    $scope.view.taskName = 'FINANCE_LOANED';
                } else if (item.statusView === 1007) {
                    $scope.view.taskName = 'BILLED';
                }else if(item.statusView===1008){
                    $scope.view.taskName = 'PAY_IN_PROCESS';
                }
            }

            function init() {
                //uat 环境中会有开发时造成的紊乱数据,只有entityOID,没有详细内容,过滤掉这种数据
                if(!$scope.item){
                    return
                }
                compareExpenseStatus($scope.item);
                var types = $scope.item.expenseTypes.split(':');
                for (var i = 0; i < types.length; i++) {
                    if (types[i] === 'fcf5878d-0857-4c7e-8350-b0faded4fb9e') {
                        $scope.view.expenseNames.push($filter('translate')('expense_item_js.didi.travel'));//滴滴出行
                    }
                }
                if ($sessionStorage.expenseTypes) {
                    $scope.view.expenseTypes = $sessionStorage.expenseTypes;
                    var newArr = $scope.view.expenseTypes.filter(function (item) {
                        return $scope.item.expenseTypes.indexOf(item.expenseTypeOID) !== -1;
                    });
                    for (var i = 0; i < newArr.length; i++) {
                        $scope.view.expenseNames.push(newArr[i].name);
                    }
                    $scope.view.name = $scope.view.expenseNames.join(',');
                }
                $scope.code = CurrencyCodeService.getCurrencySymbol($scope.item.currencyCode);
                //console.log($scope.item)
                if ($scope.item.rejectReason) {
                    $scope.view.rejectStatus = true;
                } else {
                    $scope.view.rejectStatus = false;
                }
               // $scope.view.withReciptAmount = $scope.item.exchangeRateValue * $scope.item.withReceiptAmount;
                //$scope.view.withoutReciptAmount = $scope.item.exchangeRateValue * $scope.item.withoutReceiptAmount;
            }

            init();
        }]);

