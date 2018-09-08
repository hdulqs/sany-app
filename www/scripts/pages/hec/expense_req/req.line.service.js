/**
 * 申请行
 * Created by zong.liu on 2017/8/15.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('ReqLineService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys', 'PublicFunction',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys, PublicFunction) {
                var factory = {
                    //差旅申请行信息
                    queryTravelLines: queryTravelLines,
                    //保存差旅申请行信息
                    saveReqLine: saveReqLine,
                    //保存同行出差人信息
                    saveTraveler: saveTraveler,
                    //保存同行出差人信息
                    deleteTraveler: deleteTraveler,
                    //查询通用申请行信息
                    queryReqLines:queryReqLines,
                    //保存通用申请行
                    saveDailyReqLine: saveDailyReqLine
                };
                return factory;

                /**
                 * 查询差旅申请行信息
                 * @param reqLineId 差旅申请行ID
                 * @returns {HttpPromise}
                 */
                function queryTravelLines(reqLineId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_req_lines_details",
                        "action": "query",
                        "req_travel_id": reqLineId,
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                function getAmount(value) {
                    if (PublicFunction.isNull(value)) {
                        return 0;
                    } else {
                        return value;
                    }
                }

                /**
                 * 保存差旅申请行信息
                 * @param params 差旅申请行信息
                 * @returns {*}
                 */
                function saveReqLine(params) {
                    params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    params.session_employee_id = localStorageService.get(LocalStorageKeys.hec_employee_id);
                    var status = "update";
                    if (PublicFunction.isNull(params.req_travel_id)) {
                        status = "insert";
                    }
                    params.source_document_type = "EXP_REQUISITION_LINES";
                    //console.log("params ===" + angular.toJson(params));

                    params.fly_requisition_amount = getAmount(params.fly_requisition_amount);
                    params.hotel_requisition_amount = getAmount(params.hotel_requisition_amount);
                    params.other_requisition_amount = getAmount(params.other_requisition_amount);

                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_req_line_save",
                            "action": "submit",
                            "parameter": [params],
                            "_status": status
                        }
                    });
                }

                /**
                 * 保存出差同行人信息
                 * @param params 同行人信息
                 * @returns {*}
                 */
                function saveTraveler(params) {
                    if (PublicFunction.isNull(params.beneficiary_id)) {
                        params._status = "insert";
                    } else {
                        params._status = "update";
                    }
                    params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "beneficiary_save",
                            "action": "submit",
                            "parameter": [params]
                        }
                    });
                }

                /**
                 * 删除出差同行人信息
                 * @param benefyId 同行人ID
                 * @returns {*}
                 */
                function deleteTraveler(benefyId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "beneficiary_delete",
                            "action": "submit",
                            "parameter": {"beneficiary_id": benefyId, "_status": "delete"}
                        }
                    });
                }

                /**
                 * 查询通用申请行信息
                 * @param reqLineId 申请行ID
                 * @returns {HttpPromise}
                 */
                function queryReqLines(reqLineId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_standard_req_lines",
                        "action": "query",
                        "exp_requisition_line_id": reqLineId,
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                /**
                 * 保存申请行信息
                 * @param params 申请行信息
                 * @returns {*}
                 */
                function saveDailyReqLine(params) {
                    params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    params.session_employee_id = localStorageService.get(LocalStorageKeys.hec_employee_id);
                    params._status = "update";
                    if (PublicFunction.isNull(params.exp_requisition_line_id)) {
                        params._status = "insert";
                    }
                    params.source_document_type = "EXP_REQUISITION_LINES";
                    //console.log("params ===" + angular.toJson(params));

                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_standard_req_line_save",
                            "action": "submit",
                            "parameter": [params]
                        }
                    });
                }

            }])
})();
