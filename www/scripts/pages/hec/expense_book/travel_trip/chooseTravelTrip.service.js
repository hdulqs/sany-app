/**
 * Created by Dawn on 2017/8/29.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('chooseTravelTripService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    //初始化差旅行程
                    initTravelTrip : initTravelTrip
                };
                return factory;

                /**
                 * 初始化我的账本
                 * @param page
                 * @param size
                 * @returns {HttpPromise}
                 */
                function initTravelTrip (page ,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_mine_confirm_select",
                        "action":"query",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                        "session_employee_id":localStorageService.get(LocalStorageKeys.hec_employee_id),
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }
            }])
})();
