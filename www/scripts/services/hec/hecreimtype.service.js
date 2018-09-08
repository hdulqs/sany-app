(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecReimTypeService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                return {
                    searchKeywords: function (dataType,docTypeId, companyId,page, size) {
                        var params =  {
                            "data_type":dataType,
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "company_id":companyId,
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":"false"
                        };

                        if(dataType==='exp_expense_type'){//通用申请单行：报销类型
                            params.requisition_flag = "Y";
                            params.exp_requisition_type_id =docTypeId;
                        }else if(dataType==='report_type'){//差旅申请单行：报销类型
                            params.session_company_id = localStorageService.get(LocalStorageKeys.hec_company_id);
                            params.expense_requisition_type_id =docTypeId;
                        }

                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data: params
                        });
                    }
                }
            }])
})();
