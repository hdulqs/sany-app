/**
 * Created by Dawn on 2017/8/6.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.overStandard', {
                url: '/overStandard',
                params: {
                    repHeaderId: "",
                    repTypeCode: "",
                    status:""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_report/over_standard/overStandard.html',
                        controller: 'overStandardController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.report');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('overStandardController', ['$scope', '$filter', '$ionicHistory', '$state', '$ionicLoading', '$stateParams', 'approvalService','PublicFunction',
        function ($scope, $filter, $ionicHistory, $state, $ionicLoading, $stateParams, approvalService,PublicFunction) {
            var vm = this;
            vm.repHeaderId = $stateParams.repHeaderId;
            vm.repTypeCode = $stateParams.repTypeCode;
            vm.overOtherReqList = []  //超其他申请
            vm.overTravelList = []; //超差旅政策情况
            vm.overTravelReqList = [];//超差旅申请
            vm.type = "";
            vm.initPage = initPage;
            vm.initPage();

            /**
             * 获取超标情况
             */
            function initPage() {
                console.log("repHeaderId === " + vm.repHeaderId);
                console.log("repTypeCode === " + vm.repTypeCode);
                //超申请(差旅申请和其他申请)
                approvalService.searchOverReqData(vm.repHeaderId,vm.repTypeCode).then((function (res) {
                    if (res.data.success) {
                        if (res.data.result.pageCount > 0) {
                            if(vm.repTypeCode === "1010" || vm.repTypeCode === "1015"){
                                vm.type = "travel";
                                vm.overTravelReqList = res.data.result.record;
                            }else{
                                vm.type = "other";
                                vm.overOtherReqList = res.data.result.record;
                            }
                        } else {
                            vm.overOtherReqList = [];
                            vm.overTravelReqList = [];
                        }
                    } else {
                        console.log("获取超申请情况出错,错误信息：" + angular.toJson(res.data.error.message));
                        PublicFunction.showToast(res.error.message);
                    }
                }), function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求获取action_id失败： " + angular.toJson(error));
                });

                //超差旅政策情况
                approvalService.searchOverStandData(vm.repHeaderId).then((function (res) {
                    if (res.data.success) {
                        if (res.data.result.pageCount > 0) {
                            vm.overTravelList = res.data.result.record;
                        } else {
                            vm.overTravelList = [];
                        }
                    } else {
                        console.log("获取超申请情况出错,错误信息：" + angular.toJson(res.data.error.message));
                        PublicFunction.showToast(res.error.message);
                    }
                }), function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求获取action_id失败： " + angular.toJson(error));
                });
            }

            $scope.goBack = function () {
                if($stateParams.status === 'waitSubmit'){
                    $state.go('app.reportHeader',{headerId:vm.repHeaderId});
                }else{
                    $state.go('app.approvalReport');
                }
            };
        }]);
