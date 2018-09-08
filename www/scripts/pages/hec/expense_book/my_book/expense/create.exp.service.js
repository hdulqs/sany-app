/**
 * Created by Dawn on 2017/8/15.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('createExpService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    //初始化费用账本id
                    initExpID : initExpID,
                    //维度初始化
                    initDimension : initDimension,
                    //保存新建账本信息
                    saveExpBook:saveExpBook,
                    //账本查询
                    searchExpBook: searchExpBook,
                    //加载维度列表
                    getDimensionList:getDimensionList,
                    //获取默认成本中心
                    getUserDefault:getUserDefault,
                    //获取报销单费用项目弹性域
                    getReportFlex:getReportFlex,
                    //报销单行查询
                    searchReportLine: searchReportLine,
                    //
                    queryExchangeRate:queryExchangeRate
                };
                return factory;

                /**
                 * 初始化费用账本id
                 * @returns {HttpPromise}
                 */
                function initExpID () {
                    var url = ServiceBaseURL.hec_interface_url;
                    console.log("当前用户session_user_id:"+localStorageService.get(LocalStorageKeys.hec_user_id));
                    var params = {
                        "data_type":"book_init",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":{
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "_status":"execute"
                        }
                    };
                    return $http.post(url,params);
                }

                /**
                 * 维度初始化
                 * @param expenseId 费用账本id
                 * @returns {HttpPromise}
                 */
                function initDimension(expenseId,companyId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"book_init_dimension",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":{
                            "session_user_id" : localStorageService.get(LocalStorageKeys.hec_user_id),
                            "session_employee_id":localStorageService.get(LocalStorageKeys.hec_employee_id),
                            "session_company_id":companyId,
                            "expense_id" : expenseId,
                            "_status" : "execute"
                        }
                    };
                    return $http.post(url,params);
                }

                /**
                 * 保存新建账本信息
                 * @param bookItem 费用账本保存信息
                 * @returns {*}
                 */
                function saveExpBook(bookItem,assReportFlag) {
                    var url = ServiceBaseURL.hec_interface_url;
                    /*if(bookItem[0].tax_type_desc){
                        bookItem[0].tax_type_desc = "";
                    }else if (bookItem[0].invoice_category_desc){
                        bookItem[0].invoice_category_desc = "";
                    }*/
                    var params = {
                        "data_type":"book_save",
                        "action":"submit",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "parameter":bookItem
                    };
                    if(assReportFlag){
                         params = {
                            "data_type":"exp_report_line_save",
                            "action":"submit",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "parameter":bookItem
                         };
                    }
                    return $http.post(url,params);
                }

                /**
                 * 查询账本信息
                 * @param expenseId 费用账本id
                 * @param page   页码
                 * @param size   页大小
                 * @returns {*}
                 */
                function searchExpBook(companyId,expenseId,page,size) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type":"book_select",
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "expense_id":expenseId,
                            "company_id": companyId,
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":"false"
                         }
                    });
                }

                //创建费用账本时查询维度
                function getDimensionList(companyId,expenseId,page,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"book_dimension",
                        "action":"query",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "company_id" : companyId,//1
                        "expense_id" : expenseId,//190
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }


                function queryExchangeRate(comId,periodName,fromCry,toCry) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "book_get_exchange_rate",
                            "action": "query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "company_id": comId,
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "exchange_period_name": periodName,
                            "from_currency": fromCry,
                            "to_currency": toCry,
                            "pagenum": 1,
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        }
                    });
                }

                function getReportFlex(expReportLineId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "report_flexs",
                            "action": "query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "exp_report_line_id": expReportLineId,
                            "pagenum": "1",
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        }
                    });
                }

                function searchReportLine(lineId) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "exp_report_line_details",
                            "action": "query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "exp_report_line_id": lineId,
                            "pagenum": "1",
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        }
                    });
                }

                function getUserDefault() {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "user_default",
                            "action": "query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "session_company_id": localStorageService.get(LocalStorageKeys.hec_company_id),
                            "pagenum": "1",
                            "pagesize": LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        }
                    });
                }

            }])
})();
