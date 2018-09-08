'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                cache: false,
                params: {
                    mobile: null,
                    status: null
                },
                data: {
                    roles: []
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                },
                views: {
                    'main': {
                        templateUrl: 'scripts/pages/login/login.tpl.html',
                        controller: 'com.handchina.hly.LoginController'
                    }
                }
            });
    }])
    .controller('com.handchina.hly.LoginController', ['$ionicHistory', '$scope', '$rootScope', '$state', 'Auth',
        '$ionicLoading', 'localStorageService', 'PushService', 'LocalStorageKeys', '$sessionStorage', '$filter',
        'FunctionProfileService', '$translate', '$timeout', 'ENV', 'ServerService', 'PublicFunction',
        function ($ionicHistory, $scope, $rootScope, $state, Auth, $ionicLoading, localStorageService, PushService, LocalStorageKeys,
                  $sessionStorage, $filter, FunctionProfileService, $translate, $timeout, ENV, ServerService, PublicFunction) {
            $scope.user = {};
            $scope.errors = {};
            $scope.rememberMe = true;
            $scope.user = {};
            $scope.hasBpo = false;
            $scope.userStatus = false;
            $scope.user.localServiceBaseURL = localStorageService.get("ServiceBaseURL");

            $scope.judgeENV = function () {
                return ServerService.judgeENV();
            };

            $scope.login = function () {
                PublicFunction.showLoading();
                localStorageService.remove('token');

                // 非正式和预发布环境设置ServiceBaseURL
                if (!$scope.judgeENV()) {
                    if ($scope.user.localServiceBaseURL) {
                        ServerService.saveServiceBaseURL($scope.user.localServiceBaseURL.replace(" ", ""));
                    } else {
                        localStorageService.set("ServiceBaseURL", "");
                        ServerService.setInitServiceBaseURL();
                    }
                }

                Auth.login({
                    username: $scope.user.username,
                    password: $scope.user.password
                }).then(function (data) {
                    $translate.use($sessionStorage.lang);
                    Auth.hec_login({username: $scope.user.username}).then(function (hecRes) {
                        $ionicLoading.hide();
                        if (hecRes === "S") {
                            $sessionStorage.isLoginOut = true;
                            $scope.authenticationError = false;
                            // 解除用户锁定
                            Auth.loginSuccess({
                                'username': $scope.user.username,
                                'token': localStorageService.get('token')
                            });
                            $rootScope.$emit('loginSuccess');
                            PushService.resumePushService();
                            FunctionProfileService.getFunctionProfileList().then(function (data) {
                                $scope.functionProfileList = data;
                            });
                            $timeout(function () {
                                $state.go('app.tab_erv.homepage');
                            }, 500);
                            localStorageService.set(LocalStorageKeys.push.cleared, false);
                            if (!localStorageService.get(LocalStorageKeys.push.cleared)) {
                                PushService.registerUserDevice();
                            }
                        }
                    }, function (err) {
                        PublicFunction.showToast('获取HEC系统用户信息出错!');
                        Auth.logout();
                    });
                }, function (error) {
                    $ionicLoading.hide();
                    $scope.authenticationError = true;
                    if (error.data) {
                        if (error.data.error_description === 'user.not.found') {
                            $ionicLoading.show({
                                template: $filter('translate')('login.errors.user.not.found'),
                                duration: '1000'
                            });
                        } else if (error.data.error_description === 'Bad credentials') {
                            // 向后台写入登录失败次数
                            Auth.loginErrorCounts({username: $scope.user.username}).success(function (res) {
                                if (res > 0) {
                                    $ionicLoading.show({
                                        template: $filter('translate')('login.errors.user.is.locked1') + ' ' + res + ' ' + $filter('translate')('login.tips.times'),
                                        duration: '1000'
                                    });
                                } else {
                                    $ionicLoading.show({
                                        template: $filter('translate')('login.errors.user.is.locked2'),
                                        duration: '2000'
                                    });
                                }
                            });
                        } else if (error.data.error_description === 'user.is.locked') {
                            $ionicLoading.show({
                                template: $filter('translate')('login.errors.user.is.locked2'),
                                duration: '1000'
                            });
                        } else if ((error.data.error_description === 'user.not.activated')) {
                            $ionicLoading.show({
                                template: $filter('translate')('login.errors.user.not.activated'),
                                duration: '1000'
                            });
                        }
                    } else {
                        $ionicLoading.show({
                            template: $filter('translate')('login.errors.request.error'),
                            duration: '1000'
                        });
                    }
                });
            };

            $scope.$on('$ionicView.enter', function () {
                var token = localStorageService.get(LocalStorageKeys.token);
                var username = localStorageService.get('username');
                if (token) {
                    FunctionProfileService.getFunctionProfileList().then(function (data) {
                        $scope.functionProfileList = data;
                    });
                    $state.go('app.tab_erv.homepage');
                }
                if ($state.params.status == 'active') {
                    $scope.userStatus = true;
                    $scope.title = $filter('translate')('login.activate.title');
                } else if ($state.params.status === 'register') {
                    $scope.userStatus = true;
                    $scope.title = $filter('translate')('login.register.title');
                }
                if ($state.params.mobile) {
                    $scope.user.username = $state.params.mobile;
                    $scope.user.password = null;
                } else {
                    if (username) {
                        $scope.user.username = username;
                        //$scope.user.password = password;
                    } else {
                        $scope.user.username = null;
                        $scope.user.password = null;
                    }
                }
            });

            $scope.forgotPassword = function (data) {
                $state.go('app.forgot_password_init', {
                    'mobile': data
                })
            };

            $scope.clearUrl = function () {
                $scope.user.localServiceBaseURL = '';
            };
            $scope.clearAccount = function () {
                $scope.user.username = '';
                $scope.user.password = '';
            };
            $scope.clearPwd = function () {
                $scope.user.password = '';
            };
            $scope.goTo = function (stateName) {
                $scope.userStatus = false;
                $state.go(stateName);
            }
        }])
    .directive('trim', function () {    //给input输入框中的ngModel值去除前后空格
        return {
            require: 'ngModel',
            link: function (scope, element, iAttrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (input) {     //input中输入的值发生变化都会触发这个函数
                    // return input.replace(/(^\s*)|(\s*$)/g, ""); // 返回匹配给定正则表达式后的值, 去除前后空格
                    return input.replace(/\s/g, ""); // 返回匹配给定正则表达式后的值， 去除所有空格
                });
            }
        }
    })
;
