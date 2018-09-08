'use strict';
angular.module('huilianyi.services')
    .factory('NetworkInformationService', ['$cordovaNetwork',
        function ($cordovaNetwork) {
            return {
                isOffline: function () {
                    return $cordovaNetwork.isOffline();
                },

                isWiFi: function () {
                    //console.log($cordovaNetwork.connectionType);
                    return $cordovaNetwork.getNetwork() === 'wifi';
                },

                getNetworkInformation: function() {
                    return $cordovaNetwork.getNetwork();
                    /*Returns Connection Object:
                     Connection Type	Description
                     Connection.UNKNOWN	Unknown connection
                     Connection.ETHERNET	Ethernet connection
                     Connection.WIFI	WiFi connection
                     Connection.CELL_2G	Cell 2G connection
                     Connection.CELL_3G	Cell 3G connection
                     Connection.CELL_4G	Cell 4G connection
                     Connection.CELL	Cell generic connection
                     Connection.NONE	No network connection*/
                }
            };
        }]);
