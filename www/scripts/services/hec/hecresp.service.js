(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecrespService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys','PublicFunction',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys,PublicFunction) {
                return {
                    searchKeywords: function (keyWord, companyId,unitId,employeeId,page, size) {
                        var empId = employeeId;
                        if(PublicFunction.isNull(empId)){
                            empId = localStorageService.get(LocalStorageKeys.hec_employee_id);
                        }
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data:  {
                                "data_type":"book_resp",
                                "action":"query",
                                "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                                "employee_id":empId,
                                "company_id":companyId,
                                "unit_id":unitId,
                                "fuzzy":keyWord,
                                "pagenum": typeof page === 'number' ? page : 1,
                                "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                                "fetchall":"false"
                            }
                        });
                    }
                }
            }])
})();
