/**
 * Created by Hurong on 2017/8/23.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('approvalRecordService', ['$http', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //申请单单据跟踪记录
                    reqRecord: reqRecord,
                    //报销单单据跟踪记录
                    reportRecord: reportRecord,
                    //借款单单据跟踪记录
                    loanRecord: loanRecord,
                    //付款单单据跟踪记录
                    paymentRecord: paymentRecord
                };
                return factory;

                /**
                 * 申请单单据跟踪记录
                 * @param headerId 单据id
                 * @returns {HttpPromise}
                 */
                function reqRecord(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_req_approve_record",
                        "action": "query",
                        "session_user_id": 1,
                        "exp_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 报销单据跟踪记录
                 * @param headerId 单据id
                 * @returns {HttpPromise}
                 */
                function reportRecord(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_report_approve_record",
                        "action": "query",
                        "session_user_id": 1,
                        "exp_report_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 借款单单据跟踪记录
                 * @param headerId 单据id
                 * @returns {HttpPromise}
                 */
                function loanRecord(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_payment_approve_record",
                        "action": "query",
                        "session_user_id": 1,
                        "payment_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 付款单单据跟踪记录
                 * @param headerId 单据id
                 * @returns {HttpPromise}
                 */
                function paymentRecord(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "center_acp_req_approve_record",
                        "action": "query",
                        "session_user_id": 1,
                        "acp_requisition_header_id": headerId,
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fechall": "FALSE"
                    };
                    return $http.post(url, params);
                }
            }])
})();
