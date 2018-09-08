/**
 * Created by boyce1 on 2016/4/13.
 */
'use strict'
angular.module('huilianyi.services')
    .factory('CompanyConfigurationService', ['$http', '$q', 'ServiceBaseURL', 'localStorageService', 'LocalStorageKeys', '$timeout','TravelERVService','$filter',
        function ($http, $q, ServiceBaseURL, localStorageService, LocalStorageKeys, $timeout,TravelERVService,$filter) {
            Array.prototype.OrderByAsc = function (func) {
                var m = {};
                for (var i = 0; i < this.length; i++) {
                    for (var k = 0; k < this.length; k++) {
                        if (func(this[i]) < func(this[k])) {
                            m = this[k];
                            this[k] = this[i];
                            this[i] = m;
                        }
                    }
                }
                return this;
            };
            var getCityList = function () { // 向后台请求数据，存储到sessionStorage中，并返回包含所有城市列表数据的promise对象
                var deferred = $q.defer();
                //if (!$sessionStorage.originCityList || $sessionStorage.originCityList.length === 0) {
                    TravelERVService.getInlandCityList().success(function (data) {
                        angular.forEach(data, function (item) {
                            item.firstLetter = pinyinUtil.getFirstLetter(item.name.replace(/\s+/g, ""), true);
                            item.fullPin = pinyinUtil.getPinyin(item.name.replace(/\s+/g, ""), '', false, true);
                        });
                        data = data.OrderByAsc(function (a) {
                            return a.fullPin;
                        });
                        //$sessionStorage.originCityList = data;
                        deferred.resolve(data);
                    });
                //}
                //else {
                //    deferred.resolve($sessionStorage.originCityList);
                //}
                return deferred.promise;
            };
            return ({
                getCompanyConfiguration: function () {
                    var deferred = $q.defer();
                    var configuration = localStorageService.get(LocalStorageKeys.company.configuration);
                    if (configuration && (new Date().getTime() - configuration.lastFetchDate < 86400000)) {
                        deferred.resolve(configuration.data);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/company/configurations/user')
                            .success(function (data) {
                                localStorageService.set(LocalStorageKeys.company.configuration, {
                                    lastFetchDate: new Date().getTime(),
                                    data: data
                                });
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        })
                    }
                    return deferred.promise;
                },
                getStringConfig: function (key) {
                    var configuration = localStorageService.get(LocalStorageKeys.company.configuration);
                    if (configuration) {
                        var result = configuration.data.configuration;
                        var keys = key.split("\.");
                        for (var i = 0; i < keys.length; i++) {
                            var k = keys[i];
                            if (result[k]) {
                                result = result[k];
                            }
                        }
                        return result;
                    } else {
                        return null;
                    }
                },
                getBooleanConfig: function (key) {
                    var configuration = localStorageService.get(LocalStorageKeys.company.configuration);
                    if (configuration) {
                        var result = configuration.data.configuration;
                        var keys = key.split("\.");
                        for (var i = 0; i < keys.length; i++) {
                            var k = keys[i];
                            if (i == keys.length - 1) {
                                return result[k];
                            }
                            if (result[k]) {
                                result = result[k];
                            }
                        }
                    } else {
                        $timeout(this.getCompanyConfiguration().then(function () {
                            this.getBooleanConfig(key);
                        }), 100);
                    }
                },
                getCitiesByKeyword:function(keyword,length){
                    var deferred = $q.defer();
                    var len = arguments[1] ? arguments[1] : 10;
                    getCityList().then(function (res) {
                        var cities = $filter('filter')(res, keyword);
                        //console.log(cities)
                        //if(cities.length > len){
                        //    deferred.resolve(cities.slice(0, len));
                        //}else{
                            deferred.resolve(cities);
                        //}
                    });
                    return deferred.promise;
                },
                getCompanyAdminInfo: function (companyOID) {
                    return $http.get(ServiceBaseURL.url + '/api/account/get/admin/' + companyOID);
                }
            })
        }]);
