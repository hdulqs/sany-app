/**
 * Created by boyce1 on 2016/6/22.
 */
'use strict'
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.order_form', {
            url: '/order/form',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/order.form.tpl.html',
                    controller: 'OrderFormController'
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
    .controller('OrderFormController', ['$scope', 'CtripService', '$ionicHistory', '$state', 'ThirdPartService', 'LocationService', 'PublicFunction', 'InvoiceService',
        'FunctionProfileService','$filter', '$timeout',
        function ($scope, CtripService, $ionicHistory, $state, ThirdPartService, LocationService, PublicFunction, InvoiceService, FunctionProfileService,$filter,$timeout) {
            $scope.view = {
                jumpDisabled: false,//是否禁止跳转函数执行
                tabIndex: -1,
                tabItem: [
                ],
                changeTab: function (index) {
                    if ($scope.view.tabIndex !== index) {
                        $scope.view.tabIndex = index;
                        if ($scope.view.tabIndex == 0) {
                            InvoiceService.setTab(1002);
                        } else {
                            InvoiceService.setTab(1008);
                        }
                    }

                },
                functionProfileVenderJudge: function(type, id_list) {
                    if(!$scope.view.functionProfileList || !$scope.view.functionProfileList[type]){
                        return true
                    }

                    for(var i=0; i<id_list.length; i++){
                        if ($scope.view.functionProfileList[type].indexOf(id_list[i])!=-1){
                            return true
                        }
                    }
                    return false
                }
            };
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go(tab.account);
                }
            };
            $scope.jumpToCtrip = function (data) {
                //防止连续点击白屏,设置1.5秒间隔时间
                if($scope.view.jumpDisabled){
                    return
                }
                $scope.view.jumpDisabled = true;
                CtripService.goTravelBefore(data);
                $timeout(function(){
                    $scope.view.jumpDisabled = false;
                },1500);
            };
            $scope.orderSecretary = function () {
                var location = LocationService.getParam();
                var locationParams = {};
                locationParams.dLongitude = location.longitude;
                locationParams.dLatitude = location.latitude;
                locationParams.initPage = 'order';
                ThirdPartService.getSecretary(locationParams)
            };
            $scope.$on('$ionicView.enter', function () {
                var tab = InvoiceService.getTab();
                if (tab) {
                    if (tab === 1002) {
                        $scope.view.tabIndex = 0;
                    } else {
                        $scope.view.tabIndex = 1;
                    }

                } else {
                    $scope.view.tabIndex = 0;
                }
            });
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                InvoiceService.setTab(1002);
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;
                    if($scope.view.functionProfileVenderJudge('vendor', [1002])){
                        var item = {name: $filter('translate')('order_form.Ctrip')};//携程
                        $scope.view.tabItem.push(item);
                    }
                    if($scope.view.functionProfileVenderJudge('vendor', [1008])){
                        var item = {name: $filter('translate')('order_form.Order.secretary')};//订餐小秘书
                        $scope.view.tabItem.push(item);
                    }
                });
            });
        }]);
