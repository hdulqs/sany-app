/**
 * Created by hly on 2016/10/19.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.service_agreement', {
            url: '/service/agreement',
            cache: false,
            data: {
                roles: []
            },
            resolve: {
                authorize: ['Auth', function (Auth) {
                    return Auth.authorize();
                }],
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('pattern_lock');
                    return $translate.refresh();
                }]
            },
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/register/service.agreement.html',
                    controller: 'com.handchina.huilianyi.ServiceAgreementController'
                }
            },
            params: {
                mobile: null
            }
        })
    }])
    .controller('com.handchina.huilianyi.ServiceAgreementController', ['$scope', function ($scope) {
        $scope.goBack = function () {
            $state.go('app.check_register_user', {
                mobile: $state.params.mobile
            })
        }
    }]);

