/**
 * Created by Nealyang on 16/2/26.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('no_header.welcome', {
                url: '/welcome',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense_report_version/welcome/welcome.tpl.html',
                        controller: 'WelcomeController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        return $translate.refresh();
                    }]
                }
            });
    }])
    .controller('WelcomeController', ['$scope', '$state', 'localStorageService', 'VersionService',
        function ($scope, $state, localStorageService, VersionService) {
            $scope.goLogin = function () {
                $state.go('login');
            };
            localStorageService.set('welcomeVersion', VersionService.getLocalVersion());
            //VersionService.getLocalVersion();
        }]);

