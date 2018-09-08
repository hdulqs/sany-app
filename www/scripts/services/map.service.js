'use strict';
angular.module('huilianyi.services')
    .factory('MapService', function () {
        return {
            initMap: function (id) {
                return new AMap.Map(id, {
                    resizeEnable: true
                });
            },
            createMapWithCenter: function(id, lng, lat) {
                return new AMap.Map(id, {
                    resizeEnable: true,
                    center: [lng, lat]
                });
            },
            createMarker: function (map, lng, lat) {
                var marker = new AMap.Marker({
                    position: [lng, lat]
                });
                marker.setMap(map);
                return marker;
            },
            createHightMarker: function (map, lng, lat) {
                var marker = new AMap.Marker({
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                    position: [lng, lat]
                });
                marker.setMap(map);
                return marker;
            },
            createMarkerWithNumber: function (map, lng, lat, number) {
                var marker = new AMap.Marker({
                    position: [lng, lat],
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b'+ number +'.png'
                });
                marker.setMap(map);
                return marker;
            },
            createHighlightMarker: function (map, lng, lat) {
                var marker = new AMap.Marker({
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                    position: [lng, lat]
                });
                marker.setMap(map);
                return marker;
            },
            addPath: function (map, markers) {

            }
        }
    })
