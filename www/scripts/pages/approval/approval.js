'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('approval', {
            abstract: true,
            parent: 'app',
            url: '/approval',
            cache: false,
            views: {
                'page-content': {
                    templateUrl: 'scripts/pages/approval/approval.tpl.html',
                    controller: 'ApprovalController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('approval');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('ApprovalController', ['$scope', '$state', '$ionicHistory','$filter',
        function($scope, $state, $ionicHistory,$filter) {
            $scope.goTo = function (stateName) {
                $state.go(stateName);
            };
            $scope.view = {
                appendInvoiceNum: $filter('translate')('approval.pen.cost'),//笔费用
                isList: true,
                unApproved: true,
                approvalButtonText: $filter('translate')('approval.already'),//已审批
                goBack: function () {
                    //if ($ionicHistory.backView()) {
                    //    $ionicHistory.goBack();
                    //} else {
                    //    $scope.goTo('app.tab.dash');
                    //}
                    $scope.goTo('app.tab.dash');
                },
                listToggle: function() {
                    $scope.view.isList = !$scope.view.isList;
                    if ($scope.view.isList) {
                        $scope.goTo('approval.list');
                    } else {
                        $scope.goTo('approval.other_expense');
                    }
                },
                approvalToggle: function() {
                    $scope.view.unApproved = !$scope.view.unApproved;
                    if ($scope.view.isList) {
                        if ($scope.view.unApproved) {
                            $scope.view.approvalButtonText = $filter('translate')('approval.already');//已审批
                        }
                        else {
                            $scope.view.approvalButtonText = $filter('translate')('approval.not.approved');//未审批
                        }
                        $state.go('approval.list', {unApproved: $scope.view.unApproved});
                    } else {
                        if ($scope.view.unApproved) {
                            $scope.view.approvalButtonText = $filter('translate')('approval.already');//已审批
                        }
                        else {
                            $scope.view.approvalButtonText = $filter('translate')('approval.not.approved');//未审批
                        }
                        $state.go('approval.other_expense', {unApproved: $scope.view.unApproved});
                    }

                }
            };
            //other tab
            $scope.$on("enterUnApprovedOtherExpenseList", function() {
                $scope.view.isList = false;
                $scope.view.unApproved = true;
                $scope.view.approvalButtonText = $filter('translate')('approval.already');//已审批
            });
            $scope.$on("enterApprovedOtherExpenseList", function() {
                $scope.view.isList = false;
                $scope.view.unApproved = false;
                $scope.view.approvalButtonText = $filter('translate')('approval.not.approved');//未审批
            });

            $scope.$on("enterUnApprovedExpenseList", function() {
                $scope.view.isList = true;
                $scope.view.unApproved = true;
                $scope.view.approvalButtonText = $filter('translate')('approval.already');//已审批
            });

            $scope.$on("enterApprovedExpenseList", function() {
                $scope.view.isList = true;
                $scope.view.unApproved = false;
                $scope.view.approvalButtonText = $filter('translate')('approval.not.approved');//未审批
            })
        }
    ]);
