/**
 * 申请单关联借款单service
 * Created by rong.hu on 2017/8/15.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('reqLoanService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //查询申请单关联的借款单列表
                    searchReqLoanList: searchReqLoanList,
                    //删除已关联的借款信息：
                    deleteReqLoan:deleteReqLoan
                };
                return factory;

                /**
                 * 查询申请单关联的借款单列表
                 * @param headerId 申请单Id
                 * @returns {*}
                 */
                function searchReqLoanList(headerId,page) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "csh_payment_req_select",
                        "action": "query",
                        "exp_requisition_header_id": headerId,
                        "pagenum": page,
                        "pagesize": "1000",
                        "fetchall": "false"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 删除已关联的借款信息
                 * @param loanHeaderId 借款单头ID
                 * @returns {*}
                 */
                function deleteReqLoan(loanHeaderId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "csh_payment_req_delete",
                            "action": "submit",
                            "parameter": [{
                                "payment_requisition_header_id": loanHeaderId,//csh_head_id
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "_status": "delete"
                            }]
                        }
                    });
                }
            }])
})();
