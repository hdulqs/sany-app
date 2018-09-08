(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecexptypeService', ['$http', '$q', 'ServiceBaseURL', '$timeout' ,'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    //初始化弹性域
                    bookInitFlexs:bookInitFlexs,
                    //加载补充明细
                    bookFlexs: bookFlexs,
                    searchKeywords:searchKeywords
                };
                return factory;

                /**
                 * 获取报销类型-费用项目
                 * 我的账本与报销单新建的费用调用接口参数不一样通过assReportFlag区分
                 * @param keyWord
                 * @param companyId
                 * @param employeeId
                 * @param assReportFlag  true关联报销单的费用 false为费用账本
                 * @param page
                 * @param size
                 * @returns {HttpPromise}
                 */
                function searchKeywords(keyWord, companyId,employeeId,expReportTypeId,page, size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"book_expense",
                        "action":"query",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "company_id":companyId,
                        "employee_id":employeeId,
                        "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                        "fuzzy":keyWord,
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    if(expReportTypeId){
                        params.data_type = "report_expense";
                        params.expense_report_type_id = expReportTypeId;
                    }
                    return $http.post(url,params);
                }
                //初始化弹性域
                function bookInitFlexs(expenseId,expenseTypeId,expItemId) {
                    var defer = $q.defer();
                    $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data:  {
                            "data_type": "book_init_flexs",
                            "action": "submit",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "parameter":{
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "expense_id": expenseId,//352
                                "expense_type_id": expenseTypeId,//1180
                                "exp_req_item_id": expItemId,//1330
                                "_status":"execute"
                            }
                        }
                    }).success(function (data) {
                        if(data.success){
                            defer.resolve(data);
                        }else{
                            defer.reject(data);
                        }
                    }).error(function (data) {
                        defer.reject(data);
                        console.log(angular.toJson(data));
                    });
                    return defer.promise;
                }

                //创建费用账本时获取关联费用项目的弹性域
                function bookFlexs(expenseId,page,size) {
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data:  {
                            "data_type":"book_flexs",
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "expense_id": expenseId,//352
                            "tmp_type":"tmp",
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":"false"
                        }
                    });
                }

            }])
})();
