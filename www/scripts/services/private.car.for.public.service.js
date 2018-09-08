/**
 * Created by Yuko on 16/12/7.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('PrivateCarForPublicService', ['$http', '$q', '$injector', 'Map', '$timeout', 'ServiceBaseURL', 'LocationService', '$filter',
        function ($http, $q, $injector, Map, $timeout, ServiceBaseURL, LocationService, $filter) {
        var parm = {"latitude": "", "longitude": "", "address": ""};
        var city = "";
        return {
            //获取定位信息
            getParam: function () {
                return parm;
            },
            //获取城市信息
            getCity: function () {
                return city;
            },
            resetLocation: function () {
                parm = {"latitude": "", "longitude": "", "address": ""};
            },
            getCurrentLocationByIP: function (deferred) {
                $http.get('http://restapi.amap.com/v3/ip', {
                    params: {
                        key: Map.key.web
                    }
                })
                .success(function (data) {
                    var lb = data.rectangle.substring(0, data.rectangle.indexOf(';'));
                    var rt = data.rectangle.substring(data.rectangle.indexOf(';') + 1);
                    city = data.city;
                    var result = {
                        address: data.city,
                        city: data.city,
                        longitude: (parseFloat(lb.substring(0, lb.indexOf(','))) + parseFloat(rt.substring(0, rt.indexOf(',')))) / 2,
                        latitude: (parseFloat(lb.substring(lb.indexOf(',') + 1)) + parseFloat(rt.substring(rt.indexOf(',') + 1))) / 2
                    };
                    parm = {
                        address: data.city,
                        longitude: (parseFloat(lb.substring(0, lb.indexOf(','))) + parseFloat(rt.substring(0, rt.indexOf(',')))) / 2,
                        latitude: (parseFloat(lb.substring(lb.indexOf(',') + 1)) + parseFloat(rt.substring(rt.indexOf(',') + 1))) / 2
                    };
                    $timeout(function () {
                        $injector.get('$ionicLoading').hide();
                    }, 500);
                    deferred.resolve(result);
                })
                .error(function () {
                    $timeout(function () {
                        $injector.get('$ionicLoading').hide();
                    }, 500);
                    deferred.reject(false);
                })

            },
            getCurrentLocation: function () {
                $injector.get('$ionicLoading').show({
                    template: $filter('translate')('private.position'), /*定位中...*/
                    noBackdrop: true
                });
                var deferred = $q.defer();
                var result = null;
                if (typeof device !== 'undefined') {
                    if (device.platform == 'iOS' || device.platform == 'ios') {
                        var getLocationSuccess = false;
                        var onSuccess = function (position) {
                            result = {};
                            result.longitude = position.coords.longitude;
                            result.latitude = position.coords.latitude;
                            parm.longitude = position.coords.longitude;
                            parm.latitude = position.coords.latitude;
                            // 使用百度的地标转换
                            LocationService.transferToBaiDu(position.coords.latitude, position.coords.longitude).then(function(response){
                                var point = new BMap.Point(response.data.result[0].x, response.data.result[0].y);
                                var geoc = new BMap.Geocoder();
                                try {
                                    geoc.getLocation(point, function (rs) {
                                        getLocationSuccess = true;
                                        var addComp = rs.addressComponents;
                                        result.address = addComp.district + addComp.street + addComp.streetNumber;
                                        parm.address = addComp.district + addComp.street + addComp.streetNumber;
                                        result.city = addComp.city;
                                        city = addComp.city;
                                        $injector.get('$ionicLoading').hide();
                                        deferred.resolve(result);
                                    });
                                } catch (e) {
                                    this.getCurrentLocationByIP(deferred);
                                }
                            });
                        };
                        navigator.geolocation.getCurrentPosition(onSuccess, function () {
                            deferred.reject(false);
                        }, {timeout: 3000, enableHighAccuracy: true});
                        $timeout(function(){
                            if (getLocationSuccess){
                                $injector.get('$ionicLoading').hide();
                                deferred.reject(false);
                            } else {
                                $injector.get('$ionicLoading').hide();
                                deferred.reject(false);
                            }
                        }, 4000);
                    } else {
                        var getLocationSuccess = false;
                        BDLoc.getLocation(function (response) {
                            result = {};
                            result.longitude = response.longitude;
                            result.latitude = response.latitude;
                            parm.longitude = response.longitude;
                            parm.latitude = response.latitude;
                            var conv = LocationConv.gcj2bd(parseFloat(response.latitude), parseFloat(response.longitude));
                            var point = new BMap.Point(conv[1], conv[0]);
                            var geoc = new BMap.Geocoder();
                            try {
                                geoc.getLocation(point, function (rs) {
                                    getLocationSuccess = true;
                                    var addComp = rs.addressComponents;
                                    result.address =  addComp.district + addComp.street + addComp.streetNumber;
                                    parm.address =  addComp.district + addComp.street + addComp.streetNumber;
                                    result.city = addComp.city;
                                    city = addComp.city;
                                    $injector.get('$ionicLoading').hide();
                                    deferred.resolve(result);
                                });
                            } catch (e) {
                                this.getCurrentLocationByIP(deferred);
                            }
                        }, function (response) {
                            $injector.get('$ionicLoading').hide();
                            deferred.reject(false);
                        });
                        $timeout(function(){
                            if (getLocationSuccess){
                                $injector.get('$ionicLoading').hide();
                                deferred.reject(false);
                            } else {
                                $injector.get('$ionicLoading').hide();
                                deferred.reject(false);
                            }
                        }, 4000);
                    }
                    return deferred.promise;
                } else {
                    var deferred = $q.defer();
                    this.getCurrentLocationByIP(deferred);
                    return deferred.promise;
                }
            },
            getMyUnitPrice: function () {
                return $http.get(ServiceBaseURL.url + '/api/private/car/for/public/my');
            },
            getPrivateCarExpenseType: function (expenseTypeOID) {
                return $http.get(ServiceBaseURL.url + '/api/expense/types/' + expenseTypeOID)
            }
        }
    }]);
