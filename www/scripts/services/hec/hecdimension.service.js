/**
 * Created by Dawn on 2017/8/19.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecdimensionService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                return {
                    getDimensionDetail: function (keyword,companyId,dimensionId,loanFlag,page, size) {
                        var url = ServiceBaseURL.hec_interface_url;
                        if(!dimensionId){
                            dimensionId ='21';
                        }
                        if(loanFlag=='loan'){
                           var params = {
                                "data_type":"csh_payment_req_project_name",
                                "action":"query",
                                "fuzzy":keyword,
                                "session_company_id":companyId
                            }
                        }else{
                           var params = {
                               "data_type":"book_dimension_detail",
                               "action":"query",
                               "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                               "fuzzy":keyword,
                               "company_id":companyId,
                               "dimension_id":dimensionId,
                               "pagenum": typeof page === 'number' ? page : 1,
                               "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                               "fetchall":"false"
                            };
                        }
                        return $http.post(url, params);
                    }
                }
            }])
})();
