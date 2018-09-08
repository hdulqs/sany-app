'use strict';

angular.module('huilianyi.services')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
        return {
            responseError: function (response) {
                if (response.status === 500){
	                $rootScope.$emit('artemisApp.httpError', response);
	            }
                return $q.reject(response);
            }
        };
    });
