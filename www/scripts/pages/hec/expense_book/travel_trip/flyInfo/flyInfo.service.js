/**
 * Created by Dawn on 2017/10/3.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('flyInfoService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    //初始化差旅行程
                    save : save
                };
                return factory;

                /**
                 * 初始化我的账本
                 * @param page
                 * @param size
                 * @returns {HttpPromise}
                 */
                function save (param) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_flight_save",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":param
                    };
                    return $http.post(url,params);
                }
            }])
})();

