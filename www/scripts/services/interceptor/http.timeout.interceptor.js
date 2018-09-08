'use strict';

angular.module('huilianyi.services')
    .factory('httpTimeoutInterceptor', function ($rootScope) {
        return {
            // Add http request timeout
            'request': function (config) {
                //当timeout属性为空时才添加
                if (config.timeout == null)
                    config.timeout = $rootScope.httpTimeout;
                return config;
            }
        };
    });
