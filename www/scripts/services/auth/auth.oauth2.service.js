'use strict';

angular.module('huilianyi.services')
    .factory('AuthServerProvider', ['$http', '$q', 'localStorageService', 'Base64', 'ServiceBaseURL', 'ClientCredential', 'LocalStorageKeys', 'PushService', '$sessionStorage', '$cacheFactory',
        '$rootScope', 'PublicFunction', function ($http, $q, localStorageService, Base64, ServiceBaseURL, ClientCredential, LocalStorageKeys, PushService, $sessionStorage, $cacheFactory, $rootScope, PublicFunction) {

            // 登录之前或者退出登录的时候清除localStorage和sessionStorage
            var clearStorage = function () {
                localStorageService.remove('token');
                localStorageService.remove('push.cleared');
                localStorageService.remove('company.configuration');
                localStorageService.remove('cost.center');
                localStorageService.remove('expense.types');
                localStorageService.remove('unSavePhoto');
                localStorageService.remove('historyDepartment');
                localStorageService.remove('cashList');
                localStorageService.remove('headPortrait');
                localStorageService.remove('hasMessageTips');
                localStorageService.remove('localStorageService');
                localStorageService.remove('functionProfileList');
                localStorageService.remove('companyVendor');
                localStorageService.remove('privateLocation');

                localStorageService.remove('userInfo');
                localStorageService.remove('roles');
                localStorageService.remove('exitApprovalCounts');
                localStorageService.remove('companyInfo');
                localStorageService.remove('identity');
                localStorageService.remove(LocalStorageKeys.hec_language_code)

                //for hec
                clearHecStorage();

                delete $sessionStorage.companyVersion;
                delete $sessionStorage.rootDepartments;
                delete $sessionStorage.rootEnableDepartments;
                delete $sessionStorage.childrenEnableDepartments;
                delete $sessionStorage.expenseTypes;
                delete $sessionStorage.historyDepartment;
                delete $sessionStorage.companyInfo;
                delete $sessionStorage.isLoginOut;
                delete $sessionStorage.functionProfileList;
                delete $sessionStorage.customForm;
                delete $sessionStorage.expenseCategoryList;
                delete $sessionStorage.customApplication;
                delete $sessionStorage.expenseReportForm;
                delete $sessionStorage.applicationForm;
                delete $sessionStorage.lang;
            };

            //for hec
            var clearHecStorage = function () {
                localStorageService.remove(LocalStorageKeys.hec_token);
                localStorageService.remove(LocalStorageKeys.hec_user_id);
                localStorageService.remove(LocalStorageKeys.hec_token_type);
                localStorageService.remove(LocalStorageKeys.hec_company_id);
                localStorageService.remove(LocalStorageKeys.hec_employee_id);
                localStorageService.remove("seqList");
            }

            return {
                login: function (credentials) {
                    // 清除localStorage和sessionStorage
                    clearStorage();
                    var data = "username=" + encodeURIComponent(credentials.username) + "&password="
                        + encodeURIComponent(credentials.password) + "&grant_type=password&scope=read%20write";
                    return $http.post(ServiceBaseURL.url + '/oauth/token', data, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json",
                            "Authorization": "Basic " + Base64.encode(ClientCredential.id + ':' + ClientCredential.secret)
                        }
                    }).success(function (response) {
                        var expiredAt = new Date();
                        expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
                        response.expires_at = expiredAt.getTime();
                        localStorageService.set(LocalStorageKeys.token, response);
                        return response;
                    });
                },
                get_hec_token: function (loginFlag) {
                    var deferred = $q.defer();
                    // 登录时清除hec系统的token和用户信息，hec系统token过期时，只清除token信息，用户信息不清除
                    if (loginFlag === "Y") {
                        clearHecStorage();
                    } else {
                        localStorageService.remove(LocalStorageKeys.hec_token);
                    }
                    //url: ServiceBaseURL.hec_url + '/hec/api/login',
                    $http({
                        url: ServiceBaseURL.hec_login_url,
                        method: 'POST',
                        data: {
                            "username": LocalStorageKeys.hec_token_username,
                            "password": LocalStorageKeys.hec_token_password,
                            "user_language": localStorageService.get(LocalStorageKeys.hec_language_code)
                        },
                        headers: {
                            "Content-Type": "application/json"
                        },
                    }).success(function (data) {
                        localStorageService.set(LocalStorageKeys.hec_token, data.access_token);
                        localStorageService.set(LocalStorageKeys.hec_token_type, data.token_type);
                        deferred.resolve("S");
                    }).error(function (error) {
                        console.log("get_hec_token: " + error);
                        deferred.reject("E");
                    });
                    return deferred.promise;
                },

                get_user_info: function (credentials) {
                    var deferred = $q.defer();
                    $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "user",
                            "action": "query",
                            "fuzzy": encodeURIComponent(credentials.username),
                            "pagenum": "1",
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        },
                    }).success(function (response) {
                        if (response.success) {
                            if(response.result.pageCount > 0){
                                var rec = response.result.record[0];
                                localStorageService.set(LocalStorageKeys.hec_user_id, rec.session_user_id);
                                localStorageService.set(LocalStorageKeys.hec_company_id, rec.session_company_id);
                                localStorageService.set(LocalStorageKeys.hec_employee_id, rec.session_employee_id);
                                deferred.resolve("S");
                            }else{
                                console.log("无效的费控账号");
                                PublicFunction.showToast("无效的费控账号");
                                deferred.reject("E");
                            }
                        } else {
                            PublicFunction.showToast(response.error.message);
                            deferred.reject("E");
                        }
                    }).error(function (error) {
                        console.log("get_user_info: " + error);
                        deferred.reject("E");
                    });
                    return deferred.promise;
                },

                get_user_default: function () {
                    var deferred = $q.defer();
                    $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "user_default",
                            "action": "query",
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "session_company_id": localStorageService.get(LocalStorageKeys.hec_company_id),
                            "pagenum": "1",
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        },
                    }).success(function (response) {
                        if (response.success) {
                            localStorageService.set(LocalStorageKeys.hec_user_default, response.result.record[0]);
                            deferred.resolve("S");
                        } else {
                            PublicFunction.showToast(response.error.message);
                            deferred.reject("E");
                        }
                    }).error(function (error) {
                        console.log("get_user_default: " + error);
                        deferred.reject("E");
                    });
                    return deferred.promise;
                },

                logout: function () {
                    $http.post(ServiceBaseURL.url + '/api/logout').then(function () {
                        // 清除localStorage和sessionStorage
                        clearStorage();
                        //PushService.stopPushService();
                    });
                },
                getToken: function () {
                    return localStorageService.get(LocalStorageKeys.token);
                },
                hasValidToken: function () {
                    var token = this.getToken();
                    return token && token.expires_at && token.expires_at > new Date().getTime();
                },
                refreshToken: function () {
                    var token = localStorageService.get(LocalStorageKeys.token);
                    if (!token) {
                        return $q.reject(token);
                    }
                    //防止在开机的时候，多次获取token，导致后台出错。如果同时有两个以上获取token的请求，则放到rootscope里面缓存
                    var def = $q.defer();
                    if ($rootScope.cachedToken) {
                        //如果已经cache了，则直接返回cache的token promise，不call后端
                        return $rootScope.cachedToken;
                    }
                    else {
                        //If a call is already going on just return the same promise, else make the call and set the promise to _cache
                        $http({
                            url: ServiceBaseURL.url + '/oauth/token',
                            method: 'POST',
                            data: "client_id=" + encodeURIComponent(ClientCredential.id)
                            + "&client_secret=" + encodeURIComponent(ClientCredential.secret)
                            + "&refresh_token=" + token.refresh_token
                            + "&grant_type=refresh_token",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                        })
                            .success(function (data) {
                                //返回成功后，清空cache
                                $rootScope.cachedToken = null;
                                def.resolve(data);
                            })
                            .error(function (error) {
                                //返回成功后，清空cache
                                $rootScope.cachedToken = null;
                                def.reject(error);
                            });
                        //把promise放到cache中
                        $rootScope.cachedToken = def.promise;
                        return def.promise;
                    }
                }
            };
        }]);
