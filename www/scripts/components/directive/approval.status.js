///**
// * Created by hly on 2016/10/19.
// */
////(function () {
//    'use strict';
//    angular.module('huilianyi.pages')
//        .directive('approvalStatus',function () {
//            return {
//                restrict: 'E',
//                scope: {
//                    expenseStatus: '='
//                },
//                template: '<span class="approval-status {{statusClass}}">{{approvalName}}</span>',
//                controller: ['$scope', function ($scope) {
//                    console.log($scope.expenseStatus)
//                    $scope.statusClass = '';
//                    $scope.approvalName = '';
//                    var init = function (status) {
//                        switch (status) {
//                            case 1003:
//                                $scope.statusClass = 'bg-has-pass';
//                                $scope.approvalName = '已通过';
//                                break;
//                            case 1004:
//                                $scope.statusClass = 'bg-bpo-pass';
//                                $scope.approvalName = '审核通过';
//                                break;
//                            case 1005:
//                                $scope.statusClass = 'bg-finance-loan';
//                                $scope.approvalName = '已付款';
//                                break;
//                            case 1007:
//                                $scope.statusClass = 'bg-bpo-pass';
//                                $scope.approvalName = '开票通过';
//                                break;
//                        }
//                    };
//                    init($scope.expenseStatus);
//                }]
//            }
//        });
////})();

(function () {
    'use strict';
    angular.module('huilianyi.pages')
        .directive('approvalStatus', function() {
            return {
                restrict: 'E',
                scope: {
                    status: '='
                },
                template: '<span class="approval-status {{statusClass}}">{{statusDisplayName}}</span>',
                controller: ['$scope', function($scope) {
                    $scope.statusClass = '';
                    $scope.statusDisplayName = '';
                    var init = function(status) {
                        switch (status) {
                            case 1003:
                                $scope.statusClass = 'PASSED';
                                $scope.statusDisplayName = $filter('translate')('status.Have.been.through');//已通过
                                break;
                            case 1004:
                                $scope.statusClass = 'FINANCE_AUDIT_PASSED';
                                $scope.statusDisplayName = $filter('translate')('status.approved');//审核通过
                                break;
                            case 1005:
                                $scope.statusClass = 'FINANCE_LOANED';
                                $scope.statusDisplayName = $filter('translate')('status.Payment.has.been');//已付款
                                break;
                            case 1007:
                                $scope.statusClass = 'BILLED';
                                $scope.statusDisplayName = $filter('translate')('status.Make.out.an.invoice.through');//开票通过
                                break;
                            default:

                        }
                    };
                    init($scope.status);
                }]
            }
        })
})();

