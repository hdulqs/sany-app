'use strict';
angular.module('huilianyi.services')
    .factory('VersionService', ['$http', 'ServiceBaseURL', 'localStorageService', '$q', '$sessionStorage',
        function ($http, ServiceBaseURL, localStorageService, $q, $sessionStorage) {
            var isAppVersionPluginEnabled = function () {
                if (AppVersion) {
                    return true;
                } else {
                    return false;
                }
            };
            var localVersion;
            return {
                getNewVersion: function () {
                    var defer = $q.defer();
                    if (!$sessionStorage.newVersion) {
                        $sessionStorage.newVersion = {};
                    }
                    var platform = "android";
                    if (ionic.Platform.isIOS()) {
                        platform = "ios";
                    }
                    $http.get(ServiceBaseURL.url + '/api/versions/code?versionCode=Y&platform=' + platform).success(function (data) {
                        $sessionStorage.newVersion = data;
                        defer.resolve(data);
                    })
                    return defer.promise;
                },
                getLocalVersion: function () {
                    if (!isAppVersionPluginEnabled()) {
                        return;
                    }
                    localVersion = AppVersion.version;
                    return localVersion;
                },
                checkVersionEnabled: function () {
                    var defer = $q.defer();
                    if (!$sessionStorage.newVersion) {
                        $sessionStorage.newVersion = {};
                    }
                    var newVersion = $sessionStorage.newVersion[0];
                    if (newVersion) {
                        defer.resolve(newVersion);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/versions/code?versionCode=Y').success(function (data) {
                            $sessionStorage.newVersion = data;
                            defer.resolve(data);
                        })
                    }
                    return defer.promise;
                },
                //根据公司获取版本号
                getCompanyVersion: function () {
                    var defer = $q.defer();
                    var companyVersion = $sessionStorage.companyVersion;
                    if (companyVersion) {
                        defer.resolve(companyVersion);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/company/versions/code?versionCode=Y').success(function (data) {
                            $sessionStorage.companyVersion = data;
                            defer.resolve(data);
                        })
                    }
                    return defer.promise;
                },

                // 判断是否需要更新
                checkUpdate: function (local, remote) {
                    var VPAT = /^\d+(\.\d+){0,2}$/;
                    if (!local || !remote || local.length === 0 || remote.length === 0 || local === remote)
                        return false;
                    if (VPAT.test(local) && VPAT.test(remote)) {
                        var lparts = local.split('.');
                        while (lparts.length < 3)
                            lparts.push("0");
                        var rparts = remote.split('.');
                        while (rparts.length < 3)
                            rparts.push("0");
                        for (var i = 0; i < 3; i++) {
                            var l = parseInt(lparts[i], 10);
                            var r = parseInt(rparts[i], 10);
                            if (l === r)
                                continue;
                            return l < r;
                        }
                        return true;
                    } else {
                        return false;
                    }
                },
                //更新语言
                updateLanguage: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/users/language/' + data);
                },

                updateHecLanguage: function (userLanguage) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"init_language",
                        "action":"submit",
                        "parameter": {
                            "lang": userLanguage,
                            "_status": "update"
                        }
                    };
                    return $http.post(url,params);
                },
                //获取手机支持的语言列表
                getLanguageList: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/lov/language/' + data);
                },

                // 获取AppStore版本号
                getAppStoreVersion: function () {
                    return $http.post("http://itunes.apple.com/lookup?id=1160660933");
                }
            }
        }]);
