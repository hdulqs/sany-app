'use strict';

angular.module('huilianyi.services')
    .factory('ApprovalService', ['$http', 'ServiceBaseURL', 'localStorageService', '$q',
        function($http, ServiceBaseURL, localStorageService, $q) {
            return {
                getApprovalList: function(page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/users',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    })
                },
                getApprovalHistoryList: function(page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/pass/users',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    })
                },

                getUserExpenseWaitForApproval: function(page, size, userOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/users/' + userOID +'/invoices',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    })
                },

                getUserExpensePassedApproval: function(page, size, userOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/pass/users/' + userOID +'/invoices',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    })
                },

                getUserTotalExpenses: function(userOID, includeOIDs) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/users/' + userOID + '/invoices/stats',
                        method: 'GET',
                        params: {
                            includeOIDs: includeOIDs
                        }
                    });
                },

                //old workflow api
                getOthersHistory: function (page, size, costCenterItemOID, processKey, startDate, endDate, keyword) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/workflow/historic/my/approval',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size,
                            costCenterItemOID: costCenterItemOID,
                            processKey: processKey,
                            startDate: startDate,
                            endDate: endDate,
                            keyword: keyword
                        }
                    });
                },
                //old workflow api
                getWaitingForApprovals: function (page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/v2/workflow/todos/my/approval',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    });
                },
                getMessageList: function (page, pageSize) {
                    return $http.get(ServiceBaseURL.url + "/api/my/messages?page=" + page + "&size=" + pageSize);
                },

                batchGetCostCenterItemByOIDs: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/cost/center/item/names',
                        method: 'POST',
                        params: {
                            costCenterItemOIDs: data
                        }
                    });
                },
                mapCCIOIDandCCIName: function (CCIOIDs) {
                    var deferred = $q.defer();
                    var tempCCIOID = [];
                    var localMap = localStorageService.get('CostCenterItemMap') || {};
                    for (var i = 0; i < CCIOIDs.length; i++) {
                        if (!localMap[CCIOIDs[i]]) {
                            tempCCIOID.push(CCIOIDs[i]);
                        }
                    }
                    tempCCIOID = this.CCIOIDUnique(tempCCIOID);
                    if (tempCCIOID.length == 0) {
                        deferred.reject(tempCCIOID);
                    } else {
                        this.batchGetCostCenterItemByOIDs(tempCCIOID)
                            .success(function (data) {
                                var tempMap = {};
                                if (!localStorageService.get('CostCenterItemMap')) {
                                    for (var item in data) {
                                        tempMap[item] = data[item];
                                    }
                                    localStorageService.set('CostCenterItemMap', tempMap);
                                } else {
                                    var hasExist = localStorageService.get('CostCenterItemMap');
                                    for (var item in data) {
                                        hasExist[item] = data[item];
                                    }
                                    localStorageService.set('CostCenterItemMap', hasExist);
                                }
                                var CCIMap = localStorageService.get('CostCenterItemMap');
                                //return CCIMap;
                                deferred.resolve(CCIMap);
                            })
                            .error(function (error) {
                                deferred.reject(error);
                                //return null;
                            });
                    }
                    //return null;
                    return deferred.promise;
                },

                CCIOIDUnique: function (data) {
                    var n = {}, r = [];
                    for (var i = 0; i < data.length; i++) {
                        if (!n[data[i]]) {
                            n[data[i]] = true;
                            r.push(data[i]);
                        }
                    }
                    return r;
                }
            }
        }
    ]);
