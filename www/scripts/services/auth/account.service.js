'use strict';

angular.module('huilianyi.services')
    .factory('Account', ['ServiceBaseURL', '$http', function(ServiceBaseURL, $http) {
        return {
            //加上cache: true，这样不会一直获取信息，如果principle force=true，才会清空缓存，重新获取
            getAccount: function () {
                return $http({
                    method: 'GET',
                    url: ServiceBaseURL.url + '/api/account',
                    cache: true
                });
            }
        };
    }]);
