/**
 * Created by Hurong on 2017/8/2.
 *  审批申请页面-查看借款项目
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.loanItem', {
                cache: false,
                url: '/loanItem',
                data: {
                    roles: []
                },
                params: {
                    item: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/loan/loanItem.html',
                        controller: 'loanItemController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('loanItemController', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', '$stateParams', 'approvalService',
        'PublicFunction', 'PageValueService',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams, approvalService,
                  PublicFunction, PageValueService) {
            var vm = this;
            //行对象
            vm.item = $stateParams.item;
            //行明细信息字段
            vm.lineDetail = [];
            if (vm.item != null) {
                var lineId = vm.item.payment_requisition_line_id;//1604;
                approvalService.searchLoanLineDetail(lineId).then(function (res) {
                    var pageCnt = res.data.result.pageCount;
                    if (pageCnt > 0) {
                        vm.lineDetail = res.data.result.record;
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('error.get.line.detail.failed'));  // 获取行明细信息失败!
                });
            }
            $scope.goBack = function () {
                /*  if ($ionicHistory.backView()) {
                 $ionicHistory.goBack();
                 } else {
                 $state.go('app.approvalList');
                 }*/
                $state.go('app.approvalLoan');
            };
        }]);

