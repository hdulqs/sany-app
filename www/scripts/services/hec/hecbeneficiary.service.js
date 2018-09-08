/**
 * Created by Dawn on 2017/10/20.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecbeneficiaryService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys','PublicFunction',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys,PublicFunction) {
                return {
                    /**
                     *
                     * @param keyWord  模糊查询条件
                     * @param dataType  依据收款对象：客户 csh_payment_req_vendor 供应商：csh_payment_req_customer
                     * @param companyId 公司id
                     * @param page
                     * @param size
                     * @returns {*}
                     */
                    searchKeywords: function (keyWord,dataType, companyId,page, size) {
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data:  {
                                "data_type":dataType,
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
