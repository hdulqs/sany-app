/**
 * Created by Hurong on 2017/8/22.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('expListService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    //初始化我的账本
                    initExpList : initExpList,
                    //删除账本
                    deleteExpense : deleteExpense,
                    //导入费用到差旅
                    importToTravel: importToTravel
                };
                return factory;


                /**
                 *
                 * @param page 页码
                 * @param size 页大小
                 * @param cryCode 账本导入时传递的结算币种参数
                 * @returns {HttpPromise}
                 */

                /**
                 * 我的账本-获取费用列表信息
                 * @param page 页码
                 * @param size 页大小
                 * @param reqParams 根据reqParams对象，判断页面请求的接口
                 * @returns {HttpPromise}
                 */
                function initExpList (page ,size,reqParams) {
                    var url = ServiceBaseURL.hec_interface_url;
                    if(reqParams.expReportTypeId){//报销单不关联申请导入费用账本查询
                        var params = {
                            "data_type": "sy_exp_expense_select",
                            "action": "query",
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "company_id": reqParams.companyId,
                            "currency_code": reqParams.cryCode,
                            "head_id":reqParams.headId,
                            "exp_report_type_id": reqParams.expReportTypeId,
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall": reqParams.fetchall
                        };
                    }else if(reqParams.expense_type_id){//报销单关联申请账本查询
                        var params = {
                            "data_type": "exp_report_req_expense_select",
                            "action": "query",
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "company_id": reqParams.companyId,
                            "currency_code":reqParams.cryCode,
                            "expense_type_id": reqParams.expense_type_id,
                            "exp_req_item_id": reqParams.exp_req_item_id,
                            "head_id":reqParams.headId,
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall": reqParams.fetchall
                        };
                    }else if(reqParams.cryCode){//差旅行程确认导入费用账本查询
                        var params = {
                            "data_type":"trip_import_expense_select",
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "currency_code": reqParams.cryCode,
                            "company_id": reqParams.companyId,
                            "head_id":reqParams.headId,
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":reqParams.fetchall
                        };
                    } else{//我的账本查询
                        var params = {
                            "data_type":"book_mine_select",
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":"false"
                        };
                    }
                    return $http.post(url,params);
                }

                /**
                 * 删除账本-根据费用账本id删除费用
                 * @param expense_id 费用账本id
                 * @returns {HttpPromise}
                 */
                function deleteExpense (expense_id) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"book_delete",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter": {
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "expense_id":expense_id,
                            "_status": "execute"
                        }
                    };
                    return $http.post(url,params);
                }

                /**
                 * 导入费用到差旅行程确认
                 * @param param 请求参数
                 * @returns {*}
                 */
                function importToTravel(reqParam,importReportFlag) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_batch_import_expense",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":reqParam
                    };
                    if(importReportFlag){
                        params.data_type ="exp_report_line_save";
                    }
                    return $http.post(url,params);
                }
            }])
})();
