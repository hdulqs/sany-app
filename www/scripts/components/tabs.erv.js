/**
 * Created by Yuko on 16/7/29.
 */
angular.module('huilianyi.pages')
    .controller('MainTabsERVController', ['$scope', '$state', 'ExpenseReportService', function ($scope, $state, ExpenseReportService) {
        $scope.go = function (stateName) {
            ExpenseReportService.setTab('1001');
            $state.go(stateName);
        }

    }]);
