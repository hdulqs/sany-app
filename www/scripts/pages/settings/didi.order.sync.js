/**
 * Created by boyce1 on 2016/5/24.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.didi_sync', {
            url: '/didi/order/sync',
            cache: false,
            params: {
                message: null
            },
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/didi.order.sync.html',
                    controller: 'DiDiOrderSyncController'
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
    .controller('DiDiOrderSyncController', ['$scope', '$ionicHistory', 'ExpenseSheetService', '$state', 'InvoiceService', '$ionicLoading',
        '$timeout','$cordovaDatePicker', 'LANG','$stateParams','$filter',
        function ($scope, $ionicHistory, ExpenseSheetService, $state, InvoiceService, $ionicLoading, $timeout,$cordovaDatePicker, LANG, $stateParams,$filter) {
            $scope.view = {
                fromPage: $stateParams.message,
                start: {name: $filter('translate')('didi_order_js.Please.select.start.time'), value: ''},//请选择开始时间
                finish: {name: $filter('translate')('didi_order_js.Please.select.stop.time'), value: ''},//请选择结束时间
                getDatePickerTitle: function (name) {
                    return name;
                },
                selectDate: function (string) {
                    var dateOptions = {
                        date: new Date(),
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('person_js.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('person_js.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: LANG
                    };
                    if (!$scope.view.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'startDate') {
                                    var currentDate = new Date();
                                    if (date > currentDate) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('didi_order_js.Start.time.is.today.at.the.latest'),//开始时间最晚是今天
                                            cssClass: 'time-loading',
                                            duration: 1500
                                        });
                                        return;
                                    }
                                    $scope.view.start.value = date;
                                } else if (string === 'endDate') {
                                    if (date < $scope.view.start) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('didi_order_js.End.time.is.not.less.than.start.time'),//结束时间不能小于开始时间
                                            cssClass: 'time-loading',
                                            duration: 1500
                                        });
                                        return;
                                    }
                                    if (!$scope.view.start.value) {
                                        $ionicLoading.show({
                                            template:$filter('translate')('didi_order_js.Please.select.start.time'),// 请选择开始时间
                                            cssClass: 'time-loading',
                                            duration: 1500
                                        });
                                        return;
                                    }
                                    var currentDate = new Date();
                                    if (date > currentDate) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('didi_order_js.End.time.is.today.at.the.latest') ,//结束时间最晚是今天
                                            cssClass: 'time-loading',
                                            duration: 1500
                                        });
                                        return;
                                    }
                                    $scope.view.finish.value = date;
                                }
                            }
                        });
                    }
                }
            };
            $scope.didiOrderSync = {
                getDidiExpense: function () {
                    var date = new Date();
                    if (($scope.view.finish.value > date)&&$scope.view.finish.value!=='') {
                        $ionicLoading.show({
                            template: $filter('translate')('didi_order_js.End.time.is.today.at.the.latest'),//结束时间最晚是今天
                            cssClass: 'time-loading',
                            duration: 1500
                        });
                        return;
                    }
                    if (($scope.view.finish.value < $scope.view.start.value)&&$scope.view.finish.value!=='') {
                            $ionicLoading.show({
                                template: $filter('translate')('didi_order_js.End.time.is.not.less.than.start.time'),//结束时间不能小于开始时间
                                cssClass: 'time-loading',
                                duration: 1500
                            });

                    } else {
                        $scope.showLoading();
                        //在MainAppController中，已经定义了该函数，可以重用
                        InvoiceService.getDidiOrderInvoice($scope.view.start.value, $scope.view.finish.value)
                            .success(function () {
                                $ionicLoading.hide();
                                $ionicLoading.show({
                                    template: $filter('translate')('didi_order_js.orders.have.been.synchronized.success')+'<br>'+$filter('translate')('didi_order_js.check_in_expense_list'),//滴滴订单已同步成功,<br>请到费用列表里查看!
                                    duration: 500
                                });
                                $timeout(function () {
                                    if ($scope.view.fromPage || $scope.view.fromPage === 'account_book') {
                                        // $state.go('app.account_book');
                                        $ionicHistory.goBack(-2);
                                    } else {
                                        //$state.go('app.setting_list');
                                        $ionicHistory.goBack();
                                    }

                                }, 1000);
                            })
                            .error(function (error){
                                $ionicLoading.hide();
                            });
                    }
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            // $scope.$on('$ionicView.enter', function () {
            //     $scope.view.fromPage = $state.params.message;
            // });

        }]);
