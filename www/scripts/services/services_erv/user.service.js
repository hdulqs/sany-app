'use strict';
angular.module('huilianyi.services')
    .factory('UserService', ['$http', 'ServiceBaseURL', function ($http, ServiceBaseURL) {
        return {
            getHeadPortrait: function () {
                return $http.get(ServiceBaseURL.url + '/api/contacts/headPortrait');
            },
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
            //同行人控件中获取人员的接口
            getUsers: function (page, size, keyword) {
                return $http.get(ServiceBaseURL.url + '/api/users/search?keyword=' + encodeURIComponent(keyword), {
                    params: {
                        page: page,
                        size: size
                    }
                })
            },
            //获取单个同行人的人员信息
            getOneUser: function (userOID) {
                return $http.get(ServiceBaseURL.url + '/api/users/info/' + userOID);
            }
        }
    }]);
