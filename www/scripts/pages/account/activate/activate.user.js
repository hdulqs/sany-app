'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.activate_init', {
                url: '/activate/init?mobile',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/account/activate/activate.user.init.tpl.html',
                        controller: 'ActivateInitController'
                    }
                },
                resolve:{
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.activate_init_next', {
                url: '/activate/init/next?mobile=?&token=?',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/account/activate/activate.user.init.next.tpl.html',
                        controller: 'ActivateInitNextController'
                    }
                },
                resolve:{
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.activate_finish', {
                url: '/activate/finish?mobile=?&password=?',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/account/activate/activate.user.finish.tpl.html',
                        controller: 'ActivateUserFinishController'
                    }
                },
                resolve:{
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('ActivateInitController', ['$scope','$filter', '$document', 'Auth', '$state', '$ionicLoading', '$stateParams',
        function ($scope, $filter,$document, Auth, $state, $ionicLoading, $stateParams) {
            var mobile = $stateParams.mobile;
            var mobileReplace = mobile.substr(3, 4);
            var newMobile = mobile.replace(mobileReplace, '****');
            $scope.mobile = newMobile;
            $scope.status = {
                smsSent: false,
                timerStart: false
            };
            $scope.getToken = {
                sendActivationToken: function (valid) {
                    if (!valid) {
                        return;
                    }
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    Auth.getActivationToken(mobile)
                        .success(function () {
                            $ionicLoading.hide();
                            $scope.status.smsSent = true;
                            $scope.status.timerStart = true;
                            $document.find('timer')[0].start();
                        })
                        .error(function (error, status) {
                            $ionicLoading.hide();
                            if (status === 400
                                && error.validationErrors
                                && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message === 'user already activated') {
                                    $ionicLoading.show({
                                        template: $filter('translate')('account.the.use.has.been.activated')/*该用户已被激活*/,
                                        duration: '1000'
                                    });
                                } else if (error.validationErrors[0].message === 'mobile.not.found') {
                                    $ionicLoading.show({
                                        template: $filter('translate')('account.the.user.does.not.exist')/*该用户不存在*/,
                                        duration: '1000'
                                    });
                                } else {
                                    $ionicLoading.show({
                                        template:  $filter('translate')('account.request.authentication.code.is.too.frequent')/*请求验证码太频繁*/,
                                        duration: '1000'
                                    });
                                }
                            }
                        });
                },
                countdownFinished: function () {
                    $scope.status.timerStart = false;
                    $scope.$apply();
                }
            };
            $scope.changePasswordNext = function () {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Auth.checkActivateToken($stateParams.mobile, $scope.getToken.token)
                    .success(function () {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template:$filter('translate')('account.verify.code.correct') /*验证码正确*/,
                            duration: '1000'
                        });
                        $state.go('app.activate_init_next', {
                            mobile: $stateParams.mobile,
                            token: $scope.getToken.token
                        });
                    })
                    .error(function (error, status) {
                        $ionicLoading.hide();
                        if (status === 400
                            && error.validationErrors
                            && error.validationErrors.length > 0) {
                            if (error.validationErrors[0].message === 'expired') {
                                $ionicLoading.show({
                                    template:$filter('translate')('account.verification.code.has.expired') /*验证码已过期*/,
                                    duration: '1000'
                                });
                            } else if (error.validationErrors[0].message === 'not.found') {
                                $ionicLoading.show({
                                    template: $filter('translate')('account.verification.code.error')/*验证码错误*/,
                                    duration: '1000'
                                });
                            }
                        }
                    });
            }

        }])
    .controller('ActivateInitNextController', ['$scope', '$document', 'Auth', '$state', '$ionicLoading', '$stateParams',
        function ($scope, $document, Auth, $state, $ionicLoading, $stateParams) {
            $scope.activate = {
                activateUser: function (valid) {
                    if (!valid) {
                        return;
                    }
                    if ($scope.activate.newPassword !== $scope.activate.confirmPassword) {
                        $ionicLoading.show({
                            template: $filter('translate')('account.two.passwords.are.not.consistent') /*两次密码不一致*/,
                            duration: '1000'
                        });
                        return;
                    } else {
                        $scope.showLoading();
                        //在MainAppController中，已经定义了该函数，可以重用
                        Auth.activateUser($stateParams.mobile, $stateParams.token, $scope.activate.newPassword)
                            .success(function () {
                                $ionicLoading.hide();
                                $state.go('app.activate_finish', {mobile: $stateParams.mobile, password: $scope.activate.newPassword});
                            })
                            .error(function (error, status) {
                                $ionicLoading.hide();
                                if (status === 400
                                    && error.validationErrors
                                    && error.validationErrors.length > 0) {
                                    if (error.validationErrors[0].message === 'not.found') {
                                        $ionicLoading.show({
                                            template: $filter('translate')('account.verification.code.error')/*验证码错误*/,
                                            duration: '1000'
                                        });
                                    }
                                }
                            })
                    }
                }
            };
        }])
    .controller('ActivateUserFinishController', ['$scope', '$stateParams','Auth', 'PushService','localStorageService', '$state',
        function ($scope, $stateParams, Auth, PushService, localStorageService, $state) {
            var mobile = $stateParams.mobile;
            var mobileReplace = mobile.substr(3, 4);
            var newMobile = mobile.replace(mobileReplace, '****');
            $scope.mobile = newMobile;
            $scope.login = function () {
                localStorageService.remove('token');
                Auth.login({
                    username: $stateParams.mobile,
                    password: $stateParams.password
                }).then(function (data) {
                    $scope.authenticationError = false;
                    PushService.registerUserDevice(data.userOID);
                    //$state.go('tabs.mainpage');
                    $state.go('app.tab_erv.homepage');
                });
            }
        }]);
