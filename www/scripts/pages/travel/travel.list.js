/**
 * Created by boyce1 on 2016/7/14.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.travel_list', {
            url: '/travel/list',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/travel/travel.list.tpl.html',
                    controller: 'TravelListController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('travel');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('TravelListController', ['$scope','$rootScope','ExpenseService','PushService', '$ionicLoading', 'ParseLinks', 'TravelService', '$state','$filter',
        function ($scope,$rootScope,ExpenseService,PushService, $ionicLoading, ParseLinks, TravelService, $state,$filter) {
            $scope.view = {
                travelList: [],
                page: {
                    current: 0,
                    size: 10,
                    links: null,
                },
                applyType: '1002',
                hasTravelList: true,
                allProcessInstanceIds: {
                    ProcessInstanceIds: []
                },
                cityInfo: {
                    comeForm: '',
                    currentPage: 0,
                    size: 10,
                    links: null,
                    searchName: '',
                    cityData: '',
                    citys: [$filter('translate')('list.shanghai'), $filter('translate')('list.beijing'), $filter('translate')('list.xianggang'), $filter('translate')('list.shengzheng'), $filter('translate')('list.guangzou'), $filter('translate')('list.wuxi'), $filter('translate')('list.changsha'), $filter('translate')('list.wuhan')]//'上海', '北京', '香港', '深圳', '广州', '无锡', '长沙', '武汉'
                },
                staffInfo: {
                    comeForm: '',
                    searchName: '',
                    size: 10,
                    links: null,
                    staff: []
                },

            };
            //判断差旅的审批状态
            function changeValue(arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].finished) {
                        arr[i].lastTask.taskNameClass = 'hasPass';
                    } else {
                        if (arr[i].lastTask.taskName === 'approvalTask') {
                            arr[i].lastTask.taskNameClass = 'waitApproval';
                        } else if (arr[i].lastTask.taskName === 'draftTask') {
                            arr[i].lastTask.taskNameClass = 'editting';
                        } else if (arr[i].lastTask.taskName === 'reApplyTask') {
                            if (arr[i].lastTask.travelDTO.updated) {
                                arr[i].lastTask.taskNameClass = 'editting';
                            } else {
                                arr[i].lastTask.taskNameClass = 'hasReject';
                            }
                        }
                    }
                }
                return arr;
            }

            //刷新差旅列表
            $scope.refreshTravel = function () {
                $scope.view.page.current = 0;
                $scope.view.travelList = [];
                $scope.view.hasTravelList = true;
                $scope.loadMordTravels($scope.view.page.current, true);

            };
            //获取差旅列表
            $scope.loadMordTravels = function (page, refreshData) {
                $scope.view.page.current = page;
                TravelService.getTravels($scope.view.applyType, $scope.view.page.current, $scope.view.page.size)
                    .success(function (data, status, headers) {
                        $scope.view.page.links = ParseLinks.parse(headers('link'));
                        Array.prototype.push.apply($scope.view.travelList, data);
                        $scope.view.travelList = changeValue($scope.view.travelList);
                        $scope.view.hasTravelList = data.length > 0;
                        $scope.view.allProcessInstanceIds.ProcessInstanceIds = angular.copy($scope.view.travelList);
                    }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if (refreshData) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                })
            };
            //差旅详情
            $scope.skipPage = function (item) {
                if (item.lastTask.taskNameClass === "waitApproval") {
                    $state.go('app.ordinary_travel', {
                        ordinaryId: item.lastTask.taskId,
                        ordinaryMsg: 'waitApproval',
                        processInstanceId: item.processInstanceId
                    });
                } else if (item.lastTask.taskNameClass === "hasPass") {
                    $state.go('app.ordinary_travel', {
                        ordinaryId: item.lastTask.taskId,
                        ordinaryMsg: 'hasPass',
                        processInstanceId: null
                    });
                } else if (item.lastTask.taskNameClass === "editting") {
                    $state.go('app.ordinary_travel', {
                        ordinaryId: item.lastTask.taskId,
                        ordinaryMsg: 'editting',
                        processInstanceId: null
                    });
                } else if (item.lastTask.taskNameClass === "hasReject") {
                    $state.go('app.ordinary_travel', {
                        ordinaryId: item.lastTask.taskId,
                        ordinaryMsg: 'hasReject',
                        processInstanceId: null
                    });
                } else if (item === '') {
                    $state.go('app.ordinary_travel', {
                        ordinaryId: item.lastTask.taskId,
                        ordinaryMsg: 'create',
                        processInstanceId: null
                    });
                }
            };
            //创建差旅
            $scope.goTo = function () {
                $state.go('app.ordinary_travel', {
                    ordinaryId: $scope.view.applyType,
                    ordinaryMsg: 'create',
                });
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            //撤回差旅
            $scope.recallTravel = function (data, index) {
                $scope.view.page.size = data.length;
                for (var i = 0; i < $scope.view.allProcessInstanceIds.ProcessInstanceIds.length; i++) {
                    if ($scope.view.allProcessInstanceIds.ProcessInstanceIds[i].processInstanceId == data[index].processInstanceId) {
                        TravelService.recallTravel($scope.view.allProcessInstanceIds.ProcessInstanceIds[i].processInstanceId)
                            .success(function (data) {
                                $scope.view.travelList = [];
                                TravelService.getTravels($scope.view.applyType, 0, $scope.view.page.size)
                                    .success(function (data, status, headers) {
                                        Array.prototype.push.apply($scope.view.travelList, data);
                                        $scope.view.travelList = changeValue($scope.view.travelList);
                                    })
                            });
                        data.splice(index, 1);
                        break;
                    }
                }
            };
            //删除差旅
            $scope.deleteTravel = function (travelsData, index) {
                $scope.view.page.size = travelsData.length;
                TravelService.deleteTravel(travelsData[index].lastTask.taskId)
                    .success(function (data) {
                        travelsData.splice(index, 1);
                        $ionicLoading.show({
                            template: $filter('translate')('list.yetDelete'),//已删除
                            duration: '500'
                        });
                        $scope.view.travelList = [];
                        TravelService.getTravels($scope.view.applyType, 0, $scope.view.page.size)
                            .success(function (data, status, headers) {
                                Array.prototype.push.apply($scope.view.travelList, data);
                                $scope.view.travelList = changeValue($scope.view.travelList);
                                if ($scope.view.travelList.length > 0) {
                                    $scope.view.hasTravelList = true;
                                } else {
                                    $scope.view.hasTravelList = false;
                                }
                            })
                    })
                    .error(function () {
                        $ionicLoading.show({
                            template: $filter('translate')('list.deleteFailure'),//删除失败
                            duration: '500'
                        });
                    });
            };


            (function () {
                $scope.loadMordTravels(0);
                ExpenseService.getMessageList(0, 1)
                    .success(function (data, status, headers) {
                        $scope.total = headers('x-total-count');
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
            })();


        }]);
