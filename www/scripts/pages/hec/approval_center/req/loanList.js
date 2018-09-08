/**
 * Created by Dawn on 2017/10/2.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.loanList', {
                cache: false,
                url: '/loanList',
                params: {
                    reqLoanList: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/req/loanList.html',
                        controller: 'loanListCtrl',
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
    .controller('loanListCtrl', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', '$stateParams',
        'PageValueService',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams,
                  PageValueService) {
            var vm = this;
            //获取申请单的借款信息
            vm.reqLoanList = PageValueService.get('loanList');
            //查看借款详情页面
            vm.goDetail = goDetail;

            /**
             * 查看借款详情页面
             * @param reqLoan
             */
            function goDetail(reqLoan) {
                var params = {
                    "status": '',
                    "approvalLoan": {
                        "instance_param": reqLoan.csh_head_id
                    },
                    "passFlag": 'N',
                    "type": 'approvalReq'
                };
                vm.appCenterLoan = PageValueService.set("appCenterLoan", params);
                $state.go("app.approvalLoan");
            }

            $scope.goBack = function () {
                PageValueService.set("loanList", []);
                $state.go('app.approvalReq');
            };
        }]);
