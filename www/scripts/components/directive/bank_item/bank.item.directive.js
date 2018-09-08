/**
 * Created by hly on 2016/12/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('bankItem', function () {
        return {
            restrict: 'E',
            scope: {
                bankData: '=',
                title: '=',
                readOnly:'='
            },
            templateUrl: 'scripts/components/directive/bank_item/bank.item.directive.html',
            controller: 'huilianyi.bankItemController'
        }
    })
    .controller('huilianyi.bankItemController', ['$scope', '$ionicModal', 'CustomApplicationServices', '$ionicScrollDelegate', 'ParseLinks', 'NetworkInformationService','$filter', '$sessionStorage',
        function ($scope, $ionicModal, CustomApplicationServices, $ionicScrollDelegate, ParseLinks, NetworkInformationService,$filter,$sessionStorage) {
            $scope.view = {
                page: {
                    current: 0,
                    size: 20,
                    lastPage: 0
                },
                keyword: '',
                allBank: [],
                hotBank: [],
                networkError: false,
                networkErrorText: $filter('translate')('error_comp.network'),//哎呀,网络出错了!
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error_comp.server'),//服务器开小差了,
                systemErrorSubText: $filter('translate')('error_comp.system'),//技术小哥正在努力修复!
                systemErrorIcon: "img/error-icon/system-error.png",
                language: $sessionStorage.lang,//获取当前页面语言
                openModal: function () {
                    $scope.bankModal.show();
                    $scope.view.allBank = [];
                    $scope.view.page.current = 0;
                    $scope.view.page.lastPage = 0;
                    $scope.view.keyword = '';
                    //$(input).blur();
                    $scope.view.loadMore(0);
                },
                doRefresh:function(){
                    $scope.view.allBank = [];
                    $scope.view.page.current = 0;
                    $scope.view.page.lastPage = 0;
                    $scope.view.keyword = '';
                    $scope.view.loadMore(0);
                },
                loadMore: function (page) {
                    $scope.view.page.current = page;
                    if (page === 0) {
                        $scope.view.page.current = 0;
                        $scope.view.page.lastPage = 0;
                        $scope.view.allBank = [];
                        $ionicScrollDelegate.scrollTop();
                    }
                    CustomApplicationServices.getAllBank($scope.view.page.current, $scope.view.page.size, $scope.view.keyword)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                if ($scope.view.keyword !== '') {
                                    if(page===0){
                                        $scope.view.allBank = [];
                                    }
                                    data.forEach(function (item) {
                                        $scope.view.allBank.push(item);
                                    });
                                } else {
                                    data.forEach(function (item) {
                                        $scope.view.allBank.push(item);
                                    });
                                }
                                $scope.view.page.lastPage = ParseLinks.parse(headers('link')).last;
                            }
                        })
                        .error(function (error, status) {
                            if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                $scope.view.networkError = true;
                            } else if (status === 503) {
                                $scope.view.systemError = true;
                            }
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });

                },
                closeBank: function (item) {
                    $scope.bankData = item.bankName;
                    $scope.bankModal.hide();
                },
                clearKeyword: function () {
                    $scope.view.keyword = '';
                    $scope.view.loadMore(0);
                },
                hasImg: function (item) {
                    if (item.bankType.toUpperCase() === 'GD' || item.bankType.toUpperCase() === 'GF' || item.bankType.toUpperCase() === 'GS' || item.bankType.toUpperCase() === 'HX'
                        || item.bankType.toUpperCase() === 'JS' || item.bankType.toUpperCase() === 'JT' || item.bankType.toUpperCase() === 'MS' || item.bankType.toUpperCase() === 'PF' || item.bankType.toUpperCase() === 'XY'
                        || item.bankType.toUpperCase() === 'ZG' || item.bankType.toUpperCase() === 'ZS' || item.bankType.toUpperCase() === 'ZX') {
                        return true;
                    } else {
                        return false;
                    }
                }
            };
            $scope.$watch('view.keyword', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue !== '') {
                    $scope.view.loadMore(0);
                }

            });
            $ionicModal.fromTemplateUrl('bank.item.modal.html', {
                    scope: $scope,
                    animation: 'none'
                })
                .then(function (modal) {
                    $scope.bankModal = modal;
                })
        }]);
