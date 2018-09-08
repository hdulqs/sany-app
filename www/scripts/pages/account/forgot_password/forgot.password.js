'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.forgot_password_init', {
                cache: false,
                url: '/forgot/password/init',
                data: {
                    roles: []
                },
                params: {
                    mobile: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/account/forgot_password/forgot.password.init.tpl.html',
                        controller: 'com.handchina.huilianyi.ForgotPasswordInitController'
                    }
                },  resolve:{
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.forgot_password_finish', {
                cache: false,
                url: '/forgot/password/finish/?mobile=?&token=?',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/account/forgot_password/forgot.password.finish.tpl.html',
                        controller: 'com.handchina.huilianyi.ForgotPasswordInitController'
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

    .controller('com.handchina.huilianyi.ForgotPasswordInitController', ['$scope', '$filter','$timeout', '$location', '$ionicHistory', 'localStorageService', '$document', 'Auth', '$state', '$ionicLoading', '$stateParams', 'NetworkInformationService',
        function ($scope,$filter, $timeout, $location, $ionicHistory, localStorageService, $document, Auth, $state, $ionicLoading, $stateParams, NetworkInformationService) {
            /*$scope.view = {
                activeContent: 'item-phone',
                holderTitle: '海外手机号请选择邮箱验证',
                btnTitle: '发送验证码',
                setActiveContent: function (active_content) {
                    if(active_content === 'item-phone'){
                        $scope.view.holderTitle = '海外手机号请选择邮箱验证';
                        $scope.view.btnTitle = '发送验证码';
                    }else{
                        $scope.view.holderTitle = '请输入邮箱';
                        $scope.view.btnTitle = '发送邮箱验证码';
                    }
                    $scope.view.activeContent = active_content;
                },
                isActive: function (active_content) {
                    return active_content === $scope.view.activeContent;
                },
            }*/
            $scope.forgotPassword = {
                token: null,
                mobile: null,
                password: null,
                confirmPassword: null
            };
            $scope.status = {
                smsSent: false,
                timerStart: false
            };
            $scope.clear = function () {
                $scope.forgotPassword.mobile = null;
                $scope.forgotPassword.token = null;
                $scope.status.smsSent = false;
                $scope.status.timerStart = false;
            }
            $scope.clear();
            $scope.reset = function () {
                $scope.status.smsSent = false;
                $scope.forgotPassword.token = null;
            };

            $scope.getToken = {
                submitted: false,
                token: null,
                mobile: null,
                resetSubmitButton: function () {
                    $scope.status.smsSent = false;
                },
                sendForgotPasswordToken: function (valid, error) {
                    $scope.getToken.submitted = true;
                    if (error.required === true) {
                        $ionicLoading.show({
                            template:$filter('translate')('account.please.enter.your.phone.number')/*请输入手机号码*/,
                            duration: '1000'
                        });
                        /*if($scope.view.activeContent === 'item-phone'){
                            $ionicLoading.show({
                                template: '请输入手机号码',
                                duration: '1000'
                            });
                        }else{
                            $ionicLoading.show({
                                template: '请输入邮箱',
                                duration: '1000'
                            });
                        }*/
                        return false;
                    }
                    if (error.pattern === true) {
                        $ionicLoading.show({
                            template:$filter('translate')('account.phone.number.to.fill.in.the.error') /*手机号码填写错误*/,
                            duration: '1000'
                        });
                        /*if($scope.view.activeContent === 'item-phone'){
                            $ionicLoading.show({
                                template: '手机号码填写错误',
                                duration: '1000'
                            });
                        }else{
                            $ionicLoading.show({
                                template: '邮箱填写错误',
                                duration: '1000'
                            });
                        }*/

                        return false;
                    }
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    Auth.getResetPasswordToken($scope.forgotPassword.mobile)
                        .success(function (data) {
                            $ionicLoading.hide();
                            $scope.status.smsSent = true;
                            $scope.status.timerStart = true;
                            //$document.find('timer')[0].start();
                            $scope.$broadcast('timer-start');
                            $ionicLoading.show({
                                template:$filter('translate')('account.verification.code.has.been.sent') /*验证码已发送*/,
                                duration: '1000'
                            });
                        })
                        .error(function (error, status) {
                            $ionicLoading.hide();
                            $scope.status.smsSent = false;
                            if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message === 'not.activated') {
                                    $ionicLoading.show({
                                        template:$filter('translate')('account.user.is.not.activated') /*用户尚未激活,请先激活*/,
                                        duration: '1000'
                                    });
                                } else if (error.validationErrors[0].message === 'mobile.not.found') {
                                    $ionicLoading.show({
                                        template: $filter('translate')('account.user.does.not.exist')/*用户不存在，请先注册*/,
                                        duration: '1000'
                                    });
                                } else if (error.validationErrors[0].message === 'sending.sms.is.too.frequent') {
                                    $ionicLoading.show({
                                        template:$filter('translate')('account.verify.code.is.sent.frequently') /*验证码发送频繁,请稍后再试*/,
                                        duration: '1000'
                                    });
                                } else if (error.validationErrors[0].message === 'not.allowed') {
                                    // 不能修改密码, 包括找回密码(美克需求)
                                    $ionicLoading.show({
                                        template:$filter('translate')('account.the.company.does.not.support.forgotten.passwords') /*该公司不支持忘记密码，如有疑问请联系管理员*/,
                                        duration: '1000'
                                    });
                                }
                            } else if (NetworkInformationService.isOffline()) {
                                $ionicLoading.show({
                                    template:$filter('translate')('error.network') /*网络连接失败!*/,
                                    duration: '1500'
                                });
                            }
                        });
                },
                countdownFinished: function () {
                    $scope.status.timerStart = false;
                    $timeout(function () {
                        $scope.$apply();
                    }, 100, false);
                    //$document.find('timer')[0].addCDSeconds(60);
                    //$document.find('timer')[0].stop();
                    $scope.$broadcast('timer-stop');
                    $scope.$broadcast('timer-set-countdown-seconds',60);
                }
            };
            $scope.checkToken = function (mobile, token) {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Auth.checkResetPasswordToken(mobile, token)
                    .success(function (data) {
                        $ionicLoading.hide();
                        $state.go('app.forgot_password_finish',
                            {
                                mobile: mobile,
                                token: token
                            });
                    })
                    .error(function (error, status) {
                        $ionicLoading.hide();
                        if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                            if (error.validationErrors[0].message === 'not.found') {
                                $ionicLoading.show({
                                    template: $filter('translate')('account.verify.code.error')/* 验证码错误,请重新输入*/,
                                    duration: '1000'
                                });
                            }
                            else {
                                $ionicLoading.show({
                                    template:  $filter('translate')('account.server.internal.error.please.try.again.later')/*服务器内部错误,请稍后再试*/,
                                    duration: '1000'
                                });
                            }
                        } else if (NetworkInformationService.isOffline()) {
                            $ionicLoading.show({
                                template:$filter('translate')('error.network') /*网络连接失败!*/,
                                duration: '1500'
                            });
                        }
                    });

            };
            $scope.mobile = $stateParams.mobile;
            $scope.token = $stateParams.token;
            $scope.resetPassword = function (error) {

                if (error.password.$error.required) {
                    $ionicLoading.show({
                        template: $filter('translate')('account.please.input.a.password')/*请输入密码*/,
                        duration: '1000'
                    });
                    return false;
                }
                if (error.password.$error.minlength || error.password.$error.maxlength) {
                    $ionicLoading.show({
                        template: $filter('translate')('account.please.input.6-20.letters.and.numbers')/*请输入6-20字母与数字组合!*/,
                        duration: '1000'
                    });
                    return;
                }
                if (error.confirmPassword.$error.required) {
                    $ionicLoading.show({
                        template:  $filter('translate')('account.please.enter.a.confirmation.password')/*请输入确认密码*/,
                        duration: '1000'
                    });
                    return;
                }
                if (error.password.$viewValue !== error.confirmPassword.$viewValue || error.confirmPassword.$error.minlength || error.confirmPassword.$error.maxlength) {
                    $ionicLoading.show({
                        template: $filter('translate')('account.two.passwords.are.not.consistent')/*两次密码不一致*/,
                        duration: '1000'
                    });
                    return;
                }
                if (!error.password.$valid || !error.confirmPassword.$valid) {
                    $ionicLoading.show({
                        template: $filter('translate')('account.password.consists')/*密码由6-20字母与数字组合!*/,
                        duration: '1000'
                    });
                    return;
                }
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Auth.resetPassword($scope.mobile, $scope.token, $scope.forgotPassword.password)
                    .success(function () {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template:$filter('translate')('account.password.reset.success')/* 密码重置成功*/,  //提示重置密码成功
                            duration: '1000'  //1秒后消失
                        });
                        $scope.clear();
                        localStorageService.set('username', $scope.mobile);
                        localStorageService.set('password', $scope.forgotPassword.password);
                        $state.go('login');

                    })
                    .error(function (error, status) {
                        $ionicLoading.hide();
                        if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                            if (error.validationErrors[0].message === 'not.found') {
                                $ionicLoading.show({
                                    template:$filter('translate')('account.verify.code.error') /*验证码错误,请重新输入*/,
                                    duration: '1000'
                                });
                            }
                            else {
                                $ionicLoading.show({
                                    template: $filter('translate')('error.network.exception,please.try.again.later')/*网络异常,请稍后再试*/,
                                    duration: '1000'
                                });
                            }
                        } else if (NetworkInformationService.isOffline()) {
                            $ionicLoading.show({
                                template:$filter('translate')('error.network')/* 网络连接失败!*/,
                                duration: '1500'
                            });
                        }
                    });
            };
            function init() {
                if ($state.params.mobile) {
                    $scope.forgotPassword.mobile = $state.params.mobile;
                }
            }

            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                localStorageService.set('username', $scope.forgotPassword.mobile);
                localStorageService.set('password', null);
            });
        }]);
