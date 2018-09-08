/**
 * Created by Dawn on 2017/8/10.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecCompanyService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys','PublicFunction',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys,PublicFunction) {
                return {
                    searchKeywords: function (keyWord, employeeId, page, size) {
                        var empId = employeeId;
                        if (PublicFunction.isNull(empId)) {
                            empId = localStorageService.get(LocalStorageKeys.hec_employee_id);
                        }
                        var url = ServiceBaseURL.hec_interface_url;
                        var params = {
                            "data_type": "book_company",
                            "action": "query",
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "employee_id": empId,
                            "fuzzy": keyWord,
                            "pagenum": typeof page === 'number' ? page : 1,
                            "pagesize": typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                            "fetchall": "false"
                        };
                        return $http.post(url, params);
                    }
                }
            }])
})();
