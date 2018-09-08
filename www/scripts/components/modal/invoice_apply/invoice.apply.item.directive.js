/**
 * Created by liyinsen on 2016/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('invoiceApplyItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                item: '=item',
                canDelete: '=',
                isShowType: '=',
                isHideState: '=',
                withdraw: '=',
                deleteInvoice: '&',
                goDetail: '&',
                canApproval: '=',
                withdrawInvoice: '&',
                reject: '&',
                agree: '&'
            },
            templateUrl: 'scripts/components/modal/invoice_apply/invoice.apply.item.directive.tpl.html',
            controller: 'com.handchina.hly.InvoiceApplyItemDirectiveController'
        }
    }])
    .controller('com.handchina.hly.InvoiceApplyItemDirectiveController', ['$scope',
        function ($scope) {
            var init = function () {
                if ($scope.item.warnning) {
                    $scope.item.errorMsg = JSON.parse($scope.item.warnning);
                }
                $scope.expenseTypeList = [];
                if ($scope.item.expenseApplication.expenseBudgetList !== null && $scope.item.expenseApplication.expenseBudgetList.length > 0) {
                    for (var i = 0; i < $scope.item.expenseApplication.expenseBudgetList.length; i++) {
                        if ($scope.expenseTypeList.indexOf($scope.item.expenseApplication.expenseBudgetList[i].expenseType.name) == -1) {
                            $scope.expenseTypeList.push($scope.item.expenseApplication.expenseBudgetList[i].expenseType.name);
                        }
                    }
                }
            };
            init();
        }]);

