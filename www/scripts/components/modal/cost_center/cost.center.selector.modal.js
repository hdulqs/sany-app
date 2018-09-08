/**
 * Created by Yuko on 16/10/18.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('costCenterSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                callback: '&',
                selected: '=',
                name: '=',
                title: '=',
                costCenter: '=',
                readonly:'=',
                searchAll: '='  // 是否搜索所有成本中心
            },
            templateUrl: 'scripts/components/modal/cost_center/cost.center.selector.modal.tpl.html',
            controller: 'com.handchina.huilianyi.CostCenterSelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.CostCenterSelectorController', ['$scope', '$ionicModal', 'CostCenterService', 'CompanyConfigurationService',
                '$location', 'ParseLinks', 'TravelERVService', 'PublicFunction', 'FunctionProfileService','$filter', 'AgencyService',
        function ($scope, $ionicModal, CostCenterService, CompanyConfigurationService, $location, ParseLinks, TravelERVService,
                  PublicFunction, FunctionProfileService,$filter, AgencyService) {
            $scope.view = {
                page: 0,
                size: 20,
                lastPage: 0,
                myCostCenterItems: [],
                searchName: null,
                // 选择新增的不选择项,清空选择的成本中心
                selectNone: function() {
                    $scope.name = "";
                    $scope.selected = null;
                    $scope.callback();
                    $scope.modal.hide();
                },
                selectCostCenter: function(item){
                    $scope.name = item.name;
                    $scope.selected = item.costCenterItemOID;
                    $scope.callback();
                    $scope.modal.hide();
                },
                loadMore: function(page){
                    $scope.view.page = page;
                    if(page === 0){
                        $scope.view.myCostCenterItems = [];
                    }
                    if($scope.view.lastPage >= page){
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            // 根据functionProfileList判断是否需要按照code排序
                            var sort = data && data['cost.center.code.sort'] ? 'code' : null;

                            // 数据处理
                            var _dataHandle = function(data, status, headers) {
                                if(page === 0){
                                    $scope.view.lastPage = ParseLinks.parse(headers('link')).last;
                                    $scope.view.myCostCenterItems = [];
                                }
                                if(data.length > 0){
                                    for(var i = 0; i < data.length; i++){
                                        $scope.view.myCostCenterItems.push(data[i]);
                                    }
                                }
                                if(data.length === 0 && page === 0){
                                    if($scope.view.searchName == null || $scope.view.searchName == ''){
                                        PublicFunction.showToast($filter('translate')('cost_center.Cost.center.is.not.configured'));//成本中心未配置，请联系管理员
                                    }
                                }
                            };

                            if($scope.view.searchName !== null && $scope.view.searchName !== ''){
                                // 是否搜索所有成本中心
                                if($scope.searchAll) {
                                    CostCenterService.searchAllItemsByKeywords($scope.costCenter, $scope.view.searchName,
                                        page, $scope.view.size, sort)

                                        .success(function(data, status, headers){
                                            _dataHandle(data, status, headers);
                                        })
                                        .finally(function () {
                                            $scope.$broadcast('scroll.infiniteScrollComplete');
                                        });

                                } else {
                                    CostCenterService.getMyCostCenter($scope.costCenter, page, $scope.view.size,
                                        $scope.view.searchName, sort, AgencyService.getApplicantOID())

                                        .success(function(data, status, headers){
                                            _dataHandle(data, status, headers);
                                        })
                                        .finally(function () {
                                            $scope.$broadcast('scroll.infiniteScrollComplete');
                                        });
                                }

                            } else {
                                // 是否搜索所有成本中心
                                if($scope.searchAll) {
                                    CostCenterService.getItemsAll($scope.costCenter, page, $scope.view.size, sort)

                                        .success(function(data, status, headers){
                                            _dataHandle(data, status, headers);
                                        })
                                        .finally(function () {
                                            $scope.$broadcast('scroll.infiniteScrollComplete');
                                        });
                                } else {
                                    CostCenterService.getMyCostCenter($scope.costCenter, page, $scope.view.size, null, sort, AgencyService.getApplicantOID())
                                        .success(function(data, status, headers){
                                            _dataHandle(data, status, headers);
                                        })
                                        .finally(function () {
                                            $scope.$broadcast('scroll.infiniteScrollComplete');
                                        });
                                }
                            }
                        });
                    }

                }
            };
            $scope.$watch('view.searchName', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.view.loadMore(0);
                }
            });
            $ionicModal.fromTemplateUrl('cost.center.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                if ($scope.readonly) {
                    return;
                }
                $scope.view.loadMore(0);
                $scope.modal.show();
            };
            $scope.getCostCenterName = function () {
                if ($scope.selected == null) {
                    return null;
                }
                for (var i = 0; i < $scope.myCostCenterItems.length; i++) {
                    if ($scope.myCostCenterItems[i].costCenterItemOID === $scope.selected) {
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
        }]);

