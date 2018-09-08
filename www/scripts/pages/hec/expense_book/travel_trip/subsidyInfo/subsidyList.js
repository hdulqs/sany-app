/**
 * Created by Dawn on 2017/8/31.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.subsidyList', {
                cache: false,
                url: '/subsidyList',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/subsidyInfo/subsidyList.html',
                        controller: 'subsidyListCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hectravel.trip');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('subsidyListCtrl', ['$scope','$filter','$q','PageValueService','$rootScope','LocalStorageKeys','PublicFunction','localStorageService','$ionicModal', '$stateParams','$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','subsidyListService',
        function ($scope,  $filter,$q,PageValueService,$rootScope,LocalStorageKeys,PublicFunction,localStorageService,$ionicModal,$stateParams,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,subsidyListService) {
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

            vm.subsidyParam = PageValueService.get("subsidyParam");
            //已导入的补贴信息
            vm.importSubsidy = [];

            //添加补贴信息
            vm.goAddSubsidy = goAddSubsidy;
            //删除已导入的补贴信息
            vm.deleteLine = deleteLine;
            //获取已导入的补贴信息
            vm.getImportSubsidyList = getImportSubsidyList;
            vm.getImportSubsidyList(1);
            vm.doRefresh = doRefresh;
            vm.updateSubidy = updateSubidy;

            //获取已导入的补贴信息
            function getImportSubsidyList(page,refresh) {
                PublicFunction.showLoading(150);
                vm.page = page;
                var q = subsidyListService.getImportSubsidyList(vm.subsidyParam.expReqHeaderId, page);
                q.success(function (data) {
                    var dataRes = angular.fromJson(data.result);
                    vm.pageCount  = dataRes.pageCount;
                    if (vm.pageCount  > 0) {
                        vm.importSubsidy =  vm.importSubsidy.concat(dataRes.record);
                        vm.nothing = false;
                       /* angular.forEach(vm.importSubsidy,function (item) {
                            item.travel_start_date = PublicFunction.dataFormat(item.travel_start_date);
                            item.travel_end_date = PublicFunction.dataFormat(item.travel_end_date);
                        });*/
                    }else{
                        vm.nothing = true;
                    }
                }).error(function () {
                    PublicFunction.showToast($filter('translate')('error.request'));
                }).finally(function () {
                    $ionicLoading.hide();
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

           //跳转到未导入的补贴信息列表
            function goAddSubsidy() {
                console.log('导入list界面=expReqHeaderId='+vm.subsidyParam.expReqHeaderId+';confirmHeadId='+vm.subsidyParam.confirmHeadId+';国际/国外编码='+vm.subsidyParam.expReqTypeCode+';specialTypeCode:'+vm.subsidyParam.specialTypeCode);
                $state.go('app.subsidyAddList');
            }

            /**
             * 删除已关联的补贴信息
             * @param confirmId confirm_id
             */
            function deleteLine(confirmItem) {
                PublicFunction.showLoading(150);
                var param = [{
                    "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                    "confirm_id":confirmItem.confirm_id,
                    "_status":"delete"
                }];
                subsidyListService.deleteSubsidy(param).then(function (data) {
                    if(data.data.success){
                        vm.importSubsidy.splice(vm.importSubsidy.indexOf(confirmItem),1);
                        if(vm.importSubsidy.length<=0){
                            vm.nothing = true;
                        }
                        PublicFunction.showToast($filter('translate')('message.delete.success'));
                    }else if(data.data.error.message){
                        PublicFunction.showToast(data.data.error.message);
                    }else{
                        PublicFunction.showToast($filter('translate')('error.message.Subscription.message.deletion.failed'));
                    }
                    $ionicLoading.hide();
                });
            }


            function updateSubidy(item) {
                var subsidyItem = item;
                subsidyItem.currency_code =  vm.subsidyParam.currencyCode;//头上币种
                subsidyItem.special_type_code = vm.subsidyParam.specialTypeCode;//头上特批
                /*导入参数*/
                PageValueService.set("subsidyItem",subsidyItem);
                $state.go('app.subsidyInfo',{isUpdate:true});
            }


            //页面刷新
            function doRefresh() {
                vm.networkError = false;
                vm.systemError = false;
                vm.page = 0;
                vm.importSubsidy = [];
                vm.getImportSubsidyList(1,true);
            }

            $scope.goBack = function () {
                PageValueService.set("subsidyItem","");
                if ($ionicHistory.backView()) {
                    $state.go('app.confirmTravelTrip');
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
