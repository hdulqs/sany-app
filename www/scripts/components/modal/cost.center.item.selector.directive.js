'use strict';
angular.module('huilianyi.pages')
    .directive('costCenterItemSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                code: '=?',
                callback: '=',
                iconUrl: '@',
                filterByCode: '@'
            },
            templateUrl: 'scripts/components/modal/cost.center.item.selector.directive.tpl.html',
            controller: 'CostCenterItemSelectorModelController'
        }
    }])
    .controller('CostCenterItemSelectorModelController', [
        '$scope', '$ionicModal', 'CostCenterService', 'CompanyConfigurationService','$location','$filter',
        function ($scope, $ionicModal, CostCenterService, CompanyConfigurationService,$location,$filter) {
            $scope.keyword = '';
            $scope.meikeCCISeparator = '|';
            $scope.myCostCenterItems = [];
            $scope.publicCenterItems = [];
            $scope.travelFilterCode = false;
            $scope.reimbursementFilterCode = false;
            $scope.hideCostName=false;
            if($location.path()==='/approval/history'){
                $scope.hideCostName=true;
            }else{
                $scope.hideCostName=false;
            }
            CostCenterService.getMyCostCenters().then(function (data) {
                $scope.costCenterName = data.length?data[0].name:"$filter('translate')('cost_js.Cost.center')";//成本中心
                $scope.myCostCenterItems = [];
                $scope.publicCenterItems = [];
                for (var i = 0; i < data[0].costCenterItems.length; i++) {
                    var item = data[0].costCenterItems[i];
                    if (item.public) {
                        $scope.publicCenterItems.push(item);
                    } else {
                        $scope.myCostCenterItems.push(item);
                    }
                }
            });
            CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                $scope.travelFilterCode = data.configuration.travel.costCenterItemCodeRequired;
                $scope.reimbursementFilterCode = data.configuration.reimbursement.costCenterItemCodeRequired;
            });
            $ionicModal.fromTemplateUrl('cost.center.item.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                CostCenterService.getMyPreferredCostCenters().success(function (data) {
                    $scope.myPreferredCostCenterItems = data;
                    $scope.modal.show();
                });
            };
            $scope.selectCostCenterItem = function (costCenterItem) {
                $scope.selected = costCenterItem.costCenterItemOID;
                $scope.code = costCenterItem.code;
                if ($scope.callback) {
                    $scope.callback($scope.selected);
                }
                $scope.modal.hide();
            };
            $scope.getCostCenterName = function () {
                if ($scope.selected == null) {
                    return null;
                }
                for (var i = 0; i < $scope.myCostCenterItems.length; i++) {
                    var item = $scope.myCostCenterItems[i];
                    if (item.costCenterItemOID === $scope.selected) {
                        return item.name;
                    }
                }
                for (i = 0; i < $scope.publicCenterItems.length; i++) {
                    var item = $scope.publicCenterItems[i];
                    if (item.costCenterItemOID === $scope.selected) {
                        return item.name;
                    }
                }
            };
            $scope.costCenterItemFilter = function (item) {
                if ($scope.filterByCode === 'travel') {
                    //console.log(item.code)
                    return $scope.travelFilterCode ? item.code : true;
                } else if ($scope.filterByCode === 'reimbursement') {
                    return $scope.reimbursementFilterCode ? item.code : true;
                } else {
                    return true
                }
            };
    }]);

