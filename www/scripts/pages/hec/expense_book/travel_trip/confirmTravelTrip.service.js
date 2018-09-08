/**
 **差旅行程确认服务
 * Created by Dawn on 2017/8/7.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('confirmTravelTripService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    //获取头部信息
                    getHeadInfo:getHeadInfo,
                    //获取差旅明细头信息
                    getSelfExpInfo : getSelfExpInfo,
                    //获取航班信息
                    getFlyList:getFlyList,
                    //删除关联的自导入费用
                    deleteExpense: deleteExpense,
                    confirm:confirm,
                    toCancelTrip:toCancelTrip
                };
                return factory;

                function getHeadInfo(id,confirmHeadId,page,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_subsidy_head_info",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"query",
                        "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                        "exp_requisition_header_id":id,
                        "confirm_head_id":confirmHeadId,
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }

                /**
                 * 获取 差旅自导入费用信息
                 * @param id 差旅行程确认ID
                 * @param page
                 * @param size
                 * @returns {HttpPromise}
                 */
                function getSelfExpInfo (id,page ,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_expense_select",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"query",
                        "requisition_header_id":id,
                       /* "session_company_id":localStorageService.get(LocalStorageKeys.hec_company_id),*/
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }



                function getFlyList(id,page ,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_flight_info",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"query",
                        "exp_requisition_header_id":id,
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }

                /**
                 * 删除关联的费用账本信息
                 * @param params  封装费用账本对象
                 * @returns {HttpPromise}
                 */
                function deleteExpense(params) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_expense_delete",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":params
                    };
                    return $http.post(url,params);
                }

                /**
                 * 完成差旅行程确认
                 * @returns {HttpPromise}
                 */
                function confirm(param) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_confirm",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":param
                    };
                    return $http.post(url,params);
                }


                function toCancelTrip(id,cryCode,specialTypeCode) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_cancel",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":[{
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "exp_requisition_header_id":id,
                            "currency_code":cryCode,
                            "special_type_code":specialTypeCode,
                            "_status":"update"
                        }]
                    };
                    return $http.post(url,params);
                }
            }])
})();
