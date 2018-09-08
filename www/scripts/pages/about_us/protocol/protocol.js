'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.protocol', {
                url: '/protocol',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/about_us/protocol/protocol.html',
                        controller: 'com.handchina.huilianyi.ProtocolController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('about_us');
                        return $translate.refresh();
                    }]
                },
                params: {
                    mobile: null
                }
            })

    }])
    .controller('com.handchina.huilianyi.ProtocolController', ['$scope', '$ionicHistory', '$state','$filter',
        function ($scope, $ionicHistory, $state,$filter) {
            $scope.goBack = function () {
                if ($state.params.mobile) {
                    $state.go('app.check_register_user', {
                        mobile: $state.params.mobile
                    })
                } else {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        //$state.go('app.about_us');
                    }
                }
            };
        }]);
