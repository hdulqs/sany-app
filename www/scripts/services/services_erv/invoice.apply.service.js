/**
 * Created by liyinsen on 2016/8/2.
 */
'use strict';

angular.module('huilianyi.services')
    .factory('InvoiceApplyERVService', ['$http', 'ServiceBaseURL',
        function ($http, ServiceBaseURL) {
            var progressBar = 0;
            var tab;
            return {
                getTab: function () {
                    return tab;
                },
                setTab: function (state) {
                    tab = state;
                    return tab;
                },
                saveInvoiceApply: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/applications/draft',
                        method: 'POST',
                        data: data
                    });
                },
                submitInvoiceApply: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/applications/submit',
                        method: 'POST',
                        data: data
                    });
                },
                searchInvoiceApply: function (page, size, status) {
                    return $http.get(ServiceBaseURL.url + "/api/expense/applications/my?status=" + status + '&page=' + page + '&size=' + size)
                },
                deleteInvoiceApply: function (applicationOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/applications/' + applicationOID,
                        method: 'DELETE'
                    })
                },
                getInvoiceApplyDetail: function (applicationOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/applications/' + applicationOID,
                        method: 'GET'
                    })
                },
                withdrawInvoiceApply: function (data) {
                    return $http({

                    });
                }
            }
        }]);
