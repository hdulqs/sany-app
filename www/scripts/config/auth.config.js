(function () {

'use strict';
angular.module('huilianyi')
    .config(AuthServiceConfig)
    .run(AuthServiceRun);

    AuthServiceConfig.inject = ['$httpProvider']
    AuthServiceRun.$inject = ['$rootScope', 'Principal', 'Auth'];

    function AuthServiceConfig($httpProvider) {
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
    }
    function AuthServiceRun($rootScope, Principal, Auth) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }
        });
    }

})();
