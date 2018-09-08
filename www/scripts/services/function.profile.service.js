/**
 * Created by lizhi on 16/10/11.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('FunctionProfileService', ['$q', '$http', 'ServiceBaseURL', 'localStorageService', function ($q, $http, ServiceBaseURL, localStorageService) {
        return {
            //获取FuctionProfileList
            getFunctionProfileList: function () {
                var deferred = $q.defer();
                var functionProfileList = localStorageService.get('functionProfileList');
                if (functionProfileList) {
                    deferred.resolve(functionProfileList);

                    // 返回数据之后更新,测试方便,提交之前注释掉
                    //$http.get(ServiceBaseURL.url + '/api/function/profiles').success(function (data) {
                    //    $sessionStorage.functionProfileList = data;
                    //})
                } else {
                    $http.get(ServiceBaseURL.url + '/api/function/profiles').success(function (data) {
                        localStorageService.set('functionProfileList', data);
                        deferred.resolve(data);
                    }).error(function (error) {
                        deferred.reject(error);
                    })
                }
                return deferred.promise;
            },
            getCompanyVendor: function () {
                var deferred = $q.defer();
                // var companyVendor = localStorageService.companyVendor;
                var companyVendor = localStorageService.get('companyVendor');
                if (companyVendor) {
                    deferred.resolve(companyVendor);
                } else {
                    $http.get(ServiceBaseURL.url + '/api/register/get/vendor').success(function (data) {
                        // localStorageService.companyVendor = data;
                        localStorageService.set("companyVendor", data);
                        deferred.resolve(data);
                    }).error(function (error) {
                        deferred.reject(error);
                    })
                }
                return deferred.promise;
            },
            // 获取用户profile
            getUserFunctionProfile: function (userOID) {
                return $http.get(ServiceBaseURL.url + '/api/function/profiles/' + userOID);
            },
            //只要app.is.check.standard字段
            getFuntionProfileJustCheckStandard: function () {
                var deferred = $q.defer();
                $http.get(ServiceBaseURL.url + '/api/function/profiles').success(function (data) {
                    deferred.resolve(data['travel.standard.check.enabled']);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }

        }
    }]);
