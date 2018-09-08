/**
 * Created by Yuko on 16/8/12.
 */
'use strict';

angular.module('huilianyi.pages')
    .factory('CustomValueService', ['$http', 'ServiceBaseURL', '$sessionStorage', '$q',
        function ($http, ServiceBaseURL, $sessionStorage, $q) {
            return {
                getMessageKey: function (customEnumerationOID, value) {
                    var defer = $q.defer();
                    if (!$sessionStorage.customEnumerations) {
                        $sessionStorage.customEnumerations = {};
                    }
                    var customEnumeration = $sessionStorage.customEnumerations[customEnumerationOID];
                    if (customEnumeration) {
                        for (var i = 0; i < customEnumeration.values.length; i++) {
                            var v = customEnumeration.values[i];
                            if (v.value === value) {
                                defer.resolve(v.messageKey);
                            }
                        }
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/custom/enumerations/' + customEnumerationOID)
                            .success(function (data) {
                                $sessionStorage.customEnumerations[customEnumerationOID] = data;
                                for (var i = 0; i < data.values.length; i++) {
                                    var v = data.values[i];
                                    if (v.value === value) {
                                        defer.resolve(v.messageKey);
                                    }
                                }
                            });
                    }
                    return defer.promise;
                },
                getCustomValueList: function (customEnumerationOID) {
                    var defer = $q.defer();
                    if (!$sessionStorage.customEnumerations) {
                        $sessionStorage.customEnumerations = {};
                    }
                    var customEnumeration = $sessionStorage.customEnumerations[customEnumerationOID];
                    if (customEnumeration) {
                        defer.resolve(customEnumeration);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/custom/enumerations/' + customEnumerationOID)
                            .success(function (data) {
                                $sessionStorage.customEnumerations[customEnumerationOID] = data;
                                defer.resolve($sessionStorage.customEnumerations[customEnumerationOID]);
                            });
                    }
                    return defer.promise;
                },
                getCustomValueItemDetail: function (dataFrom,customEnumerationOID,value) {
                    //dataFrom  102  外部值列表
                    if(dataFrom === 102){
                        return $http.get(ServiceBaseURL.url + '/api/custom/enumerations/items/out',{
                            params:{
                                customEnumerationOID: customEnumerationOID,
                                messageKey: value
                            }
                        });
                    }else{
                        return $http.get(ServiceBaseURL.url + '/api/custom/enumerations/items',{
                            params:{
                                customEnumerationOID: customEnumerationOID,
                                messageKey: value
                            }
                        });
                    }
                },
                //分页获取值列表
                getCustomValueListByPagination: function (dataFrom,customEnumerationOID,page,size,keyword, applicantOID) {
                    //dataFrom 102 外部值列表
                    if(dataFrom === 102){
                        return $http({
                            url: ServiceBaseURL.url + '/api/custom/enumerations/' + customEnumerationOID + '/items/out',
                            method: 'GET',
                            params: {
                                page: page,
                                size: size
                            }
                        });
                    }else{
                        return $http({
                            url: ServiceBaseURL.url + '/api/custom/enumerations/' + customEnumerationOID + '/items/by/user',
                            method: 'GET',
                            params: {
                                applicantOID: applicantOID,
                                keyword: keyword,
                                page: page,
                                size: size
                            }
                        });
                    }
                },
                //获取值列表描述详情
                getCustomValueDetail: function (customEnumerationOID) {
                    return $http.get(ServiceBaseURL.url + '/api/custom/enumerations/' + customEnumerationOID + '/simple');
                },
            }
        }
    ]);
