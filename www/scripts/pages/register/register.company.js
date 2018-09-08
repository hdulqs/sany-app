/**
 * Created by boyce1 on 2016/7/10.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.register_company', {
                url: '/register/company',
                cache: false,
                data: {
                    roles: []
                },
                params: {
                    mobile: null,
                    token: null,
                    password: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/register/register.company.tpl.html',
                        controller: 'RegisterCompanyController'
                    }
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    content: function () {
                        return "register";
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('register');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.register_success', {
                url: '/register/success',
                cache: false,
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/register/register.success.tpl.html',
                        controller: 'RegisterCompanyController'
                    }
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    content: function () {
                        return "register_success";
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('register');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('RegisterCompanyController', ['$scope', 'PushService', '$ionicLoading', 'localStorageService', 'Auth',
        '$state', '$ionicHistory', 'content', '$ionicPopup', '$filter',
        function ($scope, PushService, $ionicLoading, localStorageService, Auth, $state, $ionicHistory, content,
                  $ionicPopup, $filter) {
            $scope.view = {
                companyName: null,
                username: null,
                mobile: null,
                token: null,
                password: null,
                content: content,
                openPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                }
                //goBack: function () {
                //    if ($ionicHistory.backView()) {
                //        $ionicHistory.goBack();
                //    } else {
                //        $state.go('app.set_register_password');
                //    }
                //}
            };

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;

            });
            $scope.nextStep = function (companyName, username) {
                if (!companyName || !username) {
                    $scope.view.openPopup($filter('translate')('register.Please.complete.the.information'));//请将信息填写完整
                    return false;
                }
                if ($state.params.mobile) {
                    $scope.view.mobile = $state.params.mobile;
                }
                if ($state.params.token) {
                    $scope.view.token = $state.params.token;
                }
                if ($state.params.password) {
                    $scope.view.password = $state.params.password;
                }
                var profile = {};
                profile.token = $scope.view.token;
                profile.mobile = $scope.view.mobile;
                profile.login = $scope.view.mobile;
                profile.password = $scope.view.password;
                profile.fullName = username;
                profile.companyName = companyName;

                Auth.checkCompanyStatus(companyName)
                    .success(function () {
                        //更换成跟中控一样的注册接口
                        //Auth.registerAccount(companyName, $scope.view.mobile, $scope.view.password, username, $scope.view.token)
                        Auth.register(profile)
                            .success(function () {
                                localStorageService.set('username', $scope.view.mobile);
                                localStorageService.set('password', $scope.view.password);
                                $state.go('app.register_success');
                            })
                            .error(function (error, status) {
                                if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                                    if (error.validationErrors[0].message == 'not.found') {
                                        $scope.view.openPopup($filter('translate')('register.Verification.code.does.not.exist'));//验证码不存在,请重新发送
                                    } else if (error.validationErrors[0].message == 'expired') {
                                        $scope.view.openPopup($filter('translate')('register.Captcha.timeout'));//验证码超时,请重新发送
                                    }
                                    $state.go('app.check_register_user', {
                                        'mobile': $scope.view.mobile
                                    });

                                } else if (error.message.indexOf('not present') !== -1) {
                                    $scope.view.openPopup($filter('translate')('register.Registration.failed'));//注册失败,请重新注册
                                    $state.go('app.check_register_user', {
                                        'mobile': $scope.view.mobile
                                    });
                                }
                            })
                    })
                    .error(function (error, status) {
                        if (status === 400 && error.validationErrors && error.validationErrors.length > 0) {
                            if (error.validationErrors[0].message == 'company.exists') {
                                $scope.view.openPopup($filter('translate')('register.The.company.has.been.registered'));//该公司已被注册,请重新填写企业名称
                                return;
                            }

                        }
                    });
            };
            $scope.isDirtyForm = function () {
                if ($('.input-group').has('input').length > 0) {
                    if ($('.input-group input').hasClass('ng-dirty') && $scope.view.content === 'register') {
                        $ionicPopup.confirm({
                                title: $filter('translate')('register.return')/*'返回'*/,
                                template: $filter('translate')('register.One.step.short.of.registration.is.complete')/*'还差一步就注册完成了'*/,
                                cancelText: $filter('translate')('register.cancel')/*'取消'*/,
                                okText: $filter('translate')('register.leave')/*'离开'*/,
                                cssClass: 'delete-ordinary-application-popup'
                            })
                            .then(function (res) {
                                if (res) {
                                    $state.go('login', {
                                        mobile: $state.params.mobile
                                    })
                                }
                            });
                    } else {
                        $state.go('login', {
                            mobile: $state.params.mobile
                        })
                    }
                } else {
                    $state.go('login', {
                        mobile: $state.params.mobile
                    })
                }
            };
            $scope.registerSuccess = function () {
                Auth.login({
                    username: localStorageService.get('username'),
                    password: localStorageService.get('password')
                }).then(function (data) {
                    $scope.authenticationError = false;
                    PushService.registerUserDevice(data.userOID);
                    //$state.go('app.tab.dash');
                    $state.go('app.tab_erv.homepage');
                });
            }
        }]);
