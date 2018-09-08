'use strict';
angular.module('huilianyi.services')
    .factory('PlaceService', ['$http', '$q', function ($http, $q) {
        return {
            searchNearby: function (lng, lat) {
                $http.get('http://restapi.amap.com/v3/place/around', {
                    params: {
                        key: '174c8e2d376b5789cebbf78cd59f9e2f',
                        location: lng + ',' + lat
                    }
                })
            },
            searchPlace: function () {

            },
            getCurrentCity: function () {
                var deferred = $q.defer();
                $http.get('http://restapi.amap.com/v3/ip')
                    .success(function (data) {
                        
                    })
                    .error(function (error) {
                        //TODO: 添加错误处理
                    })
            }
        }
    }]);
