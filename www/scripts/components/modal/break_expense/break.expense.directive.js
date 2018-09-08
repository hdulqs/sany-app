/**
 * Created by hly on 2016/10/20.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('breakExpense', function () {
        return {
            restrict: 'E',
            scope: {
                childrenExpense: '=',
                originCurrencyCode:"=",
                showDetail: '&'
            },
            templateUrl: 'scripts/components/modal/break_expense/break.expense.directive.html',
            controller: 'com.huilianyi.BreakExpenseController'
        }
    })
    .controller('com.huilianyi.BreakExpenseController', ['$scope', 'CurrencyCodeService', '$state','$filter',
        function ($scope, CurrencyCodeService, $state,$filter) {
            $scope.view = {
                expandedExpenseOID: '',
                isExpanded: function (expenseReportOID) {
                    return $scope.view.expandedExpenseOID === expenseReportOID;
                }
            };
            //查看报销单详情
            $scope.showDetail = function (item) {
                if (!item.expenseReportOID) {
                    return;
                }
                if ($scope.view.expandedExpenseOID === item.expenseReportOID) {
                    $scope.view.expandedExpenseOID = "";
                } else {
                    $scope.view.expandedExpenseOID = item.expenseReportOID;
                }
            };
            //跳转到费用详情
            $scope.showExpenseConsumeDetail = function (expense) {
                $state.go('app.tab_erv_expense_consume_submit', {
                    expense: expense.invoiceOID,
                    expenseReportOID: $state.params.expenseReportOID

                })
            };
            //获取币种
            $scope.getCurrencyCode = function (currencyCode) {
                return CurrencyCodeService.getCurrencySymbol(currencyCode);
            };

        }])
    //过滤子报销单类型
    .filter('splitName', function ($filter) {
        return function (name) {
            switch (name) {
                case 'er.split.receipt':
                    return $filter('translate')('break_expense_js.stick');//贴票金额
                    break;
                case 'er.split.ctrip':
                    return $filter('translate')('break_expense_js.ctrip');//携程金额
                    break;
                case 'er.split.didi':
                    return $filter('translate')('break_expense_js.didi');//滴滴金额
                    break;
                case 'er.split.changguan':
                    return $filter('translate')('break_expense_js.changguan');  // 场馆金额
                    break;
                case 'er.split.huafei':
                    return $filter('translate')('break_expense_js.huafei');  // 话费金额
                    break;
                case 'er.split.youka':
                    return $filter('translate')('break_expense_js.youka');  // 油卡金额
                    break;
            }
        }
    })
    //过滤子报销单状态
    .filter('expenseDisplay', function ($filter) {
        return function (value) {
            switch (value) {
                case 1003:
                    //$scope.view.statusClass = 'PASSED';
                    return $filter('translate')('status.Have.been.through');//已通过
                    break;
                case 1004:
                    //$scope.view.statusClass = 'FINANCE_AUDIT_PASSED';
                    return $filter('translate')('status.approved');//审核通过
                    break;
                case 1005:
                    //$scope.view.statusClass = 'FINANCE_LOANED';
                    return $filter('translate')('status.Payment.has.been');//已付款
                    break;
                case 1007:
                    //$scope.view.statusClass = 'BILLED';
                    return $filter('translate')('status.Make.out.an.invoice.through');//开票通过
                    break;
            }
        }
    })
    //过滤子报销单的scss
    .filter('expenseClass', function () {
        return function (value) {
            switch (value) {
                case 1003:
                    //$scope.view.statusClass = 'PASSED';
                    return 'PASSED';
                    break;
                case 1004:
                    //$scope.view.statusClass = 'FINANCE_AUDIT_PASSED';
                    return 'FINANCE_AUDIT_PASSED';
                    break;
                case 1005:
                    //$scope.view.statusClass = 'FINANCE_LOANED';
                    return 'FINANCE_LOANED';
                    break;
                case 1007:
                    //$scope.view.statusClass = 'BILLED';
                    return 'BILLED';
                    break;
            }
        }
    });
