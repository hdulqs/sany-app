/**
 * 申请头
 * Created by zong.liu on 2017/8/15.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('ReqHeaderService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //差旅申请头信息初始化（通用申请单共用）
                    initTravelHeader: initTravelHeader,
                    //保存差旅申请头信息（通用申请单共用）
                    saveReqHeader: saveReqHeader,
                    //提交差旅申请单信息（通用申请单共用）
                    submitReq: submitReq,
                    //提交校验需维护差旅申请人
                    submitBeneficiaryCheck:submitBeneficiaryCheck,
                    //查询差旅申请头信息
                    searchTravelHeader: searchTravelHeader,
                    //删除差旅申请行信息
                    deleteTravelReqLine: deleteTravelReqLine,
                    //查询通用申请单头信息
                    searchDailyHeader:searchDailyHeader,
                    //删除通用申请行信息
                    deleteDailyReqLine:deleteDailyReqLine,
                };
                return factory;

                /**
                 * 差旅申请头初始化
                 * @param employeeId 经办人ID
                 * @returns {HttpPromise}
                 */
                function initTravelHeader(employeeId,companyId,docTypeId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_req_init",
                        "action": "query",
                        "expense_requisition_type_id":docTypeId,
                        "employee_id": employeeId,
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "company_id": companyId,//根据选择的公司，获取申请头默认信息
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询差旅申请单信息
                 * @param reqHeaderId 差旅申请头ID
                 * @returns {*}
                 */
                function searchTravelHeader(reqHeaderId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_req_head_lines",
                            "action": "query",
                            "exp_requisition_header_id": reqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": LocalStorageKeys.hec_pagesize
                        }
                    });
                }

                /**
                 * 保存差旅申请单头信息
                 * @param params 申请单头信息
                 * @returns {*}
                 */
                function saveReqHeader(params) {
                    /*删除session_company_id*/
                   /* params.session_company_id = localStorageService.get(LocalStorageKeys.hec_company_id);*/
                    params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    var status = "update";
                    if (params.initFlag) {
                        status = "insert";
                    } else {
                        params.session_employee_id = localStorageService.get(LocalStorageKeys.hec_employee_id);
                    }
                    //console.log("params ===" + angular.toJson(params));
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_req_head_save",
                            "action": "submit",
                            "parameter": [params],
                            "_status": status
                        }
                    });
                }

                /**
                 * 删除差旅申请行记录
                 * @param reqHeaderId 差旅申请头ID
                 * @param reqLineId 差旅申请行ID
                 * @returns {*}
                 */
                function deleteTravelReqLine(reqHeaderId, reqLineId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_req_line_delete",
                            "action": "submit",
                            "parameter": {
                                "exp_requisition_header_id": reqHeaderId,
                                "req_travel_id": reqLineId,
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "_status": "delete"
                            }
                        }
                    });
                }

                /**
                 * 提交校验---需维护差旅申请人
                 */
                function submitBeneficiaryCheck(reqHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "beneficiary_check",
                        "action": "execute",
                        "parameter": {
                            "exp_requisition_header_id": reqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            // "_status": "update"
                        }
                    };
                    return $http.post(url, params);
                }

                /**
                 * 提交差旅申请单
                 * @param reqHeaderId 差旅申请单头ID
                 * @returns {HttpPromise}
                 */
                function submitReq(reqHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_req_submit",
                        "action": "submit",
                        "parameter": {
                            "exp_requisition_header_id": reqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "_status": "update"
                        }
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询通用申请单信息
                 * @param reqHeaderId 申请头ID
                 * @returns {*}
                 */
                function searchDailyHeader(reqHeaderId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_standard_req_head_lines",
                            "action": "query",
                            "exp_requisition_header_id": reqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": LocalStorageKeys.hec_pagesize
                        }
                    });
                }

                /**
                 * 删除通用申请行记录
                 * @param reqHeaderId 差旅申请头ID
                 * @param reqLineId 差旅申请行ID
                 * @returns {*}
                 */
                function deleteDailyReqLine(reqHeaderId, reqLineId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_standard_req_line_delete",
                            "action": "submit",
                            "parameter": {
                                "exp_requisition_header_id": reqHeaderId,
                                "exp_requisition_line_id": reqLineId,
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "_status": "delete"
                            }
                        }
                    });
                }
            }])
})();
