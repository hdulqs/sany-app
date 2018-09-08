/**
 * Created by Dawn on 2017/8/31.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.subsidyAddList', {
                cache: false,
                url: '/subsidyAddList',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/subsidyInfo/subsidyAddList.html',
                        controller: 'subsidyAddListCtrl',
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
    .controller('subsidyAddListCtrl', ['$scope','$rootScope','PageValueService','$filter','$q','LocalStorageKeys','PublicFunction','localStorageService','$ionicModal', '$stateParams','$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','subsidyListService',
        function ($scope,$rootScope,PageValueService,$filter,$q,LocalStorageKeys,PublicFunction,localStorageService,$ionicModal,$stateParams,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,subsidyListService) {
            var vm = this;
            vm.page = 0;
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
            //新增未导入的行程
            vm.subsidyList = [];
            vm.getSubsidyList = getSubsidyList;
            vm.selectItem = selectItem;
            //导入的单个补贴信息
            vm.importSubsidyItem = importSubsidyItem;
            vm.getSubsidyList(1);
            vm.doRefresh = doRefresh;

            /**
             * 导入补贴信息，并查询导入的数据
             * @param item
             */
            function selectItem(item) {
                vm.importSubsidyItem(item).then(function (data) {
                    var temp = data;
                    //查看已导入的数据
                    subsidyListService.getImportSubsidyList(vm.subsidyParam.expReqHeaderId,1).then(function (data) {
                        if(data.data.success){
                            if(data.data.result.record){
                                var last= data.data.result.record.length -1;
                                var subsidyItem = data.data.result.record[last];
                                subsidyItem.currency_code =  vm.subsidyParam.currencyCode;//头上币种
                                subsidyItem.special_type_code = vm.subsidyParam.specialTypeCode;//头上特批
                                PageValueService.set("subsidyItem",subsidyItem);
                                $state.go('app.subsidyInfo');
                            }
                        }else{
                            PublicFunction.showToast($filter('translate')('error.message.Subscription.information.import.failed'));
                        }
                    });
                });
            }

            //获取未导入的行程
             function getSubsidyList(page,refresh) {
                 PublicFunction.showLoading(150);
                vm.page =page;
                var q = subsidyListService.getSubsidyList(vm.subsidyParam.expReqHeaderId, page);
                q.success(function (data) {
                    var dataRes = angular.fromJson(data.result);
                    vm.pageCount  = dataRes.pageCount;
                    if (vm.pageCount  > 0) {
                        vm.subsidyList = vm.subsidyList.concat(dataRes.record);
                       /* angular.forEach(vm.subsidyList,function (item) {
                            item.date_from = PublicFunction.dataFormat(item.date_from);
                            item.date_to = PublicFunction.dataFormat(item.date_to);
                        });*/
                    }else{
                        vm.nothing = true;
                    }
                }).error(function () {
                    PublicFunction.showToast($filter('translate')('subsidy_list.searchError'));  // 加载失败
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
            //导入数据
            function importSubsidyItem(item) {
                //导入时传入的币种就为新增查询时的currency_code，不是头上的币种
                var defer=$q.defer();
                item.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                item.exp_requisition_header_id = vm.subsidyParam.expReqHeaderId;
                item.special_type_code = vm.subsidyParam.specialTypeCode;//头上特批
                //item.currency_code = vm.subsidyParam.currencyCode;
                item.confirm_head_id = vm.subsidyParam.confirmHeadId;
                item._status = "insert";
                console.log('导入补贴界面=expReqHeaderId='+vm.subsidyParam.expReqHeaderId+';confirmHeadId='+vm.subsidyParam.confirmHeadId+';国际/国外编码='+vm.subsidyParam.expReqTypeCode);
                var param = [item];
                subsidyListService.importSubsidyItem(param).success(function (data) {
                    if(data.success){
                        var temp = data.result.record;
                        vm.subsidyParam.confirmHeadId = temp.confirm_head_id;
                        var params = {
                            expReqHeaderId:vm.subsidyParam.expReqHeaderId,//差旅行程确认头id
                            confirmHeadId: temp.confirm_head_id,//确认头id，导入补贴信息之后生成
                            expReqTypeCode:vm.subsidyParam.expReqTypeCode//差旅行程国际国内code
                        };
                        PageValueService.set("confirmTripParams", params);
                        defer.resolve(temp);
                    }else{
                        if(data.error.message){
                            PublicFunction.showToast(data.error.message);
                        }
                        defer.reject('E');
                    }
                }).error(function (data) {
                    defer.reject('E');
                });
                return defer.promise;
            }

            //页面刷新
            function doRefresh() {
                vm.networkError = false;
                vm.systemError = false;
                vm.page = 0;
                vm.subsidyList = [];
                vm.getSubsidyList(1,true);
            }
            $scope.goBack = function () {
                PageValueService.set("subsidyItem","");
                if ($ionicHistory.backView()) {
                    $state.go('app.subsidyList');
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
