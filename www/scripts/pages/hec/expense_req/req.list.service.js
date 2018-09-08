/**
 * Created by Hurong on 2017/8/23.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('ReqListService', ['$http', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //根据不同类型初始化我的申请列表
                    initReqList: initReqList,
                    //删除整单申请
                    deleteReq: deleteReq,
                    //判断申请单的类型（差旅、标准）
                    getReqType: getReqType,
                    //收回待审批单据
                    takeBack:takeBack,
                    //删除整单借款申请
                    deleteLoanReq:deleteLoanReq
                };
                return factory;

                /**
                 * 根据不同类型初始化我的申请列表
                 * @param dataType 审批状态类型
                 * @param page 页数
                 * @param size 页大小
                 * @returns {*}
                 */
                function initReqList(dataType, page, size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "session_employee_id": localStorageService.get(LocalStorageKeys.hec_employee_id),
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize": typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall": "false"
                    };
                    //待审批时，新增workflow_category参数：限制单据类型
                    if(dataType=='expense_req_approve_pending'){
                        params.workflow_category = 'EXP_REQUISITION';
                        params.workflow_category_payment = "PAYMENT_REQUISITION"
                    }
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
                        "pagenum": 1,
                        "pagesize": "1000",
                        "fetchall": "FALSE"
                    };
                    return $http.post(url, params);
                }

                /**
                 * 删除整单申请
                 * @param reqHeaderId 申请单头Id
                 * @returns {*}
                 */
                function deleteReq(reqHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_req_delete",
                        "action": "submit",
                        "parameter": {
                            "exp_requisition_header_id": reqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "_status": "execute"
                        }
                    };
                    return $http.post(url, params);
                }

                /**
                 * 收回待审批单据
                 * @param instanceId
                 * @returns {*}
                 */
                function takeBack(instanceId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "expense_wfl_back",
                        "action": "submit",
                        "parameter": {
                            "instance_id": instanceId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "_status": "insert"
                        }
                    };
                    return $http.post(url, params);
                }

                /**
                 * 删除整单借款申请
                 * @param reqHeaderId 申请单头Id
                 * @returns {*}
                 */
                function deleteLoanReq(reqHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "csh_payment_req_delete",
                        "action": "submit",
                        "parameter": [{
                            "payment_requisition_header_id": reqHeaderId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "_status": "delete"
                        }]
                    };
                    return $http.post(url, params);
                }
            }])
})();
