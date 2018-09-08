'use strict';
angular.module('huilianyi.services')
    .factory('CarouselService', ['$http', 'ServiceBaseURL', '$sessionStorage', '$q',
        function ($http, ServiceBaseURL, $sessionStorage, $q) {
            return {
                getCarouselList: function (companyOID) {
                    var deferred = $q.defer();
                    var carouselList = $sessionStorage.carouselList;
                    //判断数据是否过期
                    function isExpired(carouselList) {
                        var now = new Date().getTime();
                        //超过1个小时过期
                        return now - carouselList.timestamp > 1000*60*60
                    }
                    if(carouselList && !isExpired(carouselList)){
                        deferred.resolve(carouselList.data);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/carousels/company/' + companyOID)
                            .success(function(data){
                                var carouselList = {};
                                carouselList.data = data;
                                carouselList.timestamp = new Date().getTime();
                                $sessionStorage.carouselList = carouselList;
                                deferred.resolve(data);
                            })
                            .error(function(error){
                                deferred.reject(error);
                            })
                    }
                    return deferred.promise;
                    //return $http.get(ServiceBaseURL.url + '/api/carousels/enable/company/' + companyOID);
                },
                getCarouselDetail: function (carouselOID) {
                    return $http.get(ServiceBaseURL.url + '/api/carousels/' + carouselOID);
                }
            }
        }
    ]);
