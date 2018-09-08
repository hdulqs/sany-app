/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_travel_list', {
                url: '/erv/travel/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/travel.list.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvTravelListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'next';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.ErvTravelListController', ['$scope', '$state', 'TravelERVService', 'ParseLinks', '$ionicLoading', '$ionicScrollDelegate', 'NotificationService', '$rootScope', 'PushService', 'FunctionProfileService', '$timeout', 'NetworkInformationService','$filter',
        function ($scope, $state, TravelERVService, ParseLinks, $ionicLoading, $ionicScrollDelegate, NotificationService, $rootScope, PushService, FunctionProfileService, $timeout, NetworkInformationService,$filter) {
            $scope.view = {
                networkError: false,
                networkErrorText: $filter('translate')('error.network'),//'哎呀,网络出错了!
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error.server'),//服务器开小差了,
                systemErrorSubText: $filter('translate')('error.system'),//技术小哥正在努力修复!
                systemErrorIcon: "img/error-icon/system-error.png",
                tabItem: [
                    {name: $filter('translate')('list_js.To.submit')},//待提交
                    {name: $filter('translate')('list_js.In.the.examination.and.approval')},//审批中
                    {name: $filter('translate')('list_js.Have.been.through')}//已通过
                ],
                tabIndex: 0,
                travelStatus: null,
                pageable: {
                    page: 0,
                    size: 10
                },
                travelList: [],
                nothing: false,
                dataNum: {
                    lastPage: 0,
                    total: 0
                },
                canDelete: false,
                canWithdraw: false,
                isShowType: false,
                changeTab: function (index) {
                    if ($scope.view.tabIndex !== index) {
                        $scope.view.tabIndex = index;
                        $scope.view.pageable.page = 0;
                        $scope.view.dataNum.lastPage = 0;
                        if ($scope.view.tabIndex === 0) {
                            $scope.view.travelStatus = 'init';
                            $scope.view.canDelete = !$scope.view.functionProfileList["ta.opt.delete.disabled"];
                            $scope.view.canWithdraw = false;
                        } else if ($scope.view.tabIndex === 1) {
                            $scope.view.travelStatus = 'submit';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = !$scope.view.functionProfileList["ta.opt.withdraw.disabled"];
                        } else if ($scope.view.tabIndex === 2) {
                            $scope.view.travelStatus = 'passed';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = false;
                        }
                        $scope.view.nothing = false;
                        $scope.view.travelList = [];
                        $scope.view.getTravelList($scope.view.pageable.page);
                    }
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goTo: function (state, ev) {
                    TravelERVService.setTab($scope.view.travelStatus);
                    $timeout(function(){
                        $state.go(state);
                    }, 50)
                },
                //上拉刷新
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = 0;
                    $scope.view.travelList = [];
                    $scope.view.nothing = false;
                    $scope.view.getTravelList(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                //加载新的一条数据
                loadOneTravel: function (applicationOID, refreshData) {
                    for (var i = 0; i < $scope.view.travelList.length; i++) {
                        if ($scope.view.travelList[i].applicationOID === applicationOID) {
                            $scope.view.travelList.splice(i, 1);
                            break;
                        }
                    }
                    if ($scope.view.pageable.page < $scope.view.dataNum.lastPage) {
                        TravelERVService.getTravelList(($scope.view.pageable.page + 1) * $scope.view.pageable.size, 1, '1001')
                            .success(function (data) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.travelList.push(data[i]);
                                    }
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    } else {
                        if ($scope.view.travelList.length === 0) {
                            $scope.view.nothing = true;
                        }
                    }
                },
                goDetail: function (travel) {
                    TravelERVService.setTab($scope.view.travelStatus);
                    if ($scope.view.travelStatus === 'init') {
                        if (travel.status === 1001 && (travel.rejectType === 1002 || travel.rejectType === 1001)) {
                            $state.go('app.erv_travel_detail_edit', {applicationOID: travel.applicationOID});
                        } else {
                            $state.go('app.erv_init_travel_base', {applicationOID: travel.applicationOID});
                        }
                    } else if ($scope.view.travelStatus === 'submit') {
                        $state.go('app.erv_travel_wait_approval', {applicationOID: travel.applicationOID});
                    } else if ($scope.view.travelStatus === 'passed') {
                        $state.go('app.erv_travel_has_pass', {applicationOID: travel.applicationOID});
                    }
                },
                //删除差旅
                deleteTravel: function (applicationOID) {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    TravelERVService.deleteTravel(applicationOID)
                        .success(function () {
                            $ionicLoading.hide();
                            $scope.view.loadOneTravel(applicationOID);
                            $scope.view.openWarningPopup($filter('translate')('list_js.Delete.the.success'));//删除成功
                        })
                        .error(function () {
                            $ionicLoading.hide();
                        });
                },
                //撤回
                withdrawTravel: function (applicationOID) {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var data = {
                        entities: []
                    };
                    var entitty = {};
                    entitty.entityOID = applicationOID;
                    entitty.entityType = 1001;
                    data.entities.push(entitty);
                    TravelERVService.withdrawTravel(data)
                        .success(function () {
                            $scope.view.loadOneTravel(applicationOID);
                            $scope.view.openWarningPopup($filter('translate')('list_js.Withdraw.the.success'));//撤回成功
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        });
                },
                getTravelList: function (page, refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.pageable.page = page;
                    if ($scope.view.pageable.page === 0) {
                        $ionicScrollDelegate.scrollTop();
                    }
                    var state = null;
                    if ($scope.view.travelStatus === 'init') {
                        state = 1001;
                    } else if ($scope.view.travelStatus === 'submit') {
                        state = 1002;
                    } else if ($scope.view.travelStatus === 'passed') {
                        state = 1003;
                    }
                    TravelERVService.getTravelList(page, $scope.view.pageable.size, state)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                $scope.view.nothing = false;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.view.travelList.push(data[i]);
                                }
                                $scope.view.dataNum.total = headers('x-total-count');
                                $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                            } else {
                                if (page === 0) {
                                    $scope.view.nothing = true;
                                }
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
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                }
            };

            var init = function () {
                NotificationService.countUnReadMessage()
                    .success(function(data){
                        $scope.total = data;
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });

                if (TravelERVService.getTab()) {
                    $scope.view.travelStatus = TravelERVService.getTab();
                    if ($scope.view.travelStatus === 'init') {
                        $scope.view.tabIndex = 0;
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            $scope.view.functionProfileList = data;
                            $scope.view.canDelete = !$scope.view.functionProfileList["ta.opt.delete.disabled"];
                        });
                        $scope.view.canWithdraw = false;
                        $scope.view.getTravelList($scope.view.pageable.page);
                    } else if ($scope.view.travelStatus === 'submit') {
                        $scope.view.tabIndex = 1;
                        $scope.view.canDelete = false;
                        FunctionProfileService.getFunctionProfileList().then(function(data){
                            $scope.view.functionProfileList = data;
                            $scope.view.canWithdraw = !$scope.view.functionProfileList["ta.opt.withdraw.disabled"];
                        });
                        $scope.view.getTravelList($scope.view.pageable.page);
                    } else if ($scope.view.travelStatus === 'passed') {
                        $scope.view.tabIndex = 2;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getTravelList($scope.view.pageable.page);
                    } else {
                        $scope.view.travelStatus = 'init';
                        $scope.view.tabIndex = 0;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getTravelList($scope.view.pageable.page);
                    }
                } else {
                    $scope.view.tabIndex = 0;
                    $scope.view.travelStatus = 'init';
                    FunctionProfileService.getFunctionProfileList().then(function(data){
                        $scope.view.functionProfileList = data;
                        $scope.view.canDelete = !$scope.view.functionProfileList["ta.opt.delete.disabled"];
                    });
                    $scope.view.canWithdraw = false;
                    $scope.view.getTravelList($scope.view.pageable.page);
                }
            };
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
