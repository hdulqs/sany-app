/**
 * Created by lizhi on 17/5/8.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('ServerService', ['$http', 'ServiceBaseURL', '$q', 'localStorageService', '$state', 'ENV', 'InitialServiceBaseURL',
        function ($http, ServiceBaseURL, $q, localStorageService, $state, ENV, InitialServiceBaseURL) {
            return {
                // 判断环境是否为正式或者预发环境
                judgeENV: function () {
                    return ENV === "prod" || ENV === "stage";
                },

                // 设置ServiceBaseURL为InitialServiceBaseURL
                setInitServiceBaseURL: function () {
                    ServiceBaseURL.url = InitialServiceBaseURL.url;
                },

                // localStorage中是否有ServiceBaseURL,有则用,没有则用InitialServiceBaseURL
                setLocalServiceBaseURL: function () {
                    var localServiceBaseURL = localStorageService.get("ServiceBaseURL");
                    ServiceBaseURL.url = localServiceBaseURL ? localServiceBaseURL : InitialServiceBaseURL.url;
                },

                // 保存ServiceBaseURL到localStorage
                saveServiceBaseURL: function (url) {
                    localStorageService.set("ServiceBaseURL", url);
                    ServiceBaseURL.url = url;
                }
            }
        }]);
