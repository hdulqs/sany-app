/**
 * Created by Yuko on 16/9/12.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('BaoKuService', ['$http', 'ServiceBaseURL', '$state', '$location', '$filter', function ($http, ServiceBaseURL, $state, $location, $filter) {
        var ref = null;

        function inAppBrowserLoadStart(event) {
            if (event.url.indexOf('closeInAppBrowser.html') !== -1) {
                ref.close();
            }
        }

        function inAppBrowserClose() {
            ref.removeEventListener('loadstart', inAppBrowserLoadStart);
            ref.removeEventListener('exit', inAppBrowserClose);
            ref = null;
        }

        return {
            goBaoKu: function () {
                return $http({
                    url: ServiceBaseURL.url + '/api/baoku/sso/url',
                    method: 'GET'
                }).success(function (data) {
                    ref = cordova.InAppBrowser.open(ServiceBaseURL.url + '/jump.html?' + data, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no');
                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                    ref.addEventListener('exit', inAppBrowserClose);
                });
            }
        };
    }]);
