/**
 * 报销单头
 * Created by Dawn on 2017/10/19.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('ReportHeaderService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'PublicFunction','localStorageService', 'LocalStorageKeys',
            function ($http, $q, ServiceBaseURL, $timeout, PublicFunction,localStorageService, LocalStorageKeys) {
                var factory = {
                    //报销单头信息初始化
                    initReportHeader: initReportHeader,
                    //报销单头行查询
                    searchReportHeaderLine: searchReportHeaderLine,
                    //保存报销单头信息
                    saveReportHeader: saveReportHeader,
                    //一键生成计划付款行
                    createPayPlan: createPayPlan,
                    //删除报销单行信息
                    deleteExpReportLine: deleteExpReportLine,
                    //查询计划付款行信息
                    searchPlanPayment: searchPlanPayment,
                    //保存付款计划行
                    savaPayPlans: savaPayPlans,
                    //删除计划付款行-待提交报销单
                    deletePlan: deletePlan,
                    //提交校验
                    submitCheck:submitCheck,
                    //验证住宿费是否超标
                    checkHotelExpense:checkHotelExpense
                };
                return factory;

                /**
                 * 报销单头初始化
                 * @param employeeId 经办人ID
                 * @returns {HttpPromise}
                 */

                /**
                 * 报销单头初始化
                 * @param employeeId 经办人ID
                 * @param expense_report_type_id 报销单单据类型
                 * @param currency_code //报销单单据类型币种
                 * @returns {HttpPromise}
                 */
                function initReportHeader(companyId, employeeId, expense_report_type_id, currency_code) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "exp_report_init",
                        "action": "query",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "company_id": companyId,//根据选择的公司，获取申请头默认信息
                        "employee_id": employeeId,
                        "expense_report_type_id": expense_report_type_id,
                        "currency_code": currency_code,
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                /**
                 * 报销单头行查询
                 * @param headerId
                 * @returns {HttpPromise}
                 */
                function searchReportHeaderLine(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "exp_report_head_lines",
                        "action": "query",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "exp_report_header_id": headerId,
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize
                    };
                    return $http.post(url, params);
                }

                /**
                 * 保存报销单头
                 * @param payPlans
                 * @returns {*}
                 */
                function saveReportHeader(header) {
                    var url = ServiceBaseURL.hec_interface_url;
                    header.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    var params = {
                        "data_type": "report_save",
                        "action": "submit",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter": [header]
                    };
                    return $http.post(url, params);
                }

                /**
                 * 一键生成计划付款行
                 * @param expReportHeaderId 报销单id
                 * @returns {HttpPromise}
                 */
                function createPayPlan(expReportHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "exp_report_plan_line_create",
                        "action": "submit",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter": [{
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "exp_report_header_id": expReportHeaderId,
                            "_status": "execute"
                        }]
                    };
                    return $http.post(url, params);
                }


                /**
                 * 删除报销单行记录
                 * @param parameter
                 * @returns {*}
                 */
                function deleteExpReportLine(parameter) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "exp_report_line_delete",
                            "action": "submit",
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "parameter": parameter
                        }
                    });
                }

                /**
                 * 查询计划付款行信息
                 * @param headerId 报销单头id
                 * @returns {HttpPromise}
                 */
                function searchPlanPayment(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_report_plan_payment",
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
                 * 保存付款计划行
                 * @param payPlans
                 * @returns {HttpPromise}
                 */
                function savaPayPlans(payPlans) {
                    var url = ServiceBaseURL.hec_interface_url;
                    angular.forEach(payPlans,function (item) {
                       if(item.initFlag){
                           item._status = "insert";

                       }else{
                           item._status = "update";
                       }
                    });
                    var params = {
                        "data_type": "report_plan_save",
                        "action": "submit",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter": [{
                            "pmtplan": payPlans
                        }]
                    };
                    return $http.post(url, params);
                }

                /**
                 * 删除所有计划付款行-待提交报销单
                 * @param payPlan
                 * @returns {HttpPromise}
                 */
                function deletePlan(payPlan) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "exp_report_plan_line_delete",
                        "action": "submit",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter": payPlan
                    };
                    return $http.post(url, params);
                }

                function submitCheck(headerId,budgetControlEnabled,result) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var temp = {
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "exp_report_header_id": headerId
                    };
                    if(PublicFunction.isNull(budgetControlEnabled)&&!PublicFunction.isNull(result)){
                        temp.notice_type=result.error_type;
                        if(result.error_type=="NOTICE1"){
                            temp.flag = result.day_flag;
                            temp.error = result.day_error;
                        }else if(result.error_type=="NOTICE3"){
                            temp.flag='Y';
                        }
                    }else{
                        temp.budget_control_enabled=budgetControlEnabled;
                    }
                    var params = {
                        "data_type": "report_submit_check",
                        "action": "execute",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":temp
                    };
                    return $http.post(url, params);
                }

                function checkHotelExpense(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var temp = {
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "head_id": headerId
                    };
                    var params = {
                        "data_type": "accom_policy_check",
                        "action": "execute",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":temp
                    };
                    return $http.post(url, params);
                }
            }])
})();
