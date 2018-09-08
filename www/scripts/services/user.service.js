'use strict';
angular.module('huilianyi.pages')
    .factory('UserService', ['$http', 'ServiceBaseURL', function ($http, ServiceBaseURL) {
        return {
            searchUser: function (keyword, page, size) {
                // keyword = $.trim(keyword).replace(/\s+/g,'*');
                return $http.get(ServiceBaseURL.url + '/api/search/users/by/' + encodeURIComponent(keyword), {
                    params: {
                        page: page,
                        size: size
                    }
                })
            },
            getAllUsers: function (page, size) {
                return $http.get(ServiceBaseURL.url + '/api/users', {
                    params: {
                        page: page,
                        size: size
                    }
                })
            },
            getBatchUsers: function(data){
                return $http.get(ServiceBaseURL.url + '/api/users/oids?userOIDs=' + data);
            }
        }
    }]);
