/**
 * 审批中心service
 * Created by Hurong on 2017/8/29.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('approvalService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //获取待审批总数
                    getApprovalTotal: getApprovalTotal,
                    //根据不同类型获取审批列表
                    getApprovalList: getApprovalList,
                    //根据recordId获取审批拒绝和同意的actionId
                    getActionId: getActionId,
                    //审批拒绝
                    refuseApproval: refuseApproval,
                    //审批同意
                    passApproval: passApproval,
                    //加载审批记录
                    getApprovalRecord: getApprovalRecord,
                    //添加加签人
                    approvalSign: approvalSign,
                    //判断申请单的类型（差旅、标准）
                    getReqType: getReqType,
                    //查询审批申请单信息（标准申请头、行，差旅申请头行）
                    searchApprovalReq: searchApprovalReq,
                    //查询申请单借款信息
                    searchReqLoanList: searchReqLoanList,
                    //查询同行出差人信息
                    queryTravelPeople: queryTravelPeople,
                    //查询审批报销单信息（头、行、付款计划）
                    searchApprovalReport: searchApprovalReport,
                    //查询报销单行-明细信息
                    searchExpenseLineDetail: searchExpenseLineDetail,
                    //查询审批借款单信息（头、行）
                    searchApprovalLoan: searchApprovalLoan,
                    //查询借款单行-明细信息
                    searchLoanLineDetail: searchLoanLineDetail,
                    //查询审批付款单信息（头、行）
                    searchApprovalPayment: searchApprovalPayment,
                    //查看超申请情况(差旅和其他)
                    searchOverReqData: searchOverReqData,
                    //查看超差旅政策情况
                    searchOverStandData: searchOverStandData
                };
                return factory;

                /**
                 * 获取待审批总数
                 * @returns {HttpPromise}
                 */
                function getApprovalTotal() {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "wfl_recipient_count",
                        "action": "query",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                    };
                    return $http.post(url, params);
                }

                /**
                 * 根据不同审批状态初始化我的审批列表
                 * @param dataType 审批状态类型 center_unapproved/未审批  center_approved/已审批
                 * @param page 页数
                 * @param keywords 搜索关键字
                 * @param size 页大小
                 * @returns {*}
                 */
                function getApprovalList(dataType, keywords, page, size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "fuzzy": keywords,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize": typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall": "false"
                    };
                    return $http.post(url, params);
                };

                /**
                 * 根据recordId获取审批拒绝和同意的actionId
                 * @param recordId
                 * @returns {*}
                 */
                function getActionId(recordId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_get_node_action",
                        "action": "query",
                        "record_id": recordId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 拒绝审批
                 * @param recordId
                 * @param actionId
                 * @param approvalText
                 * @returns {*}
                 */
                function refuseApproval(recordId, actionId, approvalText) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_approve_refuse",
                        "action": "submit",
                        "parameter": [{
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "record_id": recordId,
                            "action_id": actionId,
                            "comments": approvalText,
                            "_status": "insert"
                        }],
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code)
                    };
                    return $http.post(url, params);
                }

                /**
                 * 同意审批
                 * @param recordId
                 * @param actionId
                 * @param approvalText
                 * @returns {*}
                 */
                function passApproval(recordId, actionId, approvalText) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_approve_agree",
                        "action": "submit",
                        "parameter": [{
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "record_id": recordId,
                            "action_id": actionId,
                            "comments": approvalText,
                            "_status": "insert"
                        }],
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code)
                    };
                    return $http.post(url, params);
                }

                /**
                 * 获取审批记录数据
                 * @param instanceId 审批实例Id
                 * @returns {*}
                 */
                function getApprovalRecord(instanceId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_requisition_approve",
                        "action": "query",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "instance_id": instanceId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 添加加签人
                 * @param record_id
                 * @param employee 员工信息
                 */
                function approvalSign(record_id, employee, approvedesc) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_approve_sign",
                        "action": "submit",
                        "parameter": [{
                            "record_id": record_id,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "add_method_priority_name": "之前",//固定值
                            "add_method_priority": "BEFORE",//固定值
                            "approvedesc": approvedesc,
                            "applist": {
                                "seq_number": 10,//固定值
                                "user_id": employee.user_id,
                                "employee_name": employee.name,
                                "employee_code": employee.employee_code,
                                "user_name": employee.user_name,
                                "_status": "insert"
                            },
                        }],
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code)
                    };
                    return $http.post(url, params);
                }

                /**
                 * 判断申请单的类型（差旅、标准）
                 * @param headerId 申请单Id
                 * @returns {*}
                 */
                function getReqType(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_requisition_type_select",
                        "action": "query",
                        "exp_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fetchall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询申请单（差旅、标准申请）信息
                 * @param dataType center_internal_requisition_head/差旅头  center_internal_requisition_line/差旅行 center_standard_requisition_head/标准头  center_standard_requisition_line/标准行
                 * @param headerId 待审批申请单Id
                 * @returns {*}
                 */
                function searchApprovalReq(dataType, headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "exp_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }


                /**
                 * 查询申请单的借款信息
                 * @param headerId 申请单Id
                 * @returns {*}
                 */
                function searchReqLoanList(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_csh_req_select",
                        "action": "query",
                        "exp_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fetchall": "false"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询同行出差人信息
                 * @param dataType 同行出差人类型type
                 * @param paramsId 同行出差人Id
                 * @returns {*}
                 */
                function queryTravelPeople(dataType, paramsId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "req_travel_id": paramsId,
                        "action": "query",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fetchall": "false"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 查询报销单信息（未审批）
                 * @param dataType center_report_head/头  center_report_head/行 center_report_plan_payment/付款计划
                 * @param headerId
                 * @returns {*}
                 */
                function searchApprovalReport(dataType, headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "exp_report_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "FALSE"
                    }
                    return $http.post(url, params);
                }

                /**
                 * 查询报销单行-明细信息
                 * @param lineId
                 * @returns {*}
                 */
                function searchExpenseLineDetail(lineId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_report_line_detail",
                        "action": "query",
                        "exp_report_line_id": lineId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "FALSE"
                    }
                    return $http.post(url, params);
                }

                /**
                 * 查询未审批借款单信息（头、行）
                 * @param dataType center_payment_head/头  center_payment_line/行
                 * @param headerId
                 * @returns {*}
                 */
                function searchApprovalLoan(dataType, headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "payment_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "FALSE"
                    }
                    return $http.post(url, params);
                }

                /**
                 * 查询借款单行-明细信息
                 * @param lineId
                 * @returns {*}
                 */
                function searchLoanLineDetail(lineId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_payment_line_detail",
                        "action": "query",
                        "csh_pay_req_line_id": lineId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "FALSE"
                    }
                    return $http.post(url, params);
                }

                /**
                 * 查询未审批付款单信息（头、行）
                 * @param dataType center_acp_requisition_head/头  center_acp_requisition_line/行
                 * @param headerId
                 * @returns {*}
                 */
                function searchApprovalPayment(dataType, headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "acp_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "FALSE"
                    }
                    return $http.post(url, params);
                }

                /**
                 * 查看超申请情况(差旅和其他)
                 * @param reportHeaderId
                 * @returns {*}
                 */
                function searchOverReqData(reportHeaderId, typeCode) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {};
                    if (typeCode === "1010" || typeCode === "1015") {
                        params = {
                            "data_type": "center_travel_req_check_log",
                            "action": "query",
                            "exp_report_header_id": reportHeaderId,
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": 1000,
                            "fechall": "false"
                        };
                    } else {
                        params = {
                            "data_type": "center_req_check_log",
                            "action": "query",
                            "exp_report_header_id": reportHeaderId,
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": 1000,
                            "fechall": "false"
                        };
                    }
                    return $http.post(url, params);
                }

                /**
                 * 查看超差旅政策情况
                 * @param reportHeaderId
                 * @returns {*}
                 */
                function searchOverStandData(reportHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_event_log",
                        "action": "query",
                        "exp_report_header_id": reportHeaderId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": 1000,
                        "fechall": "false"
                    }
                    return $http.post(url, params);
                }
            }])
})();
