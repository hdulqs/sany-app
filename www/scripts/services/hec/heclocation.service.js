/**
 * Created by Dawn on 2017/8/20.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HeclocationService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                return {
                    searchKeywords: function (keyWord,reqTypeCode,page, size) {
                        //reqTypeCode:  //差旅申请单类型： 1010/国内  1015/国际
                        var stateFlag = "N";
                        if(reqTypeCode !="1010"){
                            stateFlag = null;
                        }
                        return $http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data:  {
                                "data_type":"city",
                                "action":"query",
                                "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                                "fuzzy":keyWord,
                                "state_flag":stateFlag,
                                "pagenum": typeof page === 'number' ? page : 1,
                                "pagesize":typeof page === 'number' ? size : LocalStorageKeys.hec_pagesize,
                                "fetchall":"false"
                            }
                        });
                    }
                }
            }])
})();
