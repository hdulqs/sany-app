/**
 * Created by Yuko on 16/9/12.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('BorrowMoneyService', ['$http', 'ServiceBaseURL', '$state', '$location', function ($http, ServiceBaseURL, $state, $location) {
        return {
            getStayWriteoffAmount: function () {
                return $http.get(ServiceBaseURL.url + '/api/writeoffs/my');
            },
            getBorrowList: function (page,size) {
                return $http({
                    url: ServiceBaseURL.url + '/api/writeoffartificials/my',
                    method: 'GET',
                    params: {
                        page: page,
                        size: size
                    }
                });
            }
        }
    }]);
