/**
 * Created by Yuko on 16/7/28.
 */
'use strict';

angular.module('huilianyi.services')
    .factory('TravelERVService', ['$http', 'ServiceBaseURL', '$q', 'localStorageService',
        function ($http, ServiceBaseURL, $q, localStorageService) {
            var travelBase = {};
            var tab;
            var ref = null;

            function inAppBrowserLoadStart(event) {
                if (event.url.indexOf('closeInAppBrowser.html') !== -1 && event.url.indexOf('CallBack') === -1 && event.url.indexOf('callback') === -1) {
                    ref.close();
                }
            }

            function inAppBrowserClose() {
                ref.removeEventListener('loadstart', inAppBrowserLoadStart);
                ref.removeEventListener('exit', inAppBrowserClose);
                ref = null;
            }

            return {
                getTab: function () {
                    return tab;
                },
                setTab: function (state) {
                    tab = state;
                    return tab;
                },
                getTravelBase: function () {
                    return travelBase;
                },
                setTravelBase: function (data) {
                    travelBase = data;
                    return travelBase;
                },
                getTravelList: function (page, size, state) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/applications/my?applicationStatusEnumId=' + state + '&page=' + page + '&size=' + size,
                        method: 'GET'
                    });
                },
                getTravelDetail: function (applicationOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/applications/my/get/' + applicationOID,
                        method: 'GET'
                    })
                },
                travelDraft: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/applications/draft',
                        method: 'POST',
                        data: data
                    })
                },
                deleteTravel: function (applicationOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/applications/' + applicationOID,
                        method: 'DELETE'
                    })
                },
                submitTravel: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/applications/submit',
                        method: 'POST',
                        data: data
                    })
                },
                withdrawTravel: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/withdraw',
                        method: 'POST',
                        data: data
                    })
                },
                exportExpense: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/reports/draft',
                        method: 'POST',
                        data: data
                    })
                },
                reject: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/reject',
                        method: 'POST',
                        data: data
                    })
                },
                agree: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/pass',
                        method: 'POST',
                        data: data
                    })
                },
                getTongChengOrderUrl: function () {
                    return $http({
                        url: ServiceBaseURL.url + '/api/tongcheng/orders/bookurl',
                        method: 'GET'
                    })
                },
                getFlyCity: function (keyword, page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/areas/search?keyword=' + keyword + '&page=' + page + '&size=' + size,
                        method: 'GET'
                    })
                },
                getBatchUsers: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/users/oids?userOIDs=' + data,
                        method: 'GET'
                    });
                },
                getBestDoUrl: function (parm) {
                    if (parm.longitude && parm.latitude) {
                        return $http({
                            url: ServiceBaseURL.url + '/api/bestdo/sso/url?lng=' + parm.longitude + '&lat=' + parm.latitude,
                            method: 'GET'
                        })
                    } else {
                        return $http({
                            url: ServiceBaseURL.url + '/api/bestdo/sso/url',
                            method: 'GET'
                        })
                    }

                },
                deleteHistoryExternalParticipant: function () {
                    return $http({
                        url: ServiceBaseURL.url + '/api/external/participant/histories',
                        method: 'DELETE'
                    })
                },
                getHistroyExternalParticipant: function () {
                    return $http({
                        url: ServiceBaseURL.url + '/api/external/participant/histories',
                        method: 'GET'
                    })
                },
                getSuppliers: function () {
                    return $http({
                        url: ServiceBaseURL.url + '/api/suppliers',
                        method: 'GET'
                    })
                },
                getSuppliersSSO: function (supplierOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/suppliers/sso/' + supplierOID,
                        method: 'GET'
                    })
                },
                getSupplierURL: function (supplierOID, pageType, bussinessCode) {
                    if (!supplierOID) {
                        supplierOID = '';
                    }
                    return $http({
                        url: ServiceBaseURL.url + '/api/suppliers/sso',
                        method: 'POST',
                        params: {
                            supplierOID: supplierOID,
                            pageType: pageType,
                            businessCode: bussinessCode
                        }
                    }).success(function (data) {
                        ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                        ref.addEventListener('loadstart', inAppBrowserLoadStart);
                        ref.addEventListener('exit', inAppBrowserClose);
                    });
                },
                getSsoSupplierUrl: function (supplierOID, pageType, bussinessCode) {
                    if (!supplierOID) {
                        supplierOID = '';
                    }
                    return $http({
                        url: ServiceBaseURL.url + '/api/suppliers/sso',
                        method: 'POST',
                        params: {
                            supplierOID: supplierOID,
                            pageType: pageType,
                            businessCode: bussinessCode
                        }
                    })
                },
                //搜索成本中心项(成本中心)
                searchItemsAllByKeywords: function (costCenterOID, keywords, page, size) {
                    return $http.get(ServiceBaseURL.url + '/api/search/cost/center/' + costCenterOID + '/item/' + keywords + '/all', {
                        params: {
                            page: page,
                            size: size
                        }
                    });
                },
                //获取国内城市list
                getInlandCityList: function () {
                    return $http.get(ServiceBaseURL.url + '/api/areas/areas/by/type?areaType=CITY');
                },
                //提交差旅申请单先调用这个接口检查预算是否超额
                checkBudgetTravel: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/applications/checkbudget',
                        method: 'POST',
                        data: data
                    })
                },
                //保存预算错误信息
                saveErrorMsg: function (applicationOID, warning) {
                    return $http({
                        method:'POST',
                        url:ServiceBaseURL.url+'/api/applications/save/warning',
                        data:{
                            applicationOID:applicationOID,
                            warningMessage:warning
                        }
                    });
                },
                searchALLCity: function (params) {//获取飞机地点
                    var deferred = $q.defer(),lang;
                    if (localStorageService.get('language') === "zh_cn") {
                        lang = "zh_cn"
                    } else if (localStorageService.get('language') === "en") {
                        lang = "en_us"
                    } else {
                        lang = "zh_cn"
                    }
                    $http({
                        url:ServiceBaseURL.url + '/location-service/api/location/search?vendorType=' + params.vendorType + '&keyWord=' + params.keyWord +'&page=0'+'&size=20',
                        method: 'GET',
                        headers: {
                            "language": lang,
                            "baceCountry": "CHN",
                            "Authorization": localStorageService.get("token"),
                            "vendorType": params.vendorType,
                            "country":params.country
                        }
                    }).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (state) {
                        deferred.reject(state);
                    });
                    return deferred.promise;
                },
                getCitys: function (flag, tab) {
                    // console.log(flag,tab);
                    var url, deferred = $q.defer();
                    switch (flag) {
                        case "ctsho_air":
                            url = "i18n/zh_cn/app_ctsho_air_domestic.json";
                            //中旅机场本地
                            break;
                        case "ctrip_air":
                            if (tab === 0) {
                                url = "i18n/zh_cn/alphabet_fly_city.json";
                            } else {
                                url = "i18n/zh_cn/alphabet_inter_show.json";
                            }
                            //获取携程机场本地
                            break;
                        case "ctrip_train":
                            if (tab === 0) {
                                url = "i18n/zh_cn/app_ctrip_trian_domestic.json";
                            } else {
                                url = "i18n/zh_cn/alphabet_inter_show.json";
                            }
                            //获取携程火车本地历史
                            break;
                        case "ctrip_hotel":
                            if (tab === 0) {
                                url = "i18n/zh_cn/app_ctrip_hotel_domestic.json";
                            } else {
                                url = "i18n/zh_cn/alphabet_inter_show.json";
                            }
                            //获取携程酒店本地历史
                            break;
                        case "baoku_air":
                            url = "i18n/zh_cn/app_baoku_domestic.json";
                            //获取宝库机场本地
                            break;
                        case "standard":
                            if (tab === 0) {
                                url = "i18n/zh_cn/alphabet_fly_city.json";
                            } else {
                                url = "i18n/zh_cn/alphabet_inter_show.json";
                            }
                            //获取标准本地历史
                            break;
                        default:
                            if (tab === 0) {
                                url = "i18n/zh_cn/alphabet_fly_city.json";
                            } else {
                                url = "i18n/zh_cn/alphabet_inter_show.json";
                            }
                            //获取标准本地
                            break;
                    }

                    if (localStorageService.get('language') === "en") {
                        if (tab === 0) {
                            url = "i18n/zh_cn/app_china_us_en.json";
                        } else {
                            url = "i18n/zh_cn/app_inter_us_en.json";
                        }
                    }
                    $http.get(url).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (state) {
                        deferred.reject(state);
                    });
                    return deferred.promise;

                }

            }
        }]);
