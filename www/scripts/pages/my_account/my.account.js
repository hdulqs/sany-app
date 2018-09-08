/**
 * Created by Yuko on 16/7/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab.account', {
            url: '/account',
            cache: false,
            views: {
                'tab-account': {
                    templateUrl: 'scripts/pages/my_account/my.account.tpl.html',
                    controller: 'com.handchina.hly.AccountController'
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
    .controller('com.handchina.hly.AccountController', ['$scope', 'Principal', 'CompanyConfigurationService', '$state',
        function ($scope, Principal, CompanyConfigurationService, $state) {
            $scope.goTo = function (stateName) {
                $state.go(stateName);
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            $scope.$on("$ionicView.enter", function () {
                Principal.identity(true).then(function (data) {
                    $scope.person = data;
                    if ($scope.person && $scope.person.filePath)
                        $scope.imgUrl = $scope.person.filePath;
                    else
                        $scope.imgUrl = '/img/title-icon.png';
                });
                CompanyConfigurationService.getCompanyConfiguration().then(function () {
                    $scope.orderAuth = CompanyConfigurationService.getBooleanConfig('travel.enabled');
                });

            });
            $scope.currentLocation = {
                longitude: 121.492846,
                latitude: 31.293518
            }
            $scope.selectLocation = function (item) {
                $scope.selected = {
                    address: item.name,
                    longitude: item.longitude,
                    latitude: item.latitude
                };
            }
        }]);
