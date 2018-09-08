'use strict';

angular.module('huilianyi.services')
    .factory('authInterceptor', function ($rootScope, $q, $location, localStorageService, LocalStorageKeys, $injector) {
        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                if (config.url.toString().indexOf('restapi.amap.com') !== -1) {
                    return config;
                }

                if (config.url.toString().indexOf('/hec/api/login') == -1) {
                    if (config.url.toString().indexOf('/api/interface_handle') !== -1) {
                        var hec_token = localStorageService.get(LocalStorageKeys.hec_token);
                        if (hec_token) {
                            config.headers.Authorization = localStorageService.get(LocalStorageKeys.hec_token_type) + ' ' + hec_token;
                        }
                        return config;
                    }
                }

                var token = localStorageService.get('token');
                if (token && token.expires_at && token.expires_at > new Date().getTime()) {
                    config.headers.Authorization = 'Bearer ' + token.access_token;
                }
                return config;
            }
        };

    })
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService, $location, NetworkInformationService,
                                                 $filter, $timeout) {
        return {
            responseError: function (response) {
                console.log("response.status   === " + response.status);
                var registrationCleared = localStorageService.get('notification.cleared.registration');
                $injector.get('$ionicLoading').hide();

                // 记录错误信息到sentry
                Raven.captureException(new Error('HTTP response error: ' + response.status), {
                    extra: {
                        status: response.status,
                        sendConfig: response.config,
                        responseData: response.data
                    }
                });

                // 代理关系权限错误处理
                if (response.data && response.data.validationErrors && response.data.validationErrors.length > 0 &&
                    response.data.validationErrors[0].externalPropertyName === 'AGENT_PERMISSION_ERROR') {
                    // $ionicLoading不能直接注入,延时10ms,因为调用接口的代码报错时会hide loading,延时为了在hide之后提示消息
                    $timeout(function () {
                        $injector.get('$ionicLoading').show({
                            template: $filter('translate')('error_comp.permission'),
                            duration: '1500'
                        });
                    }, 10);
                }

                // 如果是网络错误,直接提示网络错误
                if (!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) {
                    $injector.get('$ionicLoading').show({
                        template: $filter('translate')('error_comp.network'),
                        duration: '1500'
                    });
                }

                // token has expired
                else if (response.status === -1) {
                    if (!($location.path() === '/erv/travel/list' ||
                        $location.path() === '/erv/invoice/apply/list' ||
                        $location.path() === '/tab/erv/expense/report' ||
                        $location.path() === '/account_book/' ||
                        $location.path() === '/erv/approval/list' ||
                        $location.path() === '/private/car/for/public' ||
                        //当被主动cancel的时候 不跳出请求出错的Toast
                        response.config.url === "/api/approvals/filters")) {
                        $injector.get('$ionicLoading').show({
                            template: $filter('translate')('error_comp.error'),
                            duration: '1500'
                        });
                    }
                } else if (response.status === 404) {

                } else if (response.status === 503) {
                    if ($location.path() === '/erv/travel/list' || $location.path() === '/erv/invoice/apply/list' || $location.path() === '/tab/erv/expense/report' || $location.path() === '/account_book/' || $location.path() === '/erv/approval/list' || $location.path() === '/private/car/for/public') {

                    } else {
                        var errorMsg = $filter('translate')('error_comp.connect');
                        $injector.get('$ionicLoading').show({
                            template: errorMsg,
                            duration: '1500'
                        });
                    }
                } else if (response.status === 401 && (response.data.error == 'invalid_token' || response.data.error == 'Unauthorized')) {
                    var token = localStorageService.get('token');
                    if (!token) {
                        var Principal = $injector.get('Principal');
                        if (Principal.isAuthenticated()) {
                            $injector.get('Auth').authorize(true);
                        }
                    } else {
                        var deferred = $q.defer();
                        var Auth = $injector.get('AuthServerProvider');
                        Auth.refreshToken(token).then(function (data) {
                            localStorageService.remove('token');
                            var expiredAt = new Date();
                            expiredAt.setSeconds(expiredAt.getSeconds() + data.expires_in);
                            data.expires_at = expiredAt.getTime();
                            localStorageService.set('token', data);
                            $injector.get('$http')(response.config).then(function (response) {
                                deferred.resolve(response);
                            }, function (response) {
                                deferred.reject(response);
                            });
                        });
                        return deferred.promise;
                    }
                } else if (response.status == 400 && !localStorageService.get('token')
                    && response.data.error == 'invalid_grant'
                    && response.data.error_description.indexOf('Invalid refresh token') !== -1) {
                    localStorageService.remove('token');
                    $location.path("/login");
                } else if (response.config.url.indexOf('oauth') > 0) {
                    localStorageService.remove('token');
                    $location.path("/login");
                } else if (response.config.url.indexOf('http://') === 0 && response.config.url.indexOf('login') === -1 && response.config.url.indexOf('token') === -1) {
                    $injector.get('$ionicLoading').show({
                        template: $filter('translate')('error_comp.system'),
                        duration: '1500'
                    });
                }
                return $q.reject(response);
            },
            response: function (response) {
                if (response.config.url.indexOf('/api/interface_handle') > 0) {
                    var status = response.data.status;
                    var message = response.data.message;
                    var code = "";
                    var error = response.data.error;
                    if (error != null && error != undefined) {
                        code = error.code;
                    }
                    if ((status === "error" && message === "校验token权限失败!!") || code === "login_required") {
                        var deferred = $q.defer();
                        var Auth = $injector.get('AuthServerProvider');
                        Auth.get_hec_token("N").then(function (data) {
                            $injector.get('$http')(response.config).then(function (response) {
                                deferred.resolve(response);
                            }, function (err) {
                                deferred.reject(err);
                            });
                        });
                        return deferred.promise;
                    }
                }
                return response;
            }
        };
    });
