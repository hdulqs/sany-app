/**
 * Created by Dawn on 2017/8/31.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.reqRefLoanList', {
                cache: false,
                url: '/reqRefLoanList',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/reqRefLoanList.html',
                        controller: 'reqRefLoanListCtrl',
                        controllerAs:'vm'
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
    .controller('reqRefLoanListCtrl', ['$scope','$filter','$q','PageValueService','$rootScope','LocalStorageKeys','PublicFunction'
        ,'$ionicModal', '$stateParams','$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','reqLoanService',
        function ($scope,  $filter,$q,PageValueService,$rootScope,LocalStorageKeys,PublicFunction
            ,$ionicModal,$stateParams,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,reqLoanService) {
            var vm = this;
            vm.reqRefLoanInfo  = PageValueService.get("reqRefLoanInfo");
            if(!PublicFunction.isNull(vm.reqRefLoanInfo)){
                vm.reqHeaderId = vm.reqRefLoanInfo.reqHeaderId;
                vm.docType = vm.reqRefLoanInfo.docType;
                console.log("vm.reqHeaderId:"+vm.reqHeaderId);
            }
            //没有数据标志
            vm.nothing = false;
            //分页
            vm.page = 1;
            vm.pageCount = 0;
            //新增借款信息
            vm.goAddLoan = goAddLoan;
            //获取已关联的借款信息
            vm.searchReqLoanList = searchReqLoanList;
            //删除已关联的借款信息
            vm.deleteReqLoan = deleteReqLoan;
            //更新已关联借款信息
            vm.updateReqLoan = updateReqLoan;
            //刷新页面
            vm.doRefresh = doRefresh;
            //借款单信息
            vm.reqRefLoanList = [];

            //获取已关联的借款信息
            function searchReqLoanList(page,refresh) {
                PublicFunction.showLoading(150);
                vm.page = page;
                var q = reqLoanService.searchReqLoanList(vm.reqHeaderId,page);
                q.success(function (data) {
                    $ionicLoading.hide();
                    vm.pageCount  = data.result.pageCount;
                    if (vm.pageCount  > 0) {
                        vm.nothing = false;
                        vm.reqRefLoanList =  vm.reqRefLoanList.concat(data.result.record);
                    }else{
                        vm.nothing = true;
                    }
                }).error(function () {
                    PublicFunction.showToast($filter('translate')('error.request'));
                }).finally(function () {
                    if (refresh) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }else{
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                });
            }

            vm.searchReqLoanList(1);

            /**
             * 删除已关联的借款信息
             */
            function deleteReqLoan(refLoan) {
                PublicFunction.showLoading(150);
                reqLoanService.deleteReqLoan(refLoan.csh_head_id).then(function (res) {
                    if(res.data.success){
                        $ionicLoading.hide();
                        vm.reqRefLoanList.splice(vm.reqRefLoanList.indexOf(refLoan), 1);
                        if(vm.reqRefLoanList.length<=0){
                            vm.nothing = true;
                        }
                        PublicFunction.showToast($filter('translate')('req.message.success.delete'));//删除成功!
                    }else if(res.data.error.message){
                        console.log("数据删除失败,错误信息：" + angular.toJson(res.data.error.message));
                        PublicFunction.showToast(res.data.error.message);
                    }else{
                        PublicFunction.showToast($filter('translate')('req.message.error.delete'));
                    }
                }),function (error) {
                    PublicFunction.showToast(PublicFunction.showToast($filter('translate')('req.message.error.data.delete')));
                    console.log("数据删除失败：" + angular.toJson(error));
                };
            }

            //新建借款信息
            function goAddLoan() {
                PageValueService.set("comDocData", "");

                $state.go('app.companyExpType',{chooseValue:'reqRefLoan'});
            }

            //更新已关联借款信息
            function updateReqLoan(reqLoan) {
                console.log("更新借款信息");
                $state.go('app.loanReqHeader',{loanReqHeaderId:reqLoan.csh_head_id});
            }

            //页面刷新
            function doRefresh() {
                vm.page = 0;
                vm.reqRefLoanList = [];
                vm.searchReqLoanList(1,true);
            }

            $scope.goBack = function () {
                PageValueService.set("reqRefLoanInfo", "");
                if(vm.docType == 'travel'){
                    $state.go('app.travelReqHeader',{reqHeaderId:vm.reqHeaderId});
                }else{
                    $state.go('app.dailyReqHeader',{reqHeaderId:vm.reqHeaderId});
                }
            };
        }]);
