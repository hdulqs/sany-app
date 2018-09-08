'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.contact_us', {
                url: '/contact/us',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/about_us/contact_us/contact.us.html',
                        controller: 'com.handchina.huilianyi.ContactUsController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('about_us');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.ContactUsController', ['$scope','$ionicHistory','$state',
        function ($scope,$ionicHistory,$state) {
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.about_us');
                }
            };
        }]);
