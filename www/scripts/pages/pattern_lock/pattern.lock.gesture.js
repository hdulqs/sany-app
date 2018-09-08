/**
 * Created by lizhi on 16/9/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.pattern_lock_gesture', {
                url: '/pattern_lock/gesture',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/pattern_lock/pattern.lock.gesture.tpl.html',
                        controller: 'com.handchina.hly.PatternLockGestureController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('pattern_lock');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.hly.PatternLockGestureController', ['$ionicHistory', '$scope', '$state',
        '$ionicLoading', 'localStorageService', 'PushService', 'LocalStorageKeys', 'PatternLockService', 'Auth', 'Principal','$filter',
        function ($ionicHistory, $scope, $state,
                  $ionicLoading, localStorageService, PushService, LocalStorageKeys, PatternLockService, Auth, Principal,$filter) {

            $scope.username = localStorageService.get('username');
            $scope.patternLock = PatternLockService.getPatternLockByUsername($scope.username);
            $scope.patternLockErrorTime = PatternLockService.getPatternLockErrorTimeByUsername($scope.username);
            $scope.patternTime = 1;

            $scope.goBack = function (url) {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go(url);
                }
            };

            $scope.view = {
                //headerContent: $scope.patternLock?$filter('translate')('pattern.Cancel.the.gestures.password'):$filter('translate')('pattern.Password.Settings.gestures'),/*取消手势密码*//*设置手势密码*/
                headerContent: $filter('translate')('pattern.Gestures.to.lock'),
                isCancelPatternLock: function(){
                    return PatternLockService.getPatternLockByUsername($scope.username);
                },

                firstDrawPatternLock: function(){
                    return !$scope.view.isCancelPatternLock() && 1===$scope.patternTime;
                },

                secondDrawPatternLock: function(){
                    return !$scope.view.isCancelPatternLock() && 2===$scope.patternTime;
                },

                resetPatternLock: function(){
                    PatternLockService.setPatternLock($scope.username, null, 0);
                    Auth.logout();
                    $state.go('login');
                }
            };

            var patternLock = new PatternLock('#lockPatternSetting', {
                margin: (window.innerWidth-150)/8,
                onDraw:function(pattern){
                    if ($scope.view.isCancelPatternLock()) {
                        PatternLockService.checkPatternLock($scope.username, pattern).success(function(data) {
                            PatternLockService.setPatternLock($scope.username, null, 0);
                            patternLock.reset();
                            $ionicLoading.show({
                                template: $filter('translate')('pattern.Gestures.password.canceled.successfully')/*'手势密码取消成功'*/,
                                duration: '1000'
                            });
                            $scope.goBack('app.pattern_lock_setting');
                        }).error(function(data) {
                            patternLock.error();
                            if($scope.patternLockErrorTime>1){
                                $scope.patternLockErrorTime -= 1;
                                PatternLockService.setPatternLockErrorTimeByUsername($scope.username, $scope.patternLockErrorTime);
                            } else {
                                $ionicLoading.show({
                                    template: $filter('translate')('pattern.Gestures.password.authentication.failed.please.login.again')/*'手势密码验证失败,请重新登录'*/,
                                    duration: '1000'
                                });
                                PatternLockService.setPatternLock($scope.username, null, 0);
                                Auth.logout();
                                $state.go('login');
                            }
                        });
                    } else if ($scope.view.firstDrawPatternLock()){
                        if (pattern.length<=3){
                            $ionicLoading.show({
                                template:$filter('translate')('pattern.Gestures.password.shall.not.be.less.than.four.points')/* '手势密码不得少于4个点'*/,
                                duration: '1000'
                            });
                            patternLock.reset();
                        } else {
                            $scope.patternTime = 2;
                            $scope.view.headerContent = $filter('translate')('pattern.Please.input.gesture.password.again');/*请再次输入手势密码*/
                            $scope.patternLock = pattern;
                            $scope.$apply();
                            patternLock.reset();
                        }
                    } else if ($scope.view.secondDrawPatternLock()){
                        if(pattern===$scope.patternLock){
                            PatternLockService.setPatternLock($scope.username, pattern, 5);
                            patternLock.reset();
                            $ionicLoading.show({
                                template: $filter('translate')('pattern.Gestures.password.successfully')/*'手势密码设置成功'*/,
                                duration: '1000'
                            });
                            $scope.goBack('app.pattern_lock_setting');
                        } else {
                            patternLock.error();
                        }
                    }
                }
            });

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
