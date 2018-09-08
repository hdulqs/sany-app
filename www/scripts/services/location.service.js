(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('LocationService', ['$http', '$q', 'Map', 'ServiceBaseURL', '$timeout', '$sessionStorage',
            function ($http, $q, Map, ServiceBaseURL, $timeout, $sessionStorage) {

                var parm = {"latitude": "", "longitude": "", "address": ""};
                var expenseCreateLocation = {"latitude": "", "longitude": "", "address": ""};
                var privateVar = {"latitude": "", "longitude": "", "address": ""};
                var city = "";

                /*
                 * 把坐标转换成百度地图的坐标.latitude:纬度, longitude:经度
                 * 返回值: {"status":0,"result":[{"x":经度,"y":纬度}]}
                 */
                function transferToBaiDu(latitude, longitude) {
                    return $http.get('http://api.map.baidu.com/geoconv/v1/?coords=' + longitude + ',' + latitude +
                        '&from=1&to=5&ak=i6Ft7l8flPNq7Ub6O2vmcuGx')
                }

                return {
                    //获取定位信息
                    getParam: function () {
                        return parm;
                    },
                    getPrivateCar: function () {
                        return privateVar;
                    },
                    getExpenseCreateLocation: function () {
                        return expenseCreateLocation;
                    },
                    //获取城市信息
                    getCity: function () {
                        return city;
                    },
                    resetLocation: function () {
                        privateVar = {"latitude": "", "longitude": "", "address": ""};
                        parm = {"latitude": "", "longitude": "", "address": ""};
                    },
                    searchKeywords: function (keyword, types, city, page, size) {
                        var deferred = $q.defer();
                        $http.get('http://restapi.amap.com/v3/place/text', {
                            params: {
                                key: Map.key.web,
                                keywords: keyword,
                                city: city,
                                types: types,
                                page: page,
                                offset: size
                            }
                        }).success(function (data) {
                            if (data.status === '1') {
                                var locations = [];
                                if (data.pois.length === 0) {
                                    deferred.reject('keywords.is.ambiguous');
                                }
                                angular.forEach(data.pois, function (poi) {
                                    var location = {
                                        name: poi.name,
                                        address: poi.address,
                                        longitude: poi.location.substring(0, poi.location.indexOf(',')),
                                        latitude: poi.location.substring(poi.location.indexOf(',') + 1)
                                    };
                                    locations.push(location);
                                });
                                deferred.resolve(locations);
                            } else {
                                deferred.reject('location.service.failed');
                            }
                        }).error(function (error) {
                            deferred.reject('location.service.offline');
                        });
                        return deferred.promise;
                    },
                    searchNearby: function (types, longitude, latitude, page, size) {
                        var deferred = $q.defer();
                        $http.get('http://restapi.amap.com/v3/place/around', {
                            params: {
                                key: Map.key.web,
                                types: types,
                                location: longitude + ',' + latitude,
                                page: page,
                                offset: size
                            }
                        }).success(function (data) {
                            if (data.status === '1') {
                                var locations = [];
                                angular.forEach(data.pois, function (poi) {
                                    var location = {
                                        name: poi.name,
                                        address: poi.address,
                                        longitude: poi.location.substring(0, poi.location.indexOf(',')),
                                        latitude: poi.location.substring(poi.location.indexOf(',') + 1)
                                    };
                                    locations.push(location);
                                });
                                deferred.resolve(locations);
                            } else {
                                deferred.reject('location.service.failed');
                            }
                        }).error(function (error) {
                            deferred.reject('location.service.offline');
                        });
                        return deferred.promise;
                    },
                    getCurrentLocationByIP: function (deferred) {
                        $http.get('http://restapi.amap.com/v3/ip', {
                            params: {
                                key: Map.key.web
                            }
                        }).success(function (data) {
                            var lb = data.rectangle.substring(0, data.rectangle.indexOf(';'));
                            var rt = data.rectangle.substring(data.rectangle.indexOf(';') + 1);
                            var result = {
                                city: data.city,
                                longitude: (parseFloat(lb.substring(0, lb.indexOf(','))) + parseFloat(rt.substring(0, rt.indexOf(',')))) / 2,
                                latitude: (parseFloat(lb.substring(lb.indexOf(',') + 1)) + parseFloat(rt.substring(rt.indexOf(',') + 1))) / 2
                            };
                            expenseCreateLocation = {
                                address: data.city,
                                longitude: (parseFloat(lb.substring(0, lb.indexOf(','))) + parseFloat(rt.substring(0, rt.indexOf(',')))) / 2,
                                latitude: (parseFloat(lb.substring(lb.indexOf(',') + 1)) + parseFloat(rt.substring(rt.indexOf(',') + 1))) / 2
                            };
                            parm = {
                                address: data.city,
                                longitude: (parseFloat(lb.substring(0, lb.indexOf(','))) + parseFloat(rt.substring(0, rt.indexOf(',')))) / 2,
                                latitude: (parseFloat(lb.substring(lb.indexOf(',') + 1)) + parseFloat(rt.substring(rt.indexOf(',') + 1))) / 2
                            };
                            privateVar = {
                                address: data.city,
                                longitude: (parseFloat(lb.substring(0, lb.indexOf(','))) + parseFloat(rt.substring(0, rt.indexOf(',')))) / 2,
                                latitude: (parseFloat(lb.substring(lb.indexOf(',') + 1)) + parseFloat(rt.substring(rt.indexOf(',') + 1))) / 2
                            };
                            deferred.resolve(result);
                        })
                    },

                    // 把坐标转换成百度地图的坐标.latitude:纬度, longitude:经度
                    transferToBaiDu: transferToBaiDu,

                    getCurrentLocation: function () {
                        var deferred = $q.defer();
                        var result = null;
                        if (typeof device !== 'undefined') {
                            if (device.platform == 'iOS' || device.platform == 'ios') {
                                var onSuccess = function (position) {
                                    result = {};
                                    result.longitude = position.coords.longitude;
                                    result.latitude = position.coords.latitude;
                                    parm.longitude = position.coords.longitude;
                                    parm.latitude = position.coords.latitude;
                                    privateVar.longitude = position.coords.longitude;
                                    privateVar.latitude = position.coords.latitude;
                                    expenseCreateLocation.longitude = position.coords.longitude;
                                    expenseCreateLocation.latitude = position.coords.latitude;
                                    // 使用百度的地标转换
                                    transferToBaiDu(position.coords.latitude, position.coords.longitude).then(function (response) {
                                        var point = new BMap.Point(response.data.result[0].x, response.data.result[0].y);
                                        privateVar.longitude = response.data.result[0].x;
                                        privateVar.latitude = response.data.result[0].y;
                                        var geoc = new BMap.Geocoder();
                                        try {
                                            geoc.getLocation(point, function (rs) {
                                                var addComp = rs.addressComponents;
                                                result.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                                parm.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                                privateVar.address = addComp.district + addComp.street + addComp.streetNumber;
                                                result.city = addComp.city;
                                                city = addComp.city;
                                                expenseCreateLocation.address = addComp.city;
                                                deferred.resolve(result);
                                            });
                                        } catch (e) {
                                            this.getCurrentLocationByIP(deferred);
                                        }
                                    });
                                };
                                navigator.geolocation.getCurrentPosition(onSuccess, function () {

                                }, {timeout: 3000, enableHighAccuracy: true});
                            } else {
                                BDLoc.getLocation(function (response) {
                                    result = {};
                                    result.longitude = response.longitude;
                                    result.latitude = response.latitude;
                                    parm.longitude = response.longitude;
                                    parm.latitude = response.latitude;
                                    privateVar.longitude = response.longitude;
                                    privateVar.latitude = response.latitude;
                                    expenseCreateLocation.longitude = response.longitude;
                                    expenseCreateLocation.latitude = response.latitude;
                                    var conv = LocationConv.gcj2bd(parseFloat(response.latitude), parseFloat(response.longitude));
                                    var point = new BMap.Point(conv[1], conv[0]);
                                    var geoc = new BMap.Geocoder();
                                    try {
                                        geoc.getLocation(point, function (rs) {
                                            var addComp = rs.addressComponents;
                                            result.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                            parm.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                            privateVar.address = addComp.district + addComp.street + addComp.streetNumber;
                                            result.city = addComp.city;
                                            city = addComp.city;
                                            expenseCreateLocation.address = addComp.city;
                                            deferred.resolve(result);
                                        });
                                    } catch (e) {
                                        this.getCurrentLocationByIP(deferred);
                                    }
                                }, function (response) {
                                });
                            }
                            return deferred.promise;
                        } else {
                            var deferred = $q.defer();
                            this.getCurrentLocationByIP(deferred);
                            return deferred.promise;
                        }
                    },
                    getDistance: function (begin, end) {
                        // 获取两个点之间的驾驶路程,每个点均以经纬度表示.
                        // 参数: begin:object, 属性:longitude(经度), latitude(纬度)
                        // return: 空或者路程, 带单位
                        // 使用时在html添加<div id="getDistance"></div>
                        // 调用示例: LocationService.getDistance({longitude:121.452224, latitude:30.229868}, {longitude:121.448594, latitude:31.229173})
                        var deferred = $q.defer();
                        var result = null;
                        if (!begin.longitude || !begin.latitude || !end.longitude || !end.latitude) {
                            result = "params error";
                            deferred.reject(result);
                            return deferred.promise;
                        }

                        // 百度API计算两点之间的驾车距离
                        var map = new BMap.Map("getDistance");
                        var searchComplete = function (results) {
                            if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                                return;
                            }
                            var plan = results.getPlan(0);
                            result = plan.getDistance(false); //获取距离  false: 纯数字，单位为 米
                            deferred.resolve(result);
                        }
                        var transit = new BMap.DrivingRoute(map, {
                                renderOptions: {map: map},
                                onSearchComplete: searchComplete
                            }
                        );
                        transit.search(new BMap.Point(begin.longitude, begin.latitude), new BMap.Point(end.longitude, end.latitude));

                        return deferred.promise;
                    },

                    /**
                     * 根据城市名称获取城市编码
                     * @param vendorType    供应商名称.为空的时候，搜索标准城市.不为空的时候，搜索该vendorType下的城市.
                     *      取值: 携程飞机 ctrip_air 火车 ctrip_trian 飞机 ctsho_air 标准 standard
                     * @param keyWord       城市关键字.encode字符
                     * @param page          当前页数
                     * @param size          每页数量
                     * @returns {*}
                     */
                    getCodeByCity: function (keyWord, vendorType, page, size) {
                        return $http({
                            url: ServiceBaseURL.url + '/location-service/api/location/search',
                            method: 'GET',
                            headers: {
                                language: $sessionStorage.lang
                            },
                            params: {
                                page: typeof page === 'number' ? page : 0,
                                size: typeof page === 'number' ? size : 10,
                                vendorType: vendorType,
                                keyWord: keyWord
                            }
                        });
                    },

					/**
					 * 根据城市编码获取城市信息
                     * @param code 城市编码
                     * @returns {*}
                     */
                    getCityByCode: function(code) {
                        return $http({
                            url: ServiceBaseURL.url + '/location-service/api/locations/' + code,
                            method: 'GET',
                            headers: {
                                language: $sessionStorage.lang==='en' ? 'en_us' : $sessionStorage.lang
                            }
                        });
                    }
                }
            }])
})();
