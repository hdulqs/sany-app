(function () {

'use strict';
angular.module('huilianyi')
    .config(HttpTimeoutConfig);

    HttpTimeoutConfig.inject = ['$httpProvider'];

    function HttpTimeoutConfig($httpProvider) {
        $httpProvider.interceptors.push('httpTimeoutInterceptor');
    }
})();
