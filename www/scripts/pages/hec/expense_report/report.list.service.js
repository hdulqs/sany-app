/**
 * Created by Hurong on 2017/8/23.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('ReportListService', ['$http', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                var factory = {
                    //根据不同类型初始化我的申请列表
                    initReportList: initReportList,
                    //删除整单报销单
                    deleteReport: deleteReport,
                    //收回待审批单据
                    takeBack: takeBack
                };
                return factory;

                /**
                 * 根据不同类型初始化我的报销单列表
                 * @param dataType 报销单状态类型
                 * @param page 页数
                 * @param size 页大小
                 * @returns {*}
                 */
                function initReportList(dataType, page, size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": dataType,
                        "action": "query",
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "session_employee_id": localStorageService.get(LocalStorageKeys.hec_employee_id),
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize": typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall": "false"
                    };
                    //待审批时，新增workflow_category参数：限制单据类型
                    if (dataType == 'expense_req_approve_pending') {
                        params.workflow_category = 'EXP_REPORT';
                    }
                    return $http.post(url, params);
                }

                /**
                 * 删除整单报销单
                 * @param headerId 报销单头Id
                 * @returns {*}
                 */
                function deleteReport(headerId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type": "report_delete",
                        "action": "submit",
                        "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter": [{
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "exp_report_header_id": headerId,
                            "_status": "execute"
                        }]
                    };
                    console.log("删除报销单参数：" + angular.toJson(params));
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
                         },
                         "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                    };
                    return $http.post(url, params);
                }
            }])
})();
