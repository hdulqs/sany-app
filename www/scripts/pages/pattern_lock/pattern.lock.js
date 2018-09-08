/**
 * Created by lizhi on 16/9/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.pattern_lock', {
                url: '/pattern_lock',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/pattern_lock/pattern.lock.tpl.html',
                        controller: 'com.handchina.hly.PatternLockController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('pattern_lock');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.hly.PatternLockController', ['$ionicHistory', '$scope', '$state',
        '$ionicLoading', 'localStorageService', 'PushService', 'LocalStorageKeys', 'PatternLockService', 'Principal', 'Auth', '$timeout', '$rootScope','$filter',
        function ($ionicHistory, $scope, $state,
                  $ionicLoading, localStorageService, PushService, LocalStorageKeys, PatternLockService, Principal, Auth, $timeout, $rootScope,$filter) {

            $scope.username = localStorageService.get('username');
            $scope.patternLock = PatternLockService.getPatternLockByUsername($scope.username);
            $scope.patternLockErrorTime = PatternLockService.getPatternLockErrorTimeByUsername($scope.username);

            $scope.goBack = function (url) {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go(url);
                }
                $timeout(function () {
                    $rootScope.$emit('deblocking:success');
                })
            };

            $scope.view = {
                resetPatternLock: function(){
                    PatternLockService.setPatternLock($scope.username, null, 0);
                    Auth.logout();
                    $state.go('login');
                }
            };

            var patternLock = new PatternLock('#lockPattern', {
                margin: (window.innerWidth-150)/8,
                onDraw:function(pattern){
                    if ($scope.patternLock) {
                        PatternLockService.checkPatternLock($scope.username, pattern).success(function(data) {
                            patternLock.reset();
                            PatternLockService.setPatternLockErrorTimeByUsername($scope.username, 5);
                            $scope.goBack('app.tab_erv.homepage');
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
                    } else{
                        $scope.goBack('app.tab_erv.homepage');
                    }
                }
            });
        }]);
