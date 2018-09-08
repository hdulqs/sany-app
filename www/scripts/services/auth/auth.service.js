'use strict';
angular.module('huilianyi.services')
    .factory('Auth', ['$rootScope', '$state', '$http', '$q', 'Principal', 'AuthServerProvider', 'Account', 'LocalStorageKeys', 'ServiceBaseURL', 'localStorageService', '$sessionStorage', 'VersionService','PublicFunction',
        function ($rootScope, $state, $http, $q, Principal, AuthServerProvider, Account, LocalStorageKeys, ServiceBaseURL, localStorageService, $sessionStorage, VersionService,PublicFunction) {
            return {
                login: function (credentials, callback) {
                    var deferred = $q.defer();
                    localStorageService.set('username', credentials.username);
                    //localStorageService.set('password', credentials.password);
                    AuthServerProvider.login(credentials).then(function (data) {
                        // retrieve the logged account information
                        Principal.identity(true).then(function (account) {
                            //获取手机系统的语言环境
                            var reg = new RegExp("^[en|En|EN]");
                            if(reg.test(navigator.language)){
                                $sessionStorage.lang = 'en';
                            }else{
                                $sessionStorage.lang = 'zh_cn';
                            }
                            //汇联易：zh_CN中文  en英文
                            //如果当前手机语言环境不等于用户语言环境,设置手机语言为app的语言环境
                            if(account.language.toLowerCase() !=  $sessionStorage.lang.toLowerCase()){
                                if($sessionStorage.lang.toLowerCase() === 'zh_cn'){
                                    VersionService.updateLanguage('zh_CN');
                                    VersionService.updateHecLanguage('ZHS');
                                }else{
                                    VersionService.updateLanguage('en');
                                    VersionService.updateHecLanguage('US');
                                }
                            }
                            localStorageService.set('language', $sessionStorage.lang);
                            var language = $sessionStorage.lang;
                            if (language === 'zh_cn') {
                                localStorageService.set(LocalStorageKeys.hec_language_code, 'ZHS');
                            } else {
                                localStorageService.set(LocalStorageKeys.hec_language_code, 'US');
                            }
                           /* if (account.language) {
                                //如果有语言的话，就设置
                                $sessionStorage.lang = account.language.toLowerCase();
                                localStorageService.set('language', account.language.toLowerCase());
                                var language = $sessionStorage.lang;
                                if (language === 'zh_cn') {
                                    localStorageService.set(LocalStorageKeys.hec_language_code, 'ZHS');
                                } else {
                                    localStorageService.set(LocalStorageKeys.hec_language_code, 'US');
                                }
                            }*/
                            deferred.resolve(account);
                        });
                    }, function (error) {
                        if (error && error.data.error_description === 'user.not.activated') {
                            $state.go('app.check_active_user', {
                                'mobile': credentials.username,
                            });
                            //$state.go('app.activate_init', {mobile: credentials.username});
                        }
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },

                hec_login: function (credentials, callback) {
                    var deferred = $q.defer();
                    AuthServerProvider.get_hec_token("Y").then(function (data) {
                        return AuthServerProvider.get_user_info(credentials);
                    }, function (err) {
                        console.log("调用hec token失败!");
                        AuthServerProvider.logout();
                       deferred.reject("E");
                    }).then(function (data) {
                        return AuthServerProvider.get_user_default();
                    }, function (err) {
                        console.log("调用get_user_default失败!");
                        AuthServerProvider.logout();
                        deferred.reject("E");
                    }).then(function (data) {
                        //var userDefault = localStorageService.get(LocalStorageKeys.hec_user_default);
                        //if (userDefault != null && userDefault != undefined) {
                        if(data === "S"){
                            deferred.resolve("S");
                        } else {
                            AuthServerProvider.logout();
                            console.log("调用get_user_default失败!");
                            deferred.reject("E");
                        }
                    });
                    return deferred.promise;
                },

                logout: function () {
                    AuthServerProvider.logout();
                    Principal.authenticate(null);
                    // Reset state memory
                    $rootScope.previousStateName = undefined;
                    $rootScope.previousStateNameParams = undefined;
                },

                authorize: function (force) {
                    return Principal.identity(force)
                        .then(function () {
                            var isAuthenticated = Principal.isAuthenticated();

                            // an authenticated user can't access to login and register pages
                            if (isAuthenticated && $rootScope.toState.parent === 'account' && ($rootScope.toState.name === 'login' || $rootScope.toState.name === 'register')) {
                                $state.go('app.tab_erv.homepage');
                            }

                            if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !Principal.hasAnyAuthority($rootScope.toState.data.roles)) {
                                if (isAuthenticated) {
                                    // user is signed in but not authorized for desired state
                                    $state.go('login');
                                }
                                else {
                                    // user is not authenticated. stow the state they wanted before you
                                    // send them to the signin state, so you can return them when you're done
                                    $rootScope.previousStateName = $rootScope.toState;
                                    $rootScope.previousStateNameParams = $rootScope.toStateParams;

                                    // now, send them to the signin state so they can log in
                                    $state.go('login');
                                }
                            }
                        });
                },
                activateUser: function (mobile, token, password) {
                    return $http.get(ServiceBaseURL.url + '/api/activate', {
                        params: {
                            mobile: mobile,
                            token: token,
                            password: password
                        }
                    });
                },
                getActivationToken: function (mobile) {
                    return $http.get(ServiceBaseURL.url + '/api/activation/token?mobile=' + encodeURIComponent(mobile));
                },

                changePassword: function (oldPassword, newPassword) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/account/change_password',
                        params: {oldPassword: oldPassword, newPassword: newPassword}
                    });
                },
                checkActivateToken: function (mobile, token) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/activation/check',
                        params: {mobile: mobile, token: token}
                    });
                },
                getResetPasswordToken: function (mobile) {
                    return $http.get(ServiceBaseURL.url + '/api/account/reset_password/init?mobile=' + encodeURIComponent(mobile));

                },
                resetPassword: function (mobile, token, newPassword) {
                    var data = "mobile=" + encodeURIComponent(mobile) + "&token=" + encodeURIComponent(token) + "&newPassword="
                        + encodeURIComponent(newPassword);
                    return $http.post(ServiceBaseURL.url + '/api/account/reset_password/finish', data, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json"
                        }
                    });
                },
                checkResetPasswordToken: function (mobile, token) {
                    var data = "mobile=" + encodeURIComponent(mobile) + "&token=" + encodeURIComponent(token);
                    return $http.post(ServiceBaseURL.url + '/api/account/reset_password/check', data, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json"
                        }
                    });
                },
                refreshToken: function () {
                    var deferred = $q.defer();
                    AuthServerProvider.refreshToken().then(function (data) {
                        localStorageService.remove('token');
                        var expiredAt = new Date();
                        expiredAt.setSeconds(expiredAt.getSeconds() + data.expires_in);
                        data.expires_at = expiredAt.getTime();
                        localStorageService.set('token', data);
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                deleteBindMobile: function (userOID, mobile) {
                    return $http.delete(ServiceBaseURL.url + '/api/user/mobiles?userOID=' + userOID + '&mobile=' + mobile);
                },
                BindMoreMobile: function (userOID, mobile, type) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/user/mobiles',
                        params: {
                            mobile: mobile,
                            userOID: userOID,
                            type: type
                        }
                    });
                },
                queryBindMobile: function (mobile) {
                    return $http.get(ServiceBaseURL.url + '/api/user/mobiles?mobile=' + mobile);
                },
                getVerificationCode: function (mobile) {
                    return $http.get(ServiceBaseURL.url + '/api/account/add_mobile/init?mobile=' + mobile);
                },
                checkVerification: function (mobile, token) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/account/add_mobile/check',
                        params: {
                            mobile: mobile,
                            token: token
                        }
                    })

                },
                checkNewUserDetail: function (mobile) {
                    return $http.get(ServiceBaseURL.url + '/api/account/send_activate_or_register_sms?mobile=' + mobile);

                },
                checkToken: function (mobile, token) {
                    return $http.get(ServiceBaseURL.url + '/api/account/check_activate_or_register?mobile=' + mobile + '&token=' + token);
                },
                registerAccount: function (companyName, mobile, password, userName, token) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/account/register',
                        method: 'POST',
                        params: {
                            companyName: companyName,
                            mobile: mobile,
                            password: password,
                            userName: userName,
                            token: token
                        }
                    })
                },
                //更换成跟中控一样的注册接口
                register: function (profile) {
                    return $http.post(ServiceBaseURL.url + '/api/companies/register/' + profile.token + '/' + profile.mobile, profile);
                },
                checkCompanyStatus: function (companyName) {
                    return $http.get(ServiceBaseURL.url + '/api/account/check_company_name?companyName=' + companyName)
                },
                checkCompanyRegister: function (mobile) {
                    return $http.get(ServiceBaseURL.url + '/api/companies/register/check/mobile?mobile=' + mobile);

                },
                checkCompanyRegisterToken: function (mobile, token) {
                    return $http.get(ServiceBaseURL.url + '/api/companies/register/token/check?mobile=' + mobile + '&token=' + token);
                },
                loginErrorCounts: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/account/loginErrorCounts',
                        method: 'POST',
                        params: data
                    });
                },
                loginSuccess: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/account/loginSuccess',
                        method: 'POST',
                        params: data
                    });
                },
                getCompanyRegisterToken: function (mobile, attachmentOID, verifyCode) {
                    //return $http.get(ServiceBaseURL.url + '/api/companies/register/token?mobile=' + mobile);
                    return $http({
                        url: ServiceBaseURL.url + '/api/companies/register/token',
                        method: 'GET',
                        params: {
                            mobile: mobile,
                            attachmentOID: attachmentOID,
                            verifyCode: verifyCode
                        }
                    });
                },
                getCaptcha: function () {
                    return $http.get(ServiceBaseURL.url + '/api/companies/register/verify/code');
                }


                /* resetPasswordInit: function (mail, callback) {
                 var cb = callback || angular.noop;

                 return PasswordResetInit.save(mail, function() {
                 return cb();
                 }, function (err) {
                 return cb(err);
                 }).$promise;
                 },*/
                /*    resetPasswordFinish: function (keyAndPassword, callback) {
                 var cb = callback || angular.noop;

                 return PasswordResetFinish.save(keyAndPassword, function () {
                 return cb();
                 }, function (err) {
                 return cb(err);
                 }).$promise;
                 }*/
            };

        }]);
