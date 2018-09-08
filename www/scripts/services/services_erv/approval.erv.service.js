/**
 * Created by Yuko on 16/8/5.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('ApprovalERVService', ['$http', 'ServiceBaseURL',
        function ($http, ServiceBaseURL) {
            var status = null;
            return {
                setStatus: function (data) {
                    status = data;
                    return status;
                },
                getStatus: function () {
                    return status;
                },
                getApprovalList: function (page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals?page=' + page + '&size=' + size,
                        method: 'GET'
                    });
                },
                getApprovalHistoryList: function (page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals?status=FINISHED&page=' + page + '&size=' + size,
                        method: 'GET'
                    });
                },
                agree: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/pass',
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
                rejectInvoices: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/reject/expensereport/invoice',
                        method: 'POST',
                        data: data
                    })
                },
                getFilteredApprovalList: function (page, size, filter, canceller) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/filters',
                        method: 'GET',
                        timeout: canceller.promise,
                        params: {
                            page: page,
                            size: size,
                            //1001申请单, 1002报销单, 为空的话都搜索
                            entityType: filter.entityType,
                            fullName: filter.fullName,
                            businessCode: filter.businessCode,
                            finished: filter.finished
                        }
                    });
                },
                searchWaitForApproval: function (page, size, keyword, canceller) {
                    var filter = {
                        fullName: keyword,
                        businessCode: keyword,
                        finished: false
                    };
                    return this.getFilteredApprovalList(page, size, filter, canceller);
                },

                /**
                 * 财务审核驳回
                 * @param options object
                 * {
                 *     entities: [{
                 *         "entityOID": "",    // 单据OID
                 *         "entityType": ""    // 单据类型
                 *     }],
                 *     approvalTxt: ""    // 驳回理由
                 * }
                 * @returns {Promise}
                 */
                rejectAudit: function(options) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/audit/reject',
                        method: 'POST',
                        data: options
                    })
                },

                /**
                 * 根据报销单号关键字搜索报销单号
                 * @param keyword
                 * @returns {HttpPromise}
                 */
                getApprovalExpenseByBusinessCode: function(keyword) {
                    return $http.get(ServiceBaseURL.url + "/api/expense/report/scancode/search", {
                        params: {
                            businessCode: keyword
                        }
                    })
                }

            }
        }]);
