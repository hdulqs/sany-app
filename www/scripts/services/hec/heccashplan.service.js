(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HeccashplanService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys','PublicFunction',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys,PublicFunction) {
                return {
                    searchKeywords: function (keyWord,params,page, size) {
                        var url =  ServiceBaseURL.hec_interface_url;
                        var data = {
                            "action":"query",
                            "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                            "fuzzy":keyWord,
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall":"false"
                        }
                        if(!PublicFunction.isNull(params.headerId)){//报销单-资金计划
                            data.data_type = "report_cash_plan_number";
                            data.exp_report_header_id = params.headerId;
                        }else{//借款单资金计划
                            data.data_type = "csh_payment_req_cash_plan_number";
                            data.csh_transaction_class_code = params.cshClassCode;
                            data.company_id = params.companyId;
                            data.responsibility_center_id = params.respId;
                            data.requisition_date = params.reqDate;
                        }
                        return $http({url:url,method: 'POST',data:data});
                    }
                }
            }])
})();
