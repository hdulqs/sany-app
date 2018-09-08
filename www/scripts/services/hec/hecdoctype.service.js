(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecDocTypeService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                return {
                    searchKeywords: function (type,companyId,page, size,employeeId) {
                        var dataType = "";
                        if (type === "ExpReq") { //费用申请单
                            dataType = "expense_requisition_type";
                        } else if (type === "ExpReport") { //费用报销单
                            dataType = "exp_report_type";
                        }else if (type === "LoanReq"||type == 'reqRefLoan') { //借款单申请
                            dataType = "csh_payment_req_type";
                        }
                        var url = ServiceBaseURL.hec_interface_url;
                        var params = {
                            "data_type":dataType,
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "company_id":companyId,
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":"false"
                        };
                        //借款单、报销单单据类型，需要以下参数
                        if(employeeId){
                            params.employee_id = employeeId;
                            params.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                        }
                        return $http.post(url, params);
                    }
                }
            }])
})();
