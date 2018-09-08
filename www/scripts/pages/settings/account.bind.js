/**
 * Created by boyce1 on 2016/6/22.
 */
'use strict'
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.account_bind', {
                url: '/account/bind',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/settings/account.bind.tpl.html',
                        controller: 'AccountBindController'
                    }
                },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('settings');
                    return $translate.refresh();
                }]
            }

            })
            .state('app.bind_mobile_list', {
                url: '/bind/mobile/list',
                cache: false,
                params: {
                    status: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/settings/bind.mobile.list.html',
                        controller: 'AccountBindController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('settings');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.relieve_bind_mobile', {
                url: '/relieve/bind/mobile',
                cache: false,
                params: {
                    mobile: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/settings/relieve.bind.mobile.html',
                        controller: 'AccountBindController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('settings');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.bind_didi_mobile', {
                url: '/bind/didi/mobile',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/settings/bind.mobile.html',
                        controller: 'AccountBindController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('settings');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('AccountBindController', ['$scope', '$location', '$timeout', '$document', 'Auth', 'localStorageService',
        '$ionicLoading', '$ionicHistory', 'Principal', '$state', 'FunctionProfileService', '$filter',
        function ($scope, $location, $timeout, $document, Auth, localStorageService, $ionicLoading, $ionicHistory,
                  Principal, $state, FunctionProfileService, $filter) {
            $scope.goTo = function (stateName) {
                $state.go(stateName);

            };
            $scope.view = {
                mobileStatus: true,
                mobile: [],
                newMobile: null,
                showMobile: false,
                token: null,
                number: null,
                openPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    });
                }
            };
            $scope.showMobileDetails = function (mobile) {
                $state.go('app.relieve_bind_mobile', {'mobile': mobile});
            };
            $scope.resetMobile = function () {
                $scope.view.mobileStatus = false;
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Principal.identity().then(function (data) {
                    Auth.deleteBindMobile(data.userOID, $scope.view.newMobile)
                        .success(function () {
                            $ionicLoading.hide();
                            $scope.view.openPopup($filter('translate')('account_bind_js.binding.phone.number'));//已解除绑定该手机号
                            $timeout(function () {
                                $state.go('app.bind_mobile_list')
                            }, 1000)
                        })
                        .error(function (error, status) {
                            $ionicLoading.hide();
                            if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                if (error.validationErrors[0].message === 'primary.mobile.can.not.delete') {
                                    $ionicLoading.show({
                                        template:$filter('translate')('account_bind_js.phone.number.as.login.account'),//该手机号做为登录账号，不能解除绑定
                                        duration: '1000'
                                    });
                                }
                            }
                        });
                });
            };
            $scope.getToken = {
                submitted: false,
                token: null,
                mobile: null,
                resetSubmitButton: function () {
                    $scope.status.smsSent = false;
                }
            };
            $scope.status = {
                smsSent: false,
                timerStart: false
            };
            $scope.reset = function () {
                $scope.status.smsSent = false;
                $scope.status.timerStart = false;
            };
            $scope.countdownFinished = function () {
                $scope.status.timerStart = false;
                $timeout(function(){
                    $scope.$apply();
                },100,false);
                $document.find('timer')[0].addCDSeconds(60);
                $document.find('timer')[0].stop();
            };
            $scope.sendBindMobile = function (valid, error) {
                $scope.getToken.submitted = true;
                if (error.required === true) {
                    $ionicLoading.show({
                        template: $filer('translate')('account_bind_js.iuputPhoneNumber'),//请输入手机号码
                        duration: '1000'
                    });
                    return false;
                }
                if (error.pattern === true) {
                    $ionicLoading.show({
                        template: $filer('translate')('account_bind_js.PhoneNumberError'),//手机号码填写错误
                        duration: '1000'
                    });
                    return false;
                }
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Auth.getVerificationCode($scope.view.number)
                    .success(function () {
                        $ionicLoading.hide();
                        $scope.status.smsSent = true;
                        $scope.status.timerStart = true;
                        $document.find('timer')[0].start();
                        $ionicLoading.show({
                            template: $filer('translate')('account_bind_js.verificationCodeSend'),//验证码已发送
                            duration: '1000'
                        });
                    })
                    .error(function (error, status) {
                        $ionicLoading.hide();
                        $scope.status.smsSent = false;
                        if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                            if (error.validationErrors[0].message === 'mobile.used') {
                                $ionicLoading.show({
                                    template: $filer('translate')('account_bind_js.beenBound'),//该手机号已被绑定,请绑定其他手机号
                                    duration: '1000'
                                });
                            } else if (error.validationErrors[0].message === 'sending.sms.is.too.frequent') {
                                $ionicLoading.show({
                                    template: $filer('translate')('account_bind_js.SendingFrequent'),//验证码发送频繁,请稍后再试
                                    duration: '1000'
                                });
                            }
                        }
                    });
            };
            $scope.confirmBind = function (mobile, token) {
                //号码类型 手机（1001），座机（1002）
                var type = '1001';
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                Auth.checkVerification(mobile, token)
                    .success(function () {
                        Principal.identity().then(function (data) {
                            Auth.BindMoreMobile(data.userOID, mobile, type)
                                .success(function () {
                                    $ionicLoading.hide();
                                    $ionicLoading.show({
                                        template: $filer('translate')('account_bind_js.BindingSuccess'),//绑定成功
                                        duration: 1500
                                    });
                                    $state.go('app.bind_mobile_list', {'mobile': mobile})
                                })
                                .error(function (error, status) {
                                    $ionicLoading.hide();
                                    if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                        if (error.validationErrors[0].message.indexOf($filer('translate')('account_bind_js.beOccupied')) !== -1) {//手机号已被占用
                                            $ionicLoading.show({
                                                template: $filer('translate')('account_bind_js.relationDiDiService'),//该号码已被占用,请联系滴滴客服
                                                duration: '1500'
                                            });

                                        }
                                    }
                                    if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                        if (error.validationErrors[0].message === 'expired') {
                                            $ionicLoading.show({
                                                template: $filer('translate')('account_bind_js.verificationCodePastDue'),//该验证码以过期,请重新发送
                                                duration: '1000'
                                            });
                                        }else  if (error.validationErrors[0].message === 'not.found') {
                                            $ionicLoading.show({
                                                template: $filer('translate')('account_bind_js.VerificationCodeError'),//验证码错误,请重新输入
                                                duration: '1000'
                                            });
                                        } else {
                                            $ionicLoading.show({
                                                template: $filer('translate')('account_bind_js.networkAnomaly'),//网络异常,请稍后再试
                                                duration: '1000'
                                            });
                                        }
                                    }
                                });
                        });
                    })
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;

                // 获取function profile
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data
                })
            });
            $scope.$on('$ionicView.enter', function () {
                if ($state.params.mobile) {
                    $scope.view.newMobile = $state.params.mobile;
                }
                Principal.identity().then(function (data) {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    Auth.queryBindMobile(data.login)
                        .success(function (data) {
                            if (data.otherMobiles !== null && data.otherMobiles.length > 0) {
                                $scope.view.mobileStatus = true;
                                for (var i = 0; i < data.otherMobiles.length; i++) {
                                    $scope.view.mobile.push(data.otherMobiles[i].number);
                                }
                            } else {
                                $scope.view.mobileStatus = false;
                            }
                        })
                        .finally(function (){
                            $ionicLoading.hide();
                        });

                });
            });

        }]);
