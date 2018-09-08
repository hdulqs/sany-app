/**
 * Created by lizhi on 16/9/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.security_center', {
            url: '/setting/security_center',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/security.center.tpl.html',
                    controller: 'SecurityCenterController'
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
    .controller('SecurityCenterController', ['$scope', '$ionicHistory', 'localStorageService', '$state', 'PushService',
                '$ionicPopup', 'Auth', 'CompanyConfigurationService', 'FunctionProfileService',
        function ($scope, $ionicHistory, localStorageService, $state, PushService, $ionicPopup, Auth, CompanyConfigurationService, FunctionProfileService) {
            $scope.$on('$ionicView.enter', function () {
                $scope.goTo = function (stateName) {
                    if (stateName === 'app.change_password_init') {
                        var mobile = localStorageService.get('username');
                        $state.go(stateName, {'mobile': mobile});

                    } else {
                        $state.go(stateName)
                    }
                };
            });

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;

                FunctionProfileService.getFunctionProfileList()
                    .then(function (data) {
                        $scope.functionProfileList = data;
                    })
            });
        }]);
