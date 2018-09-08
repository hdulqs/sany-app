/**
 * Created by Yuko on 16/11/21.
 */
angular.module('huilianyi.services')
    .factory('CorporationEntityService', ['$http', 'ServiceBaseURL',
        function ($http, ServiceBaseURL) {
            return {
                getCorporationEntityList: function (page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/v2/my/company/receipted/invoices',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    });
                },
                getCorporationEntityDetail: function (companyReceiptedOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/my/company/receipted/invoice/' + companyReceiptedOID,
                        method: 'GET'
                    });
                }
            }
        }])
