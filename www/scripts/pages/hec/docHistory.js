/**
 * 单据历史查询
 * Created by Hurong on 2017/10/2.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.docHistory', {
                cache: false,
                url: '/docHistory',
                params: {
                    type: "",//单据类型
                    headerId: ""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/docHistory.html',
                        controller: 'docHistoryCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        $translatePartialLoader.addPart('hecexp.common');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('docHistoryCtrl', ['$scope', '$filter', '$rootScope', '$ionicScrollDelegate', 'PublicFunction', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', '$stateParams', 'approvalRecordService',
        function ($scope, $filter, $rootScope, $ionicScrollDelegate, PublicFunction, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams, approvalRecordService) {
            var vm = this;
            vm.type = $stateParams.type;
            vm.headerId = $stateParams.headerId;
            vm.docHistoryList = [];
            //获取单据跟踪记录
            vm.initPage = initPage;

            /**
             * 获取单据历史
             */
            function initPage() {
                PublicFunction.showLoading(150);
                if (vm.type == 'travelReq' || vm.type == 'dailyReq') {
                    approvalRecordService.reqRecord(vm.headerId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success && res.data.result.pageCount > 0) {
                            vm.docHistoryList = res.data.result.record;
                        }
                    }, function (error) {
                        PublicFunction.showToast($filter('translate')('error.get.req.record.failed'));//获取申请单单据跟踪记录失败!
                        console.log("请求获单据跟踪记录失败： " + angular.toJson(error));
                    });
                } else if (vm.type == 'report') {
                    //获取报销单单据跟踪记录
                    approvalRecordService.reportRecord(vm.headerId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success && res.data.result.pageCount > 0) {
                            vm.docHistoryList = res.data.result.record;
                        }
                    }, function (error) {
                        PublicFunction.showToast($filter('translate')('error.get.payment.record.failed'));//获取报销单单据跟踪记录失败!
                        console.log("请求获单据跟踪记录失败： " + angular.toJson(error));
                    });
                } else if (vm.type == 'loan') {
                    //获取报销单单据跟踪记录
                    approvalRecordService.loanRecord(vm.headerId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success && res.data.result.pageCount > 0) {
                            vm.docHistoryList = res.data.result.record;
                        }
                    }, function (error) {
                        PublicFunction.showToast($filter('translate')('error.get.payment.record.failed'));//获取报销单单据跟踪记录失败!
                        console.log("请求获单据跟踪记录失败： " + angular.toJson(error));
                    });
                }
            }

            initPage();

            $scope.goBack = function () {
                /*  if ($ionicHistory.backView()) {
                 $ionicHistory.goBack();
                 }*/
                if (vm.type == 'travelReq') {//差旅申请
                    $state.go('app.travelReqHeader', {reqHeaderId: vm.headerId});
                } else if (vm.type == 'dailyReq') {
                    $state.go('app.dailyReqHeader', {reqHeaderId: vm.headerId});
                } else if (vm.type == 'report') {
                    $state.go('app.reportHeader', {headerId: vm.headerId});
                } else if (vm.type == 'loan') {
                    $state.go('app.loanReqHeader', {loanReqHeaderId: vm.headerId});
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
