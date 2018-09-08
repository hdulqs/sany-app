/**
 * Created by Yuko on 16/7/29.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_application_list', {
            url: '/erv/application/list',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/application/application.list.tpl.html',
                    controller: 'com.handchina.huilianyi.ApplicationListERVController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('expense_report');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ApplicationListERVController', ['$scope', '$state','$ionicHistory',
        function ($scope, $state,$ionicHistory) {
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
            $scope.goTo = function (name) {
                $state.go(name);
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });

        }]);
