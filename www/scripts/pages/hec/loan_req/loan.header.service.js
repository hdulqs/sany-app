/**
 * 申请头
 * Created by zong.liu on 2017/8/15.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('LoanHeaderService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            'PublicFunction',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys, PublicFunction) {
                var factory = {
                    //借款头信息初始化
                    initLoanReqHeader: initLoanReqHeader,
                    //查询借款申请头信息
                    searchLoanReqHeader: searchLoanReqHeader,
                    //保存借款申请头信息
                    saveLoanReqHeader: saveLoanReqHeader,
                    //删除借款申请行信息
                    deleteLoanReqLine: deleteLoanReqLine,
                    //提交借款申请单信息
                    submitLoanReq: submitLoanReq,
                    //查询借款申请行信息
                    searchLoanReqLine: searchLoanReqLine,
                    //保存借款申请行信息
                    saveLoanReqLine: saveLoanReqLine,
                    //查询借款单行可借金额
                    getCanReqAmount: getCanReqAmount,
                };
                return factory;

                /**
                 * 借款申请头初始化
                 * @param employeeId 经办人ID
                 * @returns {HttpPromise}
                 */
                function initLoanReqHeader(employeeId, companyId,docTypeId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "csh_payment_req_init",
                        "action": "query",
                        "employee_id": employeeId,
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "company_id": companyId,//根据选择的公司，获取申请头默认信息
                        "csh_payment_requisition_type_id":docTypeId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询借款申请单信息
                 * @param loanReqHeaderId 借款申请头ID
                 * @returns {*}
                 */
                function searchLoanReqHeader(loanReqHeaderId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "csh_payment_req_head_lines",
                            "action": "query",
                            "payment_requisition_header_id": loanReqHeaderId,
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": LocalStorageKeys.hec_pagesize
                        }
                    });
                }

                /**
                 * 保存借款申请单头信息
                 * @param params 借款申请单头信息
                 * @returns {*}
                 */
                function saveLoanReqHeader(params) {
                    /*删除session_company_id*/
                    /* params.session_company_id = localStorageService.get(LocalStorageKeys.hec_company_id);*/
                    params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    if (params.initFlag) {
                        params._status = "insert";
                    } else {
                        params._status = "update";
                        params.session_employee_id = localStorageService.get(LocalStorageKeys.hec_employee_id);
                    }
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "csh_payment_req_head_save",
                            "action": "submit",
                            "parameter": [params],
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code)
                        }
                    });
                }

                /**
                 * 删除借款申请行记录
                 * @param loanReqLineId 借款申请行ID
                 * @returns {*}
                 */
                function deleteLoanReqLine(loanReqLineId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "csh_payment_req_line_delete",
                            "action": "submit",
                            "parameter": [{
                                "payment_requisition_line_id": loanReqLineId,
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "_status": "delete"
                            }],
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        }
                    });
                }

                /**
                 * 提交借款申请单
                 * @param loanReqHeaderId 借款申请单头ID
                 * @returns {HttpPromise}
                 */
                function submitLoanReq(loanReqHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "csh_payment_req_sumbit",
                        "action": "submit",
                        "parameter": {
                            "payment_requisition_header_id": loanReqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "_status": "update"
                        }
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询借款申请行信息
                 * @param reqLineId 借款申请行ID
                 * @returns {HttpPromise}
                 */
                function searchLoanReqLine(reqLineId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "csh_payment_req_line_details",
                        "action": "query",
                        "payment_requisition_line_id": reqLineId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                /**
                 * 保存借款申请行信息
                 * @param params 借款申请行信息
                 * @returns {*}
                 */
                function saveLoanReqLine(params) {
                    params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    // params.session_employee_id = localStorageService.get(LocalStorageKeys.hec_employee_id);
                    params._status = "update";
                    if (PublicFunction.isNull(params.payment_requisition_line_id)) {
                        params._status = "insert";
                    }
                    // params.source_document_type = "EXP_REQUISITION_LINES";
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "csh_payment_req_line_save",
                            "action": "submit",
                            "parameter": [params],
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        }
                    });
                }

                /**
                 * 保存借款申请行信息
                 * @param reqHeaderId 关联的申请单Id
                 * @returns {*}
                 */
                function getCanReqAmount(reqHeaderId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "expense_csh_unreq_amount_select",
                            "action": "query",
                            "exp_requisition_header_id": reqHeaderId,
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"

                        }
                    });
                }
            }])
})();
