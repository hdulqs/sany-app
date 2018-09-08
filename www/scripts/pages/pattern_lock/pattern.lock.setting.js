/**
 * Created by lizhi on 16/9/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.pattern_lock_setting', {
                url: '/pattern_lock/setting',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/pattern_lock/pattern.lock.setting.tpl.html',
                        controller: 'com.handchina.hly.PatternLockSettingController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('pattern_lock');
                        return $translate.refresh();
                    }]
                }
            });
    }])
    .controller('com.handchina.hly.PatternLockSettingController', ['$ionicHistory', '$scope', '$state',
        '$ionicLoading', 'localStorageService', 'PushService', 'LocalStorageKeys', 'PatternLockService', 'Principal','$filter',
        function ($ionicHistory, $scope, $state,
                  $ionicLoading, localStorageService, PushService, LocalStorageKeys, PatternLockService, Principal,$filter) {

            $scope.username = localStorageService.get('username');
            $scope.patternLock = PatternLockService.getPatternLockByUsername($scope.username);

            $scope.view = {
                enable: $scope.patternLock?true:false,
                setIsPatternLock: function () {
                    $state.go('app.pattern_lock_gesture');
                }
            };

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });

        }]);
