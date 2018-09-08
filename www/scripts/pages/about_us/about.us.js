'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.about_us', {
                url: '/about/us',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/about_us/about.us.tpl.html',
                        controller: 'com.handchina.huilianyi.InformationController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('about_us');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.InformationController', ['$scope','$ionicHistory','$state', 'updateVersionUrl', '$ionicLoading',
        '$ionicPopup', 'VersionService', 'AutoUpdateService', 'ENV', 'FunctionProfileService','$filter',
        function ($scope,$ionicHistory,$state, updateVersionUrl, $ionicLoading, $ionicPopup, VersionService, AutoUpdateService, ENV, FunctionProfileService,$filter) {
            //ionicMaterialInk.displayEffect();
            $scope.$on("$ionicView.enter", function () {
                $scope.data.localVersion = VersionService.getLocalVersion();
                if ($scope.shouldUpdate) {
                    checkVersion();
                }
            });
            $scope.view = {
                hasNewVersion: false
            };
            $scope.data = {
                currentVersion: "",
                localVersion: "0.0.1"
            };
            var checkVersion = function () {
                VersionService.getNewVersion().then(function (data) {
                    $scope.data.currentVersion = data.appVersion;
                    $scope.view.hasNewVersion = VersionService.checkUpdate($scope.data.localVersion, $scope.data.currentVersion);
                });
            };
            $scope.updateVersion = function () {
                if ($scope.shouldUpdate){
                    var options = {
                        closebuttoncaption: 'yes',
                        hardwareback: 'yes',
                        location: 'yes'
                    };
                    if ($scope.view.hasNewVersion === true) {
                        $ionicPopup.confirm({
                            title: $filter('translate')('about_us.The.new.version.is.detected'),//检测到新版本
                            template: '<p style="text-align: center">' + $filter("translate")("about_us.immediatelyUpdate") + '</p>',//是否立刻更新？
                            cancelText: $filter('translate')('about_us_js.cancel'),//取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('about_us_js.ok')//确定
                        }).then(function (result) {
                            if (result) {
                                if (ionic.Platform.isAndroid()) {
                                    AutoUpdateService.androidUpdate();
                                }
                                else if (ionic.Platform.isIOS()) {
                                    AutoUpdateService.iosUpdate();
                                }
                                else {
                                    $ionicLoading.show({
                                        template: $filter('translate')('system_check.Your.mobile.phone.platform.does.not.support.for.the.time.being'),//您的手机平台暂时不支持
                                        duration: '1000'
                                    });
                                }
                            }
                        });
                    } else {
                        $ionicLoading.show({
                            template: $filter('translate')('about_us.Is.the.latest.version'),//已经是最新版本
                            duration: '1000'
                        });
                    }
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = false;
                $scope.shouldUpdate = ionic.Platform.isAndroid() || ENV !== 'prod';
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
            $scope.goBack = function(){
                //上一级是tab，设置为根页面
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $ionicHistory.goBack();
            };
        }]);
