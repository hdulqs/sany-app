/**
 * Created by Yuko on 16/6/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.faq_login_list', {
                url: '/faq/login/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.list.html',
                        controller: 'com.handchina.huilianyi.FAQLoginListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'login';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_didi_list', {
                url: '/faq/didi/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.list.html',
                        controller: 'com.handchina.huilianyi.FAQLoginListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'didi';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_travel_list', {
                url: '/faq/travel/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.list.html',
                        controller: 'com.handchina.huilianyi.FAQLoginListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'travel';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_invoice_list', {
                url: '/faq/invoice/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.list.html',
                        controller: 'com.handchina.huilianyi.FAQLoginListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'invoice';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_list', {
                url: '/faq/expense/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.list.html',
                        controller: 'com.handchina.huilianyi.FAQLoginListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'expense';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_bpo_list', {
                url: '/faq/bpo/list',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.list.html',
                        controller: 'com.handchina.huilianyi.FAQLoginListController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'bpo';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.FAQLoginListController', ['$scope', '$state', '$ionicHistory', 'content',
        function ($scope, $state, $ionicHistory, content) {
            $scope.view = content;
            $scope.goTo = function (name) {
                $state.go(name)
            };
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.faq_list');
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
