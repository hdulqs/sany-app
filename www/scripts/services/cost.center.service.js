'use strict';
angular.module('huilianyi.services')
    .factory('CostCenterService', ['$http', '$q', 'ServiceBaseURL', 'localStorageService', 'LocalStorageKeys',
        function ($http, $q, ServiceBaseURL, localStorageService, LocalStorageKeys) {
            return {
                getMyCostCenters: function () {
                    var deferred = $q.defer();
                    var costCenters = localStorageService.get(LocalStorageKeys.cost.center);
                    if (costCenters && new Date().getTime() - costCenters.lastFetchDate < 86400000) {
                        deferred.resolve(costCenters.data);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/my/cost/centers')
                            .success(function (data) {
                                localStorageService.set(LocalStorageKeys.cost.center, {
                                    lastFetchDate: new Date().getTime(),
                                    data: data
                                });

                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        });
                    }
                    return deferred.promise;
                },
                getMyPreferredCostCenters: function () {
                    return $http.get(ServiceBaseURL.url + '/api/my/preferred/cost/centers');
                },
                logLastCostCenterItem: function (costCenterOID) {
                    $http.post(ServiceBaseURL.url + '/api/log/last/cost/center/item/' + costCenterOID, {})
                },
                //获取成本中心项列表(成本中心)
                getItemsAll: function (costCenterOID, page, size) {
                    return $http.get(ServiceBaseURL.url + '/api/cost/center/items/' + costCenterOID + '/all', {
                        params: {
                            page: page,
                            size: size
                        }
                    });
                },
                getCostCenterItemDetail: function(costCenterItemOID){
                    return $http.get(ServiceBaseURL.url + '/api/cost/center/item/' + costCenterItemOID);
                },
                getMyCostCenter: function (costCenterOID, page, size, name, sort, applicantOID) {
                    return $http.get(ServiceBaseURL.url + '/api/my/cost/center/items/' + costCenterOID, {
                        params: {
                            page: page,
                            size: size,
                            name: name,
                            sort: sort,
                            applicantOID: applicantOID
                        }
                    });
                },
                //搜索成本中心项(成本中心)
                searchAllItemsByKeywords: function (costCenterOID, keywords, page, size, sort) {
                    return $http.get(ServiceBaseURL.url + '/api/search/cost/center/' + costCenterOID + '/item/' + keywords, {
                        params: {
                            page: page,
                            size: size,
                            sort: sort
                        }
                    });
                },
                //创建表单时，根据申请人OID和成本中心的OID获取成本中心默认值
                getDefaultValueOfCostCenter: function (applicantOID, costCenterOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/bills/default/cost/center/item',
                        method: 'GET',
                        params: {
                            applicantOID: applicantOID,
                            costCenterOID: costCenterOID
                        }
                    });
                }
            }
        }]);
