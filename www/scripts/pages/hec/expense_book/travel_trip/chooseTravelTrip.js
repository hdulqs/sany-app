/**
 * 我的待确认差旅行程
 * Created by Dawn on 2017/8/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.chooseTravelTrip', {
                cache: false,
                url: '/chooseTravelTrip',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/chooseTravelTrip.html',
                        controller: 'chooseTravelTripCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hectravel.trip');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('chooseTravelTripCtrl', ['$scope','$filter', '$rootScope','PageValueService','$ionicScrollDelegate','PublicFunction','$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','chooseTravelTripService',
        function ($scope,  $filter,$rootScope,PageValueService,$ionicScrollDelegate,PublicFunction,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,chooseTravelTripService) {
            var vm = this;
            vm.page = 1;
            vm.pageSize = 100;

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
            //待确认差旅
            vm.travelTripList = [];

            //获取差旅行程列表
            vm.getTravelTrip = getTravelTrip;
            vm.getTravelTrip(1);

            //刷新页面
            vm.doRefresh = doRefresh;
            vm.goConfirmTrip = goConfirmTrip;

            /**
             * 获取待确认的差旅行程列表
             * @param page
             * @param refreshData 是否为刷新
             */
            function getTravelTrip (page, refreshData) {
                PublicFunction.showLoading();
                PageValueService.set("confirmTripParams", "");
                PageValueService.set("reportHeaderParams","");//防止按返回键没有清空之前set过的参数
                vm.networkError = false;
                vm.systemError = false;
                vm.page = page;
                if (page === 0) {
                    vm.travelTripList = [];
                    vm.lastPage = 0;//数据库中的总页数
                    $ionicScrollDelegate.scrollTop();
                }
                chooseTravelTripService.initTravelTrip(page,vm.pageSize).success(function (data,status,headers) {
                    if(data.success){
                        vm.lastPage = data.result.pageCount;
                        if(vm.lastPage == 0){
                            vm.nothing = true;
                        }else if(page <= vm.lastPage){
                            vm.travelTripList = vm.travelTripList.concat(data.result.record);
                        }
                    }else{
                        vm.systemError = true;
                    }
                }).error(function () {
                    vm.networkError = true;
                }).finally(function () {
                    $ionicLoading.hide();
                    if (refreshData) {
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

            /**
             * 跳转到差旅行程确认页面
             * @param item 待确认行程信息
             */
            function goConfirmTrip(item) {
                //如果confirm_head_id字段为空，则默认赋值为-999,导入的时值为-999传入该字段，由导入接口返回该字段数据
                if(PublicFunction.isNull(item.confirm_head_id)){
                    item.confirm_head_id = "-999";
                }
                console.log('待确认差旅选择页面=expReqHeaderId='+item.exp_requisition_header_id+';confirmHeadId='+item.confirm_head_id+';国际/国外编码='+item.expense_requisition_type_code);
                //var travelTripParam = item;
                var params = {
                    expReqHeaderId:item.exp_requisition_header_id,//差旅行程确认头id
                    confirmHeadId:item.confirm_head_id,//确认头id，导入补贴信息之后生成
                    expReqTypeCode:item.expense_requisition_type_code//差旅行程国际国内code
                };
                PageValueService.set("confirmTripParams", params);
                $state.go('app.confirmTravelTrip');
            }

            /*
            * 下拉刷新事件
            * */
            function doRefresh() {
                vm.networkError = false;
                vm.systemError = false;
                vm.travelTripList = [];
                vm.page = 0;
                vm.getTravelTrip(1,true);
            }

            $scope.goBack = function () {
                PageValueService.set("confirmTripParams", "");
                $state.go('app.tab_erv.homepage');
            };
        }]);
