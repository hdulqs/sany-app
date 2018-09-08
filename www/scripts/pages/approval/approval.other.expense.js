'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('approval.other_expense', {
            url: '/other/expense',
            parent: 'approval',
            cache: false,
            data: {
                roles: ['ROLE_USER']
            },
            views: {
                'approval-content': {
                    templateUrl: 'scripts/pages/approval/approval.other.expense.tpl.html',
                    controller: 'ApprovalOtherExpenseController'
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
    .controller('ApprovalOtherExpenseController', ['$scope', '$state', '$timeout', 'ApprovalService',
        'ParseLinks','PushService', '$rootScope', 'localStorageService', '$stateParams','$filter',
        function ($scope, $state, $timeout, ApprovalService, ParseLinks, PushService, $rootScope, localStorageService
        ,   $stateParams,$filter) {
            $scope.approvals = [];
            $scope.withoutApprovalList = true;
            $scope.keyword = "approval";

            $scope.preInvoice = {
                data: [],
                newDataLength: 0,
                oldDataLength: 0
            };
            $scope.view = {
              unApproved: $stateParams.unApproved == null ? true : $stateParams.unApproved
            };

            $scope.total = 0;
            $scope.page = {
                current: 0,
                size: 15,
                links: null
            };
            $scope.costCenters = {};

            $scope.goDetail = function (data) {
                if (data.processKey === 'travelProcess') {
                    if ($scope.unApproved) {
                        $state.go('app.ordinary_travel',{
                            ordinaryId:data.taskId,
                            ordinaryMsg:'approvalList',
                            processInstanceId:null
                        });
                    } else {
                        $state.go('app.ordinary_travel', {
                            ordinaryId: data.taskId,
                            ordinaryMsg: 'approvalHistoryHasPass',
                            processInstanceId: null
                        });
                    }
                } else if(data.processKey === 'reimbursementProcess'){
                    $state.go('app.approval_submitted', {
                        taskId: data.taskId,
                        msg: "expenseApply"
                    });
                } else if(data.processKey === 'customProcess'){
                    $state.go('app.preinvoice_detail_approval', {
                        taskId: data.taskId
                    });
                }
            };
            $scope.approvalAlready = function () {
                $state.go('app.approval_history');
            };
            $scope.approvalLoadComplete = false;
            $scope.refreshApprovalData = function () {
                $scope.page.current = 0;
                $scope.approvals = [];
                $scope.withoutApprovalList = true;
                $scope.loadMoreApprovals($scope.page.current, true);
            };
            $scope.loadMoreApprovals = function (page, refreshData) {
                $scope.page.current = page;
                if ($scope.view.unApproved) {
                    ApprovalService.getWaitingForApprovals($scope.page.current, $scope.page.size)
                        .success(function (data, status, headers) {
                            $scope.page.links = ParseLinks.parse(headers('link'));
                            var tempArr = [];
                            for(var i = 0; i < data.length; i++){
                                $scope.approvals.push(data[i]);
                                if (data[i].processKey && data[i].processKey === 'customProcess') {
                                    for (var j = 0; j < data[i].customProcessDTO.customFormValueDTOs.length; j++) {
                                        if (data[i].customProcessDTO.customFormValueDTOs[j].fieldName === $filter('translate')('approval.project')) {//项目
                                            var localMap = localStorageService.get('CostCenterItemMap') || {};
                                            if (localStorageService.get('CostCenterItemMap')) {
                                                if (!localMap[data[i].customProcessDTO.customFormValueDTOs[j].value]) {
                                                    tempArr.push(data[i].customProcessDTO.customFormValueDTOs[j].value);
                                                }
                                            } else {
                                                tempArr.push(data[i].customProcessDTO.customFormValueDTOs[j].value);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            ApprovalService.mapCCIOIDandCCIName(tempArr).then(function (data) {
                                $scope.costCenters = data;
                            }, function (error) {
                                if (localStorageService.get('CostCenterItemMap')) {
                                    $scope.costCenters = localStorageService.get('CostCenterItemMap');
                                }
                            });

                            $scope.withoutApprovalList = $scope.approvals.length > 0;
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                } else {
                    ApprovalService.getOthersHistory($scope.page.current, $scope.page.size, null, null, null, null, null)
                        .success(function (data, status, headers) {
                            $scope.page.links = ParseLinks.parse(headers('link'));
                            var tempArr = [];
                            for(var i = 0; i < data.length; i++){
                                $scope.approvals.push(data[i]);
                                if (data[i].processKey && data[i].processKey === 'customProcess') {
                                    for (var j = 0; j < data[i].customProcessDTO.customFormValueDTOs.length; j++) {
                                        if (data[i].customProcessDTO.customFormValueDTOs[j].fieldName === $filter('translate')('approval.project')) {//项目
                                            var localMap = localStorageService.get('CostCenterItemMap') || {};
                                            if (localStorageService.get('CostCenterItemMap')) {
                                                if (!localMap[data[i].customProcessDTO.customFormValueDTOs[j].value]) {
                                                    tempArr.push(data[i].customProcessDTO.customFormValueDTOs[j].value);
                                                }
                                            } else {
                                                tempArr.push(data[i].customProcessDTO.customFormValueDTOs[j].value);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            ApprovalService.mapCCIOIDandCCIName(tempArr).then(function (data) {
                                $scope.costCenters = data;
                            }, function (error) {
                                if (localStorageService.get('CostCenterItemMap')) {
                                    $scope.costCenters = localStorageService.get('CostCenterItemMap');
                                }
                            });

                            $scope.withoutApprovalList = $scope.approvals.length > 0;
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                }

            };

            (function () {
                $scope.loadMoreApprovals(0);

            })();

            $scope.$on("$ionicView.enter", function () {
                ApprovalService.getMessageList(0, 1)
                    .success(function (data, status, headers) {
                        $scope.total = headers('x-total-count');
                        $rootScope.$broadcast('TOTALCHANGE', $scope.total);
                        PushService.setBadge($scope.total);
                    });
                if($scope.view.unApproved)
                    $scope.$emit("enterUnApprovedOtherExpenseList");
                else
                    $scope.$emit("enterApprovedOtherExpenseList");
            });
        }
    ]);
