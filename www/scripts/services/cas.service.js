/**
 * Created by Hurong on 2017/10/20.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('CasService', ['$http', 'ServiceBaseURL', '$state', '$location','PublicFunction','$filter','localStorageService',
        function ($http, ServiceBaseURL, $state, $location,PublicFunction,$filter,localStorageService) {
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
            goCasBefore: function () {
                return $http({
                    method: 'GET',
                    url: ServiceBaseURL.url + '/api/cnac/sso'
                }).success(function (data) {
                    //data.url为拼接好的url,如果返回结果是null则表示尚未开卡,
                    if(!PublicFunction.isNull(data.url)){
                        ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                            $filter('translate')('back.to.HuiLianYi'));
                        ref.addEventListener('loadstart', inAppBrowserLoadStart);
                        ref.addEventListener('exit', inAppBrowserClose);
                    }else{
                        PublicFunction.showToast($filter('translate')('error_comp.card.no.open'));
                    }
                }).error(function () {
                    PublicFunction.showToast($filter('translate')('error_comp.error'));
                });
            },
            //获取单点登陆链接
            getCasSSOUrl: function (initPage, approvalNumber) {
                if (!approvalNumber) {
                    approvalNumber = '';
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/cnac/sso',
                    method: 'GET'
                })
            }
        };
    }]);
