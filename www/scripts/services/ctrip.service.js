/**
 * Created by boyce1 on 2016/4/7.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('CtripService', ['$http', 'ServiceBaseURL', '$state', '$location','PublicFunction', function ($http, ServiceBaseURL, $state, $location,PublicFunction) {
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
            goTravelBefore: function (initPage, approvalNumber) {
                if (!approvalNumber) {
                    approvalNumber = '';
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/ctrip/sso',
                    method: 'GET',
                    params: {
                        initPage: initPage,
                        approvalNumber: approvalNumber
                    }
                }).success(function (data) {
                    var ctripData = "Token=" + data.Token + "&Appid=" + data.Appid +
                        "&InitPage=" + data.InitPage + "&AccessUserId=" + data.AccessUserId +
                        "&EmployeeId=" + data.EmployeeId + "&URL=" + data.URL + "&EndorsementID=" + data.EndorsementID+
                        "&BackURL=" + encodeURIComponent($location.absUrl());

                    ref = cordova.InAppBrowser.open(ServiceBaseURL.url + '/jumpbox_v2.html?' + ctripData, '_blank', 'location=no,toolbar=no');
                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                    ref.addEventListener('exit', inAppBrowserClose);
                });
            },
            //判断员工是否开卡
            judgeCardEnable: function () {
                return $http.post(ServiceBaseURL.url + '/api/ctrip/open/card');
            },
            //获取单点登陆链接
            getCtripSSOUrl: function (initPage, approvalNumber) {
                if (!approvalNumber) {
                    approvalNumber = '';
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/ctrip/sso',
                    method: 'GET',
                    params: {
                        initPage: initPage,
                        approvalNumber: approvalNumber
                    }
                })
            }
        };
    }]);
