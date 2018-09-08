/**
 * Created by boyce1 on 2016/7/10.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.check_register_user', {
                url: '/check/register/user',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/register/check.user.detail.html',
                        controller: 'CheckUserDetailController'
                    }
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    content: function () {
                        return 'register';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('pattern_lock');
                        $translatePartialLoader.addPart('register');
                        return $translate.refresh();
                    }]
                },
                params: {
                    mobile: null
                }
            })
            .state('app.check_active_user', {
                url: '/check/active/user',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/register/check.user.detail.html',
                        controller: 'CheckUserDetailController'
                    }
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    content: function () {
                        return 'active';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('register');
                        $translatePartialLoader.addPart('pattern_lock');
                        return $translate.refresh();
                    }]

                },
                params: {
                    mobile: null
                },
            })
    }])
    .controller('CheckUserDetailController', ['$scope', '$document', '$ionicHistory', '$state', '$ionicLoading', 'Auth',
        'localStorageService', '$timeout', 'content', '$sessionStorage', '$filter',
        function ($scope, $document, $ionicHistory, $state, $ionicLoading, Auth, localStorageService, $timeout, content,
                  $sessionStorage, $filter) {
            $scope.view = {
                activeContent: 'item-phone',
                holderTitle: $filter('translate')('register.Overseas.phone.number.please.select.email.validation')/*'海外手机号请选择邮箱验证'*/,
                btnTitle: $filter('translate')('register.Send.verification.code')/*'发送验证码'*/,
                token: null,
                mobile: null,
                accountStatus: false,
                userStatus: '',
                content: content,
                isChecked: false,
                captchaShow: true,
                setActiveContent: function (active_content) {
                    $scope.reset();
                    $scope.view.mobile = null;
                    if (active_content === 'item-phone') {
                        $scope.view.holderTitle = $filter('translate')('register.Overseas.phone.number.please.select.email.validation') /*'海外手机号请选择邮箱验证'*/;
                        $scope.view.btnTitle = $filter('translate')('register.Send.verification.code')/*'发送验证码'*/;
                    } else {
                        $scope.view.holderTitle = $filter('translate')('register.Please.enter.the.email.address')/*'请输入邮箱'*/;
                        $scope.view.btnTitle = $filter('translate')('register.Send.email.verification.code')/*'发送邮箱验证码'*/;
                    }
                    $scope.view.activeContent = active_content;
                },
                isActive: function (active_content) {
                    return active_content === $scope.view.activeContent;
                },
                countdown: function () {    //倒计时
                    $scope.status.smsSent = true;
                    $scope.status.timerStart = true;
                    //重置倒计时器
                    $sessionStorage.timerStatus = 0;
                    //$document.find('timer')[0].reset();
                    //$document.find('timer')[0].start();
                    $scope.$broadcast('timer-stop');
                    $scope.$broadcast('timer-set-countdown-seconds',60);
                    $scope.$broadcast('timer-start');
                    $scope.view.openPopup($filter('translate')('register.Verification.code.has.been.sent'));//验证码已发送
                },
                openPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                getCaptchaImage: function () {
                    //获取图片验证码
                    Auth.getCaptcha()
                        .then(function (response) {
                            $scope.view.verifyCode = null;
                            $scope.view.captchaImage = response.data.image;
                            $scope.view.attachmentOID = response.data.attachmentOID;

                            $scope.view.token = null;
                            //    清空手机验证码，保留手机号
                            //获取新的图片验证码，则需要显示这个div
                            $scope.view.captchaShow = true;
                        });
                }
            };
            $scope.status = {
                smsSent: false,
                timerStart: false
            };
            $scope.goBack = function () {
                //reset session storage
                $sessionStorage.timerStatus = 0;
                $state.go('login', {
                    mobile: $scope.view.mobile
                })
            };
            $scope.getCountdown = function () {
                var reg = /[0-9]+/g;
                var content = $document.find('timer')[0].textContent;
                var countdown = content.match(reg);
                if (countdown && countdown[0]) {
                    return countdown[0];
                } else {
                    return 0;
                }
            };
            $scope.goTo = function (stateName) {
                if (stateName === 'app.protocol') {
                    //保存下当前记录的时间
                    if ($scope.status.smsSent && $scope.status.timerStart) {
                        var countdown = $scope.getCountdown();
                        if (countdown) {
                            $sessionStorage.timerStatus = 60 - countdown;
                        }
                    }
                } else {
                    $sessionStorage.timerStatus = 0;
                }
                $scope.status.smsSent = true;
                $state.go(stateName, {
                    mobile: $scope.view.mobile
                })
            };
            $scope.reset = function () {
                $scope.status.smsSent = false;
                $scope.status.timerStart = false;
                //$document.find('timer')[0].reset();
                $scope.$broadcast('timer-stop');
                $scope.$broadcast('timer-set-countdown-seconds',60);
            };
            $scope.register = function (valid, error) {
                if (error.required === true) {
                    if ($scope.view.activeContent === 'item-phone') {
                        $scope.view.openPopup($filter('translate')('register.Please.enter.the.phone.number'));//请输入手机号码
                    } else {
                        $scope.view.openPopup($filter('translate')('register.Please.enter.the.email.address'));//请输入邮箱
                    }
                    return false;
                }
                if ($scope.view.content === 'register' && $scope.view.captchaShow == false) {
                    //如果图片验证码已经影藏了，点击发送短信验证码，这个时候应该重新获取图片验证码，并且让他再次输入图片验证码
                    $scope.view.captchaShow = true;
                    $scope.view.getCaptchaImage();
                    $scope.view.openPopup($filter('translate')('register.Please.enter.a.captcha.image'));//请再输入一次图片验证码
                    return false
                }
                if ($scope.view.content === 'register' && !$scope.view.verifyCode) {
                    $scope.view.captchaShow = true;
                    $scope.view.openPopup($filter('translate')('register.Please.enter.the.image.verification.code'));//请输入图片验证码
                    return false;
                }
                if (error.pattern === true) {
                    if ($scope.view.activeContent === 'item-phone') {
                        $scope.view.openPopup($filter('translate')('register.Mobile.phone.number.fill.in.error'));//手机号码填写错误
                    } else {
                        $scope.view.openPopup($filter('translate')('register.E-mail.fill.in.error'));//邮箱填写错误
                    }
                    return false;
                }
                if ($scope.view.content === 'register') {
                    Auth.checkCompanyRegister($scope.view.mobile)
                        .success(function () {
                            Auth.getCompanyRegisterToken($scope.view.mobile, $scope.view.attachmentOID, $scope.view.verifyCode)
                                .success(function () {
                                    $scope.status.smsSent = true;
                                    $scope.status.timerStart = true;
                                    //重置倒计时器
                                    $sessionStorage.timerStatus = 0;
                                    //$document.find('timer')[0].reset();
                                    //$document.find('timer')[0].start();
                                    $scope.$broadcast('timer-stop');
                                    $scope.$broadcast('timer-set-countdown-seconds',60);
                                    $scope.$broadcast('timer-start');
                                    $scope.view.openPopup($filter('translate')('register.Verification.code.has.been.sent'));//验证码已发送
                                    //影藏图片验证码
                                    $scope.view.captchaShow = false;
                                }).error(function (error, status) {
                                //如果有错误，自动重新刷新图片验证码
                                $scope.view.getCaptchaImage();
                                $scope.status.smsSent = false;
                                if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                    if (error.validationErrors[0].message === 'sending.sms.is.too.frequent') {
                                        $scope.view.openPopup($filter('translate')('register.Send.frequent.authentication.code'));//验证码发送频繁,请稍后再试
                                    }
                                    else if (error.validationErrors[0].message === 'verifyCode error') {
                                        $scope.view.openPopup($filter('translate')('register.Image.verification.code.error'));//图片验证码错误
                                    }
                                    else {
                                        $scope.view.openPopup($filter('translate')('register.Verification.code.error.please.enter.again'));//验证码错误，请重新输入
                                    }
                                }
                                $scope.view.openPopup($filter('translate')('register.Verification.code.error.please.enter.again'));//验证码错误，请重新输入
                            });
                        })
                        .error(function (error, status) {
                            $scope.status.smsSent = false;
                            if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message === 'sending.sms.is.too.frequent') {
                                    $scope.view.openPopup($filter('translate')('register.Send.frequent.authentication.code'));//验证码发送频繁,请稍后再试
                                } else if (error.validationErrors[0].message === 'mobile has been used') {
                                    $scope.view.openPopup($filter('translate')('register.The.mobile.phone.number.has.been.registered'));//该手机号已注册
                                    $state.go('login', {
                                        'mobile': $scope.view.mobile,
                                        'status': $scope.view.content
                                    });
                                }
                            }
                        })
                } else if ($scope.view.content === 'active') {
                    $scope.view.isChecked = true;
                    Auth.getActivationToken($scope.view.mobile)
                        .success(function () {
                            $scope.view.countdown();
                        })
                        .error(function (error, status) {
                            $scope.status.smsSent = false;

                            if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message === 'sending.sms.is.too.frequent') {
                                    $scope.view.openPopup($filter('translate')('register.Send.frequent.authentication.code'));//验证码发送频繁,请稍后再试
                                } else if (error.validationErrors[0].message === 'user already activated') {
                                    $state.go('login', {
                                        'mobile': $scope.view.mobile,
                                        'status': $scope.view.content
                                    });
                                } else if (error.validationErrors[0].message === 'mobile.not.found') {
                                    $scope.view.accountStatus = true;
                                } else if (error.validationErrors[0].message === 'email.not.found') {
                                    $scope.view.openPopup($filter('translate')('register.The.email.you.entered.is.not.found'));//您输入的邮箱未找到
                                }
                            }
                        })
                }
            };
            $scope.countdownFinished = function () {
                $scope.status.timerStart = false;
                //$document.find('timer')[0].reset();
                $scope.$broadcast('timer-stop');
                $scope.$broadcast('timer-set-countdown-seconds',60);
                $timeout(function () {
                    $scope.$apply();
                }, 100, false);
                //$document.find('timer')[0].addCDSeconds(60);
                //$document.find('timer')[0].stop();

            };
            $scope.nextStep = function (mobile, token) {
                if ($scope.view.content === 'register') {
                    if ($scope.view.isChecked) {
                        Auth.checkCompanyRegisterToken(mobile, token)
                            .success(function () {
                                $state.go('app.set_register_password', {
                                    'mobile': mobile,
                                    'token': token
                                });
                            })
                            .error(function (error, status) {
                                $scope.status.smsSent = false;
                                if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                    if (error.validationErrors[0].message == 'not.found') {
                                        $scope.status.smsSent = true;
                                        $scope.getCountdown();
                                        //$document.find('timer')[0].start();
                                        $scope.$broadcast('timer-start');
                                        $scope.view.openPopup($filter('translate')('register.Verification.code.error.please.enter.again'));//验证码错误,请重新输入

                                    } else if (error.validationErrors[0].message == 'expired') {
                                        $scope.view.openPopup($filter('translate')('register.Captcha.timeout'));//验证码超时,请重新发送
                                    }
                                } else if (error.errorCode === 'OBJECT_NOT_FOUND') {
                                    $scope.status.smsSent = true;
                                    $scope.getCountdown();
                                    //$document.find('timer')[0].start();
                                    $scope.$broadcast('timer-start');
                                    $scope.view.openPopup($filter('translate')('register.Verification.code.error.please.enter.again'));//验证码错误,请重新输入
                                }
                            })
                    }
                } else if ($scope.view.content === 'active') {
                    Auth.checkActivateToken(mobile, token)
                        .success(function () {
                            $state.go('app.set_active_password', {
                                'mobile': mobile,
                                'token': token
                            });
                        })
                        .error(function (error, status) {
                            $scope.status.smsSent = false;
                            if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message == 'not.found') {
                                    $scope.status.smsSent = true;
                                    $scope.getCountdown();
                                    //$document.find('timer')[0].start();
                                    $scope.$broadcast('timer-start');
                                    $scope.view.openPopup($filter('translate')('register.Verification.code.error.please.enter.again'));//验证码错误,请重新输入
                                }
                            }
                        });
                }
            };
            function init() {
                if ($state.params.mobile) {
                    $scope.view.mobile = $state.params.mobile;
                }
                if ($scope.view.content === 'register') {
                    $scope.view.title = $filter('translate')('register.registered')/*'注册'*/;
                } else if ($scope.view.content === 'active') {
                    $scope.view.title = $filter('translate')('register.The.activation')/*'激活'*/;
                }
                $scope.view.getCaptchaImage();
            }

            $scope.$on('$ionicView.enter', function () {
                if ($sessionStorage.timerStatus) {
                    $scope.status.smsSent = true;
                    $scope.status.timerStart = true;
                    $document.find('timer')[0].addCDSeconds(-$sessionStorage.timerStatus);
                }
            });

            init();
        }]);
