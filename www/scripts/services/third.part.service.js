/**
 * Created by Yuko on 16/9/8.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('ThirdPartService', ['$http', 'ServiceBaseURL','PublicFunction', 'Auth', 'localStorageService', '$filter', 'Principal', function ($http, ServiceBaseURL,PublicFunction, Auth, localStorageService, $filter, Principal) {
        var ref = null;
        function inAppBrowserLoadStart(event) {
            if (event.url.indexOf('closeInAppBrowser.html') !== -1 && event.url.indexOf('backURL') === -1 && event.url.indexOf('backurl') === -1) {
                ref.close();
            }
        }
        function inAppBrowserClose() {
            ref.removeEventListener('loadstart', inAppBrowserLoadStart);
            ref.removeEventListener('exit', inAppBrowserClose);
            ref = null;
        }

        // 第三方应用处理
        var thirdPart = {

            /*
             * {
                "messageKey": "didi", "icon": "http://xxx/xxx.jpg", "ssoType": "[]", "ssoURL": "http://xxx/", "target": ""
               }
             * messageKey: 多语言MessageKey
             * icon: 图标URL
             * ssoType:
                    HLY_TOKEN: 汇联易平台下的H5, 直接传入accessToken
                    SSOTOKENURL: 汇联易平台下生成第三方URL
             * ssoURL:
                    HLY_TOKEN模式下直接post accessToken到ssoURL
                    SSOTOKENURL: 直接API调用返回第三方URL
             * target:
                 browser: 在系统浏览器打开
                 app： 在app InAppBrowser打开
             * hasNotToolbar: true/false,ios是否有导航条, 默认有,为false
             * */

            data: {},
            reference: null,
            target: "_blank",
            hasClick: false,
            hasNotToolbar: false,

            errorPrompt: function (message) {
                PublicFunction.showToast(message?message: $filter('translate')('error_comp.config'));
                thirdPart.hasClick = false;
            },

            // H5打开监听
            browserLoadStart: function (event) {
                if (event.url.indexOf('closeInAppBrowser.html') !== -1) {
                    thirdPart.reference.close();
                }
            },

            // H5关闭监听
            browserClose: function(){
                thirdPart.reference.removeEventListener('loadstart', thirdPart.browserLoadStart);
                thirdPart.reference.removeEventListener('exit', thirdPart.browserClose);
                thirdPart.reference = null;
                thirdPart.data = {};
                thirdPart.hasClick = false;
                thirdPart.hasNotToolbar = false;
                thirdPart.target = "_blank";
            },

            // 打开Browser
            openBrowser: function (url) {
                thirdPart.hasClick = false;

                if(thirdPart.hasNotToolbar){
                    thirdPart.reference = cordova.InAppBrowser.open(url, thirdPart.target,
                                          'location=no,toolbar=no,zoom=no');
                } else {
                    thirdPart.reference = cordova.InAppBrowser.open(url, thirdPart.target,
                                          'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                                          $filter('translate')('back.to.HuiLianYi') + ',zoom=no',
                                          $filter('translate')(thirdPart.data.messageKey));
                }
                thirdPart.reference.addEventListener('loadstart', thirdPart.browserLoadStart);
                thirdPart.reference.addEventListener('exit', thirdPart.browserClose);
            },

            // 跳转
            jumpThirdPart: function (data) {
                // 如果不是第一次点击图标
                if (thirdPart.hasClick){
                    return
                }
                thirdPart.hasClick = true;

                thirdPart.data = data;

                // 判断ios是否有导航条
                thirdPart.hasNotToolbar = data.hasNotToolbar;

                // 判断跳转链接是否存在
                if (!thirdPart.data.ssoURL){
                    thirdPart.errorPrompt();
                    return;
                }

                // 判断从系统浏览器打开还是InAppBrowser打开
                switch (thirdPart.data.target){
                    case "browser":
                        thirdPart.target = "_system";
                        break;
                    case "app":
                        thirdPart.target = "_blank";
                        break;
                    default:
                        thirdPart.errorPrompt();
                        return
                }

                // 判断平台
                switch (data.ssoType){
                    case "HLY_TOKEN":
                        // 汇联易平台H5
                        Auth.refreshToken().then(function(){
                            Principal.identity().then(function(response) {
                                // 安盛要求加上employeeId
                                var baseParam = 'access_token=' + localStorageService.get("token").access_token +
                                        '&employeeId=' + response.employeeID,
                                    url = data.ssoURL.indexOf('?')===-1 ? data.ssoURL + '?' + baseParam :
                                        data.ssoURL + '&' + baseParam;

                                thirdPart.openBrowser(url)
                            }, function() {});
                        }, function () {
                            // 刷新失败时
                            thirdPart.hasClick = false;
                        });
                        break;
                    case "SSOTOKENURL":
                        //是否需要汇联易token
                        if(data.HLY_TokenRequire){
                            // 汇联易平台下生成第三方URL
                            $http.get(data.ssoURL + '?token=' + localStorageService.get("token").access_token)
                                .success(function (data) {
                                    thirdPart.openBrowser(data.url);
                                })
                                .error(function(){
                                    thirdPart.errorPrompt($filter('translate')('error_comp.error'));//请求出错啦
                                });
                        }else{
                            // 汇联易平台下生成第三方URL
                            $http.get(data.ssoURL)
                                .success(function (data) {
                                    thirdPart.openBrowser(data.url);
                                })
                                .error(function(){
                                    thirdPart.errorPrompt($filter('translate')('error_comp.error'));//请求出错啦
                                });
                        }
                        break;
                    default :
                        thirdPart.errorPrompt();
                        return
                }
            }
        };

        return {
            getYgetSSO: function () {
                return $http.get(ServiceBaseURL.url + '/api/yget/sso/login');
            },
            getMeiKeApproval: function () {
                return $http.get(ServiceBaseURL.url + '/api/messages/h5/sso/todo/list');
            },
            getOtherApplyUrl: function () {
                return $http.get(ServiceBaseURL.url + '/api/messages/h5/sso/other/application');
            },
            getSecretary: function (locationParams) {
                return $http({
                    method: 'POST',
                    url: ServiceBaseURL.url + '/api/xms/sso',
                    data: locationParams
                }).success(function (data) {
                        ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                        ref.addEventListener('loadstart', inAppBrowserLoadStart);
                        ref.addEventListener('exit', inAppBrowserClose);
                    })
                    .error(function () {
                        PublicFunction.showToast($filter('translate')('error_comp.error'));
                    });
            },

            // 跳转第三方页面
            jumpThirdPart: thirdPart.jumpThirdPart
        }
    }]);
