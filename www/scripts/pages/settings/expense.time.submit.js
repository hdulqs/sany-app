/**
 * Created by boyce1 on 2016/5/24.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.expense_time_submit', {
            url: '/expense/time/submit',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/expense.time.submit.html',
                    controller: 'ExpenseTimeSubmitController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('settings');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('ExpenseTimeSubmitController', ['$scope', '$ionicHistory', 'ExpenseSheetService', '$state',
        function ($scope, $ionicHistory, ExpenseSheetService, $state) {
            $scope.view = {
                days: [],
                select: null,
                toggled: false,
                data:{}
            };
            $scope.cancel = function () {
                $scope.dateSelected = false;
            }
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            $scope.expenseSheetSetting = {
                data: {},
                toggleEnableAutoGeneration: function () {
                    if ($scope.expenseSheetSetting.data.enable === false) {
                        $scope.view.toggled = false;
                        ExpenseSheetService.setExpenseSheetSetting($scope.expenseSheetSetting.data);
                    } else {
                        $scope.view.toggled = true;
                        $scope.expenseSheetSetting.data.triggerDate = 1;
                        $scope.expenseSheetSetting.dateSelect($scope.expenseSheetSetting.data.triggerDate - 1,
                            $scope.expenseSheetSetting.data.triggerDate);
                    }
                },
                dateSelect: function ($index, day) {
                    $scope.selectedIndex = $index;
                    $scope.dateSelected = false;
                    $scope.view.toggled = true;
                    $scope.expenseSheetSetting.data.triggerDate = day;
                    ExpenseSheetService.setExpenseSheetSetting($scope.expenseSheetSetting.data);
                },
                toggleDate: function () {
                    $scope.dateSelected = false;
                    if ($scope.dateSelected === true) {
                        $scope.dateSelected = false;
                    }
                    else {
                        $scope.dateSelected = true;
                    }
                }
            };

            $scope.$on('$ionicView.enter', function () {
                $scope.view.days = [];
                for (var i = 1; i < 32; i++) {
                    $scope.view.days.push(i);
                }
                ExpenseSheetService.getExpenseSheetSetting()
                    .success(function (data) {
                        $scope.expenseSheetSetting.data = data;
                        $scope.expenseSheetSetting.dateSelect($scope.expenseSheetSetting.data.triggerDate - 1,
                            $scope.expenseSheetSetting.data.triggerDate);
                    });
            });
        }]);
