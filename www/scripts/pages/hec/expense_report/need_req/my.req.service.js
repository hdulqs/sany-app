/**
 * Created by Dawn on 2017/11/2.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('MyReqService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //初始化我的申请
                    initReqList: initReqList,
                };
                return factory;

                /**
                 * 初始化我的申请
                 * @param reqParam
                 * @param page
                 * @param size
                 * @returns {HttpPromise}
                 */
                function initReqList(reqParam, page, size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "report_create_from_req_query",
                        "action": "query",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "company_id": reqParam.company_id,
                        "currency_code": reqParam.currency_code,
                        "exp_report_type_id": reqParam.exp_report_type_id,
                        "exp_report_header_id":reqParam.exp_report_header_id,
                        "check": "Y",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize": typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall": "false"
                    };
                    return $http.post(url, params);
                }
            }])
})();
