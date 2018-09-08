(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HectravelQueryService', ['$http', '$q', 'ServiceBaseURL',
            function ($http, $q,  ServiceBaseURL) {
                return {
                    queryTravelPartner: function (params) {
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data: {
                                data_type:"beneficiary_select",
                                action:"query",
                                lang:localStorageService.get(LocalStorageKeys.hec_language_code),
                                req_travel_id:params.req_travel_id,
                                pagenum:params.pagenum,
                                pagesize:params.pagesize,
                                fetchall:params.fetchall
                             }
                        });
                    }
                }
            }])
})();
