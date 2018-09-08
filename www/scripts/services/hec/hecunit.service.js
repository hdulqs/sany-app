(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecunitService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                return {
                    searchKeywords: function (keyWord, companyId,page, size) {
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data:  {
                                "data_type":"book_unit",
                                "action":"query",
                                "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                                "company_id":companyId,
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
