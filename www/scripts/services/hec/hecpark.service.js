(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecparkService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                return {
                    searchKeywords: function (page, size) {
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data:  {
                                "data_type":"park_stay",
                                "action":"query",
                                "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                                "pagenum": typeof page === 'number' ? page : 1,
                                "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                                "fetchall":"false"
                            }
                        });
                    }
                }
            }])
})();
