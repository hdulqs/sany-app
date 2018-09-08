/**
 * Created by Yuko on 16/6/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.faq_list', {
            url: '/faq/list',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/help/faq/faq.list.tpl.html',
                    controller: 'com.handchina.huilianyi.FAQListController'
                }
            }
        })
    }])
    .controller('com.handchina.huilianyi.FAQListController', ['$scope', '$state', '$ionicHistory',
        function ($scope, $state, $ionicHistory) {
            $scope.goTo = function (name) {
                $state.go(name)
            };
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.help_list');
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
