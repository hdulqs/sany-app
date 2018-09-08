/**
 * Created by boyce1 on 2016/7/10.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.set_register_password', {
            url: '/set/register/password',
            cache: false,
            params: {
                mobile: null,
                token: null
            },
            data: {
                roles: []
            },
            resolve: {
                authorize: ['Auth', function (Auth) {
                    return Auth.authorize();
                }],
                content: function () {
                    return 'register';
                }
            },
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/register/set.password.tpl.html',
                    controller: 'SetPasswordController'
                }
            },
            mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('register');
                return $translate.refresh();
            }]
        }).state('app.set_active_password', {
            url: '/set/active/password',
            cache: false,
            params: {
                mobile: null,
                token: null
            },
            data: {
                roles: []
            },
            resolve: {
                authorize: ['Auth', function (Auth) {
                    return Auth.authorize();
                }],
                content: function () {
                    return 'active';
                }
            },
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/register/set.password.tpl.html',
                    controller: 'SetPasswordController'
                }
            },
            mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('register');
                return $translate.refresh();
            }]
        })

    }])
    .controller('SetPasswordController', ['$scope', 'PushService', '$state', '$ionicLoading', 'Auth', 'localStorageService', '$ionicHistory', 'content',
        '$filter', '$translate', 'PublicFunction', '$sessionStorage', '$timeout', 'FunctionProfileService', 'LocalStorageKeys','$rootScope',
        function ($scope, PushService, $state, $ionicLoading, Auth, localStorageService, $ionicHistory, content, $filter, $translate, PublicFunction,
                  $sessionStorage, $timeout, FunctionProfileService, LocalStorageKeys,$rootScope) {
            var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
            $scope.view = {
                isShowPassword: true,
                mobile: null,
                password: null,
                token: null,
                title: $filter('translate')('register.registered')/*'注册'*/,
                buttonStatus: false,
                content: content,
                openPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                }
            };
            $scope.showPassword = function () {
                $scope.view.isShowPassword = !$scope.view.isShowPassword;
            };
            $scope.setPassword = function (valid, error) {
                if (error.required === true) {
                    $scope.view.openPopup($filter('translate')('register.Please.enter.the.password'));//请输入密码
                    return false;
                }
                if (error.pattern === true) {
                    $scope.view.openPopup($filter('translate')('register.Password.from.6.to.20.letters.and.Numbers'));//密码由6-20字母与数字组合
                    return false;
                }
            };
            $scope.nextStep = function (password) {
                if (!password) {
                    $scope.view.openPopup($filter('translate')('register.Please.enter.the.password'));//请输入密码
                    return false;
                } else if (password.length < 6 || password.length > 20 || password.match(pattern) === null) {
                    $scope.view.openPopup($filter('translate')('register.Password.from.6.to.20.letters.and.Numbers'));//密码由6-20字母与数字组合
                    return false;
                }
                if ($state.params.mobile) {
                    $scope.view.mobile = $state.params.mobile;
                }
                if ($state.params.token) {
                    $scope.view.token = $state.params.token;
                }
                if ($scope.view.content === 'active') {
                    //$state.go('app.tab.dash');
                    $state.go('app.tab_erv.homepage');

                } else if ($scope.view.content === 'register') {
                    $state.go('app.register_company', {
                        'mobile': $scope.view.mobile,
                        'token': $scope.view.token,
                        'password': password
                    })
                }
            };
            $scope.confirmPassword = function (password) {
                if (!password) {
                    $scope.view.openPopup($filter('translate')('register.Please.enter.the.password'));//请输入密码
                    return false;
                } else if (password.length < 6 || password.length > 20 || password.match(pattern) === null) {
                    $scope.view.openPopup($filter('translate')('register.Password.from.6.to.20.letters.and.Numbers'));//密码由6-20字母与数字组合
                    return false;
                } else {
                    PublicFunction.showLoading();
                    localStorageService.remove('token');
                    Auth.activateUser($state.params.mobile, $state.params.token, password, password)
                        .success(function () {
                            Auth.login({
                                username: $state.params.mobile,
                                password: password
                            }).then(function (data) {
                                $scope.authenticationError = false;
                                PushService.registerUserDevice(data.userOID);

                                $translate.use($sessionStorage.lang);
                                Auth.hec_login({username: $state.params.mobile}).then(function (hecRes) {
                                    $ionicLoading.hide();
                                    if (hecRes === "S") {
                                        $sessionStorage.isLoginOut = true;
                                        $scope.authenticationError = false;
                                        // 解除用户锁定
                                        Auth.loginSuccess({
                                            'username': $state.params.mobile,
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
                            });
                        })
                        .error(function (error, status) {
                            $ionicLoading.hide();
                            if (status === 400
                                && error.validationErrors
                                && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message === 'not.found') {
                                    $ionicLoading.show({
                                        template: $filter('translate')('register.Verification.code.error')/* '验证码错误'*/,
                                        duration: '1000'
                                    });
                                }
                            }
                        })
                }
            };
            $scope.goBack = function () {
                $state.go('login', {
                    mobile: $state.params.mobile
                })
            };
            function init() {
                if ($scope.view.content === 'register') {
                    $scope.view.title = $filter('translate')('register.registered')/*'注册'*/;
                    $scope.view.buttonStatus = false;
                } else if ($scope.view.content === 'active') {
                    $scope.view.title = $filter('translate')('register.The.activation')/*'激活'*/;
                    $scope.view.buttonStatus = true;
                }
            }

            init();


        }]);
