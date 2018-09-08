/**
 * Created by Dawn on 2017/8/10.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.needReq', {
                cache: false,
                url: '/needReq',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_report/need_req/myReqList.html',
                        controller: 'needReqCtrl',
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
    .controller('needReqCtrl', ['$scope','$filter','$rootScope', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','MyReqService','PublicFunction','LocalStorageKeys','PageValueService',
        function ($scope,  $filter,$rootScope,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,MyReqService,PublicFunction,LocalStorageKeys,PageValueService) {
            var vm = this;
            //没有数据标志
            vm.nothing = false;
            //网络错误标志
            vm.networkError = false;
            vm.networkErrorText = $filter('translate')('error.network');
            vm.networkErrorIcon = "img/error-icon/network-error.png";
            //系统错误
            vm.systemError = false;
            vm.systemErrorText = $filter('translate')('error.server');
            vm.systemErrorSubText = $filter('translate')('error.system');
            vm.systemErrorIcon = "img/error-icon/system-error.png";
            vm.reqList = [];
            vm.page = 1;
            vm.size = LocalStorageKeys.hec_pagesize;

            //报销单导入标志
            vm.reportHeaderParams = PageValueService.get("reportHeaderParams");
            vm.loadMore = loadMore;
            //刷新页面
            vm.doRefresh = doRefresh;
            vm.goPage =goPage;

            //初始化我的申请
            vm.loadMore(1);

            function loadMore(page,refresh) {
                PublicFunction.showLoading(150);
                PageValueService.set("reqItem","");
                vm.page = page;
                if (page === 0) {
                    vm.reqList = [];
                    vm.nothing = true;
                }
                var params = {
                    "company_id": vm.reportHeaderParams.company_id,
                    "currency_code": vm.reportHeaderParams.exp_report_currency_code,
                    "exp_report_type_id": vm.reportHeaderParams.exp_report_type_id,
                    "exp_report_header_id":vm.reportHeaderParams.exp_report_header_id
                };
                MyReqService.initReqList(params,page ,vm.size).then(function (res) {
                    if(res.data.success){
                        vm.pageCnt = res.data.result.pageCount;
                        if(vm.pageCnt == 0){
                            vm.nothing = true;
                        }else if(page <= vm.pageCnt){
                            vm.total = res.data.result.totalCount;
                            vm.reqList = vm.reqList.concat(res.data.result.record);
                            if(vm.reqList.length==0){
                                vm.nothing = true;
                            }
                        }
                        if (refresh) {
                            $scope.$broadcast('scroll.refreshComplete');
                        }else{
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                        $ionicLoading.hide();
                    }else{
                        $ionicLoading.hide();
                        //系统错误
                        vm.systemError = true;
                    }
                }, function (error) {
                    $ionicLoading.hide();
                    //网络错误标志
                    vm.networkError = true;
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
                $rootScope.$on('NETWORKERROR', function (data, event) {
                    vm.networkError = true;
                });
                $rootScope.$on('SYSTEMERROR', function (data, event) {
                    vm.systemError = true;
                });
            }

            /**
             * 页面跳转
             * @param type  new：创建行，否则关联账本
             */
            function goPage(type) {
                PageValueService.set("reqItem",vm.reqItem);
                if(type ==='new'){
                    if(vm.reqItem){
                        $state.go('app.createExp',{assReportFlag:true,assReqFlag:true});
                    }
                }else{
                    if(vm.reqItem && type===true){
                        //导入账本信息，传递报销单、关联申请标志
                        $state.go('app.expList',{isImport:true,assReportFlag:true,assReqFlag:true});
                    }else{
                        PublicFunction.showToast($filter('translate')('message.select.book'))
                    }
                }
            }

            vm.countSelect =countSelect;
            function countSelect(index,req) {
                vm.chooseReqLineId = req.exp_requisition_line_id;
                angular.forEach(vm.reqList,function (item) {
                    if(vm.chooseReqLineId == item.exp_requisition_line_id){
                        item.checked = true;
                        vm.reqItem = req;
                    }else {
                        item.checked = false;
                    }
                });
            }

            //页面刷新
            function doRefresh() {
                vm.networkError = false;
                vm.systemError = false;
                vm.page = 0;
                vm.expList = [];
                vm.loadMore(1,true);
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.goBack = function () {
                PageValueService.set("reqItem","");
                $state.go('app.reportHeader',{headerId:vm.reportHeaderParams.exp_report_header_id});
            };
        }]);
