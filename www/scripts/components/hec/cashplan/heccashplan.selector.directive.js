/**
 * 类型：combox
 * 费用报销单-付款计划行-资金计划/借款单-行-资金计划
 * Created by rong.hu on 2017/9/19.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('heccashplanSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                cashPlanNum:'=',
                readonly: '=',
                headerId: '=?',//报销单参数
                //借款单参数:
                cshClassCode: '=?',
                companyId: '=?',
                respId: '=?',
                reqDate: '=?',
                cashFlowItemName:"=?",
                cashFlowItemId:'=?'
            },
            templateUrl: 'scripts/components/hec/cashplan/heccashplan.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HeccashplanSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HeccashplanSelectorController', [
        '$scope', '$http', '$ionicModal',  'HeccashplanService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys','$stateParams',
        function ($scope, $http, $ionicModal, HeccashplanService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys,$stateParams) {
            $scope.searchKeyword = {value: ""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.cashPlans = [];

            $ionicModal.fromTemplateUrl('heccashplan.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.cashPlans = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (cashPlan) {
                $scope.cashPlanNum = cashPlan.cash_plan_number;
                $scope.selected = cashPlan.cash_plan_number;
                $scope.cashFlowItemName = cashPlan.cash_flow_item_name;
                $scope.cashFlowItemId = cashPlan.cash_flow_item_id;
                $scope.modal.hide();
            };

            $scope.searchCashPlan = function () {
                $scope.cashPlans = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var params = {
                    headerId:$scope.headerId,//报销单参数
                    //借款单参数:
                    cshClassCode: $scope.cshClassCode,
                    companyId:$scope.companyId,
                    respId: $scope.respId,
                    reqDate:$scope.reqDate
                };
                var q = HeccashplanService.searchKeywords($scope.searchKeyword.value, params,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0){
                        $scope.nothing = false;
                        $scope.cashPlans = $scope.cashPlans.concat(dataRes.result.record);
                    }else{
                        $scope.nothing = true;
                        $scope.cashPlans = [];
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if (error === 'keywords.is.ambiguous') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        PublicFunction.showToast($filter('translate')('hec_common.searchError'));  // 加载失败
                    }
                });
            };
        }
    ]);

