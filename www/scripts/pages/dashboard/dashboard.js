'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tab.dash', {
                url: '/dash',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'dashboard'
                },
                views: {
                    'tab-dash': {
                        templateUrl: 'scripts/pages/dashboard/dashboard.tpl.html',
                        controller: 'com.handchina.hly.DashboardController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('my_account');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.hly.DashboardController', ['$scope', '$state', 'ExpenseService', 'CtripService',
        'PushService', '$rootScope', 'CarouselService', 'CompanyService', '$ionicPopup', 'localStorageService', 'LocalStorageKeys','$filter',
        function ($scope, $state, ExpenseService, CtripService, PushService, $rootScope, CarouselService,
                  CompanyService, $ionicPopup, localStorageService, LocalStorageKeys,$filter) {
        $scope.hasNotification = true;
        $scope.view = {
            goTo: function (state) {
                $state.go(state);
            },
            showAlert: function () {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('dashboard.Hint'),//提示
                    template: "<p>" + $filter('translate')('dashboard.Expect') + "</p>",//敬请期待
                    cssClass: 'show-alert',
                    okText: $filter('translate')('dashboard.confirm')//确定
                })
            }
        };
        $scope.data = {
            companyOID: null,
            carouselList: []
        };
        $scope.getDiDi = function(){
            didiJK.didiPluginFun();
        };
        $scope.jumpToCtrip = function (data) {
            CtripService.goTravelBefore(data);
        };
        $scope.$on('$ionicView.enter', function () {
            ExpenseService.setTab('INIT');
        });
        $scope.$on("$ionicView.enter", function () {
            if (!localStorageService.get(LocalStorageKeys.push.cleared)) {
                PushService.registerUserDevice();
            }
            ExpenseService.getMessageList(0, 1)
                .success(function (data, status, headers) {
                    $scope.total = headers('x-total-count');
                    $scope.$watch('total', function (newValue, oldValue, scope) {
                        PushService.setBadge($scope.total);
                        $rootScope.$on('NOTIFICATIONTOTAL', function (data, event) {
                            PushService.setBadge(data);
                        });
                    });
                    $scope.hasMessageTips = data.length > 0;
                    //if (data.length > 0) {
                    //    $scope.hasMessageTips = true;
                    //}
                    //else {
                    //    $scope.hasMessageTips = false;
                    //}
                });
            //query the company carousel
            CompanyService.getMyCompany()
                .then(function (data) {
                    CarouselService.getCarouselList(data.companyOID)
                        .success(function (data) {
                            $scope.data.carouselList = data;
                            angular.forEach($scope.data.carouselList, function (item, index) {
                                item.index = index;
                            })
                        })
                })
        });

    }]);
