'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('approval.list', {
            url: '/list',
            parent: 'approval',
            cache: false,
            data: {
                roles: ['ROLE_USER']
            },
            views: {
                'approval-content': {
                    templateUrl: 'scripts/pages/approval/approval.list.tpl.html',
                    controller: 'ApprovalListController'
                }
            },
            params: {
                unApproved: null
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('approval');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('ApprovalListController', ['$scope', '$state', '$ionicHistory', 'ApprovalService', 'ParseLinks',
                '$stateParams','$filter',
        function($scope, $state, $ionicHistory, ApprovalService, ParseLinks, $stateParams,$filter) {
            $scope.goTo = function (stateName) {
                $state.go(stateName);
            };
            $scope.view = {
                appendInvoiceNum: $filter('translate')('approval.cost'),//笔费用
                nothing: false,
                isList: true,
                unApproved: $stateParams.unApproved === null ? true : $stateParams.unApproved,
                listToggle: function() {
                    $scope.view.isList = !$scope.view.isList;
                }
            };
            $scope.data = {
                page: 0,
                size: 10,
                lastPage: 0,
                passedApprovalList: [],
                waitForApprovalList: []
            };

            //获取未审批列表
            $scope.getApprovalList = function(page, size, refreshData) {
                ApprovalService.getApprovalList(page, size)
                    .success(function(data, status, headers) {
                        if (data && data.length > 0) {
                            $scope.data.lastPage = ParseLinks.parse(headers('link')).last;
                            angular.forEach(data, function(item) {
                                item.invoice = item.invoiceNum + $scope.view.appendInvoiceNum;
                                if (!item.iconUrl)
                                    item.iconUrl = 'img/my-account.png';
                            });
                        } else if (page === 0) {
                            $scope.view.nothing = true;
                        }
                        Array.prototype.push.apply($scope.data.waitForApprovalList, data);
                    })
                    .finally(function() {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        if (refreshData)
                            $scope.$broadcast('scroll.refreshComplete');
                    })
            };

            //获取审批历史
            $scope.getApprovalHistoryList =function(page, size, refreshData) {
                ApprovalService.getApprovalHistoryList(page, size)
                    .success(function(data, status, headers) {
                        if (data && data.length > 0) {
                            $scope.data.lastPage = ParseLinks.parse(headers('link')).last;
                            angular.forEach(data, function(item) {
                                item.invoice = item.invoiceNum + $scope.view.appendInvoiceNum;
                                if (!item.iconUrl)
                                    item.iconUrl = 'img/my-account.png';
                            });
                        } else if (page === 0) {
                            $scope.view.nothing = true;
                        }
                        Array.prototype.push.apply($scope.data.passedApprovalList, data);
                    })
                    .finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        if (refreshData) {
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    });
            };

            $scope.goToUnApprovalDetail = function(userOid) {
                $state.go('approval_expense_list', {userOid: userOid});
            };

            $scope.goToApprovedExpense = function(userOid) {
                $state.go('approval_expense_list', {userOid: userOid, unApproved: false});
            };

            $scope.loadMore = function() {
                $scope.data.page++;
                if ($scope.view.unApproved) {
                    $scope.getApprovalList($scope.data.page, $scope.data.size);
                } else {
                    $scope.getApprovalHistoryList($scope.data.page, $scope.data.size);
                }
            };

            $scope.refresh = function() {
                $scope.data.page = 0;
                if ($scope.view.unApproved) {
                    $scope.data.waitForApprovalList = [];
                    $scope.getApprovalList($scope.data.page, $scope.data.size, true);
                    //ApprovalService.getApprovalList($scope.data.page, $scope.data.size)
                    //    .success(function(data, status, headers) {
                    //        $scope.data.lastPage = ParseLinks.parse(headers('link')).last;
                    //        $scope.data.waitForApprovalList = data;
                    //        $scope.$broadcast('scroll.refreshComplete');
                    //    })

                } else {
                    $scope.data.passedApprovalList = [];
                    $scope.getApprovalHistoryList($scope.data.page, $scope.data.size, true);
                    //ApprovalService.getApprovalHistoryList($scope.data.page, $scope.data.size)
                    //    .success(function(data, status, headers) {
                    //        $scope.data.lastPage = ParseLinks.parse(headers('link')).last;
                    //        $scope.data.passedApprovalList = data;
                    //        $scope.$broadcast('scroll.refreshComplete');
                    //    })
                }

            };

            if ($scope.view.unApproved)
                $scope.$emit("enterUnApprovedExpenseList");
            else
                $scope.$emit("enterApprovedExpenseList");

            function init() {
                $scope.data.page = 0;
                $scope.data.waitForApprovalList = [];
                $scope.data.passedApprovalList = [];
                if ($scope.view.unApproved) {
                    $scope.getApprovalList($scope.data.page, $scope.data.size);
                } else {
                    $scope.getApprovalHistoryList($scope.data.page, $scope.data.size);
                }
            }

            init();
        }
    ]);
