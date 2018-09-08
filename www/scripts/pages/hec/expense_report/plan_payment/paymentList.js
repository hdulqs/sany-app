/**
 * Created by Dawn on 2017/8/10.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.paymentList', {
                cache: false,
                url: '/paymentList',
                params:{
                    headerId:""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_report/plan_payment/paymentList.html',
                        controller: 'assExpCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.report');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('assExpCtrl', ['$scope','$rootScope','localStorageService','LocalStorageKeys','$filter','$stateParams', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','ReportHeaderService','PublicFunction',
        function ($scope, $rootScope,localStorageService,LocalStorageKeys, $filter,$stateParams,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,ReportHeaderService,PublicFunction) {
            var vm = this;
            //没有数据标志
            vm.nothing = false;
            vm.headerId = $stateParams.headerId;
            vm.reportPlanList = [];
            vm.getPlanList = getPlanList;
            vm.doRefresh = doRefresh;
            vm.updateReportPlan = updateReportPlan;
            vm.deleteReportPlan = deleteReportPlan;
            vm.getPlanList(1);

            function getPlanList(page,refresh) {
                PublicFunction.showLoading(150);
                vm.page = page;
                var q = ReportHeaderService.searchPlanPayment(vm.headerId, page);
                q.success(function (data) {
                    var dataRes = angular.fromJson(data.result);
                    vm.pageCount  = dataRes.pageCount;
                    if (vm.pageCount  > 0) {
                        vm.reportPlanList =  vm.reportPlanList.concat(dataRes.record);
                        vm.nothing = false;
                    }else{
                        vm.nothing = true;
                    }
                    $ionicLoading.hide();
                }).error(function () {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                }).finally(function () {
                    if (refresh) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }else{
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                });
                $rootScope.$on('NETWORKERROR', function (data, event) {
                    vm.networkError = true;
                });
                $rootScope.$on('SYSTEMERROR', function (data, event) {
                    vm.systemError = true;
                });
            }

            function deleteReportPlan(index,item) {
                var planItem = [{
                    "payment_schedule_line_id":item.payment_schedule_line_id,
                    "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                    "exp_report_header_id":item.exp_report_header_id,
                    "_status": "delete"
                }];
                ReportHeaderService.deletePlan(planItem).then(function (res) {
                    if(res.data.success){
                        vm.reportPlanList.splice(index, 1);
                        if(vm.reportPlanList.length<=0){
                            vm.nothing = true;
                        }
                        PublicFunction.showToast($filter('translate')('message.delete.success'));
                    }else if(res.data.error.message){
                        PublicFunction.showToast(res.data.error.message);
                    }else{
                        PublicFunction.showToast(res.data.error);
                    }
                },function (error) {
                    console.log("请求保存失败： " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });

            }

            function updateReportPlan(item) {
                if(item){
                    $state.go('app.payPlan', {"headerId": vm.headerId,"planItem":item, "type": 'report',status:'waitSubmit'});
                }else{
                    var maxLine = vm.reportPlanList[0].schedule_line_number;
                    for(var i=0; i<vm.reportPlanList.length;i++){
                        if(maxLine<vm.reportPlanList[i].schedule_line_number){
                            maxLine=vm.reportPlanList[i].schedule_line_number;
                        }
                    }
                    maxLine = maxLine+10;
                    $state.go('app.payPlan',{"headerId": vm.headerId,"maxLine":maxLine,"type": 'report',"status":'waitSubmit'});
                }
            }

            //页面刷新
            function doRefresh() {
                vm.page = 0;
                vm.reportPlanList = [];
                vm.getPlanList(1,true);
            }

            $scope.goBack = function () {
                $state.go('app.reportHeader',{headerId:vm.headerId});
            };
        }]);

