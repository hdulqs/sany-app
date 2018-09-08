/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('valueItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                readonly: '=',
                applicant: '=?' //申请人oid
            },
            templateUrl: 'scripts/components/modal/value_list/value.selector.directive.tpl.html',
            controller: 'com.handchina.hly.ValueItemDirectiveController'
        }
    }])
    .controller('com.handchina.hly.ValueItemDirectiveController', [
        '$scope', '$ionicModal', 'CustomValueService', '$ionicLoading', '$ionicScrollDelegate', 'ParseLinks', '$filter',
        'PublicFunction',
        function ($scope, $ionicModal, CustomValueService, $ionicLoading, $ionicScrollDelegate, ParseLinks, $filter,
                  PublicFunction) {
            $scope.view = {
                networkError: false,
                networkErrorText: $filter('translate')('error_comp.network'),//哎呀,网络出错了!
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error_comp.server'),//服务器开小差了,
                systemErrorSubText: $filter('translate')('error_comp.system'),//技术小哥正在努力修复!
                systemErrorIcon: "img/error-icon/system-error.png",
                openSelector: function () {
                    console.log($scope.selected);
                    if (!$scope.readonly) {
                        $scope.keyword = '';
                        // CustomValueService.getCustomValueList($scope.selected.customEnumerationOID)
                        //     .then(function (data) {
                        //         $scope.view.valueList = data.values;
                        //         $scope.valueSelector.show();
                        //     })
                        //enabled为false时，该值列表不可打开
                        if(!$scope.selected.enabledStatus){
                            return
                        }
                        $scope.view.getCustomValueDetail();
                        $scope.valueSelector.show();
                    }
                },
                closeSelector: function (item) {
                    if($scope.selected.value == item.value){
                        $scope.selected.value = null;
                        $scope.selected.valueKey = null;
                    } else {
                        $scope.selected.value = item.value;
                        $scope.selected.valueKey = item.messageKey;
                    }
                    $scope.valueSelector.hide();
                },
                customValueDetail: {
                    dataFrom: 102
                },
                valueList: [],
                nothing: false,
                keyword: '',
                pageable: {
                    page: 0,
                    size: 20,
                    total: 0,
                    lastPage: 0,
                    isEnd: true
                },
                getCustomValueDetail: function () {
                    CustomValueService.getCustomValueDetail($scope.selected.customEnumerationOID)
                        .then(function (res) {
                        if(res.data){
                            $scope.view.customValueDetail = res.data;// dataFrom 102    外部值列表
                            $scope.view.loadMore(0,true);
                        }
                    });
                },
                loadMore: function (page,refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    PublicFunction.showLoading();
                    $scope.view.pageable.page = page;
                    if ($scope.view.pageable.page === 0) {
                        $scope.view.valueList = [];
                        $ionicScrollDelegate.scrollTop();
                    }
                    CustomValueService.getCustomValueListByPagination($scope.view.customValueDetail.dataFrom, $scope.selected.customEnumerationOID,page, $scope.view.pageable.size,$scope.view.keyword, $scope.applicant)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                $scope.view.nothing = false;
                                angular.forEach(data,function (item) {
                                    $scope.view.valueList.push(item);
                                });
                                $scope.view.pageable.total = headers('x-total-count');
                                $scope.view.pageable.lastPage = ParseLinks.parse(headers('link')).last;
                                if(data.length < $scope.view.pageable.size){
                                    $scope.view.pageable.isEnd = true;
                                }else{
                                    $scope.view.pageable.isEnd = false;
                                }
                            } else {
                                if (page === 0) {
                                    $scope.view.nothing = true;
                                    $scope.view.pageable.isEnd = true;
                                }
                            }
                            $ionicLoading.hide();
                        })
                        .error(function (error, status) {
                            if (status === -1) {
                                $scope.view.networkError = true;
                            } else if (status === 503) {
                                $scope.view.systemError = true;
                            }
                            $ionicLoading.hide();
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                },
                searchByKeywords: function () {
                    $scope.view.loadMore(0,true);
                },
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = 0;
                    $scope.view.borrowList = [];
                    $scope.view.nothing = false;
                    $scope.view.loadMore(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                }
            };
            $ionicModal.fromTemplateUrl('value.selector.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.valueSelector = modal;
            });
        }]);


