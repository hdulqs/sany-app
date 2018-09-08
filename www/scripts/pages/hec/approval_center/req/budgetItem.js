/**
 * Created by Hurong on 2017/8/2.
 *  审批申请页面-查看预算项目
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.budgetItem', {
                cache: false,
                url: '/budgetItem',
                data: {
                    roles: []
                },
                params: {
                    item: null,
                    reqType: '',
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/req/budgetItem.html',
                        controller: 'budgetItemController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        $translatePartialLoader.addPart('hecexp.common');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('budgetItemController', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state',
        '$ionicLoading', '$stateParams', 'approvalService', 'PublicFunction',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $stateParams, approvalService
            , PublicFunction) {
            var vm = this;
            vm.travelerList = [];
            vm.item = $stateParams.item;
            vm.reqType = $stateParams.reqType;
            console.log(vm.reqType, 'reqType');

            /**
             *  查询同行人信息
             * @param travelId
             */
            if (vm.reqType === 'TRAVEL') {
                var travelId = vm.item.req_travel_id;//355;
                PublicFunction.showLoading(200);
                approvalService.queryTravelPeople('beneficiary_select', travelId).then(function (res) {
                    if (res.data.success && res.data.result.pageCount > 0) {
                        vm.travelerList = res.data.result.record;
                    }
                    $ionicLoading.hide();
                }, function (error) {
                    console.log("请求获取同行人数据失败： " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            }

            $scope.goBack = function () {
                $state.go('app.approvalReq');
            };
        }]);

