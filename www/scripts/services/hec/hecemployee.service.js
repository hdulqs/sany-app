//费用申请的经办人
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecempService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys) {
                return {
                    searchKeywords: function (companyId,type, page, size) {
                        //费用申请单、费用报销单调用同一个接口
                        var dataType = "req_employees";
                        /*if (type === "ExpReq") { //费用申请单
                            dataType = "req_employees";
                        } else if (type === "ExpReport") { //费用报销单
                            dataType = "book_employees";
                        }else if (type === "LoanReq") { //借款申请单
                            dataType = "";
                        }*/
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data: {
                                "data_type": dataType,
                                "action": "query",
                                "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "company_id": companyId,
                                "pagenum": typeof page === 'number' ? page : 1,
                                "pagesize": typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                                "fetchall": "false"
                            }
                        });
                    }
                }
            }])
})();
