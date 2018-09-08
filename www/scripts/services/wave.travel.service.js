'use strict';
angular.module('huilianyi.services')
    .factory('WaveTravelService', ['$http', 'ServiceBaseURL', '$filter', 'LocationService', function ($http, ServiceBaseURL, $filter, LocationService) {
        var parm = {"latitude": "", "longitude": "", "address": ""};
        var expenseCreateLocation = {"latitude": "", "longitude": "", "address": ""};
        var city = "";
        return{
            //获取定位信息
            getParam:function(){
                return parm;
            },
            getExpenseCreateLocation: function () {
                return expenseCreateLocation;
            },
            //获取城市信息
            getCity:function(){
                return city;
            },
            //生成发票
            buildInvoice :function(data){
                data.createdDate = new Date(data.createdDate);
                var newDate = new Date((data.createdDate.getTime() + data.createdDate.getTimezoneOffset() * 60 * 1000));
                data.createdDate = $filter('date')(newDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                return $http({
                    url: ServiceBaseURL.url + '/api/v2/invoices',
                    method: 'POST',
                    data: data
                });
            },

            resetLocation: function() {
                parm.latitude = "";
                parm.longitude = "";
                parm.address = "";
            },

            getLocation: function () {
                if (device.platform == 'iOS' || device.platform == 'ios') {
                    var onSuccess = function (position) {
                        parm.longitude = position.coords.longitude;
                        expenseCreateLocation.longitude = position.coords.longitude;
                        parm.latitude = position.coords.latitude;
                        expenseCreateLocation.latitude = position.coords.latitude;
                        // 使用百度的地标转换
                        LocationService.transferToBaiDu(position.coords.latitude, position.coords.longitude).then(function(response){
                            var point = new BMap.Point(response.data.result[0].x, response.data.result[0].y);
                            var geoc = new BMap.Geocoder();
                            try {
                                geoc.getLocation(point, function (rs) {
                                    var addComp = rs.addressComponents;
                                    parm.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                    expenseCreateLocation.address = addComp.city;
                                    city = addComp.city;
                                    locationInfo.longitude = parm.longitude;
                                    locationInfo.latitude = parm.latitude;
                                    locationInfo.address = parm.address;
                                });
                            } catch (e) {
                                throw(e.name); //抛出异常
                            } finally {
                            }
                        });
                    };
                    navigator.geolocation.getCurrentPosition(onSuccess, function () {

                    }, {timeout: 3000, enableHighAccuracy: true});
                } else {
                    BDLoc.getLocation(function (response) {
                        parm.longitude = response.longitude;
                        expenseCreateLocation.longitude = response.longitude;
                        parm.latitude = response.latitude;
                        expenseCreateLocation.longitude = response.latitude;
                        var conv = LocationConv.gcj2bd(parseFloat(response.latitude), parseFloat(response.longitude));
                        var point = new BMap.Point(conv[1], conv[0]);
                        var geoc = new BMap.Geocoder();
                        try {
                                geoc.getLocation(point, function (rs) {
                                var addComp = rs.addressComponents;
                                parm.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                expenseCreateLocation.address = addComp.city;
                                city = addComp.city;
                            });
                        } catch (e) {
                            throw(e.name); //抛出异常
                        } finally {
                        }
                    }, function (response) {
                    });
                }
            }
        }
    }]);
