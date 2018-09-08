'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.function_introduction', {
                url: '/function/introduction',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/about_us/function_introduction/function.introduction.html',
                        controller: 'com.handchina.huilianyi.FunctionIntroductionController'
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
    .controller('com.handchina.huilianyi.FunctionIntroductionController', ['$scope','$ionicHistory','$state',
        function ($scope,$ionicHistory,$state) {
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.about_us');
                }
            };
        }]);
