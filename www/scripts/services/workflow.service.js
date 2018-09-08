'use strict';
angular.module('huilianyi.services')
    .factory('WorkflowService', ['$http', 'ServiceBaseURL', 'localStorageService', '$q', function ($http, ServiceBaseURL, localStorageService, $q) {
        return {
            //获取代办人
            getTaskAsignee: function (processInstanceId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/reimbursement/reimbursement_domain/process_instance/' + processInstanceId);
            },
            //获取审批列的审批详情
            getExpenseAccountDetail: function (taskId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/reimbursement/reimbursement_domain/' + taskId);
            },
            //获取消息列表的待审批REIMBURSEMENT_APPROVAL详情
            getMessageAccountDetail: function (processInstanceId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/reimbursement/reimbursement_domain/process_instance/' + processInstanceId);
            },
            //获取消息列表的待审批TRAVEL_APPROVAL详情
            getMessageTravelDetail: function (processInstanceId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/travel/travel_domain/process_instance/' + processInstanceId);
            },
            //审批REIMBURSEMENT驳回
            rejectExpenseAccount: function (taskId, comment) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/reimbursement/approval/reject/' + taskId + '?comment=' + comment);
            },
            //审批REIMBURSEMENT通过
            agreeExpenseAccount: function (taskId) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/reimbursement/approval/pass/' + taskId);
            },
            //审批TRAVEL通过
            agreeTravelApproval: function (taskId) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/travel/approval/pass/' + taskId);
            },
            //审批TRAVEL驳回
            rejectTravelApproval: function (taskId, comment) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/travel/approval/reject/' + taskId + '?comment=' + comment);
            },
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
            getApprovalHistory: function (page, size, costCenterItemOID, processKey, startDate, endDate, keyword) {
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
            getCostCenterByID: function(costCenterItemOID){
                return $http.get(ServiceBaseURL.url + '/api/cost/center/item/' + costCenterItemOID)
            },
            //获取预报销详情
            getPreInvoiceDetailByProcressId: function (referenceId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/process/custom_process/process_instance/' + referenceId)
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
            //去重
            CCIOIDUnique: function (data) {
                var n = {}, r = [];
                for (var i = 0; i < data.length; i++) {
                    if (!n[data[i]]) {
                        n[data[i]] = true;
                        r.push(data[i]);
                    }
                }
                return r;
            },
            getCustomProcessDetail: function(taskId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/process/custom_process/' + taskId);
            },
            getCustomProcessDetailFormProcessId: function(processId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/process/custom_process/process_instance/' + processId);
            },
            //delete the draft
            cancelProcess: function(taskOID) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/process/apply/cancel/' + taskOID);
            },
            recallProcess: function(processInstanceId, comment) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/process/recall/' + processInstanceId,
                    method: 'DELETE',
                    params: {
                        comment: comment
                    }
                })
            },
            recallProcessWithoutComment: function(processInstanceId) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/process/recall/' + processInstanceId,
                    method: 'DELETE'
                });
            }
        }
    }]);

