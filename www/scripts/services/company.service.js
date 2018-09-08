'use strict';
angular.module('huilianyi.services')
    .factory('CompanyService', ['$http', 'ServiceBaseURL', '$sessionStorage', '$q',
        function ($http, ServiceBaseURL, $sessionStorage, $q) {
            return {
                getMyCompany: function() {
                    var deferred = $q.defer();
                    var companyInfo = $sessionStorage.companyInfo;
                    if (companyInfo) {
                        deferred.resolve(companyInfo);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/my/companies')
                            .success(function (data) {
                                $sessionStorage.companyInfo = data;
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        });
                    }
                    return deferred.promise;
                },
                //银行卡列表
                getUserBankAccountList: function (userOID, page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/contact/bank/account/enable',
                        method: 'GET',
                        params: {
                            userOID: userOID,
                            page: page,
                            size: size
                        }
                    });
                },
                //银行卡详情
                getBankAccountDetail: function (contactBankAccountOID) {
                    return $http.get(ServiceBaseURL.url + '/api/contact/bank/account/' + contactBankAccountOID);
                }
            }
        }
    ]);
